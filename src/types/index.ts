export interface Company {
  id: string;
  name: string;
  location: string;
  prefecture: string;
  contactPerson: string;
  phone: string;
  email: string;
  isActive: boolean;
  joinedAt: string;
}

export interface TransportOffer {
  id: string;
  companyId: string;
  company: Company;
  fromLocation: string;
  toLocation: string;
  fromPrefecture: string;
  toPrefecture: string;
  availableDate: string;
  capacity: number; // トン数
  vehicleType: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MaterialOffer {
  id: string;
  companyId: string;
  company: Company;
  materialType: string;
  materialCategory: 'steel' | 'iron' | 'aluminum' | 'copper' | 'other';
  quantity: number;
  unit: 'kg' | 'ton' | 'piece';
  quality: string;
  availableDate: string;
  expiryDate?: string;
  priceRange?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

export interface Chat {
  id: string;
  participants: Company[];
  relatedOfferId: string;
  offerType: 'transport' | 'material';
  status: 'active' | 'completed' | 'cancelled';
  isMatched: boolean;
  matchedAt?: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface MatchingResult {
  id: string;
  chatId: string;
  offerId: string;
  offerType: 'transport' | 'material';
  requesterCompany: Company;
  providerCompany: Company;
  matchedAt: string;
  value?: number; // 取引金額
  commission?: number; // 手数料
  status: 'pending' | 'completed' | 'cancelled';
}

export interface FilterOptions {
  prefecture?: string;
  materialCategory?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  capacity?: {
    min: number;
    max: number;
  };
  quantity?: {
    min: number;
    max: number;
  };
} 