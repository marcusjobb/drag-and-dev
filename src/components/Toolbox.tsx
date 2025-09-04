import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CodeIcon, 
  RepeatIcon, 
  GitBranchIcon, 
  DatabaseIcon, 
  TerminalIcon,
  TypeIcon,
  FunctionSquareIcon
} from 'lucide-react';

interface ToolboxProps {
  onDragStart: (elementType: string) => void;
}

const toolboxItems = [
  {
    category: 'Output',
    items: [
      { type: 'console.writeline', label: 'Console.WriteLine', icon: TerminalIcon, color: 'element-output' },
      { type: 'console.write', label: 'Console.Write', icon: TerminalIcon, color: 'element-output' }
    ]
  },
  {
    category: 'Control Flow',
    items: [
      { type: 'for', label: 'For Loop', icon: RepeatIcon, color: 'element-control' },
      { type: 'while', label: 'While Loop', icon: RepeatIcon, color: 'element-control' },
      { type: 'if', label: 'If Statement', icon: GitBranchIcon, color: 'element-logic' },
      { type: 'if-else', label: 'If-Else', icon: GitBranchIcon, color: 'element-logic' },
      { type: 'if-else-if', label: 'If-Else If', icon: GitBranchIcon, color: 'element-logic' }
    ]
  },
  {
    category: 'Data',
    items: [
      { type: 'variable', label: 'Variable', icon: DatabaseIcon, color: 'element-data' },
      { type: 'return', label: 'Return Statement', icon: FunctionSquareIcon, color: 'element-data' }
    ]
  },
  {
    category: 'Data Types',
    items: [
      { type: 'string', label: 'String', icon: TypeIcon, color: 'element-data' },
      { type: 'int', label: 'Integer', icon: TypeIcon, color: 'element-data' },
      { type: 'bool', label: 'Boolean', icon: TypeIcon, color: 'element-data' },
      { type: 'double', label: 'Double', icon: TypeIcon, color: 'element-data' }
    ]
  }
];

export const Toolbox: React.FC<ToolboxProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('text/plain', elementType);
    onDragStart(elementType);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <CodeIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Toolbox</h2>
      </div>

      {toolboxItems.map((category) => (
        <div key={category.category} className="space-y-2">
          <h3 className="text-sm font-medium text-toolbox-foreground/70 uppercase tracking-wider">
            {category.category}
          </h3>
          
          <div className="space-y-1">
            {category.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.type}
                  className={`p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg bg-card/10 border-card/20 hover:bg-card/20`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md bg-${item.color}/20`}>
                      <IconComponent className={`h-4 w-4 text-${item.color}`} />
                    </div>
                    <span className="text-sm font-medium text-toolbox-foreground">
                      {item.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {category !== toolboxItems[toolboxItems.length - 1] && (
            <Separator className="my-4 bg-toolbox-foreground/20" />
          )}
        </div>
      ))}

      <div className="mt-8 p-4 bg-card/10 rounded-lg border border-card/20">
        <p className="text-xs text-toolbox-foreground/60 leading-relaxed">
          💡 <strong>Tip:</strong> Drag elements from this toolbox onto the canvas to build your method. 
          Configure properties in the right panel.
        </p>
      </div>
    </div>
  );
};