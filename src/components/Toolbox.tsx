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
  FunctionSquareIcon,
  CheckCircleIcon,
  HashIcon,
  MailIcon,
  CalendarIcon
} from 'lucide-react';

interface ToolboxProps {
  onDragStart: (elementType: string) => void;
  language?: 'csharp' | 'java' | 'javascript' | 'python';
}

const toolboxItems = [
  {
    category: 'Output & Input',
    items: [
      { type: 'console.writeline', label: 'Print Line', icon: TerminalIcon, color: 'element-output' },
      { type: 'console.write', label: 'Print', icon: TerminalIcon, color: 'element-output' },
      { type: 'console.readkey', label: 'Read Key', icon: TerminalIcon, color: 'element-output' },
      { type: 'console.readline', label: 'Read Input', icon: TerminalIcon, color: 'element-output' },
      { type: 'debug.print', label: 'Debug Print', icon: TerminalIcon, color: 'element-output' },
      { type: 'trace.write', label: 'Trace Output', icon: TerminalIcon, color: 'element-output' }
    ]
  },
  {
    category: 'Control Flow',
    items: [
      { type: 'for', label: 'For Loop', icon: RepeatIcon, color: 'element-control' },
      { type: 'foreach', label: 'ForEach Loop', icon: RepeatIcon, color: 'element-control' },
      { type: 'while', label: 'While Loop', icon: RepeatIcon, color: 'element-control' },
      { type: 'do-while', label: 'Do-While Loop', icon: RepeatIcon, color: 'element-control' },
      { type: 'switch', label: 'Switch Statement', icon: GitBranchIcon, color: 'element-control' },
      { type: 'break', label: 'Break', icon: GitBranchIcon, color: 'element-control' },
      { type: 'continue', label: 'Continue', icon: GitBranchIcon, color: 'element-control' }
    ]
  },
  {
    category: 'Conditionals',
    items: [
      { type: 'if', label: 'If Statement', icon: GitBranchIcon, color: 'element-logic' },
      { type: 'if-else', label: 'If-Else', icon: GitBranchIcon, color: 'element-logic' },
      { type: 'if-else-if', label: 'If-Else If', icon: GitBranchIcon, color: 'element-logic' },
      { type: 'ternary', label: 'Ternary Operator', icon: GitBranchIcon, color: 'element-logic' }
    ]
  },
  {
    category: 'Variables & Data',
    items: [
      { type: 'variable', label: 'Variable', icon: DatabaseIcon, color: 'element-data' },
      { type: 'constant', label: 'Constant', icon: DatabaseIcon, color: 'element-data' },
      { type: 'array', label: 'Array', icon: DatabaseIcon, color: 'element-data' },
      { type: 'list', label: 'List', icon: DatabaseIcon, color: 'element-data' },
      { type: 'dictionary', label: 'Dictionary', icon: DatabaseIcon, color: 'element-data' },
      { type: 'return', label: 'Return Statement', icon: FunctionSquareIcon, color: 'element-data' }
    ]
  },
  {
    category: 'Primitive Types',
    items: [
      { type: 'string', label: 'String', icon: TypeIcon, color: 'element-data' },
      { type: 'int', label: 'Integer', icon: TypeIcon, color: 'element-data' },
      { type: 'long', label: 'Long', icon: TypeIcon, color: 'element-data' },
      { type: 'float', label: 'Float', icon: TypeIcon, color: 'element-data' },
      { type: 'double', label: 'Double', icon: TypeIcon, color: 'element-data' },
      { type: 'decimal', label: 'Decimal', icon: TypeIcon, color: 'element-data' },
      { type: 'bool', label: 'Boolean', icon: TypeIcon, color: 'element-data' },
      { type: 'char', label: 'Character', icon: TypeIcon, color: 'element-data' },
      { type: 'byte', label: 'Byte', icon: TypeIcon, color: 'element-data' },
      { type: 'short', label: 'Short', icon: TypeIcon, color: 'element-data' }
    ]
  },
  {
    category: 'Math & Operations',
    items: [
      { type: 'math.sqrt', label: 'Math.Sqrt', icon: FunctionSquareIcon, color: 'element-function' },
      { type: 'math.pow', label: 'Math.Pow', icon: FunctionSquareIcon, color: 'element-function' },
      { type: 'math.abs', label: 'Math.Abs', icon: FunctionSquareIcon, color: 'element-function' },
      { type: 'math.min', label: 'Math.Min', icon: FunctionSquareIcon, color: 'element-function' },
      { type: 'math.max', label: 'Math.Max', icon: FunctionSquareIcon, color: 'element-function' },
      { type: 'random', label: 'Random', icon: FunctionSquareIcon, color: 'element-function' }
    ]
  },
  {
    category: 'String Operations',
    items: [
      { type: 'string.length', label: 'String.Length', icon: TypeIcon, color: 'element-string' },
      { type: 'string.substring', label: 'Substring', icon: TypeIcon, color: 'element-string' },
      { type: 'string.split', label: 'Split', icon: TypeIcon, color: 'element-string' },
      { type: 'string.replace', label: 'Replace', icon: TypeIcon, color: 'element-string' },
      { type: 'string.tolower', label: 'ToLower', icon: TypeIcon, color: 'element-string' },
      { type: 'string.toupper', label: 'ToUpper', icon: TypeIcon, color: 'element-string' },
      { type: 'string.trim', label: 'Trim', icon: TypeIcon, color: 'element-string' },
      { type: 'string.contains', label: 'Contains', icon: TypeIcon, color: 'element-string' }
    ]
  },
  {
    category: 'Exception Handling',
    items: [
      { type: 'try-catch', label: 'Try-Catch', icon: GitBranchIcon, color: 'element-exception' },
      { type: 'try-catch-finally', label: 'Try-Catch-Finally', icon: GitBranchIcon, color: 'element-exception' },
      { type: 'throw', label: 'Throw Exception', icon: GitBranchIcon, color: 'element-exception' }
    ]
  },
  {
    category: 'Utility Functions',
    items: [
      { type: 'isEven', label: 'Is Even', icon: CheckCircleIcon, color: 'element-function' },
      { type: 'isOdd', label: 'Is Odd', icon: CheckCircleIcon, color: 'element-function' },
      { type: 'isPrime', label: 'Is Prime', icon: CheckCircleIcon, color: 'element-function' },
      { type: 'factorial', label: 'Factorial', icon: HashIcon, color: 'element-function' },
      { type: 'fibonacci', label: 'Fibonacci', icon: HashIcon, color: 'element-function' },
      { type: 'reverse', label: 'Reverse String', icon: TypeIcon, color: 'element-string' },
      { type: 'palindrome', label: 'Is Palindrome', icon: CheckCircleIcon, color: 'element-string' },
      { type: 'swap', label: 'Swap Variables', icon: GitBranchIcon, color: 'element-function' }
    ]
  },
  {
    category: 'Converters',
    items: [
      { type: 'toBinary', label: 'To Binary', icon: HashIcon, color: 'element-function' },
      { type: 'toHex', label: 'To Hexadecimal', icon: HashIcon, color: 'element-function' },
      { type: 'celsiusToFahrenheit', label: 'Celsius to Fahrenheit', icon: TerminalIcon, color: 'element-function' },
      { type: 'fahrenheitToCelsius', label: 'Fahrenheit to Celsius', icon: TerminalIcon, color: 'element-function' },
      { type: 'inchesToCm', label: 'Inches to CM', icon: TerminalIcon, color: 'element-function' },
      { type: 'cmToInches', label: 'CM to Inches', icon: TerminalIcon, color: 'element-function' }
    ]
  },
  {
    category: 'Validators',
    items: [
      { type: 'checkEmail', label: 'Validate Email', icon: MailIcon, color: 'element-function' },
      { type: 'validatePassword', label: 'Validate Password', icon: CheckCircleIcon, color: 'element-function' },
      { type: 'isValidUrl', label: 'Validate URL', icon: CheckCircleIcon, color: 'element-function' },
      { type: 'isValidDate', label: 'Validate Date', icon: CalendarIcon, color: 'element-function' },
      { type: 'isNumeric', label: 'Is Numeric', icon: CheckCircleIcon, color: 'element-function' }
    ]
  }
];

