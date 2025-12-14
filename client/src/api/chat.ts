const API_BASE = 'http://localhost:4000/api/chat';

export interface ChatResponse {
  response: string;
}

export interface ChatError {
  error: string;
}

export async function sendMessage(message: string, token: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/makeChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error: ChatError = await response.json();
    throw new Error(error.error || 'Failed to send message');
  }

  return response.json();
}

