
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CopyButton } from './copy-button';
import { ClipboardPaste, User, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

const initialFormState = {
  interactionId: '',
  customerName: '',
  callerName: '',
  relation: '',
  query: '',
  resolution: '',
  ghostline: 'N/A',
  validatedBy: '',
  notes: '',
};

const formFields = [
  { id: 'interactionId', label: 'Interaction ID' },
  { id: 'customerName', label: "Customer's name" },
  { id: 'query', label: 'Query' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'validatedBy', label: 'Validated by' },
];

interface CustomerFormProps {
  agentName: string;
}

function CustomerForm({ agentName }: CustomerFormProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [customerIsCaller, setCustomerIsCaller] = useState(false);

  useEffect(() => {
    if (customerIsCaller) {
      setFormData(prev => ({
        ...prev,
        callerName: prev.customerName,
        relation: 'Self',
      }));
    }
  }, [customerIsCaller, formData.customerName]);

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCustomerIsCaller(checked);
    if (!checked) {
        // Clear caller name and relation when unchecked
        setFormData(prev => ({
            ...prev,
            callerName: '',
            relation: '',
        }));
    }
  }

  const resetForm = () => {
    setFormData(initialFormState);
    setCustomerIsCaller(false);
  };

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

        <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                    id="customer-is-caller"
                    checked={customerIsCaller}
                    onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="customer-is-caller" className="font-normal">Customer is the caller</Label>
            </div>
            <Label htmlFor="callerName">Caller's name</Label>
            <Input
                id="callerName"
                value={formData.callerName}
                onChange={(e) => handleInputChange('callerName', e.target.value)}
                disabled={customerIsCaller}
            />
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
        <Button variant="outline" size="icon" onClick={resetForm} aria-label="Reset form">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <CopyButton textToCopy={detailsToCopy} className="h-10 w-auto px-4 copy-cursor">
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Copy Details
        </CopyButton>
      </div>
    </div>
  );
}


interface CustomerDetailsCardProps {
    agentName: string;
}

export function CustomerDetailsCard({ agentName }: CustomerDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Card className="glass-card mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="text-primary h-6 w-6" />
            <CardTitle>Customer Details</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
              <Tabs defaultValue="customer1" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="customer1">Customer 1</TabsTrigger>
                      <TabsTrigger value="customer2">Customer 2</TabsTrigger>
                  </TabsList>
                  <TabsContent value="customer1">
                      <CustomerForm agentName={agentName} />
                  </TabsContent>
                  <TabsContent value="customer2">
                      <CustomerForm agentName={agentName} />
                  </TabsContent>
              </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
