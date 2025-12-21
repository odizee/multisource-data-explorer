import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DataSectionProps {
  title: string;
  count?: number;
  isLoading: boolean;
  error: string | null;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DataSection({
  title,
  count,
  isLoading,
  error,
  isEnabled,
  onToggle,
  onRetry,
  children,
  className,
}: DataSectionProps) {
  return (
    <Card className={`w-full h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          {isEnabled && count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${title}`}
        />
      </CardHeader>
      <CardContent className="flex-1 p-0 relative min-h-[300px] flex flex-col">
        {!isEnabled ? (
          <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground p-6">
            <p>Dataset disabled</p>
            <Button variant="link" onClick={() => onToggle(true)}>
              Enable to view data
            </Button>
          </div>
        ) : (
          <>
            {error ? (
              <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                <Alert variant="destructive" className="mb-4 max-w-xs text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                {onRetry && (
                  <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                )}
              </div>
            ) : isLoading ? (
              <div className="p-4 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
