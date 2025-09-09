import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Toolbox } from './Toolbox';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { CodeEditor } from './CodeEditor';
import { CelebrationEffects } from './CelebrationEffects';
import { CodeGenerator } from '@/lib/codeGenerator';
import { CodeIcon, PlayIcon, DownloadIcon, WandIcon, SparklesIcon } from 'lucide-react';
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
  language: 'csharp' | 'java' | 'javascript' | 'python';
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
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [celebrationType, setCelebrationType] = useState<'confetti' | 'sparkles' | 'fireworks' | 'unicorn'>('confetti');
  const [activeTab, setActiveTab] = useState('builder');

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
    
    // Trigger celebration!
    const celebrations: ('confetti' | 'sparkles' | 'unicorn')[] = 
      ['confetti', 'sparkles', 'unicorn'];
    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
    setCelebrationType(randomCelebration);
    setCelebrationTrigger(prev => prev + 1);
  };

  const handleElementReorder = (elements: CodeElement[]) => {
    const updatedMethods = [...projectData.methods];
    updatedMethods[selectedMethod].elements = elements;
    setProjectData({
      ...projectData,
      methods: updatedMethods
    });
  };

  const generateCode = () => {
    const code = CodeGenerator.generate(projectData);
    setGeneratedCode(code);
    setCelebrationType('fireworks');
    setCelebrationTrigger(prev => prev + 1);
    toast({
      title: '🚀 Code Generated!',
      description: 'Your epic method has been successfully generated!',
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'code') {
      const code = CodeGenerator.generate(projectData);
      setGeneratedCode(code);
      setCelebrationType('fireworks');
      setCelebrationTrigger(prev => prev + 1);
      toast({
        title: '🚀 Code Generated!',
        description: 'Your epic method has been successfully generated!',
      });
    }
  };

  const handleGenerateCodeClick = () => {
    const code = CodeGenerator.generate(projectData);
    setGeneratedCode(code);
    setCelebrationType('fireworks');
    setCelebrationTrigger(prev => prev + 1);
    toast({
      title: '🚀 Code Generated!',
      description: 'Your epic method has been successfully generated!',
    });
    setActiveTab('code');
  };

  const handleCodeChange = (newCode: string) => {
    setGeneratedCode(newCode);
  };

  const downloadCode = () => {
    if (!generatedCode) {
      generateCode();
      return;
    }

    const extensionMap = {
      'csharp': 'cs',
      'java': 'java', 
      'javascript': 'js',
      'python': 'py'
    };
    const extension = extensionMap[projectData.language] || 'txt';
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
                  Drag & drop method generator for C#, Java, JavaScript & Python
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleGenerateCodeClick}
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
          <Toolbox onDragStart={handleDragStart} language={projectData.language} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
            <div className="px-6 py-3 border-b bg-card/50">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="builder" className="flex items-center gap-2">
                  <WandIcon className="h-4 w-4" />
                  Builder
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4" />
                  Code Editor
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="builder" className="flex-1 m-0 p-0">
              <div className="flex-1 bg-gradient-to-br from-background to-muted/50 p-6">
                <Canvas
                  elements={projectData.methods[selectedMethod]?.elements || []}
                  onDrop={handleDrop}
                  onElementReorder={handleElementReorder}
                  draggedElement={draggedElement}
                />
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0 p-0">
              <div className="h-full">
                <CodeEditor
                  code={generatedCode}
                  language={projectData.language}
                  onChange={handleCodeChange}
                  onDownload={downloadCode}
                />
              </div>
            </TabsContent>
          </Tabs>
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
      <div className="fixed bottom-4 right-4">
        <Card className="p-3 bg-card/95 backdrop-blur-sm shadow-lg border-dev-primary/20 hover:scale-105 transition-transform duration-200">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            ❤️ By Marcus Medina
          </p>
        </Card>
      </div>

      {/* Celebration Effects */}
      <CelebrationEffects trigger={celebrationTrigger} type={celebrationType} />
    </div>
  );
};

export default CodeBuilder;