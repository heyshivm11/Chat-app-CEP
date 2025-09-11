"use client";

import { useState, useMemo } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { Header } from "./header";
import { FileText, Files } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerDetailsCard } from "./customer-details-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ScriptPage({ department: initialDepartment }: { department?: string, departmentName?: string }) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState(initialDepartment || "etg");

  const [customerName, setCustomerName] = useState("");
  const [agentName, setAgentName] = useState("Shivam");

  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment);
    router.push(`/scripts/${newDepartment}`, { scroll: false });
  };

  const getProcessedScripts = (scriptsToProcess: Script[], currentCustomerName: string, currentAgentName: string) => {
    return scriptsToProcess.map(script => {
      const newScript = JSON.parse(JSON.stringify(script)); // Deep copy
      
      const replacePlaceholders = (text: string) => {
        return text
          .replace(/\[Customer First Name\]/g, currentCustomerName || '[Customer First Name]')
          .replace(/\[Agent Name\]/g, currentAgentName || 'Shivam');
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
  };

  const filteredScripts = useMemo(() => {
    return scripts.filter((script) => {
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
  }, [searchTerm, category]);

  const departmentScripts = useMemo(() => {
    const deptScripts = filteredScripts.filter(s => s.department === department);
    return getProcessedScripts(deptScripts, customerName, agentName);
  }, [filteredScripts, department, customerName, agentName]);
  
  const commonScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common");
    return getProcessedScripts(common, customerName, agentName);
  }, [filteredScripts, customerName, agentName]);


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
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-1">
                <Card className="glass-card h-full">
                    <CardHeader>
                        <CardTitle>Name Placeholders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="agentName">Agent Name</Label>
                                <Input id="agentName" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name</Label>
                                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="xl:col-span-2">
                <CustomerDetailsCard agentName={agentName} />
            </div>
        </div>

        <div className="space-y-12 mt-8">
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
