'use client'

export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: 'white'
        }}>
          🎨 CSS Test - Inline Styles
        </h1>
        
        {/* Color Test with Inline Styles */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: '#ef4444', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            🔴 RED COLOR
          </div>
          <div style={{ 
            background: '#22c55e', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            🟢 GREEN COLOR
          </div>
          <div style={{ 
            background: '#3b82f6', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            🔵 BLUE COLOR
          </div>
          <div style={{ 
            background: '#a855f7', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            🟣 PURPLE COLOR
          </div>
        </div>

        {/* Chat Colors */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem' 
          }}>
            Chat App Colors
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: '#075e54', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '1.1rem'
            }}>
              💬 Primary Chat Color (#075e54)
            </div>
            <div style={{ 
              background: '#128c7e', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '1.1rem'
            }}>
              💬 Secondary Chat Color (#128c7e)
            </div>
            <div style={{ 
              background: '#25d366', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '1.1rem'
            }}>
              💬 Accent Chat Color (#25d366)
            </div>
            <div style={{ 
              background: '#dcf8c6', 
              color: '#1f2937', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '1.1rem'
            }}>
              💬 Chat Bubble Color (#dcf8c6)
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '1rem' 
          }}>
            Interactive Buttons
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <button style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#2563eb'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#3b82f6'}
            >
              Primary Button
            </button>
            <button style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Success Button
            </button>
            <button style={{ 
              background: '#f59e0b', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Warning Button
            </button>
            <button style={{ 
              background: '#ef4444', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              Danger Button
            </button>
          </div>
        </div>

        {/* Status */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '0.5rem', 
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            ✅ CSS Status Check
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            যদি আপনি এই colors এবং styling দেখতে পাচ্ছেন, তাহলে CSS কাজ করছে!
          </p>
          <a 
            href="/" 
            style={{ 
              background: '#6366f1', 
              color: 'white', 
              padding: '0.75rem 2rem', 
              borderRadius: '0.5rem',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ← Back to Chat App
          </a>
        </div>
      </div>
    </div>
  )
}
