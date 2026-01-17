
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CONVERSATIONS } from '../constants';
import { Conversation, ChatMessage } from '../types';
import { generateShelterResponse } from '../lib/gemini';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = ['All', 'Unread', 'Archived'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const filteredConversations = conversations.filter(msg => {
    const matchesTab = activeTab === 'All' || (activeTab === 'Unread' && msg.isUnread);
    const matchesSearch = msg.shelterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.petName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChat = {
      ...selectedChat,
      lastMessage: newMessage,
      time: 'Just now',
      isUnread: false,
      messages: [...selectedChat.messages, userMsg]
    };

    setSelectedChat(updatedChat);
    setConversations(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI Response from Shelter using OpenRouter (via lib/gemini)
    try {
      const responseText = await generateShelterResponse(
        selectedChat.shelterName,
        selectedChat.petName,
        selectedChat.petBreed,
        userMsg.text,
        "Active outdoor enthusiast. I hike every weekend and love high-energy dogs."
      );

      const shelterMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'shelter',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      const chatWithResponse = {
        ...updatedChat,
        lastMessage: shelterMsg.text,
        messages: [...updatedChat.messages, shelterMsg]
      };

      setSelectedChat(chatWithResponse);
      setConversations(prev => prev.map(c => c.id === chatWithResponse.id ? chatWithResponse : c));
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const openChat = (chat: Conversation) => {
    // Mark as read when opening
    const updated = { ...chat, isUnread: false };
    setConversations(prev => prev.map(c => c.id === chat.id ? updated : c));
    setSelectedChat(updated);
  };

  if (selectedChat) {
    return (
      <div className="flex flex-col h-screen bg-white animate-slideInRight relative z-[100]">
        {/* Chat Header */}
        <header className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0">
          <button onClick={() => setSelectedChat(null)} className="size-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-900">arrow_back_ios_new</span>
          </button>
          <div className="size-10 rounded-full overflow-hidden border border-gray-100">
            <img src={selectedChat.shelterLogo} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate text-sm">{selectedChat.shelterName}</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Regarding {selectedChat.petName}</p>
          </div>
          <button className="size-10 bg-background-light rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400">more_vert</span>
          </button>
        </header>

        {/* Messages Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-slate-50/30">
          <div className="flex justify-center">
            <div className="bg-white px-4 py-1.5 rounded-full border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
              Chatting about {selectedChat.petName}
            </div>
          </div>

          {selectedChat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm relative ${msg.sender === 'user'
                ? 'bg-slate-900 text-white rounded-tr-none'
                : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'
                }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[8px] font-bold mt-1 block opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                <div className="size-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="size-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="size-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-100 flex gap-3 pb-24">
          <div className="flex-1 h-14 bg-background-light rounded-2xl px-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400">sentiment_satisfied</span>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            className="size-14 bg-primary rounded-2xl flex items-center justify-center text-slate-900 shadow-lg active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined filled">send</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-5 pt-4 pb-2 flex justify-between items-center">
        <button
          onClick={() => navigate('/profile')}
          className="size-10 flex items-center justify-center bg-background-light rounded-xl transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <h2 className="font-bold text-xl text-slate-900">Messages</h2>
        <div className="size-10"></div> {/* Spacer to keep title centered if needed, or just remove if flex-between handles it. Flex-between with 3 items centers middle if sides are equal. keeping spacer or empty div ensures alignment */}
      </header>

      {/* Search */}
      <div className="px-5 mt-4">
        <div className="flex h-12 bg-background-light rounded-2xl items-center px-4 gap-3">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search pets or shelters"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 mt-6 border-b border-gray-100 gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold tracking-wide transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-gray-400'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <main className="flex-1 mt-2 pb-24">
        {filteredConversations.length > 0 ? filteredConversations.map((msg) => (
          <div
            key={msg.id}
            onClick={() => openChat(msg)}
            className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="relative shrink-0">
              <div className="size-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                <img src={msg.shelterLogo} alt={msg.shelterName} className="w-full h-full object-cover" />
              </div>
              {msg.isUnread && (
                <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className={`text-sm truncate ${msg.isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                  {msg.shelterName}
                </h4>
                <span className={`text-[10px] shrink-0 ${msg.isUnread ? 'text-primary font-bold' : 'text-gray-400'}`}>
                  {msg.time}
                </span>
              </div>
              <p className={`text-xs truncate mb-0.5 ${msg.isUnread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                {msg.lastMessage}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[10px] text-primary filled">pets</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {msg.petName} • ID: {msg.petId}
                </p>
              </div>
            </div>

            <div className="shrink-0 ml-1">
              <span className="material-symbols-outlined text-gray-200 text-lg group-hover:text-primary transition-colors">chevron_right</span>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center gap-4 opacity-40">
            <span className="material-symbols-outlined text-6xl">forum</span>
            <p className="font-bold">No messages found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
