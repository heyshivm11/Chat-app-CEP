

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


const initialFormState = {
  interactionId: '',
  customerName: '',
  callerName: '',
  relation: '',
  query: '',
  resolution: '',
  ghostline: 'N/A',
  notes: '',
  validatedBy: '',
};

type FormState = typeof initialFormState;

const formFields = [
  { id: 'interactionId', label: 'Interaction ID' },
  { id: 'customerName', label: "Customer's name" },
  { id: 'query', label: 'Query' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'validatedBy', label: 'Validated by' },
];

interface CustomerFormProps {
  agentName: string;
  formData: FormState;
  onFormChange: (fieldName: keyof FormState, value: string) => void;
  onUndo: () => void;
  onReset: () => void;
  hasHistory: boolean;
  onQueryChange?: (query: string) => void;
}

function CustomerFormComponent({ agentName, formData, onFormChange, onUndo, onReset, hasHistory, onQueryChange }: CustomerFormProps) {
  const [customerIsCaller, setCustomerIsCaller] = useState(formData.relation === 'Self');

  const handleInputChange = (id: string, value: string) => {
    onFormChange(id as keyof FormState, value);
    if (id === 'query' && onQueryChange) {
      onQueryChange(value);
    }
  };
  
  const handleSelectChange = (id: string, value: string) => {
    onFormChange(id as keyof FormState, value);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCustomerIsCaller(checked);
    if (checked) {
      onFormChange('callerName', formData.customerName);
      onFormChange('relation', 'Self');
    } else {
      onFormChange('callerName', '');
      onFormChange('relation', '');
    }
  }

  const detailsToCopy = useMemo(() => {
    let text = `Agent Name: ${agentName}\n`;
    text += `Interaction ID: ${formData.interactionId}\n`;
    text += `Customer's name: ${formData.customerName}\n`;
    text += `Caller's name: ${formData.callerName}\n`;
    text += `Relation: ${formData.relation}\n`;
    text += `Query: ${formData.query}\n`;
    text += `Resolution: ${formData.resolution}\n`;
    text += `Validated by: ${formData.validatedBy}\n`;
    text += `Ghostline: ${formData.ghostline}\n`;
    text += `Notes: ${formData.notes}`;
    return text;
  }, [formData, agentName]);

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              value={formData[field.id as keyof typeof formData]}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="callerName">Caller's name</Label>
            <Input
                id="callerName"
                value={formData.callerName}
                onChange={(e) => handleInputChange('callerName', e.target.value)}
                disabled={customerIsCaller}
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
        
        {!customerIsCaller && (
            <div className="space-y-2">
                <Label htmlFor="relation">Relation</Label>
                <Input
                    id="relation"
                    value={formData.relation}
                    onChange={(e) => handleInputChange('relation', e.target.value)}
                />
            </div>
        )}

        <div className="space-y-2">
            <Label htmlFor="ghostline">Ghostline</Label>
            <Select
                value={formData.ghostline}
                onValueChange={(value) => handleSelectChange('ghostline', value)}
            >
                <SelectTrigger id="ghostline">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Added">Added</SelectItem>
                    <SelectItem value="Not Added">Not Added</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add your notes here..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="icon" onClick={onUndo} disabled={!hasHistory} aria-label="Undo change">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onReset} aria-label="Reset form">
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
}: {
  agentName: string;
  onQueryChange?: (query: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form1Data, setForm1Data] = useState(initialFormState);
  const [form1History, setForm1History] = useState<FormState[]>([]);
  
  const [form2Data, setForm2Data] = useState(initialFormState);
  const [form2History, setForm2History] = useState<FormState[]>([]);

  const { toast } = useToast();
  const reminderInterval = useRef<NodeJS.Timeout>();

  const copyDetails = useCallback((details: string) => {
    navigator.clipboard.writeText(details);
    toast({ title: 'Details Copied!', description: 'Customer details have been copied to your clipboard.' });
  },[toast]);

  const detailsToCopy1 = useMemo(() => {
    let text = `Agent Name: ${agentName}\n`;
    Object.entries(form1Data).forEach(([key, value]) => {
      if(value) text += `${key}: ${value}\n`;
    });
    return text;
  }, [form1Data, agentName]);

  const detailsToCopy2 = useMemo(() => {
    let text = `Agent Name: ${agentName}\n`;
    Object.entries(form2Data).forEach(([key, value]) => {
      if(value) text += `${key}: ${value}\n`;
    });
    return text;
  }, [form2Data, agentName]);

  useEffect(() => {
    reminderInterval.current = setInterval(() => {
      toast({
        title: "Don't Forget!",
        description: "Have you copied the customer details? They might be important for your records.",
        duration: 8000,
        action: (
            <div className="flex flex-col gap-2">
                <Button onClick={() => copyDetails(detailsToCopy1)}>Copy Cust. 1</Button>
                <Button onClick={() => copyDetails(detailsToCopy2)}>Copy Cust. 2</Button>
            </div>
        )
      });
    }, 120000); // 2 minutes

    return () => {
      if (reminderInterval.current) {
        clearInterval(reminderInterval.current);
      }
    };
  }, [toast, detailsToCopy1, detailsToCopy2, copyDetails]);


  const handleFormChange = useCallback((
    formIndex: 1 | 2, 
    fieldName: keyof FormState, 
    value: string
  ) => {
    if (formIndex === 1) {
      setForm1History(prev => [...prev, form1Data]);
      setForm1Data(prev => ({ ...prev, [fieldName]: value }));
      if (fieldName === 'query' && onQueryChange) {
        onQueryChange(value);
      }
    } else {
      setForm2History(prev => [...prev, form2Data]);
      setForm2Data(prev => ({ ...prev, [fieldName]: value }));
      if (fieldName === 'query' && onQueryChange) {
        onQueryChange(value);
      }
    }
  }, [onQueryChange, form1Data, form2Data]);
  
  const handleUndo = useCallback((formIndex: 1 | 2) => {
    if (formIndex === 1) {
      const lastState = form1History.pop();
      if (lastState) {
        setForm1Data(lastState);
        setForm1History([...form1History]);
        if(lastState.query !== form1Data.query && onQueryChange) {
          onQueryChange(lastState.query);
        }
      }
    } else {
      const lastState = form2History.pop();
      if (lastState) {
        setForm2Data(lastState);
        setForm2History([...form2History]);
         if(lastState.query !== form2Data.query && onQueryChange) {
          onQueryChange(lastState.query);
        }
      }
    }
  }, [form1History, form2History, onQueryChange, form1Data.query, form2Data.query]);

  const handleReset = useCallback((formIndex: 1 | 2) => {
    if (formIndex === 1) {
      setForm1History(prev => [...prev, form1Data]);
      setForm1Data(initialFormState);
       if (form1Data.query !== '' && onQueryChange) {
        onQueryChange('');
      }
    } else {
      setForm2History(prev => [...prev, form2Data]);
      setForm2Data(initialFormState);
      if (form2Data.query !== '' && onQueryChange) {
        onQueryChange('');
      }
    }
  }, [onQueryChange, form1Data, form2Data]);

  const handleTabChange = useCallback((value: string) => {
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
              onFormChange={(field, value) => handleFormChange(1, field, value)}
              onUndo={() => handleUndo(1)}
              onReset={() => handleReset(1)}
              hasHistory={form1History.length > 0}
              onQueryChange={onQueryChange}
            />
        </TabsContent>
        <TabsContent value="customer2">
            <CustomerForm
              agentName={agentName}
              formData={form2Data}
              onFormChange={(field, value) => handleFormChange(2, field, value)}
              onUndo={() => handleUndo(2)}
              onReset={() => handleReset(2)}
              hasHistory={form2History.length > 0}
              onQueryChange={onQueryChange}
            />
        </TabsContent>
    </Tabs>
  );
}

export const CustomerDetailsCard = React.memo(CustomerDetailsCardComponent);

    