export interface Header {
  key: string;
  value: string;
}

export interface WebhookRequest {
  url: string;
  method: string;
  headers: Header[];
  body?: string;
}

export interface WebhookResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  request: WebhookRequest;
  response: WebhookResponse;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'webhook' | 'error';
  content: string;
  timestamp: string;
  status?: number;
  duration?: number;
}

export interface WebhookProfile {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: Header[];
  description?: string;
  color: string;
  createdAt: string;
}