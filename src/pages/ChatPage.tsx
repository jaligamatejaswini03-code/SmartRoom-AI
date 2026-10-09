import React from 'react';
import { ChatAssistantDrawer } from '../components/ChatAssistantDrawer';
import { DesignResult } from '../types';

interface ChatPageProps {
  currentDesign: DesignResult | null;
}

export const ChatPage: React.FC<ChatPageProps> = ({ currentDesign }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60 shadow-2xl">
        <ChatAssistantDrawer currentDesign={currentDesign} isStandalonePage={true} />
      </div>
    </div>
  );
};
