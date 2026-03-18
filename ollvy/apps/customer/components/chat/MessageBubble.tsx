'use client'

import { cn, formatTime } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'
import { FileText, Download } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
  professionalName?: string
}

export function MessageBubble({ message, professionalName }: MessageBubbleProps) {
  const isUser = message.sender_type === 'user'
  const isSystem = message.sender_type === 'system'
  const isProfessional = message.sender_type === 'professional'

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
      <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
        <div className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary/10 rounded-br-sm'
            : 'bg-muted rounded-bl-sm'
        )}>
          {!isUser && isProfessional && professionalName && (
            <p className="text-xs text-muted-foreground mb-1">
              {professionalName.split(' ')[0]}, Ollvy Compliance Team
            </p>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{message.file_name || 'File'}</p>
              {message.file_size && (
                <p className="text-xs text-muted-foreground">
                  {(message.file_size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-2 text-right">
            {formatTime(message.created_at)}
          </p>
        </div>
      </div>
    )
  }

  // Text messages
  return (
    <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-3',
        isUser
          ? 'bg-primary/10 rounded-br-sm'
          : 'bg-muted rounded-bl-sm'
      )}>
        {!isUser && isProfessional && professionalName && (
          <p className="text-xs text-muted-foreground mb-1">
            {professionalName.split(' ')[0]}, Ollvy Compliance Team
          </p>
        )}
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-1 text-right">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}
