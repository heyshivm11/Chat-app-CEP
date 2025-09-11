"use client";

import { useState, useMemo } from "react";
import { scripts } from "@/lib/scripts";
import { Script } from "@/lib/types";
import { ScriptCard } from "./script-card";
import { Header } from "./header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Files } from "lucide-react";

interface ScriptPageProps {
  department: string;
  departmentName: string;
}

export default function ScriptPage({ department, departmentName }: ScriptPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

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

  const departmentScripts = filteredScripts.filter(s => s.department === department);
  const commonScripts = filteredScripts.filter(s => s.department === "common");

  const renderScriptList = (scriptList: Script[]) => {
    if (scriptList.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No scripts found.</p>;
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
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
      />
      <main className="container mx-auto px-4 md:px-8 py-8">
        <Accordion type="multiple" defaultValue={['department-scripts', 'common-scripts']} className="w-full space-y-6">
          <AccordionItem value="department-scripts" className="border-none">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline pb-4 flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              {departmentName} Scripts
            </AccordionTrigger>
            <AccordionContent>
              {renderScriptList(departmentScripts)}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="common-scripts" className="border-none">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline pb-4 flex items-center gap-3">
              <Files className="h-6 w-6 text-primary" />
              Common Scripts
            </AccordionTrigger>
            <AccordionContent>
              {renderScriptList(commonScripts)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
