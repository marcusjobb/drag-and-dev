import type { ProjectData, CodeElement } from '@/components/CodeBuilder';

export class CodeGenerator {
  static generate(projectData: ProjectData): string {
    const { language, namespace, className, methods } = projectData;
    
    switch (language) {
      case 'csharp':
        return this.generateCSharp(namespace, className, methods);
      case 'java':
        return this.generateJava(namespace, className, methods);
      case 'javascript':
        return this.generateJavaScript(namespace, className, methods);
      case 'python':
        return this.generatePython(namespace, className, methods);
      default:
        return this.generateCSharp(namespace, className, methods);
    }
  }

  private static generateCSharp(
    namespace: string, 
    className: string, 
    methods: ProjectData['methods']
  ): string {
    let code = `using System;\nusing System.Text.RegularExpressions;\nusing System.Linq;\n\n`;
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
        if (this.isUtilityFunction(element.type)) {
          // Skip utility functions in method body - they'll be added as separate methods
          return;
        }
        code += `            ${this.generateCSharpElement(element)}\n`;
      });
      
      code += `        }\n\n`;
    });

    // Add utility functions as separate methods at class level
    const utilityFunctions = this.getUtilityFunctions(methods);
    utilityFunctions.forEach(funcType => {
      code += `        ${this.generateCSharpUtilityMethod(funcType)}\n\n`;
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
      
      // Utility Functions - these are now handled separately
      case 'isEven':
      case 'isOdd':
      case 'isPrime':
      case 'factorial':
      case 'fibonacci':
      case 'reverse':
      case 'palindrome':
      case 'swap':
      case 'toBinary':
      case 'toHex':
      case 'celsiusToFahrenheit':
      case 'fahrenheitToCelsius':
      case 'inchesToCm':
      case 'cmToInches':
      case 'checkEmail':
      case 'validatePassword':
      case 'isValidUrl':
      case 'isValidDate':
      case 'isNumeric':
        return `// ${element.type}() method will be added separately`;
      
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
      
      // Utility Functions
      case 'isEven':
        return `public static boolean isEven(int number) {\n                return number % 2 == 0;\n            }`;
      case 'isOdd':
        return `public static boolean isOdd(int number) {\n                return number % 2 != 0;\n            }`;
      case 'isPrime':
        return `public static boolean isPrime(int number) {\n                if (number <= 1) return false;\n                for (int i = 2; i <= Math.sqrt(number); i++) {\n                    if (number % i == 0) return false;\n                }\n                return true;\n            }`;
      case 'factorial':
        return `public static long factorial(int n) {\n                if (n <= 1) return 1;\n                return n * factorial(n - 1);\n            }`;
      case 'fibonacci':
        return `public static int fibonacci(int n) {\n                if (n <= 1) return n;\n                return fibonacci(n - 1) + fibonacci(n - 2);\n            }`;
      case 'reverse':
        return `public static String reverseString(String input) {\n                return new StringBuilder(input).reverse().toString();\n            }`;
      case 'palindrome':
        return `public static boolean isPalindrome(String input) {\n                String clean = input.toLowerCase().replaceAll(" ", "");\n                return clean.equals(reverseString(clean));\n            }`;
      case 'swap':
        return `public static void swap(int[] arr, int i, int j) {\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }`;
      
      // Converters
      case 'toBinary':
        return `public static String toBinary(int number) {\n                return Integer.toBinaryString(number);\n            }`;
      case 'toHex':
        return `public static String toHex(int number) {\n                return Integer.toHexString(number).toUpperCase();\n            }`;
      case 'celsiusToFahrenheit':
        return `public static double celsiusToFahrenheit(double celsius) {\n                return (celsius * 9.0 / 5.0) + 32;\n            }`;
      case 'fahrenheitToCelsius':
        return `public static double fahrenheitToCelsius(double fahrenheit) {\n                return (fahrenheit - 32) * 5.0 / 9.0;\n            }`;
      case 'inchesToCm':
        return `public static double inchesToCm(double inches) {\n                return inches * 2.54;\n            }`;
      case 'cmToInches':
        return `public static double cmToInches(double cm) {\n                return cm / 2.54;\n            }`;
      
      // Validators
      case 'checkEmail':
        return `public static boolean isValidEmail(String email) {\n                return email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");\n            }`;
      case 'validatePassword':
        return `public static boolean isValidPassword(String password) {\n                return password.length() >= 8 && password.matches(".*[A-Z].*") && \n                       password.matches(".*[a-z].*") && password.matches(".*\\d.*");\n            }`;
      case 'isValidUrl':
        return `public static boolean isValidUrl(String url) {\n                try {\n                    new java.net.URL(url);\n                    return true;\n                } catch (Exception e) {\n                    return false;\n                }\n            }`;
      case 'isValidDate':
        return `public static boolean isValidDate(String dateString) {\n                try {\n                    java.time.LocalDate.parse(dateString);\n                    return true;\n                } catch (Exception e) {\n                    return false;\n                }\n            }`;
      case 'isNumeric':
        return `public static boolean isNumeric(String input) {\n                try {\n                    Double.parseDouble(input);\n                    return true;\n                } catch (NumberFormatException e) {\n                    return false;\n                }\n            }`;
      
      default:
        return `// ${element.type}`;
    }
  }

  private static generateChildElements(children: CodeElement[], language: 'csharp' | 'java' | 'javascript' | 'python'): string {
    return children.map(child => {
      let elementCode: string;
      switch (language) {
        case 'csharp':
          elementCode = this.generateCSharpElement(child);
          break;
        case 'java':
          elementCode = this.generateJavaElement(child);
          break;
        case 'javascript':
          elementCode = this.generateJavaScriptElement(child);
          break;
        case 'python':
          elementCode = this.generatePythonElement(child);
          break;
      }
      const indent = language === 'python' ? '            ' : '                ';
      return `\n${indent}${elementCode}`;
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

  private static generateJavaScript(
    namespace: string, 
    className: string, 
    methods: ProjectData['methods']
  ): string {
    let code = `// Module: ${namespace}\n\n`;
    code += `class ${className} {\n`;
    
    methods.forEach(method => {
      const staticKeyword = method.isStatic ? 'static ' : '';
      const parameters = method.parameters
        .map(p => p.name)
        .join(', ');
      
      code += `    ${staticKeyword}${method.name}(${parameters}) {\n`;
      
      method.elements.forEach(element => {
        code += `        ${this.generateJavaScriptElement(element)}\n`;
      });
      
      code += `    }\n\n`;
    });
    
    code += `}\n\nexport default ${className};`;
    return code;
  }

  private static generatePython(
    namespace: string, 
    className: string, 
    methods: ProjectData['methods']
  ): string {
    let code = `# Module: ${namespace}\n\n`;
    code += `class ${className}:\n`;
    
    methods.forEach(method => {
      const parameters = method.parameters
        .map(p => p.name)
        .join(', ');
      const selfParam = method.isStatic ? '' : 'self' + (parameters ? ', ' : '');
      const decorator = method.isStatic ? '    @staticmethod\n' : '';
      
      code += `${decorator}    def ${method.name}(${selfParam}${parameters}):\n`;
      
      if (method.elements.length === 0) {
        code += `        pass\n`;
      } else {
        method.elements.forEach(element => {
          code += `        ${this.generatePythonElement(element)}\n`;
        });
      }
      
      code += `\n`;
    });
    
    return code;
  }

  private static generateJavaScriptElement(element: CodeElement): string {
    switch (element.type) {
      case 'console.writeline':
        return `console.log(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'console.write':
        return `process.stdout.write(${element.properties?.message ? `"${element.properties.message}"` : '""'});`;
      case 'for':
        const { variable = 'i', start = '0', end = '10', increment = '1' } = element.properties || {};
        return `for (let ${variable} = ${start}; ${variable} < ${end}; ${variable} += ${increment}) {${element.children ? this.generateChildElements(element.children, 'javascript') : ''}\n        }`;
      case 'while':
        return `while (${element.properties?.condition || 'true'}) {${element.children ? this.generateChildElements(element.children, 'javascript') : ''}\n        }`;
      case 'if':
        return `if (${element.properties?.condition || 'true'}) {${element.children ? this.generateChildElements(element.children, 'javascript') : ''}\n        }`;
      case 'variable':
        const { name = 'myVariable', value = '""' } = element.properties || {};
        return `let ${name} = ${value};`;
      case 'return':
        return `return ${element.properties?.value || 'null'};`;
      case 'string':
        return `let ${element.properties?.name || 'myString'} = ${element.properties?.value || '""'};`;
      case 'int':
        return `let ${element.properties?.name || 'myInt'} = ${element.properties?.value || '0'};`;
      case 'bool':
        return `let ${element.properties?.name || 'myBool'} = ${element.properties?.value || 'false'};`;
      
      // Utility Functions
      case 'isEven':
        return `static isEven(number) {\n            return number % 2 === 0;\n        }`;
      case 'isOdd':
        return `static isOdd(number) {\n            return number % 2 !== 0;\n        }`;
      case 'isPrime':
        return `static isPrime(number) {\n            if (number <= 1) return false;\n            for (let i = 2; i <= Math.sqrt(number); i++) {\n                if (number % i === 0) return false;\n            }\n            return true;\n        }`;
      case 'factorial':
        return `static factorial(n) {\n            if (n <= 1) return 1;\n            return n * this.factorial(n - 1);\n        }`;
      case 'fibonacci':
        return `static fibonacci(n) {\n            if (n <= 1) return n;\n            return this.fibonacci(n - 1) + this.fibonacci(n - 2);\n        }`;
      case 'reverse':
        return `static reverseString(input) {\n            return input.split('').reverse().join('');\n        }`;
      case 'palindrome':
        return `static isPalindrome(input) {\n            const clean = input.toLowerCase().replace(/\\s/g, '');\n            return clean === this.reverseString(clean);\n        }`;
      case 'swap':
        return `static swap(arr, i, j) {\n            [arr[i], arr[j]] = [arr[j], arr[i]];\n        }`;
      
      // Converters
      case 'toBinary':
        return `static toBinary(number) {\n            return number.toString(2);\n        }`;
      case 'toHex':
        return `static toHex(number) {\n            return number.toString(16).toUpperCase();\n        }`;
      case 'celsiusToFahrenheit':
        return `static celsiusToFahrenheit(celsius) {\n            return (celsius * 9.0 / 5.0) + 32;\n        }`;
      case 'fahrenheitToCelsius':
        return `static fahrenheitToCelsius(fahrenheit) {\n            return (fahrenheit - 32) * 5.0 / 9.0;\n        }`;
      case 'inchesToCm':
        return `static inchesToCm(inches) {\n            return inches * 2.54;\n        }`;
      case 'cmToInches':
        return `static cmToInches(cm) {\n            return cm / 2.54;\n        }`;
      
      // Validators
      case 'checkEmail':
        return `static isValidEmail(email) {\n            const regex = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/;\n            return regex.test(email);\n        }`;
      case 'validatePassword':
        return `static isValidPassword(password) {\n            return password.length >= 8 && /[A-Z]/.test(password) && \n                   /[a-z]/.test(password) && /\\d/.test(password);\n        }`;
      case 'isValidUrl':
        return `static isValidUrl(url) {\n            try {\n                new URL(url);\n                return true;\n            } catch {\n                return false;\n            }\n        }`;
      case 'isValidDate':
        return `static isValidDate(dateString) {\n            return !isNaN(Date.parse(dateString));\n        }`;
      case 'isNumeric':
        return `static isNumeric(input) {\n            return !isNaN(parseFloat(input)) && isFinite(input);\n        }`;
      
      default:
        return `// ${element.type}`;
    }
  }

  private static generatePythonElement(element: CodeElement): string {
    switch (element.type) {
      case 'console.writeline':
        return `print(${element.properties?.message ? `"${element.properties.message}"` : '""'})`;
      case 'console.write':
        return `print(${element.properties?.message ? `"${element.properties.message}"` : '""'}, end='')`;
      case 'for':
        const { variable = 'i', start = '0', end = '10' } = element.properties || {};
        return `for ${variable} in range(${start}, ${end}):${element.children ? this.generateChildElements(element.children, 'python') : '\\n            pass'}`;
      case 'while':
        return `while ${element.properties?.condition || 'True'}:${element.children ? this.generateChildElements(element.children, 'python') : '\\n            pass'}`;
      case 'if':
        return `if ${element.properties?.condition || 'True'}:${element.children ? this.generateChildElements(element.children, 'python') : '\\n            pass'}`;
      case 'variable':
        const { name = 'my_variable', value = '""' } = element.properties || {};
        return `${name} = ${value}`;
      case 'return':
        return `return ${element.properties?.value || 'None'}`;
      case 'string':
        return `${element.properties?.name || 'my_string'} = ${element.properties?.value || '""'}`;
      case 'int':
        return `${element.properties?.name || 'my_int'} = ${element.properties?.value || '0'}`;
      case 'bool':
        return `${element.properties?.name || 'my_bool'} = ${element.properties?.value || 'False'}`;
      
      // Utility Functions
      case 'isEven':
        return `@staticmethod\n        def is_even(number):\n            return number % 2 == 0`;
      case 'isOdd':
        return `@staticmethod\n        def is_odd(number):\n            return number % 2 != 0`;
      case 'isPrime':
        return `@staticmethod\n        def is_prime(number):\n            if number <= 1:\n                return False\n            for i in range(2, int(number**0.5) + 1):\n                if number % i == 0:\n                    return False\n            return True`;
      case 'factorial':
        return `@staticmethod\n        def factorial(n):\n            if n <= 1:\n                return 1\n            return n * factorial(n - 1)`;
      case 'fibonacci':
        return `@staticmethod\n        def fibonacci(n):\n            if n <= 1:\n                return n\n            return fibonacci(n - 1) + fibonacci(n - 2)`;
      case 'reverse':
        return `@staticmethod\n        def reverse_string(input_str):\n            return input_str[::-1]`;
      case 'palindrome':
        return `@staticmethod\n        def is_palindrome(input_str):\n            clean = input_str.lower().replace(' ', '')\n            return clean == clean[::-1]`;
      case 'swap':
        return `@staticmethod\n        def swap(arr, i, j):\n            arr[i], arr[j] = arr[j], arr[i]`;
      
      // Converters
      case 'toBinary':
        return `@staticmethod\n        def to_binary(number):\n            return bin(number)[2:]`;
      case 'toHex':
        return `@staticmethod\n        def to_hex(number):\n            return hex(number)[2:].upper()`;
      case 'celsiusToFahrenheit':
        return `@staticmethod\n        def celsius_to_fahrenheit(celsius):\n            return (celsius * 9.0 / 5.0) + 32`;
      case 'fahrenheitToCelsius':
        return `@staticmethod\n        def fahrenheit_to_celsius(fahrenheit):\n            return (fahrenheit - 32) * 5.0 / 9.0`;
      case 'inchesToCm':
        return `@staticmethod\n        def inches_to_cm(inches):\n            return inches * 2.54`;
      case 'cmToInches':
        return `@staticmethod\n        def cm_to_inches(cm):\n            return cm / 2.54`;
      
      // Validators
      case 'checkEmail':
        return `@staticmethod\n        def is_valid_email(email):\n            import re\n            pattern = r'^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'\n            return bool(re.match(pattern, email))`;
      case 'validatePassword':
        return `@staticmethod\n        def is_valid_password(password):\n            import re\n            return (len(password) >= 8 and \n                    bool(re.search(r'[A-Z]', password)) and\n                    bool(re.search(r'[a-z]', password)) and\n                    bool(re.search(r'\\d', password)))`;
      case 'isValidUrl':
        return `@staticmethod\n        def is_valid_url(url):\n            try:\n                from urllib.parse import urlparse\n                result = urlparse(url)\n                return all([result.scheme, result.netloc])\n            except:\n                return False`;
      case 'isValidDate':
        return `@staticmethod\n        def is_valid_date(date_string):\n            try:\n                from datetime import datetime\n                datetime.fromisoformat(date_string)\n                return True\n            except:\n                return False`;
      case 'isNumeric':
        return `@staticmethod\n        def is_numeric(input_str):\n            try:\n                float(input_str)\n                return True\n            except ValueError:\n                return False`;
      
      default:
        return `# ${element.type}`;
    }
  }

  private static isUtilityFunction(type: string): boolean {
    const utilityTypes = [
      'isEven', 'isOdd', 'isPrime', 'factorial', 'fibonacci', 'reverse', 'palindrome', 'swap',
      'toBinary', 'toHex', 'celsiusToFahrenheit', 'fahrenheitToCelsius', 'inchesToCm', 'cmToInches',
      'checkEmail', 'validatePassword', 'isValidUrl', 'isValidDate', 'isNumeric'
    ];
    return utilityTypes.includes(type);
  }

  private static getUtilityFunctions(methods: ProjectData['methods']): string[] {
    const utilityFunctions = new Set<string>();
    methods.forEach(method => {
      method.elements.forEach(element => {
        if (this.isUtilityFunction(element.type)) {
          utilityFunctions.add(element.type);
        }
      });
    });
    return Array.from(utilityFunctions);
  }

  private static generateCSharpUtilityMethod(type: string): string {
    switch (type) {
      case 'isEven':
        return `public static bool IsEven(int number)\n        {\n            return number % 2 == 0;\n        }`;
      case 'isOdd':
        return `public static bool IsOdd(int number)\n        {\n            return number % 2 != 0;\n        }`;
      case 'isPrime':
        return `public static bool IsPrime(int number)\n        {\n            if (number <= 1) return false;\n            for (int i = 2; i <= Math.Sqrt(number); i++)\n            {\n                if (number % i == 0) return false;\n            }\n            return true;\n        }`;
      case 'factorial':
        return `public static long Factorial(int n)\n        {\n            if (n <= 1) return 1;\n            return n * Factorial(n - 1);\n        }`;
      case 'fibonacci':
        return `public static int Fibonacci(int n)\n        {\n            if (n <= 1) return n;\n            return Fibonacci(n - 1) + Fibonacci(n - 2);\n        }`;
      case 'reverse':
        return `public static string ReverseString(string input)\n        {\n            char[] chars = input.ToCharArray();\n            Array.Reverse(chars);\n            return new string(chars);\n        }`;
      case 'palindrome':
        return `public static bool IsPalindrome(string input)\n        {\n            string clean = input.ToLower().Replace(" ", "");\n            return clean == ReverseString(clean);\n        }`;
      case 'swap':
        return `public static void Swap<T>(ref T a, ref T b)\n        {\n            T temp = a;\n            a = b;\n            b = temp;\n        }`;
      case 'toBinary':
        return `public static string ToBinary(int number)\n        {\n            return Convert.ToString(number, 2);\n        }`;
      case 'toHex':
        return `public static string ToHex(int number)\n        {\n            return number.ToString("X");\n        }`;
      case 'celsiusToFahrenheit':
        return `public static double CelsiusToFahrenheit(double celsius)\n        {\n            return (celsius * 9.0 / 5.0) + 32;\n        }`;
      case 'fahrenheitToCelsius':
        return `public static double FahrenheitToCelsius(double fahrenheit)\n        {\n            return (fahrenheit - 32) * 5.0 / 9.0;\n        }`;
      case 'inchesToCm':
        return `public static double InchesToCm(double inches)\n        {\n            return inches * 2.54;\n        }`;
      case 'cmToInches':
        return `public static double CmToInches(double cm)\n        {\n            return cm / 2.54;\n        }`;
      case 'checkEmail':
        return `public static bool IsValidEmail(string email)\n        {\n            var regex = new Regex(@"^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");\n            return regex.IsMatch(email);\n        }`;
      case 'validatePassword':
        return `public static bool IsValidPassword(string password)\n        {\n            return password.Length >= 8 && password.Any(char.IsUpper) && password.Any(char.IsLower) && password.Any(char.IsDigit);\n        }`;
      case 'isValidUrl':
        return `public static bool IsValidUrl(string url)\n        {\n            return Uri.TryCreate(url, UriKind.Absolute, out _);\n        }`;
      case 'isValidDate':
        return `public static bool IsValidDate(string dateString)\n        {\n            return DateTime.TryParse(dateString, out _);\n        }`;
      case 'isNumeric':
        return `public static bool IsNumeric(string input)\n        {\n            return double.TryParse(input, out _);\n        }`;
      default:
        return '';
    }
  }
}