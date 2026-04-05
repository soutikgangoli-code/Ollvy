'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'

interface ChatInputProps {
  onSend: (message: string) => Promise<void>
  onFileUpload?: (file: File) => Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSend, onFileUpload, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile) || isSending || disabled) return

    setIsSending(true)

    try {
      if (selectedFile && onFileUpload) {
        await onFileUpload(selectedFile)
        setSelectedFile(null)
      }

      if (message.trim()) {
        await onSend(message.trim())
        setMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast({
        title: 'Message not sent',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border-t border-border px-3 py-2 bg-card shrink-0">
      {/* Selected file preview */}
      {selectedFile && (
        <div className="mb-2 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground truncate flex-1">
            {selectedFile.name}
          </span>
          <button
            onClick={clearFile}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* File upload button */}
        {onFileUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isSending}
              className={cn(
                'p-2 rounded-full transition-colors',
                disabled || isSending
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Message input - pill shaped */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled || isSending}
          className={cn(
            'flex-1 h-10 px-4 bg-muted border border-border rounded-full',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-ring transition-colors',
            (disabled || isSending) && 'opacity-40 cursor-not-allowed'
          )}
        />

        {/* Send button - circular green */}
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !selectedFile) || isSending || disabled}
          className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 p-0 border-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          ) : (
            <Send className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </div>
  )
}
