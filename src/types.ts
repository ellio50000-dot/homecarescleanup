export type ApplianceCategory = 
  | 'aircon' 
  | 'washer' 
  | 'dryer' 
  | 'purifier' 
  | 'dehumidifier' 
  | 'fridge';

export interface ApplianceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedMinutes: number;
  image: string;
}

export interface ApplianceInfo {
  id: ApplianceCategory;
  title: string;
  subtitle: string;
  iconName: string;
  heroImage: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  options: ApplianceOption[];
  processSteps: {
    title: string;
    description: string;
  }[];
  symptoms: string[];
  recommendedFrequency: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface BookingData {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetail: string;
  selectedItems: {
    applianceId: ApplianceCategory;
    optionId: string;
    optionName: string;
    applianceTitle: string;
    price: number;
    quantity: number;
  }[];
  additionalServices: string[];
  bookingDate: string;
  bookingTime: string;
  specialNotes?: string;
  totalOriginalPrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentMethod: 'onsite' | 'card' | 'kakaopay' | 'tosspay' | 'transfer';
  cardIssuer?: string;
  cardType?: string;
  cardNumberFormatted?: string;
  depositorName?: string;
  paymentStatus: 'paid' | 'pending';
  bookingStatus: 'confirmed' | 'assigned' | 'completed' | 'cancelled';
  assignedTechnician?: string;
  adminNotes?: string;
}

export interface Review {
  id: string;
  applianceId: ApplianceCategory;
  applianceName: string;
  author: string;
  phoneLastDigits: string;
  rating: number;
  date: string;
  content: string;
  region: string;
  photos?: string[];
  technicianReply?: string;
  isVerified: boolean;
}

export interface PartnerApplication {
  id: string;
  appliedAt: string;
  name: string;
  phone: string;
  age: string;
  region: string;
  experienceYears: string;
  hasVehicle: boolean;
  hasEquipment: boolean;
  motivation: string;
  status: 'received' | 'reviewing' | 'interview' | 'approved';
}
