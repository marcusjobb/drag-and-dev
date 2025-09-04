import type { ProjectData, CodeElement } from '@/components/CodeBuilder';

export class CodeGenerator {
  static generate(projectData: ProjectData): string {
    const { language, namespace, className, methods } = projectData;
    
    if (language === 'csharp') {
      return this.generateCSharp(namespace, className, methods);
    } else {
      return this.generateJava(namespace, className, methods);
    }
  }

  private static generateCSharp(
    namespace: string, 
    className: string, 
    methods: ProjectData['methods']
  ): string {
    let code = `using System;\n\n`;
    code += `namespace ${namespace}\n{\n`;
    code += `    public class ${className}\n    {\n`;
    
    methods.forEach(method => {
      const staticKeyword = method.isStatic ? 'static ' : '';
      const parameters = method.parameters
        .map(p => `${p.type} ${p.name}`)
        .join(', ');
      
      code += `        ${method.visibility} ${staticKeyword}${method.returnType} ${method.name}(${parameters})\n`;
      code += `        {\n`;
      
      method.elements.forEach(element => {
        code += `            ${this.generateCSharpElement(element)}\n`;
      });
      
      code += `        }\n\n`;
    });
    
    code += `    }\n}`;
    return code;
  }

  private static generateJava(
    namespace: string, 
    className: string, 
    methods: ProjectData['methods']
  ): string {
    let code = `package ${namespace};\n\n`;
    code += `public class ${className} {\n`;
    
    methods.forEach(method => {
      const staticKeyword = method.isStatic ? 'static ' : '';
      const parameters = method.parameters
        .map(p => `${this.mapTypeToJava(p.type)} ${p.name}`)
        .join(', ');
      
      code += `    ${method.visibility} ${staticKeyword}${this.mapTypeToJava(method.returnType)} ${method.name}(${parameters}) {\n`;
      
      method.elements.forEach(element => {
        code += `        ${this.generateJavaElement(element)}\n`;
      });
      
      code += `    }\n\n`;
    });
    
    code += `}`;
    return code;
  }

  private static generateCSharpElement(element: CodeElement): string {
    switch (element.type) {
      case 'console.writeline':
        return `Console.WriteLine(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'console.write':
        return `Console.Write(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'for':
        const { variable = 'i', start = '0', end = '10', increment = '1' } = element.properties || {};
        return `for (int ${variable} = ${start}; ${variable} < ${end}; ${variable}+=${increment})\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'while':
        return `while (${element.properties?.condition || 'true'})\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'if':
        return `if (${element.properties?.condition || 'true'})\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'if-else':
        return `if (${element.properties?.condition || 'true'})\n            {\n            }\n            else\n            {\n            }`;
      case 'variable':
        const { type = 'var', name = 'myVariable', value = '""' } = element.properties || {};
        return `${type} ${name} = ${value};`;
      case 'return':
        return `return ${element.properties?.value || 'null'};`;
      case 'string':
        return `string ${element.properties?.name || 'myString'} = ${element.properties?.value || '""'};`;
      case 'int':
        return `int ${element.properties?.name || 'myInt'} = ${element.properties?.value || '0'};`;
      case 'bool':
        return `bool ${element.properties?.name || 'myBool'} = ${element.properties?.value || 'false'};`;
      case 'double':
        return `double ${element.properties?.name || 'myDouble'} = ${element.properties?.value || '0.0'};`;
      default:
        return `// ${element.type}`;
    }
  }

  private static generateJavaElement(element: CodeElement): string {
    switch (element.type) {
      case 'console.writeline':
        return `System.out.println(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'console.write':
        return `System.out.print(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'for':
        const { variable = 'i', start = '0', end = '10', increment = '1' } = element.properties || {};
        return `for (int ${variable} = ${start}; ${variable} < ${end}; ${variable}+=${increment}) {${element.children ? this.generateChildElements(element.children, 'java') : ''}\n        }`;
      case 'while':
        return `while (${element.properties?.condition || 'true'}) {${element.children ? this.generateChildElements(element.children, 'java') : ''}\n        }`;
      case 'if':
        return `if (${element.properties?.condition || 'true'}) {${element.children ? this.generateChildElements(element.children, 'java') : ''}\n        }`;
      case 'if-else':
        return `if (${element.properties?.condition || 'true'}) {\n        } else {\n        }`;
      case 'variable':
        const { type = 'String', name = 'myVariable', value = '""' } = element.properties || {};
        return `${this.mapTypeToJava(type)} ${name} = ${value};`;
      case 'return':
        return `return ${element.properties?.value || 'null'};`;
      case 'string':
        return `String ${element.properties?.name || 'myString'} = ${element.properties?.value || '""'};`;
      case 'int':
        return `int ${element.properties?.name || 'myInt'} = ${element.properties?.value || '0'};`;
      case 'bool':
        return `boolean ${element.properties?.name || 'myBool'} = ${element.properties?.value || 'false'};`;
      case 'double':
        return `double ${element.properties?.name || 'myDouble'} = ${element.properties?.value || '0.0'};`;
      default:
        return `// ${element.type}`;
    }
  }

  private static generateChildElements(children: CodeElement[], language: 'csharp' | 'java'): string {
    return children.map(child => {
      const elementCode = language === 'csharp' 
        ? this.generateCSharpElement(child)
        : this.generateJavaElement(child);
      return `\n                ${elementCode}`;
    }).join('');
  }

  private static mapTypeToJava(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'int': 'int',
      'bool': 'boolean',
      'double': 'double',
      'void': 'void'
    };
    return typeMap[type] || type;
  }
}