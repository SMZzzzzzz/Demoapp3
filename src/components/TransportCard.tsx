import React from 'react';
import { Truck, MapPin, Calendar, Package, MessageCircle } from 'lucide-react';
import { TransportOffer } from '@/types';

interface TransportCardProps {
  offer: TransportOffer;
  onChatClick: (offerId: string) => void;
}

export const TransportCard: React.FC<TransportCardProps> = ({ offer, onChatClick }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">運送空きあり</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          運送
        </span>
      </div>

      {/* 会社情報 */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900">{offer.company.name}</p>
        <p className="text-xs text-gray-500">{offer.company.contactPerson}</p>
      </div>

      {/* ルート情報 */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">配送ルート</span>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">{offer.fromPrefecture}</span>
            <div className="flex-1 mx-3 border-t border-dashed border-gray-300"></div>
            <span className="text-sm font-medium text-gray-900">{offer.toPrefecture}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">{offer.fromLocation}</span>
            <span className="text-xs text-gray-500">{offer.toLocation}</span>
          </div>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{formatDate(offer.availableDate)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{offer.capacity}トン</span>
        </div>
      </div>

      {/* 車両タイプ */}
      <div className="mb-4">
        <span className="text-xs font-medium text-gray-500">車両タイプ: </span>
        <span className="text-xs text-gray-900">{offer.vehicleType}</span>
      </div>

      {/* 備考 */}
      {offer.notes && (
        <div className="mb-4">
          <p className="text-xs text-gray-600">{offer.notes}</p>
        </div>
      )}

      {/* 商談ボタン */}
      <button
        onClick={() => onChatClick(offer.id)}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        <MessageCircle className="h-4 w-4" />
        <span>商談</span>
      </button>
    </div>
  );
}; 