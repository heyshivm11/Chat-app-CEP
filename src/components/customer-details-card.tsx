"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CopyButton } from './copy-button';
import { ClipboardPaste, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formFields = [
  { id: 'interactionId', label: 'Interaction ID' },
  { id: 'customerName', label: "Customer's name" },
  { id: 'callerName', label: "Caller's name" },
  { id: 'relation', label: 'Relation' },
  { id: 'query', label: 'Query' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'ghostline', label: 'Ghostline' },
  { id: 'validatedBy', label: 'Validated by' },
];

interface CustomerFormProps {
  onCustomerNameChange: (name: string) => void;
  onAgentNameChange: (name: string) => void;
}

function CustomerForm({ onCustomerNameChange, onAgentNameChange }: CustomerFormProps) {
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), { notes: '', agentName: 'Shivam' })
  );

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'customerName') {
      onCustomerNameChange(value);
    }
    if (id === 'agentName') {
        onAgentNameChange(value);
    }
  };

  const detailsToCopy = useMemo(() => {
    let text = `Agent Name: ${formData.agentName}\n`;
    formFields.forEach(field => {
      text += `${field.label}: ${formData[field.id as keyof typeof formData]}\n`;
    });
    text += `Notes: ${formData.notes}`;
    return text;
  }, [formData]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name</Label>
            <Input
            id="agentName"
            value={formData.agentName}
            onChange={(e) => handleInputChange('agentName', e.target.value)}
            />
        </div>
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
      <div className="flex justify-end">
        <CopyButton textToCopy={detailsToCopy} className="h-9 w-auto px-4">
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Copy Details
        </CopyButton>
      </div>
    </div>
  );
}


interface CustomerDetailsCardProps {
    onCustomerNameChange: (name: string) => void;
    onAgentNameChange: (name: string) => void;
}

export function CustomerDetailsCard({ onCustomerNameChange, onAgentNameChange }: CustomerDetailsCardProps) {
  // For now, we only pass down the handlers for the first customer.
  // This can be expanded to handle both customers if script logic needs to differ.
  const [activeTab, setActiveTab] = useState("customer1");

  return (
    <Card className="glass-card mb-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <User className="text-primary h-6 w-6" />
                Customer Details
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="customer1" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer1">Customer 1</TabsTrigger>
                    <TabsTrigger value="customer2">Customer 2</TabsTrigger>
                </TabsList>
                <TabsContent value="customer1">
                    <CustomerForm onCustomerNameChange={onCustomerNameChange} onAgentNameChange={onAgentNameChange} />
                </TabsContent>
                <TabsContent value="customer2">
                     <CustomerForm onCustomerNameChange={() => {}} onAgentNameChange={() => {}} />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
}
