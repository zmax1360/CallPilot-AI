'use client';

import type React from 'react';
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/page-header';
import type { TwilioNumber } from '@/types';
import { AVAILABLE_AI_MODELS } from '@/types';
import { PlusCircle, Edit3, Trash2, PhoneForwarded, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const initialMockNumbers: TwilioNumber[] = [
  { id: 'num_1', phoneNumber: '+12025550101', friendlyName: 'Main Support Line', status: 'Active', dateAdded: '2023-05-15', assignedAiModel: AVAILABLE_AI_MODELS[0].id },
  { id: 'num_2', phoneNumber: '+13015550102', friendlyName: 'Sales Inquiries', status: 'Active', dateAdded: '2023-06-01', assignedAiModel: AVAILABLE_AI_MODELS[1].id },
  { id: 'num_3', phoneNumber: '+14105550103', friendlyName: 'After-Hours Support', status: 'Inactive', dateAdded: '2023-07-20', assignedAiModel: AVAILABLE_AI_MODELS[0].id },
];

const NumberCard: React.FC<{ number: TwilioNumber; onEdit: (number: TwilioNumber) => void; onDelete: (id: string) => void }> = ({ number, onEdit, onDelete }) => {
  const assignedModel = AVAILABLE_AI_MODELS.find(m => m.id === number.assignedAiModel);
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <PhoneForwarded className="mr-2 h-5 w-5 text-primary" />
              {number.friendlyName}
            </CardTitle>
            <CardDescription>{number.phoneNumber}</CardDescription>
          </div>
           <Badge variant={number.status === 'Active' ? 'default' : 'destructive'} className="capitalize">
            {number.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Date Added: {new Date(number.dateAdded).toLocaleDateString()}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1.5 text-primary"/> 
          AI Model: <span className="font-medium text-foreground ml-1">{assignedModel?.name || 'Not Assigned'}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(number)}>
          <Edit3 className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(number.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

const ManageNumberDialog: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (number: TwilioNumber) => void; 
  numberToEdit?: TwilioNumber | null;
}> = ({ isOpen, onClose, onSave, numberToEdit }) => {
  const [friendlyName, setFriendlyName] = useState(numberToEdit?.friendlyName || '');
  const [phoneNumber, setPhoneNumber] = useState(numberToEdit?.phoneNumber || '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(numberToEdit?.status || 'Active');
  const [assignedAiModel, setAssignedAiModel] = useState(numberToEdit?.assignedAiModel || AVAILABLE_AI_MODELS[0].id);

  useEffect(() => {
    if (numberToEdit) {
      setFriendlyName(numberToEdit.friendlyName);
      setPhoneNumber(numberToEdit.phoneNumber);
      setStatus(numberToEdit.status);
      setAssignedAiModel(numberToEdit.assignedAiModel);
    } else {
      // Reset for new number
      setFriendlyName('');
      setPhoneNumber('');
      setStatus('Active');
      setAssignedAiModel(AVAILABLE_AI_MODELS[0].id);
    }
  }, [numberToEdit, isOpen]);

  const handleSubmit = () => {
    // Basic validation
    if (!friendlyName || !phoneNumber) {
      alert("Friendly name and phone number are required.");
      return;
    }
    onSave({
      id: numberToEdit?.id || `num_${Date.now()}`, // Mock ID generation
      friendlyName,
      phoneNumber,
      status,
      dateAdded: numberToEdit?.dateAdded || new Date().toISOString().split('T')[0],
      assignedAiModel,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{numberToEdit ? 'Edit Twilio Number' : 'Add New Twilio Number'}</DialogTitle>
          <DialogDescription>
            {numberToEdit ? 'Update the details for this Twilio number.' : 'Enter the details for the new Twilio number.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="friendlyName" className="text-right">Friendly Name</Label>
            <Input id="friendlyName" value={friendlyName} onChange={(e) => setFriendlyName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
            <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" placeholder="+1XXXXXXXXXX" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'Active' | 'Inactive')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aiModel" className="text-right">AI Model</Label>
            <Select value={assignedAiModel} onValueChange={setAssignedAiModel}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
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
          <Button type="submit" onClick={handleSubmit}>Save Number</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function NumbersPage() {
  const [numbers, setNumbers] = useState<TwilioNumber[]>(initialMockNumbers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<TwilioNumber | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddNewNumber = () => {
    setEditingNumber(null);
    setIsDialogOpen(true);
  };

  const handleEditNumber = (number: TwilioNumber) => {
    setEditingNumber(number);
    setIsDialogOpen(true);
  };

  const handleDeleteNumber = (id: string) => {
    if (window.confirm("Are you sure you want to delete this number?")) {
      setNumbers(prev => prev.filter(num => num.id !== id));
    }
  };

  const handleSaveNumber = (number: TwilioNumber) => {
    if (editingNumber) {
      setNumbers(prev => prev.map(n => (n.id === number.id ? number : n)));
    } else {
      setNumbers(prev => [number, ...prev]);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Twilio Number Management" description="Manage your Twilio phone numbers and their configurations." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
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
        title="Twilio Number Management" 
        description="Manage your Twilio phone numbers and their configurations."
        actions={
          <Button onClick={handleAddNewNumber}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Number
          </Button>
        }
      />
      {numbers.length === 0 ? (
         <Card className="text-center p-10">
          <CardTitle>No Twilio Numbers</CardTitle>
          <CardDescription className="mt-2">You haven't added any Twilio numbers yet. Click "Add New Number" to get started.</CardDescription>
          <img src="https://placehold.co/400x300.png" alt="No numbers" data-ai-hint="empty state illustration" className="mx-auto mt-6 rounded-md opacity-70" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {numbers.map((num) => (
            <NumberCard key={num.id} number={num} onEdit={handleEditNumber} onDelete={handleDeleteNumber} />
          ))}
        </div>
      )}
      <ManageNumberDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveNumber}
        numberToEdit={editingNumber}
      />
    </div>
  );
}
