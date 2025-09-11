"use client";

import { useState, useMemo } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { Header } from "./header";
import { FileText, Files } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerDetailsCard } from "./customer-details-card";

export default function ScriptPage({ department: initialDepartment }: { department?: string, departmentName?: string }) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState(initialDepartment || "etg");

  const [customer1Name, setCustomer1Name] = useState("");
  const [agent1Name, setAgent1Name] = useState("Shivam");
  
  const [customer2Name, setCustomer2Name] = useState("");
  const [agent2Name, setAgent2Name] = useState("Shivam");


  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartment(newDepartment);
    router.push(`/scripts/${newDepartment}`, { scroll: false });
  };

  const getProcessedScripts = (customerName: string, agentName: string) => {
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
  };

  const filteredScripts = useMemo(() => {
    // For simplicity, we'll filter based on a single set of names for search,
    // or we could decide not to replace placeholders before filtering.
    // Let's not replace for filtering to keep it simple.
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
    const filtered = filteredScripts.filter(s => s.department === department);
    const processed = getProcessedScripts(customer1Name, agent1Name);
    return processed.filter(ps => filtered.some(fs => fs.id === ps.id));
  }, [filteredScripts, department, customer1Name, agent1Name]);
  
  const commonScripts = useMemo(() => {
    const filtered = filteredScripts.filter(s => s.department === "common");
    const processed = getProcessedScripts(customer1Name, agent1Name);
    return processed.filter(ps => filtered.some(fs => fs.id === ps.id));
  }, [filteredScripts, customer1Name, agent1Name]);


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
        <CustomerDetailsCard 
          onCustomerNameChange={(name) => setCustomer1Name(name)}
          onAgentNameChange={(name) => setAgent1Name(name)}
        />

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
