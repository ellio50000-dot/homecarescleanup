import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingData, Review, PartnerApplication } from '../types';

export interface MainBannerData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgImage?: string;
}

export interface BeforeAfterWorkCase {
  id: string;
  category: string; // e.g., '벽걸이 에어컨', '스탠드 에어컨', '시스템 1Way', '시스템 2Way', '시스템 4Way', '360도 시스템', '세탁기', '건조기', '냉장고', '공기청정기', '제습기'
  title: string;
  beforeImage?: string;
  afterImage?: string;
  beforePoints: string[];
  afterPoints: string[];
  location?: string;
  brand?: string;
  workDate?: string;
  order: number;
  altText?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPinned: boolean;
}

export interface JobPosting {
  id: string;
  title: string;
  region: string;
  payType: string;
  requirements: string;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface ServicePriceConfig {
  id: string;
  applianceId: string;
  optionId: string;
  name: string;
  price: number;
  originalPrice: number;
  isRecommended: boolean;
  isDiscounted: boolean;
  discountLabel?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  adminUser: string;
  ip: string;
}

export interface DeletedPhotoItem {
  id: string;
  category: string;
  title: string;
  dataUrl: string;
  deletedAt: string;
}

export interface CMSData {
  banner: MainBannerData;
  beforeAfterCases: BeforeAfterWorkCase[];
  reviews: Review[];
  prices: ServicePriceConfig[];
  notices: NoticeItem[];
  jobPostings: JobPosting[];
  bookings: BookingData[];
  partnerApplications: PartnerApplication[];
  auditLogs: AuditLog[];
  trashPhotos: DeletedPhotoItem[];
}

interface CMSContextType {
  cmsData: CMSData;
  updateBanner: (banner: Partial<MainBannerData>) => void;
  // Before/After Photo CRUD
  addBeforeAfterCase: (item: Omit<BeforeAfterWorkCase, 'id' | 'order'>) => void;
  updateBeforeAfterCase: (id: string, item: Partial<BeforeAfterWorkCase>) => void;
  deleteBeforeAfterCase: (id: string) => void;
  reorderBeforeAfterCases: (newCases: BeforeAfterWorkCase[]) => void;
  // Reviews CRUD
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (id: string, review: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  // Price Config
  updatePriceConfig: (optionId: string, updates: Partial<ServicePriceConfig>) => void;
  // Notices CRUD
  addNotice: (notice: Omit<NoticeItem, 'id' | 'createdAt'>) => void;
  updateNotice: (id: string, updates: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  // Job Postings CRUD
  addJobPosting: (job: Omit<JobPosting, 'id' | 'createdAt'>) => void;
  updateJobPosting: (id: string, updates: Partial<JobPosting>) => void;
  deleteJobPosting: (id: string) => void;
  // Booking Management
  addBooking: (booking: BookingData) => void;
  updateBookingStatus: (id: string, status: BookingData['bookingStatus'], notes?: string) => void;
  assignTechnician: (id: string, technicianName: string) => void;
  deleteBooking: (id: string) => void;
  // Partner Applications
  updatePartnerApplicationStatus: (id: string, status: PartnerApplication['status']) => void;
  deletePartnerApplication: (id: string) => void;
  // Backup & Restore
  exportCMSData: () => void;
  importCMSData: (jsonString: string) => boolean;
  restoreTrashPhoto: (photoId: string) => void;
  // Log Action
  addAuditLog: (action: string) => void;
}

const DEFAULT_CATEGORIES = [
  '벽걸이 에어컨',
  '스탠드 에어컨',
  '시스템 1Way',
  '시스템 4Way',
  '세탁기',
  '건조기',
  '공기청정기',
  '제습기',
  '냉장고'
];

const INITIAL_WORK_CASES_DATA = [
  {
    category: '벽걸이 에어컨',
    title: '벽걸이 에어컨 송풍팬(블로워팬) 완전분해 세척',
    partName: '송풍팬(블로워팬) 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['송풍팬 검은 곰팡이', '시큼한 악취', '드레인 먼지'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '스탠드 에어컨',
    title: '스탠드 에어컨 열교환기(냉각핀) 고압세척',
    partName: '열교환기(냉각핀) 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['열교환기 곰팡이', '바람세기 저하', '먼지 누적'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '시스템 1Way',
    title: '시스템 1Way 드레인팬 및 송풍팬 세척',
    partName: '드레인팬 및 송풍팬 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['드레인판 물때', '천장부 유해균', '바람 악취'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '시스템 4Way',
    title: '시스템 4Way 내부 분해 고압 세척',
    partName: '내부 종합 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['4면 송풍구 기름때', '열교환기 오염', '전기세 증가'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '세탁기',
    title: '세탁기 세탁조(스텐튜브) 완전분해',
    partName: '세탁조(스텐튜브) 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['세탁조 뒤 곰팡이', '세제 찌꺼기', '빨래 이물질'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '건조기',
    title: '의류건조기 콘덴서 및 팬 정밀세척',
    partName: '콘덴서 및 팬 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['보풀 먼지 누적', '건조 효율 저하', '습기 악취'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '공기청정기',
    title: '공기청정기 필터 및 내부 분해세척',
    partName: '필터 및 내부 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['팬 미세먼지 착착', '센서 측정 오류', '바람 저하'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '제습기',
    title: '제습기 열교환기 및 물통 소독세척',
    partName: '열교환기 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['물통 바이오필름', '냉각핀 곰팡이', '꿉꿉한 바람'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
  {
    category: '냉장고',
    title: '냉장고 냉각팬 및 내부 위생 소독',
    partName: '냉각팬 및 내부 분해 전후',
    beforeImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop',
    beforePoints: ['선반 음식물 얼룩', '고무패킹 곰팡이', '음식 악취'],
    afterPoints: ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
  },
];

const DEFAULT_BEFORE_AFTER_CASES: BeforeAfterWorkCase[] = INITIAL_WORK_CASES_DATA.map((item, idx) => ({
  id: `case-${idx + 1}`,
  category: item.category,
  title: item.title,
  beforeImage: item.beforeImage,
  afterImage: item.afterImage,
  beforePoints: item.beforePoints,
  afterPoints: item.afterPoints,
  location: '서울/경기/전북/전국',
  brand: '삼성·LG·캐리어·위니아 등',
  workDate: '2026-08-01',
  order: idx + 1,
  altText: `홈케어스 클린업 ${item.category} 실제 작업 전후 사진`,
}));

const DEFAULT_BANNER: MainBannerData = {
  title: '100% 완전분해 세척 · 유해균 99.9% 퇴치',
  subtitle: '삼성·LG 출신 10년 경력 베테랑 마스터 직영 방문 서비스',
  buttonText: '실시간 3초 즉시 예약',
  buttonLink: '#booking',
};

const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'notice-1',
    title: '2026년 에어컨·세탁기 얼리버드 세척 할인 이벤트 안내',
    content: '여름 성수기 사전 예약 고객 대상 2만원 즉시 할인 패키지 혜택을 제공합니다.',
    author: '홈케어스 본사',
    createdAt: '2026-07-25',
    isPinned: true,
  },
  {
    id: 'notice-2',
    title: '친환경 세제 및 140도 고온 스팀 살균 표준 공정 적용',
    content: '아이와 반려동물이 있는 가정도 안심하고 이용할 수 있는 친환경 국산 세제를 전 현장에 적용합니다.',
    author: '품질관리팀',
    createdAt: '2026-07-20',
    isPinned: false,
  },
];

const DEFAULT_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: '수도권/전북 지역 가전 케어 마스터 엔지니어 채용',
    region: '서울, 경기, 전북 전주/익산/군산',
    payType: '건당 최상위 수수료 지급 (월 500만~800만 가능)',
    requirements: '운전면허 보유자, 가전 분해 세척 경력자 우대 (초보자 본사 교육 제공)',
    status: 'active',
    createdAt: '2026-07-15',
  },
];

