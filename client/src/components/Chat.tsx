import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api/chat';
import AuthModal from './AuthModal';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  error?: boolean;
}

interface User {
  id: string;
  email: string;
  username: string | null;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
  const [unauthenticatedMessageSent, setUnauthenticatedMessageSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const handleAuthSuccess = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setAuthModalMode(null);
    setUnauthenticatedMessageSent(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setMessages([]);
    setUnauthenticatedMessageSent(false);
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const token = getToken();
    const isUnauthenticated = !token || !isAuthenticated;

    if (isUnauthenticated && unauthenticatedMessageSent) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (isUnauthenticated) {
      setUnauthenticatedMessageSent(true);
    }

    try {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const { response } = await sendMessage(trimmedInput, token);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: error instanceof Error ? error.message : 'Network error occurred',
        error: true,
      };
      
      setMessages((prev) => [...prev, errorMessage]);

      if (isUnauthenticated) {
        const systemMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: 'Sign in to continue chatting with Strict-AI.',
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isInputDisabled = isLoading || (!isAuthenticated && unauthenticatedMessageSent);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Fixed Header */}
      <header className="flex-shrink-0 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Strict-AI</h1>
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">
                {user.username || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalMode('login')}
                className="text-sm px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setAuthModalMode('signup')}
                className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </header>

      {authModalMode && (
        <AuthModal
          mode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Start a conversation with Strict-AI
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.role === 'system'
                  ? 'bg-yellow-900 text-yellow-100'
                  : message.error
                  ? 'bg-red-900 text-red-100'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-2 text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isInputDisabled}
            placeholder={isInputDisabled && !isAuthenticated ? "Sign in to continue..." : "Type your message..."}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isInputDisabled || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

