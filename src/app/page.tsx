'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { generateCallSummary, type GenerateCallSummaryInput } from '@/ai/flows/generate-call-summary';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/page-header';
import type { ActiveCall } from '@/types';
import { AVAILABLE_AI_MODELS } from '@/types';
import { Bot, Clock, PhoneIncoming, RefreshCw, Sparkles, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const initialMockCalls: ActiveCall[] = [
  {
    id: 'call_1',
    callerId: '+15551234567',
    status: 'In Progress',
    duration: '00:02:35',
    currentAiModel: AVAILABLE_AI_MODELS[0].name,
    transcript: "Caller: Hello, I'm having an issue with my recent order. It hasn't arrived yet.\nAI: I understand. Can you please provide your order number so I can check the status for you?\nCaller: Yes, it's ORD-12345.\nAI: Thank you. Let me check... It seems your order is currently out for delivery and should arrive by end of day today.\nCaller: Oh, great! Thank you for your help.\nAI: You're welcome! Is there anything else I can assist you with today?\nCaller: No, that's all. Thanks again.\nAI: Have a great day!",
    timestamp: new Date(Date.now() - 155000), // 2 min 35 sec ago
  },
  {
    id: 'call_2',
    callerId: '+15557654321',
    status: 'Ringing',
    duration: '00:00:05',
    currentAiModel: AVAILABLE_AI_MODELS[1].name,
    transcript: 'Ringing...',
    timestamp: new Date(Date.now() - 5000), // 5 sec ago
  },
];

const ActiveCallCard: React.FC<{ call: ActiveCall; onUpdateCall: (updatedCall: ActiveCall) => void }> = ({ call, onUpdateCall }) => {
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const { toast } = useToast();
  const [currentDuration, setCurrentDuration] = useState(call.duration);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (call.status === 'In Progress' || call.status === 'Ringing') {
      interval = setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - call.timestamp.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setCurrentDuration(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [call.status, call.timestamp]);


  const handleGenerateSummary = async () => {
    if (!call.transcript || call.transcript === "Ringing...") {
      toast({
        title: "Cannot generate summary",
        description: "Transcript is not available for this call.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingSummary(true);
    try {
      const input: GenerateCallSummaryInput = { callTranscript: call.transcript };
      const result = await generateCallSummary(input);
      onUpdateCall({ ...call, summary: result.summary });
      toast({
        title: "Summary Generated",
        description: "Call summary has been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate call summary.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <PhoneIncoming className="mr-2 h-5 w-5 text-primary" />
              {call.callerId}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="mr-1.5 h-4 w-4 text-muted-foreground" /> {currentDuration}
              <Badge variant={call.status === 'In Progress' ? 'default' : call.status === 'Ringing' ? 'secondary' : 'outline'} className="ml-2 capitalize">
                {call.status}
              </Badge>
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground">
                <p>AI Model: {call.currentAiModel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 pt-0">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground">Transcript</h4>
          <ScrollArea className="h-32 w-full rounded-md border p-3 bg-secondary/30">
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{call.transcript}</pre>
          </ScrollArea>
        </div>
        {call.summary && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-accent" /> AI Summary
            </h4>
            <ScrollArea className="h-24 w-full rounded-md border p-3 bg-accent/10">
              <p className="text-xs text-foreground">{call.summary}</p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          onClick={handleGenerateSummary}
          disabled={isLoadingSummary || call.status === 'Ringing'}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoadingSummary ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          {call.summary ? 'Regenerate Summary' : 'Generate Summary'}
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function DashboardPage() {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>(initialMockCalls);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateCall = (updatedCall: ActiveCall) => {
    setActiveCalls(prevCalls => 
      prevCalls.map(c => c.id === updatedCall.id ? updatedCall : c)
    );
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Live Call Dashboard" description="Monitor active calls and agent performance in real-time." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Live Call Dashboard" 
        description="Monitor active calls and agent performance in real-time."
        actions={<Button variant="outline"><RefreshCw className="mr-2 h-4 w-4"/> Refresh</Button>}
      />
      {activeCalls.length === 0 ? (
        <Card className="text-center p-10">
          <CardTitle>No Active Calls</CardTitle>
          <CardDescription className="mt-2">There are currently no active calls to display.</CardDescription>
          <img src="https://placehold.co/400x300.png" alt="No calls" data-ai-hint="empty state illustration" className="mx-auto mt-6 rounded-md opacity-70" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {activeCalls.map((call) => (
            <ActiveCallCard key={call.id} call={call} onUpdateCall={handleUpdateCall} />
          ))}
        </div>
      )}
    </div>
  );
}
