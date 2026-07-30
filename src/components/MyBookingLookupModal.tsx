import React, { useState } from 'react';
import { X, Search, Calendar, MapPin, Phone, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { BookingData } from '../types';
import { ADDITIONAL_SERVICES } from '../data/mockData';

interface MyBookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingLookupModal: React.FC<MyBookingLookupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchPhone, setSearchPhone] = useState('');
  const [searchResults, setSearchResults] = useState<BookingData[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) {
      alert('연락처 뒤 4자리 또는 전체 번호를 입력해주세요.');
      return;
    }

    const storedStr = localStorage.getItem('homecares_bookings');
    const allBookings: BookingData[] = storedStr ? JSON.parse(storedStr) : [];

    const filtered = allBookings.filter(
      (b) => b.customerPhone.includes(searchPhone.trim()) || b.id.includes(searchPhone.trim())
    );

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('정말로 예약을 취소하시겠습니까?')) {
      const storedStr = localStorage.getItem('homecares_bookings');
      const allBookings: BookingData[] = storedStr ? JSON.parse(storedStr) : [];
      const updated = allBookings.filter((b) => b.id !== bookingId);
      localStorage.setItem('homecares_bookings', JSON.stringify(updated));

      if (searchResults) {
        setSearchResults(searchResults.filter((b) => b.id !== bookingId));
      }
      alert('예약이 성공적으로 취소되었습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">내 예약 현황 조회</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-bold text-gray-700">
              예약 시 등록한 휴대폰 번호 또는 예약번호를 입력해주세요
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="예: 01012345678 ('-' 하이픈 생략) 또는 5678"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="flex-1 text-xs font-semibold p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                조회하기
              </button>
            </div>
          </form>

          {/* Results List */}
          {hasSearched && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-gray-500">
                조회 결과 ({searchResults?.length || 0}건)
              </div>

              {!searchResults || searchResults.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 font-semibold">입력하신 정보와 일치하는 예약이 없습니다.</p>
                  <p className="text-[11px] text-gray-400 mt-1">대표번호 1577-7931로 문의해 주시면 친절히 안내해 드립니다.</p>
                </div>
              ) : (
                searchResults.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-mono font-bold text-blue-600">{b.id}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        예약 확정
                      </span>
                    </div>

                    <div className="space-y-1 text-gray-700">
                      <div><strong>예약자:</strong> {b.customerName} ({b.customerPhone})</div>
                      <div><strong>일시:</strong> {b.bookingDate} ({b.bookingTime})</div>
                      <div><strong>주소:</strong> {b.address} {b.addressDetail}</div>
                      <div>
                        <strong>품목:</strong>{' '}
                        {b.selectedItems.map((i) => `${i.applianceTitle} (${i.optionName})`).join(', ')}
                      </div>
                      {b.additionalServices && b.additionalServices.length > 0 && (
                        <div>
                          <strong>부가서비스:</strong>{' '}
                          {b.additionalServices.map((id) => ADDITIONAL_SERVICES.find((a) => a.id === id)?.name).filter(Boolean).join(', ')}
                        </div>
                      )}
                      <div><strong>최종금액:</strong> {b.finalPrice.toLocaleString()}원</div>
                      <div>
                        <strong>결제수단:</strong>{' '}
                        {b.paymentMethod === 'card'
                          ? `신용/체크카드 (${b.cardIssuer || '카드결제'} / ${b.cardType || '신용카드'})`
                          : b.paymentMethod === 'transfer'
                          ? `계좌이체 [농협 312-0231-1517-01 오현철] (입금자: ${b.depositorName || b.customerName})`
                          : '현장 결제 (카드/현금)'}
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-end">
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>예약 취소하기</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
