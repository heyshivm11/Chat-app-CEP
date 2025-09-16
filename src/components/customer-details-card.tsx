
"use client";
import React from 'react';
import { useState, useMemo, useEffect, useCallback, useRef, useReducer } from 'react';
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

// Reducer logic
type FormAction =
  | { type: 'UPDATE_FIELD'; payload: { fieldName: keyof FormState; value: string } }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'SET_CALLER_FROM_CUSTOMER'; payload: { customerName: string } }
  | { type: 'CLEAR_CALLER' };

interface ReducerState {
  data: FormState;
  history: FormState[];
}

const initialReducerState: ReducerState = {
  data: initialFormState,
  history: [],
};

const formReducer = (state: ReducerState, action: FormAction): ReducerState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        history: [...state.history, state.data],
        data: { ...state.data, [action.payload.fieldName]: action.payload.value },
      };
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const lastState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, state.history.length - 1);
      return { data: lastState, history: newHistory };
    }
    case 'RESET':
      return {
        history: [...state.history, state.data],
        data: initialFormState,
      };
    case 'SET_CALLER_FROM_CUSTOMER':
      return {
        history: [...state.history, state.data],
        data: {
          ...state.data,
          callerName: action.payload.customerName,
          relation: 'Self',
        },
      };
    case 'CLEAR_CALLER':
       return {
        history: [...state.history, state.data],
        data: {
          ...state.data,
          callerName: '',
          relation: '',
        },
      };
    default:
      return state;
  }
};


const formFields = [
  { id: 'interactionId', label: 'Interaction ID' },
  { id: 'customerName', label: "Customer's name" },
  { id: 'query', label: 'Query' },
  { id: 'resolution', label: 'Resolution' },
  { id: 'validatedBy', label: 'Validated by' },
];

const getDetailsToCopy = (formData: FormState, agentName: string) => {
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
};

interface CustomerFormProps {
  agentName: string;
  formState: ReducerState;
  dispatch: React.Dispatch<FormAction>;
  onQueryChange?: (query: string) => void;
  scheduleReminder: () => void;
}

function CustomerFormComponent({ agentName, formState, dispatch, onQueryChange, scheduleReminder }: CustomerFormProps) {
  const { data: formData, history } = formState;
  const [customerIsCaller, setCustomerIsCaller] = useState(formData.relation === 'Self');
  
  useEffect(() => {
    // Sync checkbox state if form is reset or undo changes relation
    setCustomerIsCaller(formData.relation === 'Self');
  }, [formData.relation]);

  const handleInputChange = (id: keyof FormState, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { fieldName: id, value } });
    if (id === 'query' && onQueryChange) {
      onQueryChange(value);
    }
    if ((id === 'query' || id === 'resolution') && value.trim()) {
        scheduleReminder();
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCustomerIsCaller(checked);
    if (checked) {
      dispatch({ type: 'SET_CALLER_FROM_CUSTOMER', payload: { customerName: formData.customerName } });
    } else {
      dispatch({ type: 'CLEAR_CALLER' });
    }
  }

  const detailsToCopy = useMemo(() => {
    return getDetailsToCopy(formData, agentName)
  }, [formData, agentName]);

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map(fieldDef => {
            const field = fieldDef.id as keyof FormState;
            return (
                <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{fieldDef.label}</Label>
                    <Input
                        id={field}
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                </div>
            );
        })}
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
                onValueChange={(value) => handleInputChange('ghostline', value)}
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
        <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'UNDO' })} disabled={history.length === 0} aria-label="Undo change">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'RESET' })} aria-label="Reset form">
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
}) {
  const { toast } = useToast();
  const [form1State, form1Dispatch] = useReducer(formReducer, initialReducerState);
  const [form2State, form2Dispatch] = useReducer(formReducer, initialReducerState);

  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearReminder = useCallback(() => {
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
      reminderTimeoutRef.current = null;
    }
  }, []);

  const copyDetails = useCallback((formNumber: 1 | 2) => {
    const dataToCopy = formNumber === 1 ? form1State.data : form2State.data;
    const text = getDetailsToCopy(dataToCopy, agentName);
    navigator.clipboard.writeText(text);
    toast({ title: `Details for Customer ${formNumber} copied!` });
    clearReminder();
  }, [agentName, form1State.data, form2State.data, toast, clearReminder]);

  const triggerCopyReminder = useCallback(() => {
    toast({
        title: "Don't Forget!",
        description: "Have you copied the customer details? They might be important for your records.",
        duration: 8000,
        action: (
            <div className="flex flex-row gap-2 mt-2 w-full">
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
    // Cleanup timer on component unmount
    return () => {
      clearReminder();
    };
  }, [clearReminder]);
  
  const handleReset = useCallback((formIndex: 1 | 2) => {
    clearReminder();
    if (formIndex === 1) {
      if (form1State.data.query !== '' && onQueryChange) onQueryChange('');
      form1Dispatch({ type: 'RESET' });
    } else {
      if (form2State.data.query !== '' && onQueryChange) onQueryChange('');
      form2Dispatch({ type: 'RESET' });
    }
  }, [clearReminder, onQueryChange, form1State.data.query, form2State.data.query]);

  const handleTabChange = useCallback((value: string) => {
    if (onQueryChange) {
      if (value === 'customer1') {
        onQueryChange(form1State.data.query);
      } else {
        onQueryChange(form2State.data.query);
      }
    }
  }, [onQueryChange, form1State.data.query, form2State.data.query]);


  return (
    <Tabs defaultValue="customer1" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer1">Customer 1</TabsTrigger>
            <TabsTrigger value="customer2">Customer 2</TabsTrigger>
        </TabsList>
        <TabsContent value="customer1">
            <CustomerForm
              agentName={agentName}
              formState={form1State}
              dispatch={form1Dispatch}
              onQueryChange={onQueryChange}
              scheduleReminder={scheduleReminder}
            />
        </TabsContent>
        <TabsContent value="customer2">
            <CustomerForm
              agentName={agentName}
              formState={form2State}
              dispatch={form2Dispatch}
              onQueryChange={onQueryChange}
              scheduleReminder={scheduleReminder}
            />
        </TabsContent>
    </Tabs>
  );
}

export const CustomerDetailsCard = React.memo(CustomerDetailsCardComponent);

    