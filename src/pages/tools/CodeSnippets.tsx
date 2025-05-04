
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Copy, 
  Folder, 
  Code, 
  Database, 
  Globe, 
  FileCode,
  Star,
  SquareCode
} from "lucide-react";

const CodeSnippets = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Snippets</h1>
          <p className="text-muted-foreground">
            Store, organize, and reuse your code snippets efficiently.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Snippet
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search snippets..." className="pl-8" />
          </div>
          
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {[
                  { name: "All Snippets", icon: FileCode, count: 24 },
                  { name: "JavaScript", icon: Code, count: 10 },
                  { name: "React", icon: Code, count: 6 },
                  { name: "CSS/Tailwind", icon: Code, count: 4 },
                  { name: "Database", icon: Database, count: 3 },
                  { name: "API", icon: Globe, count: 1 }
                ].map((category, index) => (
                  <Button 
                    key={index} 
                    variant={index === 0 ? "secondary" : "ghost"} 
                    className="w-full justify-start h-auto py-2"
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    <span>{category.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{category.count}</span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <CardTitle className="text-base mb-3">Folders</CardTitle>
                <div className="space-y-1">
                  {[
                    { name: "Client Projects", count: 8 },
                    { name: "Utilities", count: 7 },
                    { name: "Components", count: 5 },
                    { name: "Configurations", count: 4 }
                  ].map((folder, index) => (
                    <Button 
                      key={index} 
                      variant="ghost" 
                      className="w-full justify-start h-auto py-2"
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      <span>{folder.name}</span>
                      <span className="ml-auto text-xs text-gray-500">{folder.count}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-md">
            <CardHeader>
              <CardTitle>My Code Snippets</CardTitle>
              <CardDescription>Browse, edit, and use your saved code snippets</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "React useEffect Hook Template",
                        language: "JavaScript",
                        category: "React",
                        date: "Aug 15, 2023",
                        favorite: true,
                        code: "useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, [dependencies]);"
                      },
                      {
                        title: "Tailwind Responsive Grid",
                        language: "HTML",
                        category: "CSS/Tailwind",
                        date: "Jul 28, 2023",
                        favorite: true,
                        code: "<div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n  {/* Grid items */}\n</div>"
                      },
                      {
                        title: "API Fetch with Error Handling",
                        language: "JavaScript",
                        category: "API",
                        date: "Jun 10, 2023",
                        favorite: false,
                        code: "const fetchData = async () => {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n};"
                      },
                      {
                        title: "SQL Query Template",
                        language: "SQL",
                        category: "Database",
                        date: "May 5, 2023",
                        favorite: false,
                        code: "SELECT column1, column2\nFROM table_name\nWHERE condition\nORDER BY column1 ASC\nLIMIT 10;"
                      }
                    ].map((snippet, index) => (
                      <Card key={index} className="border border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base flex items-center">
                                <SquareCode className="h-4 w-4 mr-2 text-brand-blue" />
                                {snippet.title}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {snippet.language}
                                </Badge>
                                <span className="text-xs">{snippet.date}</span>
                              </CardDescription>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className={`h-8 w-8 ${snippet.favorite ? "text-yellow-500" : "text-gray-400"}`}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto">
                              <code>{snippet.code}</code>
                            </pre>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="absolute top-2 right-2 h-7 w-7 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="recent">
                  <div className="p-4 text-center text-muted-foreground">
                    Recent snippets will be displayed here
                  </div>
                </TabsContent>
                
                <TabsContent value="favorites">
                  <div className="p-4 text-center text-muted-foreground">
                    Favorite snippets will be displayed here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippets;