const DEFAULT_PRICES: ServicePriceConfig[] = [
  { id: 'p1', applianceId: 'aircon', optionId: 'ac-wall', name: '벽걸이 에어컨', price: 80000, originalPrice: 100000, isRecommended: false, isDiscounted: true, discountLabel: '20% 할인' },
  { id: 'p2', applianceId: 'aircon', optionId: 'ac-stand', name: '스탠드 에어컨', price: 140000, originalPrice: 160000, isRecommended: true, isDiscounted: true, discountLabel: '최고 인기' },
  { id: 'p3', applianceId: 'aircon', optionId: 'ac-2in1', name: '2in1 패키지 (스탠드+벽걸이)', price: 210000, originalPrice: 260000, isRecommended: true, isDiscounted: true, discountLabel: '강력 추천 5만원 할인' },
  { id: 'p4', applianceId: 'aircon', optionId: 'ac-sys-1way', name: '천장형 시스템 에어컨 (1Way)', price: 110000, originalPrice: 120000, isRecommended: false, isDiscounted: true, discountLabel: '2대 이상 할인' },
  { id: 'p5', applianceId: 'washer', optionId: 'wash-drum', name: '드럼 세탁기', price: 150000, originalPrice: 170000, isRecommended: true, isDiscounted: true, discountLabel: '인기' },
  { id: 'p6', applianceId: 'washer', optionId: 'wash-top', name: '통돌이 세탁기', price: 90000, originalPrice: 110000, isRecommended: false, isDiscounted: true, discountLabel: '할인' },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    applianceId: 'aircon',
    applianceName: '2in1 에어컨 완전분해 세척',
    author: '김*현',
    phoneLastDigits: '8923',
    rating: 5,
    date: '2026-07-29',
    content: '에어컨 켤 때마다 시큼한 곰팡이 냄새 때문에 머리가 아팠는데, 기사님이 부품 하나하나 다 분해해서 고압으로 씻어주시는 것 보고 감탄했습니다. 냄새 싹 사라지고 새 에어컨 됐어요!',
    region: '서울 강남구',
    isVerified: true,
    technicianReply: '안녕하세요 고객님! 홈케어스 클린업입니다. 만족해 주셔서 감사합니다. 깨끗한 바람으로 시원한 여름 보내세요!',
  },
  {
    id: 'rev-2',
    applianceId: 'washer',
    applianceName: '드럼 세탁기 완전분해 세척',
    author: '이*진',
    phoneLastDigits: '3482',
    rating: 5,
    date: '2026-07-28',
    content: '아기 빨래에서 까만 먼지 부스러기가 나와서 신청했는데, 세탁조 뒤에 때가 장난이 아니더라고요. 말끔하게 살균 소독해주셔서 이제 안심하고 아기 옷 빨래합니다.',
    region: '경기 분당구',
    isVerified: true,
  },
];

