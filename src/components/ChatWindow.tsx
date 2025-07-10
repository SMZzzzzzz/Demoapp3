import React, { useState, useRef, useEffect } from 'react';
import { Send, Check, X, ArrowLeft, Handshake } from 'lucide-react';
import { Chat, ChatMessage, TransportOffer, MaterialOffer } from '@/types';

interface ChatWindowProps {
  chat: Chat | null;
  offer: TransportOffer | MaterialOffer | null;
  currentUserId: string;
  onSendMessage: (message: string) => void;
  onComplete: () => void;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  offer,
  currentUserId,
  onSendMessage,
  onComplete,
  onClose,
}) => {
  const [message, setMessage] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    // 確認ダイアログの代わりにシンプルな確認
    if (window.confirm('この商談を成立させますか？\n成立後は取引が確定されます。')) {
      onComplete();
    }
    setIsCompleting(false);
  };

  if (!chat || !offer) {
    return null;
  }

  // より安全な otherParticipant の取得（重複ID対応）
  const otherParticipant = chat.participants.find(p => p.id !== currentUserId) || 
                          chat.participants.find(p => p.id !== chat.participants[0]?.id) ||
                          chat.participants[0];
  const isTransport = 'fromLocation' in offer;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {otherParticipant?.name || '相手企業'}との商談
              </h3>
              <p className="text-sm text-gray-500">
                {isTransport ? '運送空き' : '材料在庫'} - {
                  isTransport 
                    ? `${(offer as TransportOffer).fromPrefecture}→${(offer as TransportOffer).toPrefecture}`
                    : (offer as MaterialOffer).materialType
                }
              </p>
            </div>
          </div>
          {!chat.isMatched && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <Handshake className="h-4 w-4" />
              <span>{isCompleting ? '処理中...' : '成立'}</span>
            </button>
          )}
          {chat.isMatched && (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">取引成立済み</span>
            </div>
          )}
        </div>

        {/* オファー詳細 */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            <strong>案件詳細:</strong>
            {isTransport ? (
              <span className="ml-2">
                {(offer as TransportOffer).fromLocation} → {(offer as TransportOffer).toLocation} 
                ({(offer as TransportOffer).capacity}トン, {(offer as TransportOffer).vehicleType})
              </span>
            ) : (
              <span className="ml-2">
                {(offer as MaterialOffer).materialType} 
                ({(offer as MaterialOffer).quantity}{(offer as MaterialOffer).unit}, {(offer as MaterialOffer).quality})
              </span>
            )}
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'system'
                    ? 'bg-yellow-100 text-yellow-800 text-center text-sm'
                    : msg.senderId === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.type === 'message' && msg.senderId !== currentUserId && (
                  <p className="text-xs opacity-75 mb-1">{msg.senderName}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.type === 'system' ? 'text-yellow-600' :
                  msg.senderId === currentUserId ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        {!chat.isMatched && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="flex-1 resize-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-md transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 