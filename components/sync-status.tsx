"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudOff, Download, Upload, Copy } from "lucide-react"
import { manualSync, getLastSyncTime, getUserId, exportData, importData } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function SyncStatus() {
  const { toast } = useToast()
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setLastSync(getLastSyncTime())
    setUserId(getUserId())
  }, [])

  // Don't render anything during SSR
  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            Data Sync & Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-8 w-32 bg-slate-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-48 bg-slate-200 rounded mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    try {
      const success = await manualSync()
      if (success) {
        setLastSync(new Date().toISOString())
        toast({
          title: "Sync successful!",
          description: "Your data has been synced across devices.",
        })
      } else {
        toast({
          title: "Sync failed",
          description: "Unable to sync data. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Sync error",
        description: "An error occurred during sync.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fitness-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported!",
        description: "Your fitness data has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export data.",
        variant: "destructive",
      })
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string
            const success = importData(data)
            if (success) {
              toast({
                title: "Data imported!",
                description: "Your fitness data has been restored.",
              })
              // Refresh the page to show imported data
              window.location.reload()
            } else {
              toast({
                title: "Import failed",
                description: "Invalid data format.",
                variant: "destructive",
              })
            }
          } catch (error) {
            toast({
              title: "Import error",
              description: "Unable to read file.",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const copyUserId = () => {
    navigator.clipboard.writeText(userId)
    toast({
      title: "User ID copied!",
      description: "Share this ID to sync data across devices.",
    })
  }

  const formatLastSync = (syncTime: string | null) => {
    if (!syncTime) return "Never"
    const date = new Date(syncTime)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-600" />
          Data Sync & Backup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lastSync ? (
              <Badge variant="default" className="flex items-center gap-1">
                <Cloud className="h-3 w-3" />
                Synced
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CloudOff className="h-3 w-3" />
                Not synced
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">Last sync: {formatLastSync(lastSync)}</span>
          </div>
          <Button onClick={handleManualSync} disabled={isSyncing} size="sm">
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>

        {/* User ID */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Your Device ID:</span>
            <Button onClick={copyUserId} variant="outline" size="sm">
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded font-mono">{userId}</div>
          <p className="text-xs text-muted-foreground">
            Use this ID to sync your data across multiple devices. Your data is automatically backed up when you make
            changes.
          </p>
        </div>

        {/* Export/Import */}
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Export Data
          </Button>
          <Button onClick={handleImport} variant="outline" size="sm" className="flex-1">
            <Upload className="h-3 w-3 mr-1" />
            Import Data
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">💡 How to sync across devices:</p>
          <p>1. Your data automatically syncs when you make changes</p>
          <p>2. On a new device, import your exported data file</p>
          <p>3. Or use the same browser to access your data</p>
        </div>
      </CardContent>
    </Card>
  )
}
