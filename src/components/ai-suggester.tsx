'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAISuggestion } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from '@/components/ui/skeleton';

type AISuggesterProps = {
  watchHistory: string[];
};

export function AISuggester({ watchHistory }: AISuggesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<{ suggestedContent: string; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    setIsOpen(true);
    try {
      const result = await getAISuggestion({ watchHistory });
      setSuggestion(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: (error as Error).message,
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={handleGetSuggestion} size="lg" className="rounded-full shadow-lg h-14 w-14 p-0 md:w-auto md:px-6 md:py-2">
          <Wand2 className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">Suggest Next</span>
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Next Watch</DialogTitle>
            <DialogDescription>
              Based on your watch history, here's a suggestion for you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
            {suggestion && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">{suggestion.suggestedContent}</h3>
                <p className="text-muted-foreground">{suggestion.reason}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
