

"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { PageHeader } from "./page-header";
import { FileText, Workflow, ChevronsUpDown, MessageSquareQuote } from "@/components/ui/lucide-icons";
import { CustomerDetailsCard, initialFormState, type FormState } from "./customer-details-card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TypingEffect } from "./typing-effect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsDownUp, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Chatbot } from "./chatbot";
import { LandscapeScriptCard } from "./landscape-script-card";

const motivationalPhrases = [
  "Let's provide the best experience to customers...",
  "Every ticket is a chance to turn frustration into gratitude.",
  "They’re not angry at you they’re just tired of waiting...",
  "Jaa Sutta maar Ke aa 🚬",
  "Behind every complaint is a customer who still believes we can fix it...",
  "If empathy were currency, you'd be rich by now...",
  "Resolve. Recharge. Repeat.",
];

const doesScriptMatch = (script: Script, term: string) => {
  const lowerCaseTerm = term.toLowerCase();

  // Search in sub-script title or content
  if (Array.isArray(script.content)) {
    if (script.content.some(sub => 
      sub.title.toLowerCase().includes(lowerCaseTerm) || 
      sub.content.toLowerCase().includes(lowerCaseTerm)
    )) return true;
  }
  
  // Search in simple script content
  if (typeof script.content === 'string') {
    if (script.content.toLowerCase().includes(lowerCaseTerm)) return true;
  }

  // Search in main script title
  if (script.title.toLowerCase().includes(lowerCaseTerm)) return true;

  return false;
}

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

const getInitialFormState = (key: string): FormState => {
    if (typeof window === 'undefined') {
        return initialFormState;
    }
    try {
        const savedState = localStorage.getItem(key);
        return savedState ? JSON.parse(savedState) : initialFormState;
    } catch (e) {
        console.error("Failed to parse form data from localStorage", e);
        return initialFormState;
    }
};