export const Toolbox: React.FC<ToolboxProps> = ({ onDragStart, language = 'csharp' }) => {
  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('text/plain', elementType);
    onDragStart(elementType);
  };


  return (
    <div className="p-4 space-y-4 max-h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 sticky top-0 bg-toolbox z-10 py-2">
        <CodeIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Epic Toolbox 🚀</h2>
      </div>

      {toolboxItems.map((category) => (
        <div key={category.category} className="space-y-2">
          <h3 className="text-sm font-medium text-toolbox-foreground/70 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dev-primary animate-pulse"></span>
            {category.category}
          </h3>
          
          <div className="space-y-1">
            {category.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.type}
                  className={`p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 hover:shadow-lg bg-card/10 border-card/20 hover:bg-card/20 hover:border-${item.color}/30 group`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md bg-${item.color}/20 group-hover:bg-${item.color}/30 transition-colors`}>
                      <IconComponent className={`h-4 w-4 text-${item.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <span className="text-sm font-medium text-toolbox-foreground group-hover:text-white transition-colours">
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

      <div className="mt-8 p-4 bg-gradient-to-r from-dev-primary/10 to-dev-secondary/10 rounded-lg border border-dev-primary/20">
        <p className="text-xs text-toolbox-foreground/80 leading-relaxed">
          🎨 <strong>Pro Tip:</strong> Drag any element to the canvas and watch the magic happen! 
          Each drop triggers epic celebrations! 🎉
        </p>
      </div>
    </div>
  );
};