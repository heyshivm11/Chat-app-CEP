

"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { PageHeader } from "./page-header";
import { FileText, Workflow, BookCopy, ChevronsUpDown, MessageSquareQuote } from "@/components/ui/lucide-icons";
import { CustomerDetailsCard } from "./customer-details-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { TypingEffect } from "./typing-effect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Chatbot } from "./chatbot";

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

const SectionCard = ({ 
    icon, 
    title, 
    isOpen, 
    onOpenChange, 
    children 
} : {
    icon: React.ReactNode,
    title: string,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    children: React.ReactNode
}) => (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <div className="p-4 rounded-lg border border-white/20 bg-background/30 backdrop-blur-lg">
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full pb-4 group">
                    <div className="flex items-center gap-3">
                        {icon}
                        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
                    </div>
                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                {children}
            </CollapsibleContent>
        </div>
    </Collapsible>
);


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
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [commonOpen, setCommonOpen] = useState(false);
  const [closingOpen, setClosingOpen] = useState(true);
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {scriptList.map((script) => (
                <ScriptCard key={script.id} script={script} />
            ))}
        </div>
    );
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
        <div id="blob" ref={blobRef}></div>
        <div id="blur"></div>
        <div className="relative z-10 flex flex-col h-full flex-1">
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

                <div className="space-y-6">
                    <SectionCard 
                        icon={<FileText className="h-6 w-6 text-primary" />}
                        title="Customer Details"
                        isOpen={customerDetailsOpen}
                        onOpenChange={setCustomerDetailsOpen}
                    >
                         <CustomerDetailsCard 
                            agentName={user?.name || 'Agent'} 
                            onQueryChange={setCurrentQuery}
                            isOpen={customerDetailsOpen}
                            onOpenChange={setCustomerDetailsOpen}
                        />
                    </SectionCard>

                    <SectionCard
                        icon={<FileText className="h-6 w-6 text-primary" />}
                        title="Opening"
                        isOpen={openingOpen}
                        onOpenChange={setOpeningOpen}
                    >
                        <div className="space-y-4">
                            {requestStatedVerifiedScript && (
                                <div className="p-4 rounded-md border bg-card">
                                    <ScriptCard script={requestStatedVerifiedScript} />
                                </div>
                            )}
                            {renderScriptList(otherDepartmentScripts)}
                        </div>
                    </SectionCard>

                    <SectionCard
                        icon={<Workflow className="h-6 w-6 text-primary" />}
                        title="Workflow"
                        isOpen={workflowOpen}
                        onOpenChange={setWorkflowOpen}
                    >
                        {renderScriptList(workflowScripts)}
                    </SectionCard>
                    
                    <SectionCard
                        icon={<BookCopy className="h-6 w-6 text-primary" />}
                        title="Common Scripts"
                        isOpen={commonOpen}
                        onOpenChange={setCommonOpen}
                    >
                        {renderScriptList(commonScripts)}
                    </SectionCard>

                    <SectionCard
                        icon={<MessageSquareQuote className="h-6 w-6 text-primary" />}
                        title="Chat Closing"
                        isOpen={closingOpen}
                        onOpenChange={setClosingOpen}
                    >
                        {chatClosingScript && <ScriptCard script={chatClosingScript} />}
                    </SectionCard>
                </div>
            </main>
            <Chatbot />
            <footer className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-muted-foreground">
                Made with ❤️ by <a href="https://www.instagram.com/heyshivm/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Shivam</a>
            </footer>
        </div>
    </div>
  );
}

    
