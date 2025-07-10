import React from 'react';
import { BarChart, TrendingUp, Users, DollarSign, Package, Truck, Calendar, Eye } from 'lucide-react';
import { MatchingResult, TransportOffer, MaterialOffer } from '@/types';

interface AdminDashboardProps {
  matchingResults: MatchingResult[];
  transportOffers: TransportOffer[];
  materialOffers: MaterialOffer[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  matchingResults,
  transportOffers,
  materialOffers,
}) => {
  // 統計計算
  const totalOffers = transportOffers.length + materialOffers.length;
  const completedMatches = matchingResults.filter(m => m.status === 'completed').length;
  const matchingRate = totalOffers > 0 ? (completedMatches / totalOffers * 100).toFixed(1) : '0';
  const totalCommission = matchingResults
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.commission || 0), 0);
  const totalValue = matchingResults
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.value || 0), 0);

  // 今月の統計
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthMatches = matchingResults.filter(m => {
    const matchDate = new Date(m.matchedAt);
    return matchDate.getMonth() === currentMonth && matchDate.getFullYear() === currentYear;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'pending': return '進行中';
      case 'cancelled': return 'キャンセル';
      default: return '不明';
    }
  };

  const getOfferTypeText = (type: string) => {
    return type === 'transport' ? '運送' : '材料';
  };

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-2">
          <BarChart className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">管理ダッシュボード</h1>
        </div>
        <p className="text-gray-600">鉄鋼バリューチェーン マッチングシステムの運営状況</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 総マッチング件数 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総マッチング件数</p>
              <p className="text-2xl font-bold text-gray-900">{completedMatches}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">今月: {thisMonthMatches.length}件</span>
          </div>
        </div>

        {/* マッチング率 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">マッチング率</p>
              <p className="text-2xl font-bold text-gray-900">{matchingRate}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">総案件数: {totalOffers}件</span>
          </div>
        </div>

        {/* 取引総額 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">取引総額</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">手数料総額: {formatCurrency(totalCommission)}</span>
          </div>
        </div>

        {/* アクティブ案件数 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">アクティブ案件</p>
              <p className="text-2xl font-bold text-gray-900">{totalOffers}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex space-x-4">
            <span className="text-sm text-gray-500">運送: {transportOffers.length}</span>
            <span className="text-sm text-gray-500">材料: {materialOffers.length}</span>
          </div>
        </div>
      </div>

      {/* マッチング実績一覧 */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">マッチング実績一覧</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>最新50件</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  成立日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  案件種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  要求企業
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  提供企業
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  取引金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  手数料
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詳細
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matchingResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    マッチング実績がありません
                  </td>
                </tr>
              ) : (
                matchingResults.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(match.matchedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        {match.offerType === 'transport' ? (
                          <Truck className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4 text-green-500" />
                        )}
                        <span>{getOfferTypeText(match.offerType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.requesterCompany.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.providerCompany.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.value ? formatCurrency(match.value) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.commission ? formatCurrency(match.commission) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(match.status)}`}>
                        {getStatusText(match.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 