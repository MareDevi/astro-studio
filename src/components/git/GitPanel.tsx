import React, { useState, useEffect, useCallback } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { commands } from '../../lib/bindings'
import { toast } from '../../lib/toast'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import {
  GitCommit,
  RefreshCw,
  FileText,
  Plus,
  FileEdit,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface ChangedFile {
  path: string
  status: 'modified' | 'added' | 'deleted' | 'untracked' | 'renamed'
}

export const GitPanel: React.FC = () => {
  const projectPath = useProjectStore(state => state.projectPath)
  const [changedFiles, setChangedFiles] = useState<ChangedFile[]>([])
  const [commitMessage, setCommitMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStatus = useCallback(
    async (silent = false) => {
      if (!projectPath) return
      if (!silent) setIsRefreshing(true)

      try {
        const result = await commands.gitStatus(projectPath)
        if (result.status === 'ok') {
          const files: ChangedFile[] = result.data
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => {
              const statusIndicator = line.substring(0, 2)
              const filePath = line.substring(3)

              let status: ChangedFile['status'] = 'modified'
              if (statusIndicator.includes('M')) status = 'modified'
              else if (statusIndicator.includes('A')) status = 'added'
              else if (statusIndicator.includes('D')) status = 'deleted'
              else if (statusIndicator.includes('??')) status = 'untracked'
              else if (statusIndicator.includes('R')) status = 'renamed'

              return { path: filePath, status }
            })
          setChangedFiles(files)
        }
      } catch {
        // Ignore errors for now
      } finally {
        setIsRefreshing(false)
      }
    },
    [projectPath]
  )

  useEffect(() => {
    void fetchStatus()
    // Refresh status every 10 seconds if panel is open
    const interval = setInterval(() => {
      void fetchStatus(true)
    }, 10000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  const handleCommit = async () => {
    if (!projectPath || !commitMessage.trim()) return

    setIsLoading(true)
    try {
      const result = await commands.gitCommit(projectPath, commitMessage)
      if (result.status === 'ok') {
        toast.success('Successfully committed changes')
        setCommitMessage('')
        void fetchStatus()
      } else {
        toast.error('Git Commit Failed', { description: result.error })
      }
    } catch {
      toast.error('An error occurred during commit')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePush = async () => {
    if (!projectPath) return
    setIsLoading(true)
    try {
      const result = await commands.gitPush(projectPath)
      if (result.status === 'ok') {
        toast.success('Successfully pushed changes')
      } else {
        toast.error('Git Push Failed', { description: result.error })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePull = async () => {
    if (!projectPath) return
    setIsLoading(true)
    try {
      const result = await commands.gitPull(projectPath)
      if (result.status === 'ok') {
        toast.success('Successfully pulled changes')
        void fetchStatus()
      } else {
        toast.error('Git Pull Failed', { description: result.error })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: ChangedFile['status']) => {
    switch (status) {
      case 'modified':
        return <FileEdit className="size-3.5 text-blue-500" />
      case 'added':
        return <Plus className="size-3.5 text-green-500" />
      case 'untracked':
        return <Plus className="size-3.5 text-green-500" />
      case 'deleted':
        return <Trash2 className="size-3.5 text-red-500" />
      case 'renamed':
        return <FileText className="size-3.5 text-purple-500" />
      default:
        return <FileText className="size-3.5 text-gray-400" />
    }
  }

  const getStatusColor = (status: ChangedFile['status']) => {
    switch (status) {
      case 'modified':
        return 'text-blue-500'
      case 'added':
      case 'untracked':
        return 'text-green-500'
      case 'deleted':
        return 'text-red-500'
      case 'renamed':
        return 'text-purple-500'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Source Control
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0"
            onClick={() => {
              void fetchStatus()
            }}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn('size-3.5', isRefreshing && 'animate-spin')}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0"
            onClick={() => {
              void handlePull()
            }}
            disabled={isLoading}
            title="Pull"
          >
            <ArrowDownCircle className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0"
            onClick={() => {
              void handlePush()
            }}
            disabled={isLoading}
            title="Push"
          >
            <ArrowUpCircle className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <Input
          placeholder="Message (Cmd+Enter to commit)"
          value={commitMessage}
          onChange={e => setCommitMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              void handleCommit()
            }
          }}
          className="text-sm bg-muted/50 border-none focus-visible:ring-1"
        />
        <Button
          className="w-full gap-2 text-xs h-8"
          onClick={() => {
            void handleCommit()
          }}
          disabled={
            isLoading || !commitMessage.trim() || changedFiles.length === 0
          }
        >
          <GitCommit className="size-3.5" />
          Commit
        </Button>
      </div>

      <div className="px-4 py-2 bg-muted/30 border-y">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">
          Changes ({changedFiles.length})
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/50">
          {changedFiles.length > 0 ? (
            changedFiles.map((file, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors cursor-default"
              >
                <div className="shrink-0">{getStatusIcon(file.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {file.path.split('/').pop()}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {file.path.split('/').slice(0, -1).join('/') || './'}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase px-1.5',
                    getStatusColor(file.status)
                  )}
                >
                  {file.status === 'untracked'
                    ? 'U'
                    : file.status?.charAt(0).toUpperCase() || ''}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-xs text-muted-foreground">
                No changes detected in the working tree.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
