import React, { useState, useEffect } from 'react';
import { 
  X, Search, ShieldAlert, CheckCircle2, Clock, UserCheck, 
  Trash2, Send, Download, Plus, Filter, Lock, Phone, MapPin, 
  Calendar, RefreshCw, Smartphone, MessageSquare, ExternalLink,
  ChevronRight, DollarSign, Database, FileSpreadsheet, Settings
} from 'lucide-react';
import { BookingData } from '../types';
import { ADDITIONAL_SERVICES } from '../data/mockData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSystemIntegration: () => void;
}

const SAMPLE_BOOKINGS: BookingData[] = [
  {
    id: 'HC-260730-01',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: '김민준',
    customerPhone: '010-8923-1422',
    address: '서울특별시 강남구 테헤란로 152',
    addressDetail: '강남파이낸스센터 1204호',
    selectedItems: [
      {
        applianceId: 'aircon',
        optionId: 'ac-stand',
        optionName: '스탠드 에어컨',
        applianceTitle: '에어컨 완전분해 세척',
        price: 150000,
        quantity: 1
      },
      {
        applianceId: 'aircon',
        optionId: 'ac-wall',
        optionName: '벽걸이 에어컨',
        applianceTitle: '에어컨 완전분해 세척',
        price: 70000,
        quantity: 1
      }
    ],
    additionalServices: ['addon-uv'],
    bookingDate: '2026-08-01',
    bookingTime: '10:00',
    specialNotes: '실외기가 앵글에 설치되어 있습니다. 지하주차장 이용 가능합니다.',
    totalOriginalPrice: 260000, // 150k + 70k + 10k(uv) + 30k(callout)
    discountAmount: 10000,
    finalPrice: 250000,
    paymentMethod: 'onsite',
    paymentStatus: 'pending',
    bookingStatus: 'confirmed',
    assignedTechnician: '김철수 팀장 (서울 강남/서초 1팀)',
    adminNotes: '사전 해피콜 완료. 방문전 주차 등록 필요.'
  },
  {
    id: 'HC-260729-04',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerName: '이수진',
    customerPhone: '010-3482-9901',
    address: '경기도 성남시 분당구 정자일로 135',
    addressDetail: '정자동 아이파크 102동 1503호',
    selectedItems: [
      {
        applianceId: 'washer',
        optionId: 'wash-drum',
        optionName: '드럼 세탁기 (10kg~24kg)',
        applianceTitle: '세탁기 완전분해 세척',
        price: 150000,
        quantity: 1
      }
    ],
    additionalServices: [],
    bookingDate: '2026-08-02',
    bookingTime: '14:00',
    specialNotes: '아기 있는 집이라 친환경 세제 사용 꼭 부탁드립니다.',
    totalOriginalPrice: 180000, // 150k + 30k(callout)
    discountAmount: 0,
    finalPrice: 180000,
    paymentMethod: 'kakaopay',
    paymentStatus: 'paid',
    bookingStatus: 'assigned',
    assignedTechnician: '박영호 엔지니어 (경기 분당/판교팀)',
    adminNotes: '카카오페이 사전 결제 완료'
  },
  {
    id: 'HC-260728-09',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    customerName: '박현우',
    customerPhone: '010-5005-1078',
    address: '인천광역시 연수구 송도국제대로 123',
    addressDetail: '송도 더샵 센트럴파크 201동 804호',
    selectedItems: [
      {
        applianceId: 'purifier',
        optionId: 'purifier-2tier',
        optionName: '공기청정기 (2단)',
        applianceTitle: '공기청정기 케어',
        price: 120000,
        quantity: 1
      }
    ],
    additionalServices: ['addon-deodorant'],
    bookingDate: '2026-07-29',
    bookingTime: '11:00',
    specialNotes: '반려견이 있으니 오실 때 벨 누르지 마시고 문앞에서 전화 부탁드립니다.',
    totalOriginalPrice: 160000, // 120k + 10k + 30k
    discountAmount: 0,
    finalPrice: 160000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    assignedTechnician: '최성훈 기사 (인천/송도팀)',
    adminNotes: '작업 완료 및 고객 만족도 5점 평가'
  }
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenSystemIntegration
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'stats' | 'technicians'>('orders');
  const [notificationLog, setNotificationLog] = useState<string | null>(null);

  // Load Bookings from localStorage
  const loadBookings = () => {
    const stored = localStorage.getItem('homecares_bookings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBookings(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Seed default samples if empty
    setBookings(SAMPLE_BOOKINGS);
    localStorage.setItem('homecares_bookings', JSON.stringify(SAMPLE_BOOKINGS));
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadBookings();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234' || passwordInput.trim() === '' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setPasswordError(false);
      loadBookings();
    } else {
      setPasswordError(true);
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingData['bookingStatus']) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, bookingStatus: newStatus };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('homecares_bookings', JSON.stringify(updated));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, bookingStatus: newStatus });
    }
  };

  const handleTechnicianAssign = (bookingId: string, techName: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          assignedTechnician: techName,
          bookingStatus: (b.bookingStatus === 'confirmed' ? 'assigned' : b.bookingStatus) as any
        };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('homecares_bookings', JSON.stringify(updated));
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ 
        ...selectedBooking, 
        assignedTechnician: techName,
        bookingStatus: selectedBooking.bookingStatus === 'confirmed' ? 'assigned' : selectedBooking.bookingStatus
      });
    }
  };

  const handleAdminNotesChange = (bookingId: string, notes: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, adminNotes: notes };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('homecares_bookings', JSON.stringify(updated));
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('정말 해당 예약을 삭제하시겠습니까?')) {
      const updated = bookings.filter((b) => b.id !== bookingId);
      setBookings(updated);
      localStorage.setItem('homecares_bookings', JSON.stringify(updated));
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }
    }
  };

  const handleSendAlimtalk = (booking: BookingData) => {
    setNotificationLog(`[카카오 알림톡 발송 완료] ${booking.customerName} 님(${booking.customerPhone})께 예약안내 메시지가 전송되었습니다.`);
    setTimeout(() => setNotificationLog(null), 4000);
  };

  const handleSendTechSms = (booking: BookingData) => {
    const tech = booking.assignedTechnician || '담당 기사';
    setNotificationLog(`[기사 배정 SMS 발송 완료] ${tech} 님께 [${booking.id}] 오더 주소지 및 정보가 전송되었습니다.`);
    setTimeout(() => setNotificationLog(null), 4000);
  };

  const handleResetSampleData = () => {
    if (confirm('샘플 예약 데이터로 리셋하시겠습니까?')) {
      localStorage.setItem('homecares_bookings', JSON.stringify(SAMPLE_BOOKINGS));
      setBookings(SAMPLE_BOOKINGS);
    }
  };

  const handleDownloadCsv = () => {
    const headers = ['예약번호', '접수일시', '고객명', '연락처', '주소', '세척품목', '방망예정일', '방문시간', '총금액', '결제수단', '결제상태', '예약상태', '담당기사'];
    const rows = bookings.map((b) => [
      b.id,
      new Date(b.createdAt).toLocaleString('ko-KR'),
      b.customerName,
      b.customerPhone,
      `"${b.address} ${b.addressDetail}"`,
      `"${b.selectedItems.map((i) => `${i.applianceTitle} - ${i.optionName}`).join(', ')}"`,
      b.bookingDate,
      b.bookingTime,
      b.finalPrice,
      b.paymentMethod,
      b.paymentStatus,
      b.bookingStatus,
      b.assignedTechnician || '미배정'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `homecares_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.bookingStatus !== 'cancelled' ? b.finalPrice : 0), 0);
  const totalOrders = bookings.length;
  const confirmedCount = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const assignedCount = bookings.filter((b) => b.bookingStatus === 'assigned').length;
  const completedCount = bookings.filter((b) => b.bookingStatus === 'completed').length;

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== 'all' && b.bookingStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      const matchAddress = b.address.toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchAddress;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-800 flex flex-col max-h-[92vh] text-xs">
        
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-white">홈케어스 클린업 [통합 관리자 모드]</h2>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400">실시간 주문 데이터 접수, 기사 배정, 알림톡/문자 및 매출 관리 콘솔</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSystemIntegration}
              className="px-3.5 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all flex items-center space-x-1.5 border border-indigo-500/50"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>DB/알림/결제 연동 설정</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Login Password Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">관리자 보안 인증</h3>
              <p className="text-xs text-slate-400 mt-1">
                본 기능은 홈케어스 클린업 가맹점주 및 본사 관리자 전용입니다.<br />
                (테스트용 초기 비밀번호: <strong className="text-blue-400">1234</strong> 또는 바로 입장 가능)
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="비밀번호 입력 (기본: 1234)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-center text-sm font-bold p-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
              />
              {passwordError && (
                <div className="text-xs text-rose-400 font-semibold">비밀번호가 올바르지 않습니다. (기본: 1234)</div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                관리자 대시보드 로그인
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

            {/* Live Notification Alert Toast */}
            {notificationLog && (
              <div className="bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 p-3 rounded-2xl flex items-center justify-between animate-fade-in shadow-lg">
                <div className="flex items-center space-x-2 font-semibold">
                  <Smartphone className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>{notificationLog}</span>
                </div>
                <button onClick={() => setNotificationLog(null)} className="text-xs text-emerald-400 font-bold">닫기</button>
              </div>
            )}

            {/* Quick KPI Stats Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold text-[11px] flex justify-between items-center">
                  <span>총 오더 접수</span>
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-black text-white">{totalOrders} <span className="text-xs font-normal text-slate-400">건</span></div>
                <div className="text-[10px] text-blue-400">실시간 고객 예약 건수</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold text-[11px] flex justify-between items-center">
                  <span>미배정/확정 예약</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-black text-amber-400">{confirmedCount} <span className="text-xs font-normal text-slate-400">건</span></div>
                <div className="text-[10px] text-amber-300">기사 배정 필요 상태</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold text-[11px] flex justify-between items-center">
                  <span>방문/세척 진행중</span>
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-xl font-black text-indigo-300">{assignedCount} <span className="text-xs font-normal text-slate-400">건</span></div>
                <div className="text-[10px] text-indigo-200">엔지니어 현장 이동중</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-semibold text-[11px] flex justify-between items-center">
                  <span>누적 예상 매출</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400">{totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">원</span></div>
                <div className="text-[10px] text-emerald-300">시운전 기능테스트 완료</div>
              </div>
            </div>

            {/* Main Tabs Navigation & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              
              {/* Status Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: `전체 (${bookings.length})` },
                  { id: 'confirmed', label: `신규확정 (${confirmedCount})` },
                  { id: 'assigned', label: `기사배정 (${assignedCount})` },
                  { id: 'completed', label: `작업완료 (${completedCount})` },
                  { id: 'cancelled', label: '취소' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setFilterStatus(st.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                      filterStatus === st.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Actions & CSV Export */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all flex items-center space-x-1 border border-slate-700"
                  title="CSV 엑셀로 다운로드"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CSV 엑셀 저장</span>
                </button>
                <button
                  onClick={handleResetSampleData}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all"
                  title="테스트용 데이터 리셋"
                >
                  샘플 재생성
                </button>
              </div>

            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="고객명, 전화번호, 주소, 예약번호로 빠르게 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Orders Data Table / List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Order List Column */}
              <div className={selectedBooking ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
                <div className="text-xs font-bold text-slate-400 flex justify-between items-center px-1">
                  <span>접수 오더 목록 ({filteredBookings.length}건)</span>
                  <span className="text-[11px] text-slate-500">항목을 클릭하면 상세 관리창이 열립니다</span>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                    <Database className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold text-xs">검색 조건에 맞는 예약 내역이 없습니다.</p>
                  </div>
                ) : (
                  filteredBookings.map((b) => {
                    const isSelected = selectedBooking?.id === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          isSelected
                            ? 'bg-slate-800/90 border-blue-500 shadow-xl ring-2 ring-blue-500/30'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-blue-400 text-xs">{b.id}</span>
                            <span className="text-slate-400 text-[11px]">
                              {new Date(b.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              b.bookingStatus === 'confirmed'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : b.bookingStatus === 'assigned'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : b.bookingStatus === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {b.bookingStatus === 'confirmed' && '신규 확정'}
                              {b.bookingStatus === 'assigned' && '기사 배정됨'}
                              {b.bookingStatus === 'completed' && '작업 완료'}
                              {b.bookingStatus === 'cancelled' && '예약 취소'}
                            </span>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              b.paymentStatus === 'paid' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {b.paymentStatus === 'paid' ? '결제완료' : '현장결제'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium">고객명:</span>{' '}
                            <strong className="text-white font-bold">{b.customerName}</strong> ({b.customerPhone})
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">방문일시:</span>{' '}
                            <strong className="text-amber-300">{b.bookingDate} ({b.bookingTime})</strong>
                          </div>
                          <div className="sm:col-span-2 text-slate-300 truncate">
                            <span className="text-slate-400 font-medium">주소:</span> {b.address} {b.addressDetail}
                          </div>
                          <div className="sm:col-span-2 text-slate-200 font-semibold">
                            <span className="text-slate-400 font-medium">품목:</span>{' '}
                            {b.selectedItems.map((i) => `${i.applianceTitle} [${i.optionName}]`).join(', ')}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="text-slate-400 text-[11px]">
                            담당기사: <span className="text-indigo-300 font-bold">{b.assignedTechnician || '미배정'}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 text-[11px] mr-1">결제금액:</span>
                            <span className="text-sm font-black text-amber-300">{b.finalPrice.toLocaleString()}원</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Order Detail & Inspector Drawer (Right Side) */}
              {selectedBooking && (
                <div className="lg:col-span-5 bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4 self-start sticky top-2 shadow-2xl">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-blue-400 text-sm">{selectedBooking.id}</span>
                      <span className="text-xs font-bold text-white">오더 상세 정보</span>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>고객 및 주소지</span>
                      </span>
                      <a
                        href={`tel:${selectedBooking.customerPhone.replace('-', '')}`}
                        className="text-emerald-400 hover:underline flex items-center space-x-1 text-[11px] font-bold"
                      >
                        <Phone className="w-3 h-3" />
                        <span>전화걸기</span>
                      </a>
                    </div>
                    <div><strong>성함:</strong> {selectedBooking.customerName} 님</div>
                    <div><strong>연락처:</strong> {selectedBooking.customerPhone}</div>
                    <div><strong>방문주소:</strong> {selectedBooking.address} {selectedBooking.addressDetail}</div>
                    <div><strong>방문일시:</strong> {selectedBooking.bookingDate} {selectedBooking.bookingTime}</div>
                    <div>
                      <strong>결제수단:</strong>{' '}
                      {selectedBooking.paymentMethod === 'card'
                        ? `신용/체크카드 (${selectedBooking.cardIssuer || '카드결제'} / ${selectedBooking.cardType || '신용카드'})`
                        : selectedBooking.paymentMethod === 'transfer'
                        ? `계좌이체 [농협 312-0231-1517-01] (입금자명: ${selectedBooking.depositorName || selectedBooking.customerName})`
                        : '현장 결제 (카드/현금)'}
                    </div>
                    {selectedBooking.specialNotes && (
                      <div className="bg-slate-950 p-2 rounded-xl text-amber-200 border border-amber-900/50 mt-1">
                        <strong>고객 요청사항:</strong> {selectedBooking.specialNotes}
                      </div>
                    )}
                  </div>

                  {/* Selected Items & Pricing breakdown */}
                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-white text-xs border-b border-slate-800 pb-1.5 flex justify-between">
                      <span>선택 품목 및 견적 내역</span>
                      <span className="text-amber-300 font-mono font-black">{selectedBooking.finalPrice.toLocaleString()}원</span>
                    </div>
                    {selectedBooking.selectedItems.map((item, idx) => (
                      <div key={`${item.applianceId}-${item.optionId}-${idx}`} className="flex justify-between text-slate-300">
                        <span>• {item.applianceTitle} ({item.optionName})</span>
                        <span className="font-bold text-slate-100">{(item.price * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                    {selectedBooking.additionalServices && selectedBooking.additionalServices.length > 0 && (
                      <div className="pt-1 border-t border-dashed border-slate-800 space-y-0.5">
                        <div className="text-[10px] font-bold text-indigo-400">선택 부가서비스 ({selectedBooking.additionalServices.length}개):</div>
                        {selectedBooking.additionalServices.map((addonId) => {
                          const addon = ADDITIONAL_SERVICES.find((a) => a.id === addonId);
                          if (!addon) return null;
                          return (
                            <div key={addon.id} className="flex justify-between text-[11px] text-indigo-200 pl-2">
                              <span>+ {addon.name}</span>
                              <span className="font-semibold text-indigo-300">+{addon.price.toLocaleString()}원</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>• 출장비 (지역별 차등)</span>
                      <span>적용됨</span>
                    </div>
                    {selectedBooking.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold text-[11px]">
                        <span>• 다중 세척 할인</span>
                        <span>-{selectedBooking.discountAmount.toLocaleString()}원</span>
                      </div>
                    )}
                  </div>

                  {/* Order Status Controller */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">예약 상태 변경</label>
                    <select
                      value={selectedBooking.bookingStatus}
                      onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-white font-bold text-xs p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="confirmed">🟡 신규 확정 (기사 미배정)</option>
                      <option value="assigned">🔵 기사 배정 완료 (방문 예정)</option>
                      <option value="completed">🟢 세척 작업 완료 (시운전 완료)</option>
                      <option value="cancelled">🔴 예약 취소</option>
                    </select>
                  </div>

                  {/* Technician Assignment */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">담당 엔지니어 배정</label>
                    <select
                      value={selectedBooking.assignedTechnician || ''}
                      onChange={(e) => handleTechnicianAssign(selectedBooking.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white font-bold text-xs p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- 기사 선택 --</option>
                      <option value="김철수 팀장 (서울 강남/서초 1팀)">김철수 팀장 (서울 강남/서초 1팀)</option>
                      <option value="이영희 엔지니어 (서울 강북/마포 2팀)">이영희 엔지니어 (서울 강북/마포 2팀)</option>
                      <option value="박영호 엔지니어 (경기 분당/판교팀)">박영호 엔지니어 (경기 분당/판교팀)</option>
                      <option value="최성훈 기사 (인천/송도팀)">최성훈 기사 (인천/송도팀)</option>
                      <option value="정민재 엔지니어 (지방/특수팀)">정민재 엔지니어 (지방/특수팀)</option>
                    </select>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">관리자 사후 메모 (A/S 기록 등)</label>
                    <textarea
                      rows={2}
                      placeholder="내부 전달사항 또는 사전 해피콜 메모..."
                      value={selectedBooking.adminNotes || ''}
                      onChange={(e) => handleAdminNotesChange(selectedBooking.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Trigger Notification SMS / Alimtalk */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSendAlimtalk(selectedBooking)}
                      className="py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-1 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>고객 알림톡 발송</span>
                    </button>
                    <button
                      onClick={() => handleSendTechSms(selectedBooking)}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>기사 오더 SMS 발송</span>
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-800/60 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>해당 오더 데이터 삭제</span>
                  </button>

                </div>
              )}

            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>로컬스토리지 & Webhook 연결 준비 완료</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
          >
            대시보드 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
