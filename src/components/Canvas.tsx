import React from 'react';
import { Card } from '@/components/ui/card';
import { PlusIcon, MousePointerClickIcon } from 'lucide-react';
import type { CodeElement } from './CodeBuilder';

interface CanvasProps {
  elements: CodeElement[];
  onDrop: (element: CodeElement) => void;
  draggedElement: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ elements, onDrop, draggedElement }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    
    if (elementType) {
      const newElement: CodeElement = {
        id: `${elementType}-${Date.now()}`,
        type: elementType,
        content: getDefaultContent(elementType),
        properties: getDefaultProperties(elementType),
        position: {
          x: e.clientX - e.currentTarget.getBoundingClientRect().left,
          y: e.clientY - e.currentTarget.getBoundingClientRect().top
        }
      };
      
      onDrop(newElement);
    }
  };

  const getDefaultContent = (type: string): string => {
    const contentMap: Record<string, string> = {
      'console.writeline': 'Console.WriteLine("Hello World");',
      'console.write': 'Console.Write("Hello");',
      'for': 'for (int i = 0; i < 10; i++)',
      'while': 'while (condition)',
      'if': 'if (condition)',
      'if-else': 'if (condition) { } else { }',
      'if-else-if': 'if (condition1) { } else if (condition2) { } else { }',
      'variable': 'var myVariable = value;',
      'return': 'return value;',
      'string': 'string myString = "";',
      'int': 'int myInt = 0;',
      'bool': 'bool myBool = false;',
      'double': 'double myDouble = 0.0;'
    };
    return contentMap[type] || type;
  };

  const getDefaultProperties = (type: string): Record<string, any> => {
    const propertiesMap: Record<string, Record<string, any>> = {
      'console.writeline': { message: 'Hello World' },
      'console.write': { message: 'Hello' },
      'for': { variable: 'i', start: '0', end: '10', increment: '1' },
      'while': { condition: 'condition' },
      'if': { condition: 'condition' },
      'variable': { type: 'var', name: 'myVariable', value: 'value' },
      'return': { value: 'value' }
    };
    return propertiesMap[type] || {};
  };

  const getElementColor = (type: string): string => {
    if (type.includes('console')) return 'element-output';
    if (['for', 'while'].includes(type)) return 'element-control';
    if (type.includes('if')) return 'element-logic';
    return 'element-data';
  };

  return (
    <div className="h-full relative">
      <div
        className={`w-full h-full min-h-[500px] border-2 border-dashed rounded-xl transition-all duration-300 ${
          draggedElement 
            ? 'border-dev-primary bg-dev-primary/5' 
            : 'border-border bg-canvas/50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                <PlusIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start Building Your Method
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Drag code elements from the toolbox on the left to start building your method. 
                  Each element can be configured in the properties panel.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-dev-primary">
                <MousePointerClickIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Drag & Drop to Begin</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {elements.map((element, index) => (
              <Card 
                key={element.id}
                className={`p-4 bg-card border-l-4 border-l-${getElementColor(element.type)} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    <code className="text-sm font-mono text-foreground">
                      {element.content}
                    </code>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full bg-${getElementColor(element.type)}/10 text-${getElementColor(element.type)} font-medium`}>
                    {element.type}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};