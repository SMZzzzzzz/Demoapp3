import React from 'react';
import { Filter, Search, Calendar, MapPin, Package } from 'lucide-react';
import { FilterOptions } from '@/types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  activeTab: 'transport' | 'material';
  onTabChange: (tab: 'transport' | 'material') => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  activeTab, 
  onTabChange 
}) => {
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const materialCategories = [
    { value: 'steel', label: '鋼材' },
    { value: 'iron', label: '鉄材' },
    { value: 'aluminum', label: 'アルミ' },
    { value: 'copper', label: '銅材' },
    { value: 'other', label: 'その他' },
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      {/* タブ切り替え */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => onTabChange('transport')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transport'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>運送空き</span>
        </button>
        <button
          onClick={() => onTabChange('material')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'material'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>材料在庫</span>
        </button>
      </div>

      {/* フィルターヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">絞り込み条件</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          クリア
        </button>
      </div>

      {/* フィルター内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 都道府県 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'transport' ? '目的地' : '所在地'}
          </label>
          <select
            value={filters.prefecture || ''}
            onChange={(e) => handleFilterChange('prefecture', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべて</option>
            {prefectures.map(prefecture => (
              <option key={prefecture} value={prefecture}>{prefecture}</option>
            ))}
          </select>
        </div>

        {/* 材料カテゴリ（材料タブのみ） */}
        {activeTab === 'material' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              材料種別
            </label>
            <select
              value={filters.materialCategory || ''}
              onChange={(e) => handleFilterChange('materialCategory', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">すべて</option>
              {materialCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* 日付範囲 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            利用可能日
          </label>
          <input
            type="date"
            value={filters.dateRange?.start || ''}
            onChange={(e) => handleFilterChange('dateRange', {
              ...filters.dateRange,
              start: e.target.value,
              end: filters.dateRange?.end || ''
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 容量/数量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'transport' ? '最小容量(トン)' : '最小数量'}
          </label>
          <input
            type="number"
            value={activeTab === 'transport' ? (filters.capacity?.min || '') : (filters.quantity?.min || '')}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : undefined;
              if (activeTab === 'transport') {
                handleFilterChange('capacity', {
                  ...filters.capacity,
                  min: value
                });
              } else {
                handleFilterChange('quantity', {
                  ...filters.quantity,
                  min: value
                });
              }
            }}
            placeholder="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}; 