
"use client";

import { useState, useMemo, useEffect } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { Header } from "./header";
import { FileText, Workflow, BookCopy, RotateCcw, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerDetailsCard } from "./customer-details-card";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { AuthGate } from "./auth-gate";
import { TypingEffect } from "./typing-effect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChatAssistantDialog } from "./chat-assistant-dialog";

export default function ScriptPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState("etg");
  const [agentName, setAgentName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [openingOpen, setOpeningOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [commonOpen, setCommonOpen] = useState(true);

  const motivationalPhrases = [
    "Let's provide the best experience to customers...",
    "Every ticket is a chance to turn frustration into gratitude.",
    "They’re not angry at you they’re just tired of waiting...",
    "Jaa Sutta maar Ke aa 🚬",
    "Behind every complaint is a customer who still believes we can fix it...",
    "If empathy were currency, you'd be rich by now...",
    "Resolve. Recharge. Repeat.",
  ];

  useEffect(() => {
    if (user) {
      setAgentName(user.displayName || '');
    }
  }, [user]);

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
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
    const userDepartment = user?.department || 'All';

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

      const teamMatch = script.team === 'All' || script.team === userDepartment;
      
      return searchMatch && categoryMatch && teamMatch;
    });
  }, [searchTerm, category, user]);

  const departmentScripts = useMemo(() => {
    const deptScripts = filteredScripts.filter(s => s.department === department);
    return getProcessedScripts(deptScripts, customerName, agentName);
  }, [filteredScripts, department, customerName, agentName]);
  
  const workflowScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common" && s.category === "Workflow");
    return getProcessedScripts(common, customerName, agentName);
  }, [filteredScripts, customerName, agentName]);

  const commonScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common" && s.category !== "Workflow");
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
    <AuthGate>
      <div className="min-h-screen w-full">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          department={department}
          onDepartmentChange={handleDepartmentChange}
          onLogout={handleLogout}
        />
        <main className="container mx-auto px-4 md:px-8 py-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              <div className="xl:col-span-1">
                  <Card className="glass-card h-full">
                      <CardContent className="pt-6">
                          <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="mb-4">
                                  <h2 className="text-2xl font-bold text-foreground">Welcome {agentName}!</h2>
                                  <TypingEffect phrases={motivationalPhrases} className="text-muted-foreground text-sm h-5" />
                                </div>
                                  <Label htmlFor="agentName">Agent Name</Label>
                                  <Input id="agentName" value={agentName} disabled />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="customerName">Customer Name</Label>
                                  <div className="flex items-center gap-2">
                                      <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                                      <Button variant="outline" size="icon" onClick={() => setCustomerName("")} aria-label="Reset customer name">
                                          <RotateCcw className="h-4 w-4" />
                                      </Button>
                                  </div>
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
              <Collapsible asChild open={openingOpen} onOpenChange={setOpeningOpen}>
                <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-7 w-7 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Opening</h2>
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

              <Collapsible asChild open={workflowOpen} onOpenChange={setWorkflowOpen}>
                <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Workflow className="h-7 w-7 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Workflow</h2>
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
              
              <Collapsible asChild open={commonOpen} onOpenChange={setCommonOpen}>
                <section>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <BookCopy className="h-7 w-7 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Common Scripts</h2>
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
    </AuthGate>
  );
}
