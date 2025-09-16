"use client";

import { useState, useMemo } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { PageHeader } from "./page-header";
import { FileText, Workflow, BookCopy, ChevronsUpDown } from "lucide-react";
import { CustomerDetailsCard } from "./customer-details-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { TypingEffect } from "./typing-effect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScriptPage({ department: initialDepartment }: { department?: string }) {
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState(initialDepartment || "etg");
  const [customerName, setCustomerName] = useState("");
  const [openingOpen, setOpeningOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [commonOpen, setCommonOpen] = useState(true);

  const agentName = 'Agent'; // Generic agent name

  const motivationalPhrases = [
    "Let's provide the best experience to customers...",
    "Every ticket is a chance to turn frustration into gratitude.",
    "They’re not angry at you they’re just tired of waiting...",
    "Jaa Sutta maar Ke aa 🚬",
    "Behind every complaint is a customer who still believes we can fix it...",
    "If empathy were currency, you'd be rich by now...",
    "Resolve. Recharge. Repeat.",
  ];

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment);
    router.push(`/scripts/${newDepartment}`);
  };

  const getProcessedScripts = (scriptsToProcess: Script[], currentCustomerName: string, currentAgentName: string) => {
    return scriptsToProcess.map(script => {
      const newScript = JSON.parse(JSON.stringify(script)); // Deep copy
      
      const replacePlaceholders = (text: string) => {
        return text
          .replace(/\[Customer First Name\]/g, currentCustomerName || '[Customer First Name]')
          .replace(/\[Agent Name\]/g, currentAgentName || '[Agent Name]');
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
      
      // Removed teamMatch as user department is no longer available
      return searchMatch && categoryMatch;
    });
  }, [searchTerm, category]);

  const departmentScripts = useMemo(() => {
    const deptScripts = filteredScripts.filter(s => s.department === department);
    return getProcessedScripts(deptScripts, customerName, agentName || 'Agent');
  }, [filteredScripts, department, customerName, agentName]);
  
  const workflowScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common" && s.category === "Workflow");
    return getProcessedScripts(common, customerName, agentName || 'Agent');
  }, [filteredScripts, customerName, agentName]);

  const commonScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common" && s.category !== "Workflow");
    return getProcessedScripts(common, customerName, agentName || 'Agent');
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
    <div className="flex flex-col min-h-screen">
      <PageHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          department={department}
          onDepartmentChange={handleDepartmentChange}
      />
      <main className="container mx-auto px-4 md:px-8 py-8 flex-1">
          
          <Card className="mb-8">
              <CardHeader>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                      <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
                      <TypingEffect phrases={motivationalPhrases} className="text-muted-foreground text-md h-6" />
                  </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                      <Label htmlFor="customerName" className="text-md whitespace-nowrap font-bold">Customer Name:</Label>
                      <div className="flex items-center gap-2 w-full">
                          <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="text-md" />
                          <Button variant="outline" size="icon" onClick={() => setCustomerName("")} aria-label="Reset customer name">
                              <RotateCcw className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                  </div>
              </CardHeader>
          </Card>

          <CustomerDetailsCard agentName={agentName || ''} />

          <div className="space-y-12 mt-8">
              <Collapsible asChild open={openingOpen} onOpenChange={setOpeningOpen} className="rounded-xl p-4 md:p-6 border">
              <section>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                      <FileText className="h-7 w-7 text-primary" />
                      <h2 className="text-3xl font-bold tracking-tight text-foreground">Opening</h2>
                      </div>
                      <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Toggle Opening</span>
                      </Button>
                      </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                      {renderScriptList(departmentScripts)}
                  </CollapsibleContent>
              </section>
              </Collapsible>

              <Collapsible asChild open={workflowOpen} onOpenChange={setWorkflowOpen} className="rounded-xl p-4 md:p-6 border">
              <section>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                      <Workflow className="h-7 w-7 text-primary" />
                      <h2 className="text-3xl font-bold tracking-tight text-foreground">Workflow</h2>
                      </div>
                      <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Toggle Workflow</span>
                      </Button>
                      </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                      {renderScriptList(workflowScripts)}
                  </CollapsibleContent>
              </section>
              </Collapsible>
              
              <Collapsible asChild open={commonOpen} onOpenChange={setCommonOpen} className="rounded-xl p-4 md:p-6 border">
              <section>
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                      <BookCopy className="h-7 w-7 text-primary" />
                      <h2 className="text-3xl font-bold tracking-tight text-foreground">Common Scripts</h2>
                      </div>
                      <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Toggle Common Scripts</span>
                      </Button>
                      </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                      {renderScriptList(commonScripts)}
                  </CollapsibleContent>
              </section>
              </Collapsible>
          </div>
      </main>
      <footer className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-muted-foreground">
          Made with ❤️ by <a href="https://www.instagram.com/heyshivm/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Shivam</a>
      </footer>
    </div>
  );
}
