import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, DesignResult } from '../types';
import { sendChatMessage } from '../services/api';

interface ChatAssistantDrawerProps {
  currentDesign: DesignResult | null;
  isOpen?: boolean;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const ChatAssistantDrawer: React.FC<ChatAssistantDrawerProps> = ({
  currentDesign,
  isStandalonePage = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: currentDesign
        ? `Hello! I'm your SmartRoom AI design consultant. I'm currently analyzing your ${currentDesign.dimensions} ${currentDesign.style} ${currentDesign.room_type} plan (${currentDesign.budget}). How can I help you refine this space?`
        : `Hello! I'm SmartRoom AI Assistant. You can ask me any question about room layouts, color palettes, lighting temperatures, budget planning, or space optimization.`,
      timestamp: 'Just now',
      actions: currentDesign
        ? [
            'Can you make this room cheaper?',
            'Which furniture should I remove?',
            'Can I change the wall color?',
            'Suggest better lighting.',
            'Make this room suitable for studying.',
            'Give me more storage ideas.',
          ]
        : [
            'How do I calculate ideal room lighting?',
            'Best furniture layouts for small bedrooms?',
            'How to choose a color palette?',
          ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(textToSend, currentDesign);
      const botMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: 'Now',
        actions: response.suggested_actions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue answering your question. Please try again.',
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'Can you make this room cheaper?',
    'Which furniture should I remove?',
    'Can I change the wall color?',
    'Suggest better lighting.',
    'Make this room suitable for studying.',
    'Give me more storage ideas.',
  ];

  return (
    <div className={`flex flex-col ${isStandalonePage ? 'h-[calc(100vh-140px)]' : 'h-full'}`}>
      {/* Top Banner with Active Context */}
      <div className="border-b border-stone-800 bg-stone-900/90 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-stone-950 shadow-md">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100">
                Ask SmartRoom AI
              </h2>
              <p className="text-xs text-stone-400">
                {currentDesign
                  ? `Active Design: ${currentDesign.style} ${currentDesign.room_type} (${currentDesign.dimensions})`
                  : 'Interior Space-Planning & Styling Assistant'}
              </p>
            </div>
          </div>

          {currentDesign && (
            <span className="hidden sm:inline-flex rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-medium text-amber-300 border border-stone-700/60">
              Budget: {currentDesign.budget}
            </span>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
            )}

            <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-stone-950 font-medium'
                    : 'border border-stone-800 bg-stone-900/90 text-stone-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>

              {/* Action Suggestion Chips if assistant */}
              {msg.sender === 'assistant' && msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(act)}
                      disabled={isLoading}
                      className="rounded-lg border border-stone-800 bg-stone-950/80 px-2.5 py-1 text-[11px] font-medium text-stone-400 hover:border-amber-500 hover:text-amber-300 transition-colors"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-stone-300">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-stone-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-xl border border-stone-800 bg-stone-900 px-4 py-2 text-stone-400">
              Analyzing spatial parameters and formulating expert recommendation...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="border-t border-stone-800/60 bg-stone-950/60 px-4 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-stone-400">Quick:</span>
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="rounded-lg border border-stone-800 bg-stone-900/70 px-2.5 py-1 text-xs text-stone-300 hover:border-amber-500/70 hover:text-amber-200 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="border-t border-stone-800 bg-stone-900 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about furniture placement, wall color, budget cuts, study space..."
            className="flex-1 rounded-xl border border-stone-700 bg-stone-950 px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-stone-950 shadow-md transition-all hover:bg-amber-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
