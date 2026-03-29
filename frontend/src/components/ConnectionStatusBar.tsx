import { useConnectionStatus, ConnectionStatus } from '@/hooks/useConnectionStatus';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, Database, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatusDot({ status }: { status: ConnectionStatus }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        status === 'connected' && 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]',
        status === 'disconnected' && 'bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.6)]',
        status === 'connecting' && 'animate-pulse bg-yellow-500'
      )}
    />
  );
}

function statusLabel(s: ConnectionStatus) {
  return s === 'connected' ? 'Connected' : s === 'disconnected' ? 'Disconnected' : 'Connecting...';
}

export function ConnectionStatusBar() {
  const { api, database, lastPing, latencyMs } = useConnectionStatus();

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1.5 px-2 py-0.5 font-normal">
            <StatusDot status={api} />
            {api === 'connected' ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            API
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>API: {statusLabel(api)}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1.5 px-2 py-0.5 font-normal">
            <StatusDot status={database} />
            <Database className="h-3 w-3" />
            DB
            {latencyMs !== null && (
              <span className="text-muted-foreground">{latencyMs}ms</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Database: {statusLabel(database)}</p>
          {lastPing && <p>Last ping: {lastPing.toLocaleTimeString()}</p>}
          {latencyMs !== null && <p>Latency: {latencyMs}ms</p>}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>15s</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Ping interval: every 15 seconds</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}



