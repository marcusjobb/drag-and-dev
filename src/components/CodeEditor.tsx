import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyIcon, CodeIcon, CheckIcon, DownloadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  code: string;
  language: 'csharp' | 'java' | 'javascript' | 'python';
  onChange: (value: string) => void;
  onDownload: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language, 
  onChange, 
  onDownload 
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const editorRef = useRef<any>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: '🎉 Code Copied!',
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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const getEditorLanguage = (lang: string) => {
    const languageMap = {
      'csharp': 'csharp',
      'java': 'java',
      'javascript': 'javascript',
      'python': 'python'
    };
    return languageMap[lang as keyof typeof languageMap] || 'plaintext';
  };

  const getLanguageDisplayName = (lang: string) => {
    const displayMap = {
      'csharp': 'C#',
      'java': 'Java',
      'javascript': 'JavaScript',
      'python': 'Python'
    };
    return displayMap[lang as keyof typeof displayMap] || lang;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 sm:p-3 border-b bg-muted/30">
        <div className="flex items-center gap-1 sm:gap-2">
          <CodeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-dev-primary" />
          <h3 className="font-semibold text-xs sm:text-sm">Generated Code</h3>
          <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-dev-primary/10 text-dev-primary rounded-full font-mono">
            {getLanguageDisplayName(language)}
          </span>
          <span className="hidden sm:inline text-xs px-2 py-1 bg-dev-success/10 text-dev-success rounded-full font-mono">
            Editable
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
          >
            {copied ? (
              <CheckIcon className="h-3 w-3 sm:mr-1" />
            ) : (
              <CopyIcon className="h-3 w-3 sm:mr-1" />
            )}
            <span className="hidden sm:inline">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </Button>
          <Button
            size="sm"
            onClick={onDownload}
            className="h-7 sm:h-8 px-2 sm:px-3 text-xs bg-dev-primary hover:bg-dev-primary/90"
          >
            <DownloadIcon className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getEditorLanguage(language)}
          value={code || '// Generated code will appear here...'}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: window.innerWidth < 768 ? 12 : 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            folding: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            tabSize: 4,
            insertSpaces: true,
            // Mobile-specific adjustments
            scrollbar: {
              useShadows: false,
              horizontal: 'auto',
              vertical: 'auto',
              horizontalScrollbarSize: window.innerWidth < 768 ? 8 : 12,
              verticalScrollbarSize: window.innerWidth < 768 ? 8 : 12,
            },
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            renderLineHighlight: 'gutter',
            lineDecorationsWidth: window.innerWidth < 768 ? 8 : 10,
            lineNumbersMinChars: window.innerWidth < 768 ? 3 : 4,
          }}
        />
      </div>
    </div>
  );
};