import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/shared/hooks/use-toast";
import { 
  Server, 
  Code, 
  Rocket, 
  Play, 
  CheckCircle, 
  Copy,
  Folder,
  File,
  FolderOpen,
  Terminal,
  Settings,
  Database,
  Shield,
  Bell,
  User,
  Briefcase,
  ArrowLeftRight,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      toast({
        title: "Command copied!",
        description: "The command has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy command to clipboard.",
        variant: "destructive",
      });
    }
  };

  const folderStructure = [
    { name: "@types/", icon: Folder, color: "text-yellow-500", description: "Type definitions" },
    { name: "core/", icon: Folder, color: "text-yellow-500", description: "Constants & config" },
    { name: "environments/", icon: Folder, color: "text-yellow-500", description: "Environment configs" },
    { name: "middlewares/", icon: Folder, color: "text-yellow-500", description: "Custom middleware" },
    { name: "models/", icon: Folder, color: "text-yellow-500", description: "Database models" },
    { name: "modules/", icon: FolderOpen, color: "text-green-500", description: "Feature modules" },
  ];

  const moduleStructure = [
    { name: "auth/", icon: Shield, color: "text-orange-500" },
    { name: "code-verification/", icon: CheckCircle, color: "text-green-500" },
    { name: "common/", icon: Settings, color: "text-gray-500" },
    { name: "job/", icon: Briefcase, color: "text-blue-500" },
    { name: "me/", icon: User, color: "text-purple-500" },
    { name: "notification/", icon: Bell, color: "text-yellow-500" },
    { name: "transaction/", icon: ArrowLeftRight, color: "text-green-500" },
  ];

  const frontendStructure = [
    { name: "apis/", icon: Code, color: "text-blue-500", description: "API layer" },
    { name: "assets/", icon: Folder, color: "text-purple-500", description: "Images, icons" },
    { name: "component/", icon: Folder, color: "text-green-500", description: "UI components" },
    { name: "hooks/", icon: Folder, color: "text-orange-500", description: "Custom hooks" },
    { name: "http/", icon: Folder, color: "text-red-500", description: "HTTP client" },
    { name: "routes/", icon: Folder, color: "text-indigo-500", description: "Routing" },
    { name: "zustand/", icon: Database, color: "text-pink-500", description: "State management" },
    { name: "theme/", icon: Folder, color: "text-teal-500", description: "Theme config" },
    { name: "utils/", icon: Folder, color: "text-yellow-500", description: "Utilities" },
    { name: "validators/", icon: Folder, color: "text-green-600", description: "Form validation" },
    { name: "views/", icon: Folder, color: "text-blue-600", description: "Page components" },
  ];

  const commands = [
    {
      title: "Install Backend Dependencies",
      command: "cd backend && npm install",
      description: "Install all backend packages",
    },
    {
      title: "Install Frontend Dependencies", 
      command: "cd frontend && npm install",
      description: "Install all frontend packages",
    },
    {
      title: "Start Backend Only",
      command: "npm run dev:backend",
      description: "Runs on http://localhost:3000",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Start Frontend Only",
      command: "npm run dev:frontend", 
      description: "Runs on http://localhost:5173",
      color: "bg-cyan-50 border-cyan-200",
      textColor: "text-cyan-700",
    },
    {
      title: "Start Full Stack",
      command: "npm run dev",
      description: "Starts both servers concurrently",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Full Stack Project Manager</h1>
                <p className="text-sm text-gray-500">TypeScript + Express | React + Vite</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Development Ready</span>
              </div>
              <Button className="bg-primary hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                Quick Start
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 text-primary p-3 rounded-lg">
                  <Server className="h-6 w-6" />
                </div>
                <Badge className="bg-green-500 text-white">Ready</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend Server</h3>
              <p className="text-gray-600 text-sm mb-4">TypeScript + Express.js</p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-primary hover:bg-blue-700" 
                  onClick={() => copyCommand("npm run dev:backend")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Development
                </Button>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                  npm run dev:backend
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-cyan-100 text-cyan-600 p-3 rounded-lg">
                  <Code className="h-6 w-6" />
                </div>
                <Badge className="bg-green-500 text-white">Ready</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend App</h3>
              <p className="text-gray-600 text-sm mb-4">React + Vite + Tailwind</p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  onClick={() => copyCommand("npm run dev:frontend")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Development
                </Button>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                  npm run dev:frontend
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <Rocket className="h-6 w-6" />
                </div>
                <Badge className="bg-yellow-500 text-white">Setup</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Stack</h3>
              <p className="text-gray-600 text-sm mb-4">Both servers concurrently</p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => copyCommand("npm run dev")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Both
                </Button>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                  npm run dev
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Backend Structure */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 text-primary p-2 rounded-lg">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Backend Structure</CardTitle>
                  <p className="text-gray-600 text-sm">TypeScript + Express.js API</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900">backend/</span>
                </div>
                
                <div className="ml-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-900">src/</span>
                  </div>
                  
                  <div className="ml-6 space-y-1 text-sm">
                    {folderStructure.map((folder, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <folder.icon className={`h-4 w-4 ${folder.color}`} />
                          <span className="text-gray-700">{folder.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {folder.description}
                        </Badge>
                      </div>
                    ))}
                    
                    {/* Module subfolders */}
                    <div className="ml-6 space-y-1 text-xs border-l-2 border-gray-200 pl-4">
                      {moduleStructure.map((module, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <module.icon className={`h-3 w-3 ${module.color}`} />
                          <span className="text-gray-600">{module.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Main files */}
                  <div className="ml-4 space-y-1 text-sm border-t border-gray-100 pt-2">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">app.ts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">server.ts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">app.routes.ts</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration Files</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-green-600" />
                    <span className="text-gray-600">package.json</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-blue-600" />
                    <span className="text-gray-600">tsconfig.json</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-purple-600" />
                    <span className="text-gray-600">.eslintrc</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-pink-600" />
                    <span className="text-gray-600">.prettierrc</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frontend Structure */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-cyan-100 text-cyan-600 p-2 rounded-lg">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Frontend Structure</CardTitle>
                  <p className="text-gray-600 text-sm">React + Vite + Tailwind CSS</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Folder className="h-4 w-4 text-cyan-500" />
                  <span className="font-medium text-gray-900">frontend/</span>
                </div>
                
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Folder className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">public/</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">Static assets</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Folder className="h-4 w-4 text-cyan-500" />
                    <span className="font-medium text-gray-900">src/</span>
                  </div>
                  
                  <div className="ml-6 space-y-1 text-sm">
                    {frontendStructure.map((folder, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <folder.icon className={`h-4 w-4 ${folder.color}`} />
                          <span className="text-gray-700">{folder.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {folder.description}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {/* Main files */}
                  <div className="ml-4 space-y-1 text-sm border-t border-gray-100 pt-2">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-cyan-600" />
                      <span className="text-gray-700">App.jsx</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-cyan-600" />
                      <span className="text-gray-700">main.jsx</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700">App.css</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700">index.css</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration Files</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-green-600" />
                    <span className="text-gray-600">package.json</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-purple-600" />
                    <span className="text-gray-600">vite.config.js</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-cyan-600" />
                    <span className="text-gray-600">tailwind.config.js</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File className="h-3 w-3 text-orange-600" />
                    <span className="text-gray-600">postcss.config.js</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commands Section */}
        <Card className="mt-8">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 text-gray-700 p-2 rounded-lg">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Development Commands</CardTitle>
                <p className="text-gray-600 text-sm">Essential commands for development workflow</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {commands.map((cmd, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${cmd.color || 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${cmd.textColor || 'text-gray-700'}`}>
                      {cmd.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCommand(cmd.command)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className={`text-sm font-mono ${cmd.textColor || 'text-gray-800'}`}>
                    {cmd.command}
                  </code>
                  {cmd.description && (
                    <p className={`text-xs mt-1 ${cmd.textColor || 'text-gray-600'}`}>
                      {cmd.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Dashboard */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Project Status</h2>
                <p className="text-gray-600 text-sm">Ready for development with all configurations set up</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">All Systems Ready</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">TypeScript</div>
                    <div className="text-sm text-gray-600">Configured</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">ESLint</div>
                    <div className="text-sm text-gray-600">Ready</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Hot Reload</div>
                    <div className="text-sm text-gray-600">Enabled</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">CORS</div>
                    <div className="text-sm text-gray-600">Configured</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
