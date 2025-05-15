'use client';

import type React from 'react';
import { useState, useEffect }_CLIENT_IMPORT_STATEMENT_0_FormatCode="react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PageHeader from '@/components/shared/page-header';
import type { CallRoutingRule, TwilioNumber } from '@/types';
import { AVAILABLE_AI_MODELS } from '@/types';
import { PlusCircle, Edit3, Trash2, Route, Clock, CalendarDays, Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock Twilio numbers for selection, in a real app this would come from a data source or state
const mockTwilioNumbers: Pick<TwilioNumber, 'id' | 'phoneNumber' | 'friendlyName'>[] = [
  { id: 'num_1', phoneNumber: '+12025550101', friendlyName: 'Main Support Line' },
  { id: 'num_2', phoneNumber: '+13015550102', friendlyName: 'Sales Inquiries' },
];

const initialMockRules: CallRoutingRule[] = [
  { 
    id: 'rule_1', 
    ruleName: 'Weekday Business Hours', 
    description: 'Route calls during business hours to Gemini Pro.',
    twilioNumberId: 'num_1', 
    timeStart: '09:00', 
    timeEnd: '17:00', 
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 
    targetAiModel: AVAILABLE_AI_MODELS[0].id 
  },
  { 
    id: 'rule_2', 
    ruleName: 'Weekend Support', 
    description: 'Route weekend calls to Claude.',
    twilioNumberId: 'num_1', 
    timeStart: '00:00', 
    timeEnd: '23:59', 
    daysOfWeek: ['Sat', 'Sun'], 
    targetAiModel: AVAILABLE_AI_MODELS[2].id
  },
  { 
    id: 'rule_3', 
    ruleName: 'Sales Evening Shift', 
    description: 'Evening calls for sales to ChatGPT.',
    twilioNumberId: 'num_2', 
    timeStart: '17:00', 
    timeEnd: '21:00', 
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 
    targetAiModel: AVAILABLE_AI_MODELS[1].id
  },
];

const DaysOfWeek: CallRoutingRule['daysOfWeek'] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const RoutingRuleCard: React.FC<{ rule: CallRoutingRule; onEdit: (rule: CallRoutingRule) => void; onDelete: (id: string) => void }> = ({ rule, onEdit, onDelete }) => {
  const twilioNumber = mockTwilioNumbers.find(n => n.id === rule.twilioNumberId);
  const aiModel = AVAILABLE_AI_MODELS.find(m => m.id === rule.targetAiModel);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Route className="mr-2 h-5 w-5 text-primary" />
              {rule.ruleName}
            </CardTitle>
            <CardDescription>{rule.description}</CardDescription>
          </div>
          {twilioNumber && <Badge variant="secondary">{twilioNumber.friendlyName}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          Time: <span className="font-medium text-foreground ml-1">{rule.timeStart} - {rule.timeEnd}</span>
        </div>
        <div className="flex items-center text-sm">
          <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
          Days: <span className="font-medium text-foreground ml-1">{rule.daysOfWeek.join(', ')}</span>
        </div>
        <div className="flex items-center text-sm">
          <Bot className="mr-2 h-4 w-4 text-muted-foreground" />
          AI Model: <span className="font-medium text-foreground ml-1">{aiModel?.name || 'N/A'}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(rule)}>
          <Edit3 className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(rule.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

const ManageRoutingRuleDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: CallRoutingRule) => void;
  ruleToEdit?: CallRoutingRule | null;
}> = ({ isOpen, onClose, onSave, ruleToEdit }) => {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [twilioNumberId, setTwilioNumberId] = useState('');
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [targetAiModel, setTargetAiModel] = useState('');

  useEffect(() => {
    if (ruleToEdit) {
      setRuleName(ruleToEdit.ruleName);
      setDescription(ruleToEdit.description);
      setTwilioNumberId(ruleToEdit.twilioNumberId);
      setTimeStart(ruleToEdit.timeStart);
      setTimeEnd(ruleToEdit.timeEnd);
      setSelectedDays(ruleToEdit.daysOfWeek);
      setTargetAiModel(ruleToEdit.targetAiModel);
    } else {
      // Reset for new rule
      setRuleName('');
      setDescription('');
      setTwilioNumberId(mockTwilioNumbers.length > 0 ? mockTwilioNumbers[0].id : '');
      setTimeStart('09:00');
      setTimeEnd('17:00');
      setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      setTargetAiModel(AVAILABLE_AI_MODELS.length > 0 ? AVAILABLE_AI_MODELS[0].id : '');
    }
  }, [ruleToEdit, isOpen]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (!ruleName || !twilioNumberId || !targetAiModel || selectedDays.length === 0) {
      alert("All fields are required, and at least one day must be selected.");
      return;
    }
    onSave({
      id: ruleToEdit?.id || `rule_${Date.now()}`,
      ruleName,
      description,
      twilioNumberId,
      timeStart,
      timeEnd,
      daysOfWeek: selectedDays as CallRoutingRule['daysOfWeek'],
      targetAiModel,
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{ruleToEdit ? 'Edit Call Routing Rule' : 'Add New Call Routing Rule'}</DialogTitle>
          <DialogDescription>
            {ruleToEdit ? 'Update the configuration for this routing rule.' : 'Define a new rule for routing incoming calls.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-1.5">
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input id="ruleName" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twilioNumberId">Twilio Number</Label>
            <Select value={twilioNumberId} onValueChange={setTwilioNumberId}>
              <SelectTrigger><SelectValue placeholder="Select Twilio Number" /></SelectTrigger>
              <SelectContent>
                {mockTwilioNumbers.map(num => (
                  <SelectItem key={num.id} value={num.id}>{num.friendlyName} ({num.phoneNumber})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="timeStart">Start Time</Label>
              <Input id="timeStart" type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timeEnd">End Time</Label>
              <Input id="timeEnd" type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Days of Week</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
              {DaysOfWeek.map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day}`} 
                    checked={selectedDays.includes(day)} 
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="text-sm font-normal cursor-pointer">{day}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="targetAiModel">Target AI Model</Label>
            <Select value={targetAiModel} onValueChange={setTargetAiModel}>
              <SelectTrigger><SelectValue placeholder="Select AI Model" /></SelectTrigger>
              <SelectContent>
                {AVAILABLE_AI_MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function RoutingPage() {
  const [rules, setRules] = useState<CallRoutingRule[]>(initialMockRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CallRoutingRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddNewRule = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule: CallRoutingRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleDeleteRule = (id: string) => {
     if (window.confirm("Are you sure you want to delete this routing rule?")) {
      setRules(prev => prev.filter(r => r.id !== id));
    }
  };
  
  const handleSaveRule = (rule: CallRoutingRule) => {
    if (editingRule) {
      setRules(prev => prev.map(r => (r.id === rule.id ? rule : r)));
    } else {
      setRules(prev => [rule, ...prev]);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Call Routing Configuration" description="Define rules to direct calls based on time, day, and other criteria." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Call Routing Configuration" 
        description="Define rules to direct calls based on time, day, and other criteria."
        actions={
          <Button onClick={handleAddNewRule}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Rule
          </Button>
        }
      />
      {rules.length === 0 ? (
        <Card className="text-center p-10">
          <CardTitle>No Routing Rules Defined</CardTitle>
          <CardDescription className="mt-2">Create routing rules to manage how incoming calls are handled.</CardDescription>
          <img src="https://placehold.co/400x300.png" alt="No rules" data-ai-hint="empty state illustration" className="mx-auto mt-6 rounded-md opacity-70" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {rules.map((rule) => (
            <RoutingRuleCard key={rule.id} rule={rule} onEdit={handleEditRule} onDelete={handleDeleteRule} />
          ))}
        </div>
      )}
      <ManageRoutingRuleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveRule}
        ruleToEdit={editingRule}
      />
    </div>
  );
}
