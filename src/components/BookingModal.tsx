import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, User, CreditCard, CheckCircle2, AlertCircle, Plus, Trash2, ShieldCheck, Sparkles, Receipt, Download, RefreshCw } from 'lucide-react';
import { APPLIANCES_DATA, ADDITIONAL_SERVICES, CALLOUT_FEE, CALLOUT_REGIONS } from '../data/mockData';
import { ApplianceCategory, BookingData } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedApplianceId?: string;
  onBookingSuccess: (booking: BookingData) => void;
}

interface SelectedCartItem {
  applianceId: ApplianceCategory;
  optionId: string;
  optionName: string;
  applianceTitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedApplianceId,
  onBookingSuccess,
}) => {
  if (!isOpen) return null;

  // Step state: 1: Cart/Selection, 2: Date & Address & Customer info, 3: Payment Choice & Confirm, 4: Success Receipt
  const [step, setStep] = useState<number>(1);

  // Cart Items State
  const initialAppliance = APPLIANCES_DATA.find((a) => a.id === preselectedApplianceId) || APPLIANCES_DATA[0];
  const initialOption = initialAppliance.options[0];

  const [cartItems, setCartItems] = useState<SelectedCartItem[]>([
    {
      applianceId: initialAppliance.id,
      optionId: initialOption.id,
      optionName: initialOption.name,
      applianceTitle: initialAppliance.title,
      price: initialOption.price,
      originalPrice: initialOption.originalPrice,
      quantity: 1,
    },
  ]);

  const [selectedAddons, setSelectedAddons] = useState<string[]>(['phytoncide']);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('jeonju');

  // Appliance picker inside modal for adding more items
  const [pickerApplianceId, setPickerApplianceId] = useState<ApplianceCategory>('aircon');
  const [pickerOptionId, setPickerOptionId] = useState<string>(APPLIANCES_DATA[0].options[0].id);

  // Customer Info State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('10:00');
  const [specialNotes, setSpecialNotes] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'onsite'>('card');
  const [cardIssuer, setCardIssuer] = useState('KB국민카드');
  const [cardType, setCardType] = useState<'신용카드' | '직불(체크)카드'>('신용카드');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingData | null>(null);

  // Add Item to Cart
  const handleAddItem = () => {
    const appliance = APPLIANCES_DATA.find((a) => a.id === pickerApplianceId);
    if (!appliance) return;
    const option = appliance.options.find((o) => o.id === pickerOptionId) || appliance.options[0];

    const existingIndex = cartItems.findIndex((item) => item.optionId === option.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          applianceId: appliance.id,
          optionId: option.id,
          optionName: option.name,
          applianceTitle: appliance.title,
          price: option.price,
          originalPrice: option.originalPrice,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (cartItems.length === 1) {
      alert('최소 1개 이상의 가전을 선택해주세요.');
      return;
    }
    setCartItems(cartItems.filter((_, idx) => idx !== index));
  };

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Calculations
  const selectedRegion = CALLOUT_REGIONS.find((r) => r.id === selectedRegionId) || CALLOUT_REGIONS[0];
  const calloutFee = selectedRegion.fee;
  const itemsTotalPrice = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const addonsTotalPrice = selectedAddons.reduce((acc, currId) => {
    const addon = ADDITIONAL_SERVICES.find((a) => a.id === currId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const totalOriginalPrice = itemsTotalPrice + addonsTotalPrice + calloutFee;

  // Multi-item discount logic
  const totalItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  let discountAmount = 0;
  if (totalItemCount >= 3) {
    discountAmount = 25000;
  } else if (totalItemCount >= 2) {
    discountAmount = 10000;
  }

  const finalPrice = Math.max(0, totalOriginalPrice - discountAmount);

  // Submit Booking
  const handleConfirmBooking = () => {
    if (!customerName.trim()) {
      alert('성함을 입력해주세요.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      alert('올바른 연락처를 입력해주세요.');
      return;
    }
    if (!address.trim()) {
      alert('방문 주소를 입력해주세요.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.replace(/\D/g, '').length < 12) {
        alert('올바른 카드번호 16자리를 입력해주세요.');
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const cleanCardDigits = cardNumber.replace(/\D/g, '');
      const formattedCardNum = cleanCardDigits.length >= 12
        ? `${cleanCardDigits.slice(0, 4)}-****-****-${cleanCardDigits.slice(-4)}`
        : undefined;

      const newBooking: BookingData = {
        id: `HC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`,
        createdAt: new Date().toISOString(),
        customerName,
        customerPhone,
        address,
        addressDetail,
        selectedItems: cartItems,
        additionalServices: selectedAddons,
        bookingDate,
        bookingTime,
        specialNotes,
        totalOriginalPrice,
        discountAmount,
        finalPrice,
        paymentMethod,
        cardIssuer: paymentMethod === 'card' ? cardIssuer : undefined,
        cardType: paymentMethod === 'card' ? cardType : undefined,
        cardNumberFormatted: paymentMethod === 'card' ? formattedCardNum : undefined,
        depositorName: paymentMethod === 'transfer' ? (depositorName || customerName) : undefined,
        paymentStatus: paymentMethod === 'onsite' ? 'pending' : 'paid',
        bookingStatus: 'confirmed',
      };

      // Save to localStorage
      const existingBookingsStr = localStorage.getItem('homecares_bookings');
      const existingBookings: BookingData[] = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
      localStorage.setItem('homecares_bookings', JSON.stringify([newBooking, ...existingBookings]));

      setIsProcessingPayment(false);
      setCompletedBooking(newBooking);
      setStep(4);
      onBookingSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">홈케어스 클린업 실시간 간편 예약</h3>
              <p className="text-[11px] text-blue-200">원하시는 가전과 일시를 선택하시면 정찰제 할인이 자동 적용됩니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        {step < 4 && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between text-xs font-bold text-gray-500">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-blue-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
              <span>가전 및 옵션 선택</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-blue-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
              <span>일정 & 방문 주소</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-blue-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
              <span>결제 및 최종 확정</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
          
          {/* STEP 1: Appliance & Options Cart */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Add Appliance Picker */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1">
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>가전 추가 선택 (다중 세척 시 최대 2.5만원 추가 할인)</span>
                  </span>
                  {totalItemCount >= 2 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      🎉 {discountAmount.toLocaleString()}원 할인 적용 중!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-5">
                    <select
                      value={pickerApplianceId}
                      onChange={(e) => {
                        const newAppId = e.target.value as ApplianceCategory;
                        setPickerApplianceId(newAppId);
                        const app = APPLIANCES_DATA.find((a) => a.id === newAppId);
                        if (app && app.options.length > 0) {
                          setPickerOptionId(app.options[0].id);
                        }
                      }}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      {APPLIANCES_DATA.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <select
                      value={pickerOptionId}
                      onChange={(e) => setPickerOptionId(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      {APPLIANCES_DATA.find((a) => a.id === pickerApplianceId)?.options.map((opt) => {
                        const hasDiscount = opt.originalPrice && opt.originalPrice > opt.price;
                        return (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}{' '}
                            {hasDiscount
                              ? `[할인가 ${opt.price.toLocaleString()}원 (정가 ${opt.originalPrice?.toLocaleString()}원)]`
                              : `(${opt.price.toLocaleString()}원)`}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      onClick={handleAddItem}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>추가</span>
                    </button>
                  </div>
                </div>

                {/* Selected Option Price Badge with Red Strikethrough */}
                {(() => {
                  const currentApp = APPLIANCES_DATA.find((a) => a.id === pickerApplianceId);
                  const currentOpt = currentApp?.options.find((o) => o.id === pickerOptionId);
                  if (!currentOpt) return null;
                  const hasDisc = currentOpt.originalPrice && currentOpt.originalPrice > currentOpt.price;
                  const discPct = hasDisc
                    ? Math.round(((currentOpt.originalPrice! - currentOpt.price) / currentOpt.originalPrice!) * 100)
                    : 0;
                  return (
                    <div className="flex items-center justify-between text-xs bg-white/90 p-2.5 rounded-xl border border-blue-200 mt-2 shadow-xs">
                      <span className="font-semibold text-gray-700 truncate max-w-[180px] sm:max-w-xs">
                        💡 선택한 옵션: <strong className="text-gray-900">{currentOpt.name}</strong>
                      </span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {hasDisc && (
                          <span className="text-xs text-rose-500 font-bold line-through decoration-rose-500 decoration-2">
                            정가 {currentOpt.originalPrice?.toLocaleString()}원
                          </span>
                        )}
                        {discPct > 0 && (
                          <span className="text-[10px] font-black text-white bg-rose-500 px-1.5 py-0.5 rounded">
                            -{discPct}%
                          </span>
                        )}
                        <span className="text-sm font-black text-blue-600">
                          {currentOpt.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Cart List */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  선택하신 세척 품목 ({cartItems.length}개)
                </label>
                {cartItems.map((item, idx) => {
                  const itemHasDiscount = item.originalPrice && item.originalPrice > item.price;
                  return (
                    <div
                      key={`${item.applianceId}-${item.optionId}-${idx}`}
                      className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm"
                    >
                      <div>
                        <div className="text-xs font-bold text-blue-600">{item.applianceTitle}</div>
                        <div className="text-sm font-extrabold text-gray-900">{item.optionName}</div>
                        <div className="text-[11px] text-gray-500">수량: {item.quantity}개</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          {itemHasDiscount && (
                            <div className="text-xs text-rose-500 font-bold line-through decoration-rose-500 decoration-2">
                              {(item.originalPrice! * item.quantity).toLocaleString()}원
                            </div>
                          )}
                          <div className="text-sm font-black text-gray-900">
                            {(item.price * item.quantity).toLocaleString()}원
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Services */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  추가 부가 케어 서비스 (선택)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ADDITIONAL_SERVICES.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`text-left p-3 rounded-2xl border text-xs transition-all flex items-start justify-between ${
                          isChecked
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{addon.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{addon.description}</div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="font-bold text-indigo-600">+{addon.price.toLocaleString()}원</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Callout Region Selector */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>출장 지역 선택 (클릭하여 해당지역 선택)</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {selectedRegion.name} (+{selectedRegion.fee.toLocaleString()}원)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CALLOUT_REGIONS.map((region) => {
                    const isSelected = selectedRegionId === region.id;
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => setSelectedRegionId(region.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="font-extrabold text-xs flex items-center justify-between">
                          <span>{region.name}</span>
                          {isSelected && <span className="text-amber-300 font-bold text-xs">✓</span>}
                        </div>
                        <div className={`text-[11px] font-black mt-1 ${isSelected ? 'text-amber-300' : 'text-blue-600'}`}>
                          +{region.fee.toLocaleString()}원
                        </div>
                        <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {region.cities}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-900 text-white p-5 rounded-2xl space-y-2.5">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>기본 세척 품목 합계 ({cartItems.length}개)</span>
                  <span className="font-bold text-white">{itemsTotalPrice.toLocaleString()}원</span>
                </div>

                {/* Itemized list of selected additional services */}
                {selectedAddons.length > 0 && (
                  <div className="py-2 border-t border-b border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] font-bold text-indigo-300 flex justify-between items-center">
                      <span>선택한 부가 케어 옵션 ({selectedAddons.length}개)</span>
                      <span className="font-extrabold text-indigo-200">+{addonsTotalPrice.toLocaleString()}원</span>
                    </div>
                    {selectedAddons.map((addonId) => {
                      const addon = ADDITIONAL_SERVICES.find((a) => a.id === addonId);
                      if (!addon) return null;
                      return (
                        <div key={addon.id} className="flex justify-between text-xs text-indigo-100/90 pl-2">
                          <span className="flex items-center space-x-1">
                            <span className="text-indigo-400">✓</span>
                            <span>{addon.name}</span>
                          </span>
                          <span className="font-semibold text-indigo-300">+{addon.price.toLocaleString()}원</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-300">
                  <span>출장비 <span className="text-[10px] text-amber-300 font-semibold">({selectedRegion.name})</span></span>
                  <span>+{calloutFee.toLocaleString()}원</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-bold">
                    <span>다중 세척 패키지 할인</span>
                    <span>-{discountAmount.toLocaleString()}원</span>
                  </div>
                )}
                <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">최종 예상 견적 금액</span>
                  <span className="text-xl font-black text-amber-300">{finalPrice.toLocaleString()}원</span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Date & Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    방문 희망 날짜 *
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    희망 방문 시간대 *
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="09:00">오전 09:00</option>
                    <option value="11:00">오전 11:00</option>
                    <option value="13:00">오후 01:00 (13:00)</option>
                    <option value="15:00">오후 03:00 (15:00)</option>
                    <option value="17:00">오후 05:00 (17:00)</option>
                    <option value="19:00">야간 07:00 (19:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    고객 성함 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 홍길동"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    휴대폰 번호 * (예약 안내문자 발송 / '-' 하이픈 생략)
                  </label>
                  <input
                    type="tel"
                    placeholder="01012345678 ('-' 하이픈 생략)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>출장 방문 지역 선택 (클릭 시 출장비 차등 적용) *</span>
                  </label>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    선택: {selectedRegion.name} (+{selectedRegion.fee.toLocaleString()}원)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {CALLOUT_REGIONS.map((region) => {
                    const isSelected = selectedRegionId === region.id;
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => setSelectedRegionId(region.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{region.name}</span>
                          {isSelected && <span className="text-amber-300 font-bold">✓</span>}
                        </div>
                        <div className={`text-[11px] font-extrabold mt-0.5 ${isSelected ? 'text-amber-300' : 'text-blue-600'}`}>
                          +{region.fee.toLocaleString()}원
                        </div>
                      </button>
                    );
                  })}
                </div>

                <label className="block text-xs font-bold text-gray-700 mb-1">
                  방문 주소 (도로명/지번) *
                </label>
                <input
                  type="text"
                  placeholder="예: 전주시 완산구 홍산남로 123"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  상세 주소 (동/호수)
                </label>
                <input
                  type="text"
                  placeholder="예: 101동 1502호 (엘리베이터 유/무)"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  기사님 전달사항 (선택)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 차량등록 필요한 경우 차량번호 작성 / 방문전 전화부탁드립니다"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    '방문전 전화부탁드립니다',
                    '차량등록 필요 (차량번호 입력)',
                    '단지 내 주차 가능합니다',
                    '벨 누르지 말고 문자로 연락주세요',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (!specialNotes) {
                          setSpecialNotes(preset);
                        } else if (!specialNotes.includes(preset)) {
                          setSpecialNotes(`${specialNotes} / ${preset}`);
                        }
                      }}
                      className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-all"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Payment Method & Final Summary */}
          {step === 3 && (
            <div className="space-y-5">
              
              {/* Selected Items Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
                <div className="font-bold text-gray-900 border-b pb-2 flex justify-between">
                  <span>예약 정보 요약</span>
                  <span className="text-blue-600">{bookingDate} ({bookingTime})</span>
                </div>
                <div className="text-gray-700">
                  <strong>방문지:</strong> {address} {addressDetail} ({customerName} 님 / {customerPhone})
                </div>
                <div className="text-gray-700">
                  <strong>세척가전:</strong>{' '}
                  {cartItems.map((i) => `${i.applianceTitle} (${i.optionName} x ${i.quantity})`).join(', ')}
                </div>
                {selectedAddons.length > 0 && (
                  <div className="text-indigo-950 bg-indigo-50/90 p-2.5 rounded-xl border border-indigo-200 mt-1">
                    <div className="text-xs font-bold text-indigo-800 mb-1">
                      선택 부가 케어 서비스 ({selectedAddons.length}개):
                    </div>
                    <div className="space-y-1">
                      {selectedAddons.map((addonId) => {
                        const addon = ADDITIONAL_SERVICES.find((a) => a.id === addonId);
                        if (!addon) return null;
                        return (
                          <div key={addon.id} className="flex justify-between text-xs text-indigo-900">
                            <span>• {addon.name}</span>
                            <span className="font-bold text-indigo-700">+{addon.price.toLocaleString()}원</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      paymentMethod === 'card'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-xs font-black flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        <span>신용/체크카드</span>
                      </span>
                      {paymentMethod === 'card' && <span className="text-amber-300">✓</span>}
                    </div>
                    <div className={`text-[10px] mt-1 ${paymentMethod === 'card' ? 'text-blue-100' : 'text-gray-500'}`}>
                      모든 카드사 즉시 결제 가능
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      paymentMethod === 'transfer'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-xs font-black flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Receipt className="w-4 h-4" />
                        <span>계좌이체 (무통장입금)</span>
                      </span>
                      {paymentMethod === 'transfer' && <span className="text-amber-300">✓</span>}
                    </div>
                    <div className={`text-[10px] mt-1 ${paymentMethod === 'transfer' ? 'text-blue-100' : 'text-gray-500'}`}>
                      농협 계좌 이체 & 현금영수증
                    </div>
                  </button>
                </div>

                {/* Card Detailed Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 mt-2">
                    <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span>카드 결제 정보 입력</span>
                      <span className="text-[10px] font-normal text-slate-500">안전 SSL 암호화 적용</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          카드사 선택 *
                        </label>
                        <select
                          value={cardIssuer}
                          onChange={(e) => setCardIssuer(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                        >
                          {[
                            'KB국민카드',
                            '신한카드',
                            '삼성카드',
                            '현대카드',
                            '롯데카드',
                            '하나카드',
                            '우리카드',
                            'NH농협카드',
                            'BC카드',
                            '카카오뱅크',
                            '토스뱅크',
                          ].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          카드 구분 *
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['신용카드', '직불(체크)카드'] as const).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setCardType(k)}
                              className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all ${
                                cardType === k
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        카드 번호 (16자리) *
                      </label>
                      <input
                        type="text"
                        maxLength={25}
                        placeholder="1234 - 5678 - 9012 - 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 - ');
                          setCardNumber(formatted);
                        }}
                        className="w-full text-xs font-mono font-bold p-2.5 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 tracking-wider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          유효기간 (MM/YY)
                        </label>
                        <input
                          type="text"
                          maxLength={7}
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 3) {
                              setCardExpiry(`${val.slice(0, 2)} / ${val.slice(2)}`);
                            } else {
                              setCardExpiry(val);
                            }
                          }}
                          className="w-full text-xs font-mono font-semibold p-2.5 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          CVC (3자리)
                        </label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="***"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="w-full text-xs font-mono font-semibold p-2.5 bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Detailed Form */}
                {paymentMethod === 'transfer' && (
                  <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl space-y-3 mt-2">
                    <div className="text-xs font-bold text-amber-900 border-b border-amber-200/80 pb-2 flex items-center justify-between">
                      <span>계좌이체 (무통장입금) 계좌 정보</span>
                      <span className="text-[10px] text-amber-800 font-normal">입금 확인 후 즉시 예약확정</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5 shadow-sm">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>입금 은행:</span>
                        <span className="font-extrabold text-slate-900">NH농협은행</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">계좌 번호:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-sm text-blue-700">312-0231-1517-01</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('312-0231-1517-01');
                              setCopiedAccount(true);
                              setTimeout(() => setCopiedAccount(false), 2000);
                            }}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-300"
                          >
                            {copiedAccount ? '복사완료!' : '복사'}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>예금주:</span>
                        <span className="font-extrabold text-slate-900">오현철(홈케어스클린업)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">
                        입금자명 (주문자와 다를 경우 변경 입력)
                      </label>
                      <input
                        type="text"
                        placeholder={customerName || '예: 홍길동'}
                        value={depositorName}
                        onChange={(e) => setDepositorName(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 bg-white rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Final Amount & Guarantee info */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-200 font-medium">최종 결제 예정 금액</div>
                  <div className="text-2xl font-black text-amber-300">{finalPrice.toLocaleString()}원</div>
                  <div className="text-[10px] text-blue-300 mt-0.5">VAT 포함 / 조립 후 시운전 기능테스트 완료</div>
                </div>

                <div className="text-right text-[11px] text-slate-300">
                  <div className="flex items-center space-x-1 justify-end text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% 무상 A/S 보증</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 4 && completedBooking && (
            <div className="text-center py-4 space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900">예약이 성공적으로 완료되었습니다!</h3>
                <p className="text-xs text-gray-600 mt-1">
                  담당 홈케어 엔지니어가 확인 후 사전 안내 전화를 드릴 예정입니다.
                </p>
              </div>

              {/* Printable Receipt Card */}
              <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 text-left max-w-md mx-auto space-y-3 shadow-sm text-xs text-gray-700">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-extrabold text-gray-900 text-sm">홈케어스 클린업 예약 확인서</span>
                  <span className="font-mono text-[11px] text-blue-600 font-bold">{completedBooking.id}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">예약자 성함:</span>
                    <span className="font-bold text-gray-900">{completedBooking.customerName} 님</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">연락처:</span>
                    <span className="font-bold text-gray-900">{completedBooking.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">방문 희망일시:</span>
                    <span className="font-bold text-blue-700">
                      {completedBooking.bookingDate} ({completedBooking.bookingTime})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">방문 주소:</span>
                    <span className="font-bold text-gray-900 truncate max-w-[200px]">
                      {completedBooking.address} {completedBooking.addressDetail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제 수단:</span>
                    <span className="font-bold text-gray-900 text-right">
                      {completedBooking.paymentMethod === 'card'
                        ? `카드결제 (${completedBooking.cardIssuer || '신용카드'} / ${completedBooking.cardType || '신용카드'})`
                        : completedBooking.paymentMethod === 'transfer'
                        ? `계좌이체 [농협 312-0231-1517-01 오현철] (입금자: ${completedBooking.depositorName || completedBooking.customerName})`
                        : '현장 결제 (카드/현금)'}
                    </span>
                  </div>
                </div>

                {/* Itemized Breakdown Section */}
                <div className="border-t border-b border-gray-200 py-2.5 my-2 space-y-1.5 bg-gray-50/80 p-2.5 rounded-2xl">
                  <div className="font-bold text-gray-900 text-[11px] mb-1">선택 세척 품목 및 부가 서비스 상세 내역</div>
                  {completedBooking.selectedItems.map((item, idx) => (
                    <div key={`${item.applianceId}-${item.optionId}-${idx}`} className="flex justify-between text-[11px] text-gray-800">
                      <span>• {item.applianceTitle} ({item.optionName}) x {item.quantity}</span>
                      <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                  {completedBooking.additionalServices && completedBooking.additionalServices.length > 0 && (
                    <div className="pt-1.5 mt-1.5 border-t border-dashed border-gray-300 space-y-1">
                      <div className="text-[10px] font-bold text-indigo-700">부가 케어 서비스 ({completedBooking.additionalServices.length}개):</div>
                      {completedBooking.additionalServices.map((addonId) => {
                        const addon = ADDITIONAL_SERVICES.find((a) => a.id === addonId);
                        if (!addon) return null;
                        return (
                          <div key={addon.id} className="flex justify-between text-[11px] text-indigo-900 pl-2">
                            <span>+ {addon.name}</span>
                            <span className="font-bold text-indigo-700">+{addon.price.toLocaleString()}원</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">최종 청구 금액:</span>
                  <span className="text-lg font-black text-blue-600">
                    {completedBooking.finalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 max-w-md mx-auto">
                💡 언제든지 홈페이지 상단 <strong>[예약 조회]</strong> 메뉴에서 연락처로 일정을 확인하시거나 변경하실 수 있습니다.
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 px-6 flex items-center justify-between flex-shrink-0">
          {step < 4 ? (
            <>
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 font-bold text-xs text-gray-700 rounded-xl"
                >
                  이전 단계
                </button>
              ) : (
                <div />
              )}

              {step === 1 && (
                <button
                  onClick={() => {
                    if (cartItems.length === 0) {
                      alert('세척을 원하시는 가전 품목을 최소 1개 이상 추가해 주세요.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  다음: 일정 및 주소 입력
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={() => {
                    if (!customerName.trim()) {
                      alert('예약자 성함을 입력해 주세요.');
                      return;
                    }
                    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 8) {
                      alert('올바른 연락처(휴대폰 번호)를 입력해 주세요.');
                      return;
                    }
                    if (!address.trim()) {
                      alert('방문 주소를 입력해 주세요.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  다음: 결제 방법 선택
                </button>
              )}

              {step === 3 && (
                <button
                  disabled={isProcessingPayment}
                  onClick={handleConfirmBooking}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xl transition-all flex items-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>예약 접수 중...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>최종 예약 완료하기</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              확인 및 모달 닫기
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
