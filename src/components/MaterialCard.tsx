import React from 'react';
import { Package2, Calendar, Scale, AlertCircle, MessageCircle } from 'lucide-react';
import { MaterialOffer } from '@/types';

interface MaterialCardProps {
  offer: MaterialOffer;
  onChatClick: (offerId: string) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ offer, onChatClick }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'steel': return 'bg-gray-100 text-gray-800';
      case 'iron': return 'bg-red-100 text-red-800';
      case 'aluminum': return 'bg-blue-100 text-blue-800';
      case 'copper': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'steel': return '鋼材';
      case 'iron': return '鉄材';
      case 'aluminum': return 'アルミ';
      case 'copper': return '銅材';
      default: return 'その他';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Package2 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">材料在庫あり</h3>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getCategoryColor(offer.materialCategory)}`}>
          {getCategoryName(offer.materialCategory)}
        </span>
      </div>

      {/* 会社情報 */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900">{offer.company.name}</p>
        <p className="text-xs text-gray-500">{offer.company.contactPerson}</p>
      </div>

      {/* 材料情報 */}
      <div className="mb-4">
        <div className="bg-green-50 rounded-md p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">{offer.materialType}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">品質: </span>
              <span className="text-gray-900 font-medium">{offer.quality}</span>
            </div>
            <div>
              <span className="text-gray-500">数量: </span>
              <span className="text-gray-900 font-medium">{offer.quantity} {offer.unit}</span>
            </div>
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
          <Scale className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">即日対応</span>
        </div>
      </div>

      {/* 価格帯 */}
      {offer.priceRange && (
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-500">価格帯: </span>
          <span className="text-xs text-gray-900">{offer.priceRange}</span>
        </div>
      )}

      {/* 有効期限 */}
      {offer.expiryDate && (
        <div className="mb-4 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-xs text-gray-600">
            有効期限: {formatDate(offer.expiryDate)}
          </span>
        </div>
      )}

      {/* 備考 */}
      {offer.notes && (
        <div className="mb-4">
          <p className="text-xs text-gray-600">{offer.notes}</p>
        </div>
      )}

      {/* 商談ボタン */}
      <button
        onClick={() => onChatClick(offer.id)}
        className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        <MessageCircle className="h-4 w-4" />
        <span>商談</span>
      </button>
    </div>
  );
}; 