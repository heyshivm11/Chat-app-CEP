
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { PageHeader } from "./page-header";
import { FileText, Workflow, BookCopy, ChevronsUpDown, MessageSquareQuote, ChevronsDownUp, ChevronsUpDown as ChevronsUpDownIcon } from "@/components/ui/lucide-icons";
import { CustomerDetailsCard } from "./customer-details-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { TypingEffect } from "./typing-effect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const motivationalPhrases = [
  "Let's provide the best experience to customers...",
  "Every ticket is a chance to turn frustration into gratitude.",
  "They’re not angry at you they’re just tired of waiting...",
  "Jaa Sutta maar Ke aa 🚬",
  "Behind every complaint is a customer who still believes we can fix it...",
  "If empathy were currency, you'd be rich by now...",
  "Resolve. Recharge. Repeat.",
];

const getProcessedScripts = (scriptsToProcess: Script[], currentCustomerName: string, currentAgentName: string, query: string) => {
  return scriptsToProcess.map(script => {
    const newScript = JSON.parse(JSON.stringify(script)); // Deep copy
    
    const replacePlaceholders = (text: string) => {
      return text
        .replace(/\[Customer First Name\]/g, currentCustomerName || '[Customer First Name]')
        .replace(/\[Agent Name\]/g, currentAgentName || '[Agent Name]')
        .replace(/\[Query\]/g, query || '...');
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

const doesScriptMatch = (script: Script, term: string) => {
  const lowerCaseTerm = term.toLowerCase();
  if (script.title.toLowerCase().includes(lowerCaseTerm)) return true;

  if (typeof script.content === 'string') {
    if (script.content.toLowerCase().includes(lowerCaseTerm)) return true;
  } else if (Array.isArray(script.content)) {
    if (script.content.some(sub => 
      sub.title.toLowerCase().includes(lowerCaseTerm) || 
      sub.content.toLowerCase().includes(lowerCaseTerm)
    )) return true;
  }

  return false;
}

export default function ScriptPage({ department: initialDepartment }: { department: string }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState(initialDepartment || user?.department || "etg");
  const [customerName, setCustomerName] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");

  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(true);
  const [openingOpen, setOpeningOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [commonOpen, setCommonOpen] = useState(true);
  const [closingOpen, setClosingOpen] = useState(true);
  
  const [allOpen, setAllOpen] = useState(true);

  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      if (blobRef.current) {
        blobRef.current.animate({
          left: `${clientX}px`,
          top: `${clientY}px`
        }, { duration: 3000, fill: "forwards" });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  const handleDepartmentChange = useCallback((newDepartment: string) => {
    setDepartment(newDepartment);
    router.push(`/scripts/${newDepartment}`);
  }, [router]);

  const toggleAllSections = useCallback(() => {
    const nextState = !allOpen;
    setCustomerDetailsOpen(nextState);
    setOpeningOpen(nextState);
    setWorkflowOpen(nextState);
    setCommonOpen(nextState);
    setClosingOpen(nextState);
    setAllOpen(nextState);
  }, [allOpen]);
  
  useEffect(() => {
    const currentlyAllOpen = customerDetailsOpen && openingOpen && workflowOpen && commonOpen && closingOpen;
    setAllOpen(currentlyAllOpen);
  },[customerDetailsOpen, openingOpen, workflowOpen, commonOpen, closingOpen])


  const filteredScripts = useMemo(() => {
    return scripts.filter((script) => {
      const searchMatch = searchTerm ? doesScriptMatch(script, searchTerm) : true;
      const categoryMatch = category === "All" || script.category === category;
      const teamMatch = script.department === 'common' || script.department === department;
      
      return searchMatch && categoryMatch && teamMatch;
    });
  }, [searchTerm, category, department]);
  
  const handleSearchSubmit = useCallback(() => {
    if (filteredScripts.length > 0) {
      const firstMatchId = `script-card-${filteredScripts[0].id}`;
      const element = document.getElementById(firstMatchId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-animation');
        setTimeout(() => {
          element.classList.remove('highlight-animation');
        }, 1500);
      }
    }
  }, [filteredScripts]);

  const departmentScripts = useMemo(() => {
    const deptScripts = filteredScripts.filter(s => s.department === department);
    return getProcessedScripts(deptScripts, customerName, user?.name || 'Agent', currentQuery);
  }, [filteredScripts, department, customerName, user?.name, currentQuery]);

  const requestStatedVerifiedScript = useMemo(() => {
    return departmentScripts.find(s => s.title === 'Request Stated & Verified');
  }, [departmentScripts]);

  const otherDepartmentScripts = useMemo(() => {
      return departmentScripts.filter(s => s.title !== 'Request Stated & Verified');
  }, [departmentScripts]);
  
  const workflowScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common" && s.category === "Workflow");
    return getProcessedScripts(common, customerName, user?.name || 'Agent', currentQuery);
  }, [filteredScripts, customerName, user?.name, currentQuery]);

  const commonScripts = useMemo(() => {
    const common = filteredScripts.filter(s => s.department === "common" && s.category !== "Workflow" && s.category !== "Chat Closing");
    return getProcessedScripts(common, customerName, user?.name || 'Agent', currentQuery);
  }, [filteredScripts, customerName, user?.name, currentQuery]);

  const chatClosingScript = useMemo(() => {
    const closingScript = filteredScripts.find(s => s.category === "Chat Closing");
    return closingScript ? getProcessedScripts([closingScript], customerName, user?.name || 'Agent', currentQuery)[0] : null;
  }, [filteredScripts, customerName, user?.name, currentQuery]);


  const renderScriptList = useCallback((scriptList: Script[]) => {
    if (scriptList.length === 0) {
      return <p className="text-muted-foreground text-center col-span-1 md:col-span-2 xl:col-span-3 py-8">No scripts found.</p>;
    }
    
    return (
        <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
            {scriptList.map((script) => (
                <div key={script.id} className="break-inside-avoid mb-4">
                    <ScriptCard script={script} />
                </div>
            ))}
        </div>
    );
  }, []);
  
  const renderFlexScriptList = useCallback((scriptList: Script[]) => {
    if (scriptList.length === 0) {
      return <p className="text-muted-foreground text-center col-span-1 md:col-span-2 xl:col-span-3 py-8">No scripts found.</p>;
    }

    return (
      <div className="flex flex-wrap gap-4">
        {scriptList.map((script) => (
          <div key={script.id} className="w-full md:w-[calc(50%-0.5rem)] xl:w-[calc(33.33%-1rem)]">
            <ScriptCard script={script} />
          </div>
        ))}
      </div>
    );
  }, []);
  
  return (
    <div 
      className="flex flex-col min-h-screen relative overflow-hidden"
    >
        <div id="blob" ref={blobRef}></div>
        <div id="blur"></div>
        <div className="relative z-10 flex flex-col h-full">
            <PageHeader 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchSubmit={handleSearchSubmit}
                category={category}
                onCategoryChange={setCategory}
                department={department}
                onDepartmentChange={handleDepartmentChange}
            />
            <main className="container mx-auto px-4 md:px-8 py-8 flex-1">
                
                <div className="mb-8 p-6 bg-background/30 backdrop-blur-sm border-white/20 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'Agent'}!</h2>
                            <TypingEffect phrases={motivationalPhrases} className="text-muted-foreground text-md h-6" />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Label htmlFor="customerName" className="text-md whitespace-nowrap font-bold">Customer Name:</Label>
                            <div className="flex items-center gap-2 w-full">
                                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                                <Button variant="outline" size="icon" onClick={() => setCustomerName("")} aria-label="Reset customer name">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex justify-end">
                    <Button variant="outline" onClick={toggleAllSections}>
                        {allOpen ? <ChevronsUpDownIcon className="mr-2 h-4 w-4" /> : <ChevronsDownUp className="mr-2 h-4 w-4" />}
                        {allOpen ? 'Collapse All' : 'Expand All'}
                    </Button>
                </div>

                <div className="my-8">
                    <CustomerDetailsCard 
                        agentName={user?.name || 'Agent'} 
                        onQueryChange={setCurrentQuery}
                        isOpen={customerDetailsOpen}
                        onOpenChange={setCustomerDetailsOpen}
                    />
                </div>

                <div className="space-y-12">
                    <Collapsible open={openingOpen} onOpenChange={setOpeningOpen}>
                        <section>
                            <div className="flex items-center justify-between mb-6">
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full group">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-7 w-7 text-primary" />
                                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Opening</h2>
                                    </div>
                                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div className="p-6 bg-background/30 backdrop-blur-sm border-white/20 rounded-lg">
                                    {requestStatedVerifiedScript && (
                                    <div className="mb-4">
                                        <ScriptCard script={requestStatedVerifiedScript} />
                                    </div>
                                    )}
                                    {renderScriptList(otherDepartmentScripts)}
                                </div>
                            </CollapsibleContent>
                        </section>
                    </Collapsible>

                    <Collapsible open={workflowOpen} onOpenChange={setWorkflowOpen}>
                        <section>
                            <div className="flex items-center justify-between mb-6">
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full group">
                                    <div className="flex items-center gap-3">
                                    <Workflow className="h-7 w-7 text-primary" />
                                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Workflow</h2>
                                    </div>
                                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div className="p-6 bg-background/30 backdrop-blur-sm border-white/20 rounded-lg">
                                    {renderScriptList(workflowScripts)}
                                </div>
                            </CollapsibleContent>
                        </section>
                    </Collapsible>
                    
                    <Collapsible open={commonOpen} onOpenChange={setCommonOpen}>
                        <section>
                            <div className="flex items-center justify-between mb-6">
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full group">
                                    <div className="flex items-center gap-3">
                                        <BookCopy className="h-7 w-7 text-primary" />
                                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Common Scripts</h2>
                                    </div>
                                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div className="p-6 bg-background/30 backdrop-blur-sm border-white/20 rounded-lg">
                                    {renderFlexScriptList(commonScripts)}
                                </div>
                            </CollapsibleContent>
                        </section>
                    </Collapsible>

                    <Collapsible open={closingOpen} onOpenChange={setClosingOpen}>
                        <section>
                            <div className="flex items-center justify-between mb-6">
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full group">
                                    <div className="flex items-center gap-3">
                                        <MessageSquareQuote className="h-7 w-7 text-primary" />
                                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Chat Closing</h2>
                                    </div>
                                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div className="p-6 bg-background/30 backdrop-blur-sm border-white/20 rounded-lg">
                                    {chatClosingScript && (
                                    <div className="mb-4">
                                        <ScriptCard script={chatClosingScript} />
                                    </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </section>
                    </Collapsible>
                </div>
            </main>
            <footer className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-muted-foreground">
                Made with ❤️ by <a href="https://www.instagram.com/heyshivm/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Shivam</a>
            </footer>
        </div>
    </div>
  );
}
