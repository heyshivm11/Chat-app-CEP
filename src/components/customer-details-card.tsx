
"use client";
import React from 'react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from './copy-button';
import { ClipboardPaste, RotateCcw, Undo } from '@/components/ui/lucide-icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from './ui/toast';


export const initialFormState = {
  interactionId: '',
  customerName: '',
  callerName: '',
  relation: '',
  query: '',
  resolution: '',
  ghostline: 'N/A',
  notes: '',
  validationNeeded: 'No',
  validatedBy: '',
};

export type FormState = typeof initialFormState;


const getDetailsToCopy = (formData: FormState, agentName: string) => {
    let text = `Agent Name: ${agentName}\n`;
    text += `Interaction ID: ${formData.interactionId}\n`;
    text += `Customer's name: ${formData.customerName}\n`;
    text += `Caller's name: ${formData.callerName}\n`;
    text += `Relation: ${formData.relation}\n`;
    text += `Query: ${formData.query}\n`;
    text += `Resolution: ${formData.resolution}\n`;
    text += `Validation needed: ${formData.validationNeeded}\n`;
    if (formData.validationNeeded === 'Yes') {
      text += `Validated by: ${formData.validatedBy}\n`;
    }
    text += `Ghostline: ${formData.ghostline}\n`;
    text += `Notes: ${formData.notes}`;
    return text;
};

interface CustomerFormProps {
  agentName: string;
  formData: FormState;
  setFormData: (data: FormState) => void;
  history: FormState[];
  setHistory: (history: FormState[]) => void;
  onQueryChange?: (query: string) => void;
  scheduleReminder: () => void;
  formId: 'form1' | 'form2';
}

function CustomerFormComponent({ agentName, formData, setFormData, history, setHistory, onQueryChange, scheduleReminder, formId }: CustomerFormProps) {
  const [customerIsCaller, setCustomerIsCaller] = useState(false);
  
  // Refs for inputs
  const interactionIdRef = useRef<HTMLInputElement>(null);
  const customerNameRef = useRef<HTMLInputElement>(null);
  const callerNameRef = useRef<HTMLInputElement>(null);
  const relationRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef<HTMLInputElement>(null);
  const resolutionRef = useRef<HTMLInputElement>(null);
  const validationNeededRef = useRef<HTMLButtonElement>(null);
  const validatedByRef = useRef<HTMLInputElement>(null);
  const ghostlineRef = useRef<HTMLButtonElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    setCustomerIsCaller(formData.customerName !== '' && formData.customerName === formData.callerName);
  }, [formData.customerName, formData.callerName]);

  const updateField = useCallback((fieldName: keyof FormState, value: string) => {
    setHistory([...history, formData]);
    const newState = { ...formData, [fieldName]: value };
    if (fieldName === 'validationNeeded' && value === 'No') {
      newState.validatedBy = '';
    }
    setFormData(newState);
  }, [formData, history, setFormData, setHistory]);
  
  const handleInputChange = useCallback((id: keyof FormState, value: string) => {
    updateField(id, value);
    if (id === 'query' && onQueryChange) {
      onQueryChange(value);
    }
     if ((id === 'query' || id === 'resolution') && value.trim()) {
        scheduleReminder();
    }
  }, [updateField, onQueryChange, scheduleReminder]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, nextFieldRef: React.RefObject<HTMLElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef?.current) {
        nextFieldRef.current.focus();
      }
    }
  };


  const handleCheckboxChange = useCallback((checked: boolean) => {
    setCustomerIsCaller(checked);
    setHistory([...history, formData]);
    if (checked) {
      setFormData({
        ...formData,
        callerName: formData.customerName,
        relation: 'Self',
      });
    } else {
      setFormData({
        ...formData,
        callerName: '',
        relation: '',
      });
    }
  }, [formData, history, setFormData, setHistory]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setFormData(lastState);
    setHistory(history.slice(0, history.length - 1));
  }, [history, setFormData, setHistory]);
  
  const handleReset = useCallback(() => {
      setHistory([...history, formData]);
      setFormData(initialFormState);
      localStorage.removeItem(`${formId}Data`);
      if(onQueryChange) onQueryChange('');
  }, [formData, history, setFormData, setHistory, onQueryChange, formId]);

  const detailsToCopy = useMemo(() => {
    return getDetailsToCopy(formData, agentName)
  }, [formData, agentName]);

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="interactionId">Interaction ID</Label>
            <Input
                id="interactionId"
                ref={interactionIdRef}
                value={formData.interactionId}
                onChange={(e) => handleInputChange('interactionId', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, customerNameRef)}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="customerName">Customer's name</Label>
            <Input
                id="customerName"
                ref={customerNameRef}
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, callerNameRef)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="callerName">Caller's name</Label>
            <Input
                id="callerName"
                ref={callerNameRef}
                value={formData.callerName}
                onChange={(e) => handleInputChange('callerName', e.target.value)}
                disabled={customerIsCaller}
                onKeyDown={(e) => handleKeyDown(e, relationRef)}
            />
             <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                    id="customer-is-caller"
                    checked={customerIsCaller}
                    onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked))}
                />
                <Label htmlFor="customer-is-caller" className="font-normal">Customer is the caller</Label>
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="relation">Relation</Label>
            <Input
                id="relation"
                ref={relationRef}
                value={formData.relation}
                onChange={(e) => handleInputChange('relation', e.target.value)}
                disabled={customerIsCaller}
                onKeyDown={(e) => handleKeyDown(e, queryRef)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="query">Query</Label>
              <Input
                  id="query"
                  ref={queryRef}
                  value={formData.query}
                  onChange={(e) => handleInputChange('query', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, resolutionRef)}
              />
          </div>
          <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Input
                  id="resolution"
                  ref={resolutionRef}
                  value={formData.resolution}
                  onChange={(e) => handleInputChange('resolution', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, validationNeededRef)}
              />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="validationNeeded">Validation needed</Label>
            <Select
                value={formData.validationNeeded}
                onValueChange={(value) => handleInputChange('validationNeeded', value)}
            >
                <SelectTrigger id="validationNeeded" ref={validationNeededRef} onKeyDown={(e) => handleKeyDown(e, formData.validationNeeded === 'Yes' ? validatedByRef : ghostlineRef)}>
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {formData.validationNeeded === 'Yes' && (
          <div className="space-y-2">
              <Label htmlFor="validatedBy">Validated by</Label>
              <Input
                  id="validatedBy"
                  ref={validatedByRef}
                  value={formData.validatedBy}
                  onChange={(e) => handleInputChange('validatedBy', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, ghostlineRef)}
              />
          </div>
        )}
      </div>

      <div className="space-y-2">
            <Label htmlFor="ghostline">Ghostline</Label>
            <Select
                value={formData.ghostline}
                onValueChange={(value) => handleInputChange('ghostline', value)}
            >
                <SelectTrigger id="ghostline" ref={ghostlineRef} onKeyDown={(e) => handleKeyDown(e, notesRef)}>
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Added">Added</SelectItem>
                    <SelectItem value="Not Added">Not Added</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
            </Select>
        </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          ref={notesRef}
          placeholder="Add your notes here..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="icon" onClick={handleUndo} disabled={history.length === 0} aria-label="Undo change">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} aria-label="Reset form">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <CopyButton textToCopy={detailsToCopy}>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Copy Details
        </CopyButton>
      </div>
    </div>
  );
}




