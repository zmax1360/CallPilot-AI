
'use client';

import type React from 'react';
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/shared/page-header';
import type { AiModel } from '@/types';
import { AVAILABLE_AI_MODELS } from '@/types';
import { Save, Bot, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GeneralSettings {
  defaultAiModel: string;
  enableCallRecording: boolean;
  sentimentAnalysis: boolean;
}

interface ApiKeySetting {
  modelId: string;
  apiKey: string;
}

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    defaultAiModel: AVAILABLE_AI_MODELS[0].id,
    enableCallRecording: true,
    sentimentAnalysis: false,
  });
  const [apiKeys, setApiKeys] = useState<ApiKeySetting[]>(
    AVAILABLE_AI_MODELS.map(model => ({ modelId: model.id, apiKey: '' }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching settings
    const timer = setTimeout(() => {
      // In a real app, load saved settings here
      // For demo, keep defaults or load from localStorage
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGeneralSettingChange = (key: keyof GeneralSettings, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApiKeyChange = (modelId: string, apiKey: string) => {
    setApiKeys(prev => 
      prev.map(ak => ak.modelId === modelId ? { ...ak, apiKey } : ak)
    );
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      // In a real app, save settings to backend/localStorage
      console.log("Settings saved:", { generalSettings, apiKeys });
      toast({
        title: "Settings Saved",
        description: "Your application settings have been updated.",
      });
      setIsSaving(false);
    }, 1500);
  };

  const selectedDefaultModel = AVAILABLE_AI_MODELS.find(m => m.id === generalSettings.defaultAiModel);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Application Settings" description="Configure AI models, API keys, and general application behavior." />
        <div className="space-y-6">
          <Card><CardHeader><Skeleton className="h-6 w-1/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/3 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <div className="flex justify-end"><Skeleton className="h-10 w-28" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader 
        title="Application Settings" 
        description="Configure AI models, API keys, and general application behavior."
      />
      <div className="space-y-8 max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Bot className="mr-2 h-5 w-5 text-primary" /> AI Model Configuration</CardTitle>
            <CardDescription>Select default AI models and manage specific model settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultAiModel">Default AI Model</Label>
              <Select 
                value={generalSettings.defaultAiModel} 
                onValueChange={(value) => handleGeneralSettingChange('defaultAiModel', value)}
              >
                <SelectTrigger id="defaultAiModel">
                  <SelectValue placeholder="Select default AI model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_AI_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>{model.name} ({model.provider})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This model will be used unless overridden by a routing rule.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full" defaultValue="api-keys">
              <AccordionItem value="api-keys">
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-primary" /> API Key Management
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                  {selectedDefaultModel && (
                    <div key={selectedDefaultModel.id} className="space-y-2 p-3 border rounded-md bg-secondary/30">
                      <Label htmlFor={`apiKey-${selectedDefaultModel.id}`}>{selectedDefaultModel.name} API Key</Label>
                      <Input 
                        id={`apiKey-${selectedDefaultModel.id}`} 
                        type="password"
                        value={apiKeys.find(ak => ak.modelId === selectedDefaultModel.id)?.apiKey || ''}
                        onChange={(e) => handleApiKeyChange(selectedDefaultModel.id, e.target.value)}
                        placeholder={`Enter API Key for ${selectedDefaultModel.provider}`}
                      />
                       <p className="text-xs text-muted-foreground">
                        API key for the selected default AI model: {selectedDefaultModel.name}.
                      </p>
                    </div>
                  )}
                  {!selectedDefaultModel && (
                    <p className="text-sm text-muted-foreground p-3 border rounded-md bg-secondary/30">
                      Select a default AI model above to configure its API key.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage overall application behavior and features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="enableCallRecording" className="font-medium">Enable Call Recording</Label>
                <p className="text-xs text-muted-foreground">Store recordings of all calls for quality assurance and review.</p>
              </div>
              <Switch 
                id="enableCallRecording" 
                checked={generalSettings.enableCallRecording}
                onCheckedChange={(checked) => handleGeneralSettingChange('enableCallRecording', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="sentimentAnalysis" className="font-medium">Enable Real-time Sentiment Analysis</Label>
                <p className="text-xs text-muted-foreground">Analyze caller sentiment during calls (requires compatible AI model).</p>
              </div>
              <Switch 
                id="sentimentAnalysis" 
                checked={generalSettings.sentimentAnalysis}
                onCheckedChange={(checked) => handleGeneralSettingChange('sentimentAnalysis', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveChanges} disabled={isSaving} className="min-w-[120px]">
            {isSaving ? (
              <Save className="mr-2 h-4 w-4 animate-pulse" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

