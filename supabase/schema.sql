-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Row Level Security will be configured automatically by Supabase

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    status_message TEXT DEFAULT 'Hey there! I am using Bringlare Chat.',
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT, -- For group chats
    type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE
);

-- Chat participants table
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(chat_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document')),
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    reactions JSONB DEFAULT '{}',
    read_by JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, contact_user_id),
    CHECK (user_id != contact_user_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('message', 'contact_request', 'group_invite')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_online ON users(is_online);

CREATE INDEX idx_chats_type ON chats(type);
CREATE INDEX idx_chats_created_by ON chats(created_by);
CREATE INDEX idx_chats_updated_at ON chats(updated_at);

CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_participants_left_at ON chat_participants(left_at);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_message_type ON messages(message_type);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_contact_user_id ON contacts(contact_user_id);
CREATE INDEX idx_contacts_status ON contacts(status);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update chat's last message
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats 
    SET 
        last_message = NEW.content,
        last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update chat's last message when a new message is inserted
CREATE TRIGGER update_chat_last_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_chat_last_message();

-- Row Level Security Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = firebase_uid);

-- Chats table policies
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chats they participate in" ON chats
    FOR SELECT USING (
        id IN (
            SELECT chat_id FROM chat_participants 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE firebase_uid = auth.uid()::text
            )
            AND left_at IS NULL
        )
    );

CREATE POLICY "Users can create chats" ON chats
    FOR INSERT WITH CHECK (
        created_by IN (
            SELECT id FROM users 
            WHERE firebase_uid = auth.uid()::text
        )
    );

-- Chat participants table policies
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of chats they're in" ON chat_participants
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM chat_participants 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
            )
            AND left_at IS NULL
        )
    );

CREATE POLICY "Users can add participants to chats they created or are admins of" ON chat_participants
    FOR INSERT WITH CHECK (
        chat_id IN (
            SELECT c.id FROM chats c
            LEFT JOIN chat_participants cp ON c.id = cp.chat_id
            WHERE (
                c.created_by IN (
                    SELECT id FROM users 
                    WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
                )
                OR (
                    cp.user_id IN (
                        SELECT id FROM users 
                        WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
                    )
                    AND cp.role = 'admin'
                    AND cp.left_at IS NULL
                )
            )
        )
    );

-- Messages table policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in chats they participate in" ON messages
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM chat_participants 
            WHERE user_id IN (
                SELECT id FROM users 
                WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
            )
            AND left_at IS NULL
        )
    );

CREATE POLICY "Users can send messages to chats they participate in" ON messages
    FOR INSERT WITH CHECK (
        sender_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
        AND chat_id IN (
            SELECT chat_id FROM chat_participants 
            WHERE user_id = sender_id
            AND left_at IS NULL
        )
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (
        sender_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
    );

-- Contacts table policies
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contacts" ON contacts
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
        OR contact_user_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
    );

CREATE POLICY "Users can manage their own contacts" ON contacts
    FOR ALL USING (
        user_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
    );

-- Notifications table policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
    );

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM users 
            WHERE firebase_uid = current_setting('app.current_user_firebase_uid', true)
        )
    );

-- Insert some sample data (optional)
-- This would be removed in production

-- Sample users
-- INSERT INTO users (firebase_uid, email, display_name, username) VALUES
-- ('sample_uid_1', 'john@example.com', 'John Doe', 'johndoe'),
-- ('sample_uid_2', 'jane@example.com', 'Jane Smith', 'janesmith');

-- Sample chat
-- INSERT INTO chats (name, type, created_by) VALUES
-- ('General', 'group', (SELECT id FROM users WHERE username = 'johndoe'));

-- Sample chat participants
-- INSERT INTO chat_participants (chat_id, user_id) VALUES
-- ((SELECT id FROM chats WHERE name = 'General'), (SELECT id FROM users WHERE username = 'johndoe')),
-- ((SELECT id FROM chats WHERE name = 'General'), (SELECT id FROM users WHERE username = 'janesmith'));

-- Sample messages
-- INSERT INTO messages (chat_id, sender_id, content) VALUES
-- ((SELECT id FROM chats WHERE name = 'General'), (SELECT id FROM users WHERE username = 'johndoe'), 'Hello everyone!'),
-- ((SELECT id FROM chats WHERE name = 'General'), (SELECT id FROM users WHERE username = 'janesmith'), 'Hi John! How are you?');