const CustomerForm = React.memo(CustomerFormComponent);


function CustomerDetailsCardComponent({
  agentName,
  onQueryChange,
  form1Data,
  setForm1Data,
  form2Data,
  setForm2Data,
}: {
  agentName: string;
  onQueryChange?: (query: string) => void;
  form1Data: FormState;
  setForm1Data: (data: FormState) => void;
  form2Data: FormState;
  setForm2Data: (data: FormState) => void;
}) {
  const { toast } = useToast();
  
  const [history1, setHistory1] = useState<FormState[]>([]);
  const [history2, setHistory2] = useState<FormState[]>([]);
  const [activeTab, setActiveTab] = useState('customer1');

  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearReminder = useCallback(() => {
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
      reminderTimeoutRef.current = null;
    }
  }, []);

  const copyDetails = useCallback((formNumber: 1 | 2) => {
    const dataToCopy = formNumber === 1 ? form1Data : form2Data;
    const text = getDetailsToCopy(dataToCopy, agentName);
    navigator.clipboard.writeText(text);
    toast({ title: `Details for Customer ${formNumber} copied!` });
    clearReminder();
  }, [agentName, form1Data, form2Data, toast, clearReminder]);

  const triggerCopyReminder = useCallback(() => {
    toast({
        title: "Don't Forget!",
        description: "Have you copied the customer details? They might be important for your records.",
        duration: 8000,
        action: (
          <div className="flex flex-col gap-2 w-full mt-2">
            <ToastAction altText="Copy details for Customer 1" onClick={() => copyDetails(1)}>
                Copy Cust. 1
            </ToastAction>
            <ToastAction altText="Copy details for Customer 2" onClick={() => copyDetails(2)}>
                Copy Cust. 2
            </ToastAction>
        </div>
        )
    });
  }, [toast, copyDetails]);

  const scheduleReminder = useCallback(() => {
    clearReminder();
    reminderTimeoutRef.current = setTimeout(() => {
        triggerCopyReminder();
    }, 30000); // 30 seconds
  }, [clearReminder, triggerCopyReminder]);

  useEffect(() => {
    return () => {
      clearReminder();
    };
  }, [clearReminder]);
  

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    if (onQueryChange) {
      if (value === 'customer1') {
        onQueryChange(form1Data.query);
      } else {
        onQueryChange(form2Data.query);
      }
    }
  }, [onQueryChange, form1Data.query, form2Data.query]);


  return (
    <Tabs defaultValue="customer1" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer1">Customer 1</TabsTrigger>
            <TabsTrigger value="customer2">Customer 2</TabsTrigger>
        </TabsList>
        <TabsContent value="customer1">
            <CustomerForm
              agentName={agentName}
              formData={form1Data}
              setFormData={setForm1Data}
              history={history1}
              setHistory={setHistory1}
              onQueryChange={onQueryChange}
              scheduleReminder={scheduleReminder}
              formId="form1"
            />
        </TabsContent>
        <TabsContent value="customer2">
            <CustomerForm
              agentName={agentName}
              formData={form2Data}
              setFormData={setForm2Data}
              history={history2}
              setHistory={setHistory2}
              onQueryChange={onQueryChange}
              scheduleReminder={scheduleReminder}
              formId="form2"
            />
        </TabsContent>
    </Tabs>
  );
}

export const CustomerDetailsCard = React.memo(CustomerDetailsCardComponent);

    