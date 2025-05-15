
export interface TwilioNumber {
  id: string;
  phoneNumber: string;
  friendlyName: string;
  status: 'Active' | 'Inactive';
  dateAdded: string;
  assignedAiModel: string; // e.g. 'Gemini Pro'
}

export interface CallRoutingRule {
  id: string;
  ruleName: string;
  description: string;
  twilioNumberId: string; 
  timeStart: string; // HH:MM
  timeEnd: string; // HH:MM
  daysOfWeek: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  targetAiModel: string; 
}

export interface ActiveCall {
  id: string;
  callerId: string;
  status: 'Ringing' | 'In Progress' | 'On Hold' | 'Ended';
  duration: string; 
  currentAiModel: string;
  transcript: string;
  summary?: string;
  timestamp: Date;
}

export interface AiModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
}

export const AVAILABLE_AI_MODELS: AiModel[] = [
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', capabilities: ['Text Generation', 'Summarization'] },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', capabilities: ['Text Generation', 'Summarization', 'Translation'] },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', capabilities: ['Text Generation', 'Summarization', 'Analysis'] },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek', capabilities: ['Code Generation', 'Text Generation'] },
];

