'use client'

import { useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'
import { FileText, Download, Loader2 } from 'lucide-react'
import { downloadFile } from '@/lib/storage'

interface MessageBubbleProps {
  message: ChatMessage
  professionalName?: string
}

export function MessageBubble({ message, professionalName }: MessageBubbleProps) {
  const [downloading, setDownloading] = useState(false)
  const isUser = message.sender_type === 'user'
  const isSystem = message.sender_type === 'system'
  const isProfessional = message.sender_type === 'professional'

  // Handle file download with signed URL
  const handleDownload = async () => {
    // Prefer file_path (storage path), fall back to file_url (legacy public URL)
    const fileRef = message.file_path
      ? `documents/${message.file_path}`
      : message.file_url

    if (!fileRef) return

    setDownloading(true)
    try {
      await downloadFile(fileRef, message.file_name || 'download')
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  // System messages
  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-muted rounded-full">
          <p className="text-xs text-muted-foreground text-center">{message.content}</p>
        </div>
      </div>
    )
  }

  // File messages
  if (message.message_type === 'file' && message.file_path) {
    return (
      <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
        <div className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
          isUser
            ? 'bg-emerald-100 dark:bg-emerald-900/50 rounded-br-sm'
            : 'bg-card border border-border rounded-bl-sm'
        )}>
          {!isUser && isProfessional && professionalName && (
            <p className="text-xs text-muted-foreground mb-1">
              {professionalName.split(' ')[0]}, Ollvy Compliance Team
            </p>
          )}
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              isUser ? 'bg-emerald-200/50 dark:bg-emerald-800/50' : 'bg-muted'
            )}>
              <FileText className={cn(
                'h-5 w-5',
                isUser ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm truncate',
                isUser ? 'text-emerald-900 dark:text-emerald-100' : 'text-foreground'
              )}>{message.file_name || 'File'}</p>
              {message.file_size && (
                <p className={cn(
                  'text-xs',
                  isUser ? 'text-emerald-700/70 dark:text-emerald-300/70' : 'text-muted-foreground'
                )}>
                  {(message.file_size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                'p-2 rounded-lg transition-colors disabled:opacity-50',
                isUser
                  ? 'hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50'
                  : 'hover:bg-accent'
              )}
              title="Download file"
            >
              {downloading ? (
                <Loader2 className={cn(
                  'h-4 w-4 animate-spin',
                  isUser ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'
                )} />
              ) : (
                <Download className={cn(
                  'h-4 w-4',
                  isUser ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'
                )} />
              )}
            </button>
          </div>
          <p className={cn(
            'text-[10px] mt-2 text-right',
            isUser ? 'text-emerald-700/70 dark:text-emerald-300/70' : 'text-muted-foreground/70'
          )}>
            {formatTime(message.created_at)}
          </p>
        </div>
      </div>
    )
  }

  // Text messages
  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
        isUser
          ? 'bg-emerald-100 dark:bg-emerald-900/50 rounded-br-sm'
          : 'bg-card border border-border rounded-bl-sm'
      )}>
        {!isUser && isProfessional && professionalName && (
          <p className="text-xs text-muted-foreground mb-1">
            {professionalName.split(' ')[0]}, Ollvy Compliance Team
          </p>
        )}
        <p className={cn(
          'text-sm whitespace-pre-wrap break-words',
          isUser ? 'text-emerald-900 dark:text-emerald-100' : 'text-foreground'
        )}>
          {message.content}
        </p>
        <p className={cn(
          'text-[10px] mt-1 text-right',
          isUser ? 'text-emerald-700/70 dark:text-emerald-300/70' : 'text-muted-foreground/70'
        )}>
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}
