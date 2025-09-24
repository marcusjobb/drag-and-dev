import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon, CodeIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeOutputProps {
  code: string;
  language: 'csharp' | 'java';
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ code, language }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Code Copied!',
        description: 'The generated code has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy code to clipboard.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <CodeIcon className="h-4 w-4 text-dev-primary" />
          <h3 className="font-semibold text-sm">Generated Code</h3>
          <span className="text-xs px-2 py-1 bg-dev-primary/10 text-dev-primary rounded-full font-mono">
            {language === 'csharp' ? 'C#' : 'Java'}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
          className="h-8"
        >
          {copied ? (
            <CheckIcon className="h-3 w-3 mr-1" />
          ) : (
            <CopyIcon className="h-3 w-3 mr-1" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed bg-card">
          <code className="text-foreground whitespace-pre-wrap">
            {code || '// Generated code will appear here...'}
          </code>
        </pre>
      </div>
    </div>
  );
};