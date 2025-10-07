'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image, Video, Music } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/providers/auth-provider'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatFileSize, getFileType } from '@/lib/utils'

interface FileUploadProps {
  onFileUploaded: (fileUrl: string, fileName: string, fileSize: number, fileType: string) => void
  onCancel: () => void
}

export function FileUpload({ onFileUploaded, onCancel }: FileUploadProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select a file smaller than 50MB',
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setUploading(true)
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `chat-files/${user.id}/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath)

      const fileType = getFileType(selectedFile.name)
      
      onFileUploaded(
        urlData.publicUrl,
        selectedFile.name,
        selectedFile.size,
        fileType
      )

      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded successfully',
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      setSelectedFile(null)
    }
  }

  const getFileIcon = (file: File) => {
    const type = getFileType(file.name)
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />
      case 'video':
        return <Video className="w-8 h-8 text-purple-500" />
      case 'audio':
        return <Music className="w-8 h-8 text-green-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const getPreview = (file: File) => {
    const type = getFileType(file.name)
    if (type === 'image') {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg"
        />
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
      {!selectedFile ? (
        <div className="text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer hover:border-chat-primary transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Click to select a file or drag and drop
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Images, videos, audio, and documents up to 50MB
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            className="hidden"
          />
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getFileIcon(selectedFile)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {selectedFile.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFile(null)}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Preview for images */}
          {getPreview(selectedFile) && (
            <div className="flex justify-center">
              {getPreview(selectedFile)}
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-chat-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="chat"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                'Send File'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
