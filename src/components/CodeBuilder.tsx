import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toolbox } from './Toolbox';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { CodeOutput } from './CodeOutput';
import { CodeGenerator } from '@/lib/codeGenerator';
import { CodeIcon, PlayIcon, DownloadIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface CodeElement {
  id: string;
  type: string;
  content: string;
  properties?: Record<string, any>;
  children?: CodeElement[];
  position?: { x: number; y: number };
}

export interface ProjectData {
  namespace: string;
  className: string;
  language: 'csharp' | 'java';
  methods: {
    visibility: string;
    isStatic: boolean;
    returnType: string;
    name: string;
    parameters: { name: string; type: string }[];
    elements: CodeElement[];
  }[];
}

const CodeBuilder: React.FC = () => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<ProjectData>({
    namespace: 'MyProject',
    className: 'MyClass',
    language: 'csharp',
    methods: [{
      visibility: 'public',
      isStatic: false,
      returnType: 'void',
      name: 'MyMethod',
      parameters: [],
      elements: []
    }]
  });
  
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  const handleDragStart = (elementType: string) => {
    setDraggedElement(elementType);
  };

  const handleDrop = (element: CodeElement) => {
    const updatedMethods = [...projectData.methods];
    updatedMethods[selectedMethod].elements.push(element);
    
    setProjectData({
      ...projectData,
      methods: updatedMethods
    });
    
    setDraggedElement(null);
  };

  const generateCode = () => {
    const code = CodeGenerator.generate(projectData);
    setGeneratedCode(code);
    toast({
      title: 'Code Generated!',
      description: 'Your method has been successfully generated.',
    });
  };

  const downloadCode = () => {
    if (!generatedCode) {
      generateCode();
      return;
    }

    const extension = projectData.language === 'csharp' ? 'cs' : 'java';
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.className}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Code Downloaded!',
      description: `${projectData.className}.${extension} has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-dev-primary to-dev-secondary rounded-lg">
                <CodeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Code Builder</h1>
                <p className="text-sm text-muted-foreground">
                  Drag & drop method generator for C# and Java
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={generateCode}
                className="bg-dev-primary hover:bg-dev-primary/90"
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
              <Button
                onClick={downloadCode}
                variant="outline"
                className="border-dev-primary text-dev-primary hover:bg-dev-primary/10"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Toolbox */}
        <div className="w-80 border-r bg-toolbox text-toolbox-foreground overflow-y-auto">
          <Toolbox onDragStart={handleDragStart} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-background to-muted/50 p-6">
            <Canvas
              elements={projectData.methods[selectedMethod]?.elements || []}
              onDrop={handleDrop}
              draggedElement={draggedElement}
            />
          </div>
          
          {/* Code Output */}
          {generatedCode && (
            <div className="h-64 border-t">
              <CodeOutput code={generatedCode} language={projectData.language} />
            </div>
          )}
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <PropertiesPanel
            projectData={projectData}
            selectedMethod={selectedMethod}
            onProjectDataChange={setProjectData}
            onMethodChange={setSelectedMethod}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-4">
        <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-lg border-dev-primary/20">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            ❤️ By Marcus Medina
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CodeBuilder;