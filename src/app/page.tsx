'use client';

import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Bell, Search } from 'lucide-react';
import { TransportCard } from '@/components/TransportCard';
import { MaterialCard } from '@/components/MaterialCard';
import { FilterPanel } from '@/components/FilterPanel';
import { ChatWindow } from '@/components/ChatWindow';
import { AdminDashboard } from '@/components/AdminDashboard';
import { 
  Company, 
  TransportOffer, 
  MaterialOffer, 
  Chat, 
  ChatMessage, 
  MatchingResult, 
  FilterOptions 
} from '@/types';
import { 
  companies, 
  transportOffers, 
  materialOffers, 
  chats as initialChats, 
  matchingResults as initialMatchingResults 
} from '@/data/sampleData';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  // State管理
  const [activeTab, setActiveTab] = useState<'transport' | 'material'>('transport');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentView, setCurrentView] = useState<'matching' | 'admin'>('matching');
  const [currentUserId] = useState('comp-001'); // 現在のユーザー（デモ用）
  const [selectedOffer, setSelectedOffer] = useState<(TransportOffer | MaterialOffer) | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>(initialMatchingResults);
  const [isLoading, setIsLoading] = useState(false);

  // フィルタリング処理
  const filteredTransportOffers = transportOffers.filter(offer => {
    if (filters.prefecture && offer.toPrefecture !== filters.prefecture) return false;
    if (filters.capacity?.min && offer.capacity < filters.capacity.min) return false;
    if (filters.dateRange?.start && offer.availableDate < filters.dateRange.start) return false;
    return true;
  });

  const filteredMaterialOffers = materialOffers.filter(offer => {
    if (filters.prefecture && offer.company.prefecture !== filters.prefecture) return false;
    if (filters.materialCategory && offer.materialCategory !== filters.materialCategory) return false;
    if (filters.quantity?.min && offer.quantity < filters.quantity.min) return false;
    if (filters.dateRange?.start && offer.availableDate < filters.dateRange.start) return false;
    return true;
  });

  // 商談開始
  const handleChatClick = (offerId: string) => {
    setIsLoading(true);
    
    // オファーを探す
    const offer = [...transportOffers, ...materialOffers].find(o => o.id === offerId);
    if (!offer) return;

    // 既存のチャットを確認
    const existingChat = chats.find(c => c.relatedOfferId === offerId);
    
    if (existingChat) {
      setActiveChat(existingChat);
      setSelectedOffer(offer);
    } else {
      // 新しいチャットを作成
      const currentCompany = companies.find(c => c.id === currentUserId);
      if (!currentCompany) return;

      const newChat: Chat = {
        id: uuidv4(),
        participants: [currentCompany, offer.company],
        relatedOfferId: offerId,
        offerType: 'fromLocation' in offer ? 'transport' : 'material',
        status: 'active',
        isMatched: false,
        messages: [{
          id: uuidv4(),
          chatId: '',
          senderId: 'system',
          senderName: 'システム',
          message: '商談が開始されました。お互いに詳細を確認し、条件を調整してください。',
          timestamp: new Date().toISOString(),
          type: 'system' as const
        }],
        createdAt: new Date().toISOString(),
      };

      setChats(prev => [...prev, newChat]);
      setActiveChat(newChat);
      setSelectedOffer(offer);
    }
    
    setIsLoading(false);
  };

  // メッセージ送信
  const handleSendMessage = (message: string) => {
    if (!activeChat) return;
    
    const currentCompany = companies.find(c => c.id === currentUserId);
    if (!currentCompany) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      chatId: activeChat.id,
      senderId: currentUserId,
      senderName: currentCompany.name,
      message,
      timestamp: new Date().toISOString(),
      type: 'message' as const
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));

    setActiveChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
  };

  // 商談成立
  const handleComplete = () => {
    if (!activeChat || !selectedOffer) return;

    const currentCompany = companies.find(c => c.id === currentUserId);
    const otherCompany = activeChat.participants.find(p => p.id !== currentUserId);
    if (!currentCompany || !otherCompany) return;

    // チャットを成立状態に更新
    const completedChat = {
      ...activeChat,
      isMatched: true,
      matchedAt: new Date().toISOString(),
      status: 'completed' as const,
      messages: [...activeChat.messages, {
        id: uuidv4(),
        chatId: activeChat.id,
        senderId: 'system',
        senderName: 'システム',
        message: '🎉 商談が成立しました！取引が確定されました。',
        timestamp: new Date().toISOString(),
        type: 'system' as const
      }]
    };

    // マッチング結果を作成
    const newMatchingResult: MatchingResult = {
      id: uuidv4(),
      chatId: activeChat.id,
      offerId: selectedOffer.id,
      offerType: 'fromLocation' in selectedOffer ? 'transport' : 'material',
      requesterCompany: currentCompany,
      providerCompany: otherCompany,
      matchedAt: new Date().toISOString(),
      value: 150000, // デモ用固定値
      commission: 15000, // デモ用固定値
      status: 'completed'
    };

    setChats(prev => prev.map(chat => chat.id === activeChat.id ? completedChat : chat));
    setMatchingResults(prev => [...prev, newMatchingResult]);
    setActiveChat(completedChat);
  };

  // チャットを閉じる
  const handleCloseChat = () => {
    setActiveChat(null);
    setSelectedOffer(null);
  };

  const currentCompany = companies.find(c => c.id === currentUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションヘッダー */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                鉄鋼バリューチェーン マッチングシステム
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView(currentView === 'matching' ? 'admin' : 'matching')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {currentView === 'matching' ? '管理画面' : 'マッチング'}
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{currentCompany?.name}</span>
                <LogOut className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 注意事項 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-r-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ■注意事項
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>データの作成や保存はできません。</li>
                  <li>仕様や実現性を保証するものではございません。</li>
                  <li>一部生成ＡＩを利用しております。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'matching' ? (
          <div>
            {/* フィルターパネル */}
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* カード一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'transport' ? (
                filteredTransportOffers.length > 0 ? (
                  filteredTransportOffers.map(offer => (
                    <TransportCard
                      key={offer.id}
                      offer={offer}
                      onChatClick={handleChatClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      条件に合う運送案件が見つかりません
                    </h3>
                    <p className="text-gray-500">
                      フィルター条件を変更してお試しください。
                    </p>
                  </div>
                )
              ) : (
                filteredMaterialOffers.length > 0 ? (
                  filteredMaterialOffers.map(offer => (
                    <MaterialCard
                      key={offer.id}
                      offer={offer}
                      onChatClick={handleChatClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      条件に合う材料案件が見つかりません
                    </h3>
                    <p className="text-gray-500">
                      フィルター条件を変更してお試しください。
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <AdminDashboard
            matchingResults={matchingResults}
            transportOffers={transportOffers}
            materialOffers={materialOffers}
          />
        )}
      </main>

      {/* チャットウィンドウ */}
      {activeChat && selectedOffer && (
        <ChatWindow
          chat={activeChat}
          offer={selectedOffer}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onComplete={handleComplete}
          onClose={handleCloseChat}
        />
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  );
} 