const INITIAL_CMS_DATA: CMSData = {
  banner: DEFAULT_BANNER,
  beforeAfterCases: DEFAULT_BEFORE_AFTER_CASES,
  reviews: DEFAULT_REVIEWS,
  prices: DEFAULT_PRICES,
  notices: DEFAULT_NOTICES,
  jobPostings: DEFAULT_JOBS,
  bookings: [],
  partnerApplications: [],
  auditLogs: [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      action: '시스템 최초 초기화 및 CMS 데이터 로드 완료',
      adminUser: 'super_admin',
      ip: '127.0.0.1 (보안 연결)',
    },
  ],
  trashPhotos: [],
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    const stored = localStorage.getItem('homecares_cms_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_CMS_DATA,
          ...parsed,
          banner: { ...DEFAULT_BANNER, ...(parsed.banner || {}) },
          beforeAfterCases: parsed.beforeAfterCases && parsed.beforeAfterCases.length > 0 ? parsed.beforeAfterCases : DEFAULT_BEFORE_AFTER_CASES,
          prices: parsed.prices && parsed.prices.length > 0 ? parsed.prices : DEFAULT_PRICES,
          notices: parsed.notices || DEFAULT_NOTICES,
          jobPostings: parsed.jobPostings || DEFAULT_JOBS,
          reviews: parsed.reviews || DEFAULT_REVIEWS,
        };
      } catch (e) {
        console.error('Failed to parse CMS data from localStorage:', e);
      }
    }
    return INITIAL_CMS_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('homecares_cms_data', JSON.stringify(cmsData));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }
  }, [cmsData]);

  const addAuditLog = (action: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      adminUser: 'admin_master',
      ip: '127.0.0.1 (HTTPS)',
    };
    setCmsData((prev) => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs].slice(0, 100),
    }));
  };

  const updateBanner = (bannerUpdates: Partial<MainBannerData>) => {
    setCmsData((prev) => ({
      ...prev,
      banner: { ...prev.banner, ...bannerUpdates },
    }));
    addAuditLog('메인 배너 문구 및 이미지 업데이트');
  };

  // Before / After Cases
  const addBeforeAfterCase = (item: Omit<BeforeAfterWorkCase, 'id' | 'order'>) => {
    const newCase: BeforeAfterWorkCase = {
      ...item,
      id: `case-${Date.now()}`,
      order: cmsData.beforeAfterCases.length + 1,
    };
    setCmsData((prev) => ({
      ...prev,
      beforeAfterCases: [...prev.beforeAfterCases, newCase],
    }));
    addAuditLog(`작업 전후 사례 추가: ${item.title} (${item.category})`);
  };

  const updateBeforeAfterCase = (id: string, updates: Partial<BeforeAfterWorkCase>) => {
    setCmsData((prev) => ({
      ...prev,
      beforeAfterCases: prev.beforeAfterCases.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
    addAuditLog(`작업 전후 사례 수정 ID: ${id}`);
  };

  const deleteBeforeAfterCase = (id: string) => {
    const target = cmsData.beforeAfterCases.find((c) => c.id === id);
    if (target && (target.beforeImage || target.afterImage)) {
      const trashItem: DeletedPhotoItem = {
        id: `trash-${Date.now()}`,
        category: target.category,
        title: target.title,
        dataUrl: target.beforeImage || target.afterImage || '',
        deletedAt: new Date().toISOString(),
      };
      setCmsData((prev) => ({
        ...prev,
        trashPhotos: [trashItem, ...prev.trashPhotos],
      }));
    }

    setCmsData((prev) => ({
      ...prev,
      beforeAfterCases: prev.beforeAfterCases.filter((item) => item.id !== id),
    }));
    addAuditLog(`작업 전후 사례 삭제 ID: ${id}`);
  };

  const reorderBeforeAfterCases = (newCases: BeforeAfterWorkCase[]) => {
    const updated = newCases.map((c, i) => ({ ...c, order: i + 1 }));
    setCmsData((prev) => ({ ...prev, beforeAfterCases: updated }));
    addAuditLog('작업 전후 사례 순서 변경');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
    };
    setCmsData((prev) => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
    }));
    addAuditLog(`고객 방문후기 직접 등록: ${reviewData.author}`);
  };

  const updateReview = (id: string, updates: Partial<Review>) => {
    setCmsData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
    addAuditLog(`방문후기 수정 ID: ${id}`);
  };

  const deleteReview = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
    }));
    addAuditLog(`방문후기 삭제 ID: ${id}`);
  };

  // Price config
  const updatePriceConfig = (optionId: string, updates: Partial<ServicePriceConfig>) => {
    setCmsData((prev) => ({
      ...prev,
      prices: prev.prices.map((p) => (p.optionId === optionId ? { ...p, ...updates } : p)),
    }));
    addAuditLog(`서비스 가격 정보 변경 OptionID: ${optionId}`);
  };

  // Notices
  const addNotice = (notice: Omit<NoticeItem, 'id' | 'createdAt'>) => {
    const newItem: NoticeItem = {
      ...notice,
      id: `notice-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCmsData((prev) => ({ ...prev, notices: [newItem, ...prev.notices] }));
    addAuditLog(`공지사항 작성: ${notice.title}`);
  };

  const updateNotice = (id: string, updates: Partial<NoticeItem>) => {
    setCmsData((prev) => ({
      ...prev,
      notices: prev.notices.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
    addAuditLog(`공지사항 수정 ID: ${id}`);
  };

  const deleteNotice = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      notices: prev.notices.filter((n) => n.id !== id),
    }));
    addAuditLog(`공지사항 삭제 ID: ${id}`);
  };

  // Job postings
  const addJobPosting = (job: Omit<JobPosting, 'id' | 'createdAt'>) => {
    const newJob: JobPosting = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCmsData((prev) => ({ ...prev, jobPostings: [newJob, ...prev.jobPostings] }));
    addAuditLog(`기사 채용공고 작성: ${job.title}`);
  };

  const updateJobPosting = (id: string, updates: Partial<JobPosting>) => {
    setCmsData((prev) => ({
      ...prev,
      jobPostings: prev.jobPostings.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    }));
    addAuditLog(`채용공고 수정 ID: ${id}`);
  };

  const deleteJobPosting = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      jobPostings: prev.jobPostings.filter((j) => j.id !== id),
    }));
    addAuditLog(`채용공고 삭제 ID: ${id}`);
  };

  // Booking
  const addBooking = (booking: BookingData) => {
    setCmsData((prev) => ({
      ...prev,
      bookings: [booking, ...prev.bookings],
    }));
    addAuditLog(`신규 예약 수신: ${booking.id} (${booking.customerName})`);
  };

  const updateBookingStatus = (id: string, status: BookingData['bookingStatus'], notes?: string) => {
    setCmsData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === id ? { ...b, bookingStatus: status, adminNotes: notes ?? b.adminNotes } : b
      ),
    }));
    addAuditLog(`예약 상태 변경 ${id} -> ${status}`);
  };

  const assignTechnician = (id: string, technicianName: string) => {
    setCmsData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === id
          ? {
              ...b,
              assignedTechnician: technicianName,
              bookingStatus: b.bookingStatus === 'confirmed' ? 'assigned' : b.bookingStatus,
            }
          : b
      ),
    }));
    addAuditLog(`예약 담당 엔지니어 배정 ${id} -> ${technicianName}`);
  };

  const deleteBooking = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== id),
    }));
    addAuditLog(`예약 내역 삭제 ID: ${id}`);
  };

  // Partner Apps
  const updatePartnerApplicationStatus = (id: string, status: PartnerApplication['status']) => {
    setCmsData((prev) => ({
      ...prev,
      partnerApplications: prev.partnerApplications.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    }));
    addAuditLog(`기사 지원서 상태 업데이트 ID: ${id} -> ${status}`);
  };

  const deletePartnerApplication = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      partnerApplications: prev.partnerApplications.filter((p) => p.id !== id),
    }));
    addAuditLog(`기사 지원서 삭제 ID: ${id}`);
  };

  // Backup & Restore
  const exportCMSData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cmsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `homecares_cms_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditLog('전체 CMS 데이터 JSON 백업 파일 다운로드');
  };

  const importCMSData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        setCmsData({
          ...INITIAL_CMS_DATA,
          ...parsed,
        });
        addAuditLog('CMS 데이터 백업 파일로부터 전체 복원 완료');
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON for CMS import:', e);
    }
    return false;
  };

  const restoreTrashPhoto = (photoId: string) => {
    setCmsData((prev) => ({
      ...prev,
      trashPhotos: prev.trashPhotos.filter((p) => p.id !== photoId),
    }));
    addAuditLog(`휴지통 사진 복구 ID: ${photoId}`);
  };

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        updateBanner,
        addBeforeAfterCase,
        updateBeforeAfterCase,
        deleteBeforeAfterCase,
        reorderBeforeAfterCases,
        addReview,
        updateReview,
        deleteReview,
        updatePriceConfig,
        addNotice,
        updateNotice,
        deleteNotice,
        addJobPosting,
        updateJobPosting,
        deleteJobPosting,
        addBooking,
        updateBookingStatus,
        assignTechnician,
        deleteBooking,
        updatePartnerApplicationStatus,
        deletePartnerApplication,
        exportCMSData,
        importCMSData,
        restoreTrashPhoto,
        addAuditLog,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