export default function ScriptPage({ department: initialDepartment }: { department: string }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState(initialDepartment || user?.department || "etg");
  const [customerName, setCustomerName] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  
  const [form1Data, setForm1Data] = useState<FormState>(() => getInitialFormState('form1Data'));
  const [form2Data, setForm2Data] = useState<FormState>(() => getInitialFormState('form2Data'));

  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(true);
  const [openingOpen, setOpeningOpen] = useState(true);
  const [conversationFlowOpen, setConversationFlowOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [closingOpen, setClosingOpen] = useState(true);
  
  const [areAllSectionsOpen, setAreAllSectionsOpen] = useState(true);

  const blobRef = useRef<HTMLDivElement>(null);
  
  // Load collapsible state from localStorage
  useEffect(() => {
    try {
      const savedStates = localStorage.getItem('collapsibleStates');
      if (savedStates) {
        const states = JSON.parse(savedStates);
        setCustomerDetailsOpen(states.customerDetailsOpen ?? true);
        setOpeningOpen(states.openingOpen ?? true);
        setConversationFlowOpen(states.conversationFlowOpen ?? true);
        setWorkflowOpen(states.workflowOpen ?? true);
        setClosingOpen(states.closingOpen ?? true);
      } else {
        // Set default states if nothing is in localStorage
        setCustomerDetailsOpen(true);
        setOpeningOpen(true);
        setConversationFlowOpen(true);
        setWorkflowOpen(true);
        setClosingOpen(true);
      }
    } catch (e) {
      console.error("Failed to parse collapsible states from localStorage", e);
    }
  }, []);

  // Save collapsible state to localStorage
  useEffect(() => {
    const states = {
      customerDetailsOpen,
      openingOpen,
      conversationFlowOpen,
      workflowOpen,
      closingOpen,
    };
    localStorage.setItem('collapsibleStates', JSON.stringify(states));
  }, [customerDetailsOpen, openingOpen, conversationFlowOpen, workflowOpen, closingOpen]);


  useEffect(() => {
    localStorage.setItem('form1Data', JSON.stringify(form1Data));
  }, [form1Data]);

  useEffect(() => {
    localStorage.setItem('form2Data', JSON.stringify(form2Data));
  }, [form2Data]);


  const highlightAndScrollTo = useCallback((scriptId: string) => {
    const element = document.getElementById(`script-card-${scriptId}`);
    if (element) {
      // Find the parent Collapsible section and open it if it's closed
      const parentCollapsible = element.closest<HTMLElement>('[data-state]');
      if (parentCollapsible && parentCollapsible.dataset.state === 'closed') {
        const trigger = parentCollapsible.querySelector<HTMLButtonElement>('button');
        trigger?.click();
        
        // Wait for animation to finish before scrolling
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-animation');
            setTimeout(() => {
                element.classList.remove('highlight-animation');
            }, 1500);
        }, 300); // Should be slightly more than animation duration
      } else {
         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-animation');
          setTimeout(() => {
            element.classList.remove('highlight-animation');
          }, 1500);
      }
    }
  }, []);
  
  const handleSearchSubmit = useCallback(() => {
    const deptScripts = scripts.filter(s => (s.department === department || s.department === 'common') && (category === "All" || s.category === category));
    const filtered = deptScripts.filter(script => doesScriptMatch(script, searchTerm));

    if (filtered.length > 0) {
      highlightAndScrollTo(filtered[0].id);
      setSearchTerm(""); 
    }
  }, [highlightAndScrollTo, searchTerm, department, category]);


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

  const toggleAllSections = () => {
    const nextState = !areAllSectionsOpen;
    setAreAllSectionsOpen(nextState);
    setCustomerDetailsOpen(nextState);
    setOpeningOpen(nextState);
    setConversationFlowOpen(nextState);
    setWorkflowOpen(nextState);
    setClosingOpen(nextState);
  };
  
  const openingCategories = useMemo(() => [
    'Request Not Stated & Non-Verified',
    'Request Not Stated & Verified',
    'Request Stated & Non-Verified',
    'Request Stated & Verified',
    'Verified – Request Stated (Transferred Chat)',
  ], []);

  const processedScripts = useMemo(() => {
    const scriptsToDisplay = scripts;
    const deptScripts = scriptsToDisplay.filter(s => s.department === department || s.department === 'common');
    const categoryFiltered = category === "All" ? deptScripts : deptScripts.filter(s => s.category === category);
    return getProcessedScripts(categoryFiltered, customerName, user?.name || 'Agent', currentQuery);
  }, [department, category, customerName, user?.name, currentQuery]);

  
  const openingScripts = useMemo(() => {
    return processedScripts.filter(s => openingCategories.includes(s.category));
  }, [processedScripts, openingCategories]);

  const landscapeScript = useMemo(() => {
    return openingScripts.find(s => s.title === 'Request Stated & Verified');
  }, [openingScripts]);
  
  const otherOpeningScripts = useMemo(() => {
    return openingScripts.filter(s => s.title !== 'Request Stated & Verified');
  }, [openingScripts]);

  
  const otherDepartmentScripts = useMemo(() => {
    return processedScripts.filter(s => !openingCategories.includes(s.category));
  }, [processedScripts, openingCategories]);
  
  const workflowScripts = useMemo(() => {
    return otherDepartmentScripts.filter(s => s.category === "Workflow");
  }, [otherDepartmentScripts]);

  const consequentRefreshScript = useMemo(() => {
    return workflowScripts.find(s => s.title === 'Consequent refresh hold');
  }, [workflowScripts]);

  const otherWorkflowScripts = useMemo(() => {
    return workflowScripts.filter(s => s.title !== 'Consequent refresh hold');
  }, [workflowScripts]);

  
  const conversationFlowScripts = useMemo(() => {
    return otherDepartmentScripts.filter(s => s.category === "Conversation Flow");
  }, [otherDepartmentScripts]);

  const chatClosingScript = useMemo(() => {
    return otherDepartmentScripts.find(s => s.category === "Chat Closing");
  }, [otherDepartmentScripts]);


  const renderScriptList = useCallback((scriptList: Script[]) => {
    if (scriptList.length === 0) {
      return <p className="text-muted-foreground text-center col-span-1 md:col-span-2 xl:col-span-3 py-8">No scripts found for the current filter.</p>;
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div className="flex justify-end mb-4">
                    <Button variant="outline" onClick={toggleAllSections}>
                        <ChevronsDownUp className="mr-2 h-4 w-4" />
                        {areAllSectionsOpen ? "Collapse All" : "Expand All"}
                    </Button>
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
                            form1Data={form1Data}
                            setForm1Data={setForm1Data}
                            form2Data={form2Data}
                            setForm2Data={setForm2Data}
                        />
                    </SectionCard>

                    <SectionCard
                        icon={<FileText className="h-6 w-6 text-primary" />}
                        title="Opening"
                        isOpen={openingOpen}
                        onOpenChange={setOpeningOpen}
                    >
                        <div className="flex flex-col gap-6">
                            {landscapeScript && <LandscapeScriptCard script={landscapeScript} />}
                            {renderScriptList(otherOpeningScripts)}
                        </div>
                    </SectionCard>

                     <SectionCard
                        icon={<Workflow className="h-6 w-6 text-primary" />}
                        title="Conversation Flow"
                        isOpen={conversationFlowOpen}
                        onOpenChange={setConversationFlowOpen}
                    >
                        {renderScriptList(conversationFlowScripts)}
                    </SectionCard>

                    <SectionCard
                        icon={<Workflow className="h-6 w-6 text-primary" />}
                        title="Workflow"
                        isOpen={workflowOpen}
                        onOpenChange={setWorkflowOpen}
                    >
                      <div className="flex flex-col gap-6">
                          {consequentRefreshScript && <LandscapeScriptCard script={consequentRefreshScript} />}
                          {renderScriptList(otherWorkflowScripts)}
                      </div>
                    </SectionCard>
                    
                    <SectionCard
                        icon={<MessageSquareQuote className="h-6 w-6 text-primary" />}
                        title="Chat Closing"
                        isOpen={closingOpen}
                        onOpenChange={setClosingOpen}
                    >
                       {chatClosingScript && renderScriptList([chatClosingScript])}
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

    

    
