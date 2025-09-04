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
      // Output & Debug
      case 'console.writeline':
        return `Console.WriteLine(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'console.write':
        return `Console.Write(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'console.readkey':
        return `Console.ReadKey();`;
      case 'console.readline':
        return `string input = Console.ReadLine();`;
      case 'debug.print':
        return `Debug.Print(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'trace.write':
        return `Trace.Write(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      
      // Control Flow
      case 'for':
        const { variable = 'i', start = '0', end = '10', increment = '1' } = element.properties || {};
        return `for (int ${variable} = ${start}; ${variable} < ${end}; ${variable}+=${increment})\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'foreach':
        return `foreach (var item in collection)\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'while':
        return `while (${element.properties?.condition || 'true'})\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'do-while':
        return `do\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            } while (${element.properties?.condition || 'true'});`;
      case 'switch':
        return `switch (${element.properties?.variable || 'variable'})\n            {\n                case 1:\n                    break;\n                default:\n                    break;\n            }`;
      case 'break':
        return `break;`;
      case 'continue':
        return `continue;`;
      
      // Conditionals
      case 'if':
        return `if (${element.properties?.condition || 'true'})\n            {${element.children ? this.generateChildElements(element.children, 'csharp') : ''}\n            }`;
      case 'if-else':
        return `if (${element.properties?.condition || 'true'})\n            {\n            }\n            else\n            {\n            }`;
      case 'if-else-if':
        return `if (${element.properties?.condition1 || 'true'})\n            {\n            }\n            else if (${element.properties?.condition2 || 'true'})\n            {\n            }\n            else\n            {\n            }`;
      case 'ternary':
        return `var result = ${element.properties?.condition || 'true'} ? ${element.properties?.trueValue || 'value1'} : ${element.properties?.falseValue || 'value2'};`;
      
      // Variables & Data
      case 'variable':
        const { type = 'var', name = 'myVariable', value = '""' } = element.properties || {};
        return `${type} ${name} = ${value};`;
      case 'constant':
        return `const ${element.properties?.type || 'int'} ${element.properties?.name || 'MY_CONSTANT'} = ${element.properties?.value || '0'};`;
      case 'array':
        return `${element.properties?.type || 'int'}[] ${element.properties?.name || 'myArray'} = new ${element.properties?.type || 'int'}[${element.properties?.size || '10'}];`;
      case 'list':
        return `List<${element.properties?.type || 'int'}> ${element.properties?.name || 'myList'} = new List<${element.properties?.type || 'int'}>();`;
      case 'dictionary':
        return `Dictionary<${element.properties?.keyType || 'string'}, ${element.properties?.valueType || 'int'}> ${element.properties?.name || 'myDict'} = new Dictionary<${element.properties?.keyType || 'string'}, ${element.properties?.valueType || 'int'}>();`;
      case 'return':
        return `return ${element.properties?.value || 'null'};`;
      
      // Primitive Types
      case 'string':
        return `string ${element.properties?.name || 'myString'} = ${element.properties?.value || '""'};`;
      case 'int':
        return `int ${element.properties?.name || 'myInt'} = ${element.properties?.value || '0'};`;
      case 'long':
        return `long ${element.properties?.name || 'myLong'} = ${element.properties?.value || '0L'};`;
      case 'float':
        return `float ${element.properties?.name || 'myFloat'} = ${element.properties?.value || '0.0f'};`;
      case 'double':
        return `double ${element.properties?.name || 'myDouble'} = ${element.properties?.value || '0.0'};`;
      case 'decimal':
        return `decimal ${element.properties?.name || 'myDecimal'} = ${element.properties?.value || '0.0m'};`;
      case 'bool':
        return `bool ${element.properties?.name || 'myBool'} = ${element.properties?.value || 'false'};`;
      case 'char':
        return `char ${element.properties?.name || 'myChar'} = ${element.properties?.value || "'a'"};`;
      case 'byte':
        return `byte ${element.properties?.name || 'myByte'} = ${element.properties?.value || '0'};`;
      case 'short':
        return `short ${element.properties?.name || 'myShort'} = ${element.properties?.value || '0'};`;
      
      // Math & Operations
      case 'math.sqrt':
        return `double result = Math.Sqrt(${element.properties?.value || '16'});`;
      case 'math.pow':
        return `double result = Math.Pow(${element.properties?.base || '2'}, ${element.properties?.exponent || '3'});`;
      case 'math.abs':
        return `${element.properties?.type || 'int'} result = Math.Abs(${element.properties?.value || '-5'});`;
      case 'math.min':
        return `${element.properties?.type || 'int'} result = Math.Min(${element.properties?.value1 || '5'}, ${element.properties?.value2 || '10'});`;
      case 'math.max':
        return `${element.properties?.type || 'int'} result = Math.Max(${element.properties?.value1 || '5'}, ${element.properties?.value2 || '10'});`;
      case 'random':
        return `Random rand = new Random();\n            int randomNumber = rand.Next(${element.properties?.min || '1'}, ${element.properties?.max || '100'});`;
      
      // String Operations
      case 'string.length':
        return `int length = ${element.properties?.variable || 'myString'}.Length;`;
      case 'string.substring':
        return `string result = ${element.properties?.variable || 'myString'}.Substring(${element.properties?.start || '0'}, ${element.properties?.length || '5'});`;
      case 'string.split':
        return `string[] parts = ${element.properties?.variable || 'myString'}.Split('${element.properties?.delimiter || ','}');`;
      case 'string.replace':
        return `string result = ${element.properties?.variable || 'myString'}.Replace("${element.properties?.oldValue || 'old'}", "${element.properties?.newValue || 'new'}");`;
      case 'string.tolower':
        return `string result = ${element.properties?.variable || 'myString'}.ToLower();`;
      case 'string.toupper':
        return `string result = ${element.properties?.variable || 'myString'}.ToUpper();`;
      case 'string.trim':
        return `string result = ${element.properties?.variable || 'myString'}.Trim();`;
      case 'string.contains':
        return `bool contains = ${element.properties?.variable || 'myString'}.Contains("${element.properties?.value || 'search'}");`;
      
      // Exception Handling
      case 'try-catch':
        return `try\n            {\n                // Code that might throw an exception\n            }\n            catch (Exception ex)\n            {\n                // Handle exception\n            }`;
      case 'try-catch-finally':
        return `try\n            {\n                // Code that might throw an exception\n            }\n            catch (Exception ex)\n            {\n                // Handle exception\n            }\n            finally\n            {\n                // Cleanup code\n            }`;
      case 'throw':
        return `throw new ${element.properties?.exceptionType || 'Exception'}("${element.properties?.message || 'An error occurred'}");`;
      
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