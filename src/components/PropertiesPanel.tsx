import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsIcon, PlusIcon, TrashIcon } from 'lucide-react';
import type { ProjectData } from './CodeBuilder';

interface PropertiesPanelProps {
  projectData: ProjectData;
  selectedMethod: number;
  onProjectDataChange: (data: ProjectData) => void;
  onMethodChange: (index: number) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  projectData,
  selectedMethod,
  onProjectDataChange,
  onMethodChange
}) => {
  const updateProjectData = (updates: Partial<ProjectData>) => {
    onProjectDataChange({ ...projectData, ...updates });
  };

  const updateMethod = (index: number, updates: any) => {
    const updatedMethods = [...projectData.methods];
    updatedMethods[index] = { ...updatedMethods[index], ...updates };
    updateProjectData({ methods: updatedMethods });
  };

  const addParameter = () => {
    const method = projectData.methods[selectedMethod];
    const updatedParameters = [...method.parameters, { name: 'param', type: 'string' }];
    updateMethod(selectedMethod, { parameters: updatedParameters });
  };

  const removeParameter = (index: number) => {
    const method = projectData.methods[selectedMethod];
    const updatedParameters = method.parameters.filter((_, i) => i !== index);
    updateMethod(selectedMethod, { parameters: updatedParameters });
  };

  const updateParameter = (index: number, field: 'name' | 'type', value: string) => {
    const method = projectData.methods[selectedMethod];
    const updatedParameters = [...method.parameters];
    updatedParameters[index][field] = value;
    updateMethod(selectedMethod, { parameters: updatedParameters });
  };

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dev-primary" />
        <h2 className="text-base sm:text-lg font-semibold">Properties</h2>
      </div>

      <Tabs defaultValue="project" className="w-full">
        <TabsList className="grid w-full grid-cols-2 text-xs sm:text-sm">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="method">Method</TabsTrigger>
        </TabsList>

        <TabsContent value="project" className="space-y-3 sm:space-y-4">
          <Card className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm">Language</Label>
              <Select
                value={projectData.language}
                onValueChange={(value: 'csharp' | 'java' | 'javascript' | 'python') => 
                  updateProjectData({ language: value })
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="namespace" className="text-sm">
                {projectData.language === 'java' ? 'Package' : 
                 projectData.language === 'javascript' ? 'Module' :
                 projectData.language === 'python' ? 'Module' : 'Namespace'}
              </Label>
              <Input
                id="namespace"
                value={projectData.namespace}
                onChange={(e) => updateProjectData({ namespace: e.target.value })}
                placeholder="Enter namespace"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="className" className="text-sm">Class Name</Label>
              <Input
                id="className"
                value={projectData.className}
                onChange={(e) => updateProjectData({ className: e.target.value })}
                placeholder="Enter class name"
                className="text-sm"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="method" className="space-y-3 sm:space-y-4">
          <Card className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibility" className="text-sm">Visibility</Label>
                <Select
                  value={projectData.methods[selectedMethod]?.visibility}
                  onValueChange={(value) => updateMethod(selectedMethod, { visibility: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">public</SelectItem>
                    <SelectItem value="private">private</SelectItem>
                    <SelectItem value="protected">protected</SelectItem>
                    <SelectItem value="internal">internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnType" className="text-sm">Return Type</Label>
                <Select
                  value={projectData.methods[selectedMethod]?.returnType}
                  onValueChange={(value) => updateMethod(selectedMethod, { returnType: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="void">void</SelectItem>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="int">int</SelectItem>
                    <SelectItem value="bool">bool</SelectItem>
                    <SelectItem value="double">double</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodName" className="text-sm">Method Name</Label>
              <Input
                id="methodName"
                value={projectData.methods[selectedMethod]?.name}
                onChange={(e) => updateMethod(selectedMethod, { name: e.target.value })}
                placeholder="Enter method name"
                className="text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="static"
                checked={projectData.methods[selectedMethod]?.isStatic}
                onCheckedChange={(checked) => updateMethod(selectedMethod, { isStatic: checked })}
              />
              <Label htmlFor="static" className="text-sm">Static Method</Label>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Parameters</Label>
                <Button
                  size="sm"
                  onClick={addParameter}
                  className="bg-dev-success hover:bg-dev-success/90 text-xs px-2 py-1"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              {projectData.methods[selectedMethod]?.parameters.map((param, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Name"
                    value={param.name}
                    onChange={(e) => updateParameter(index, 'name', e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Select
                    value={param.type}
                    onValueChange={(value) => updateParameter(index, 'type', value)}
                  >
                    <SelectTrigger className="w-20 sm:w-24 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="int">int</SelectItem>
                      <SelectItem value="bool">bool</SelectItem>
                      <SelectItem value="double">double</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeParameter(index)}
                    className="text-destructive hover:text-destructive/90 px-2"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {projectData.methods[selectedMethod]?.parameters.length === 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                  No parameters added yet
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};