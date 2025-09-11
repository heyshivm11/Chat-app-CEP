"use client";

import { useState, useMemo } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { Header } from "./header";
import { FileText, Files, User, UserCog } from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";

export default function ScriptPage({ department: initialDepartment, departmentName: initialDepartmentName }: { department?: string, departmentName?: string }) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState(initialDepartment || "etg");
  const [customerName, setCustomerName] = useState("");
  const [agentName, setAgentName] = useState("Shivam");

  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment);
    // Use router to navigate without a full page reload if needed,
    // but for this structure, just updating state is enough.
    // router.push(`/scripts/${newDepartment}`, { scroll: false });
  };


  const processedScripts = useMemo(() => {
    return scripts.map(script => {
      const newScript = JSON.parse(JSON.stringify(script)); // Deep copy
      
      const replacePlaceholders = (text: string) => {
        return text
          .replace(/\[Customer First Name\]/g, customerName || '[Customer First Name]')
          .replace(/\[Agent Name\]/g, agentName || 'Shivam');
      };

      if (typeof newScript.content === 'string') {
        newScript.content = replacePlaceholders(newScript.content);
      } else if (Array.isArray(newScript.content)) {
        newScript.content = newScript.content.map(sub => ({
          ...sub,
          content: replacePlaceholders(sub.content)
        }));
      }
      return newScript;
    });
  }, [customerName, agentName]);


  const filteredScripts = useMemo(() => {
    return processedScripts.filter((script) => {
      const searchMatch =
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof script.content === "string" && script.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(script.content) &&
          script.content.some(
            (sub) =>
              sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              sub.content.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      
      const categoryMatch = category === "All" || script.category === category;
      
      return searchMatch && categoryMatch;
    });
  }, [searchTerm, category, processedScripts]);

  const departmentScripts = filteredScripts.filter(s => s.department === department);
  const commonScripts = filteredScripts.filter(s => s.department === "common");

  const renderScriptList = (scriptList: Script[]) => {
    if (scriptList.length === 0) {
      return <p className="text-muted-foreground text-center col-span-1 lg:col-span-2 py-8">No scripts found.</p>;
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scriptList.map((script) => (
          <ScriptCard key={script.id} script={script} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen w-full gradient-background">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        department={department}
        onDepartmentChange={handleDepartmentChange}
      />
      <main className="container mx-auto px-4 md:px-8 py-8">
        <Card className="glass-card p-4 md:p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Customer Name" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="pl-10"
                    />
                 </div>
                 <div className="relative">
                    <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Agent Name" 
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="pl-10"
                    />
                 </div>
            </div>
        </Card>

        <div className="space-y-12">
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-7 w-7 text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{departmentName} Scripts</h2>
                </div>
                {renderScriptList(departmentScripts)}
            </section>
            
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Files className="h-7 w-7 text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Common Scripts</h2>
                </div>
                {renderScriptList(commonScripts)}
            </section>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        Made with ❤️ by Shivam
      </footer>
    </div>
  );
}
