import React, { useState } from 'react';
import { INITIAL_REVIEWS } from '../data/mockData';
import { Review, ApplianceCategory } from '../types';
import { Star, MessageSquare, ThumbsUp, Plus, ShieldCheck, Camera, CheckCircle2, Filter, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const ReviewsSection: React.FC = () => {
  const { cmsData, addReview } = useCMS();
  const reviews = cmsData.reviews;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newApplianceName, setNewApplianceName] = useState('벽걸이 에어컨');
  const [newApplianceCategory, setNewApplianceCategory] = useState<ApplianceCategory>('aircon');
  const [newRating, setNewRating] = useState(5);
  const [newRegion, setNewRegion] = useState('전주 완산구 효자동');
  const [newContent, setNewContent] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newContent) {
      alert('성함과 후기 내용을 입력해주세요.');
      return;
    }

    addReview({
      applianceId: newApplianceCategory,
      applianceName: newApplianceName,
      author: `${newAuthor.slice(0, 1)}*${newAuthor.slice(-1)} 고객님`,
      phoneLastDigits: newPhone.slice(-4) || '5005',
      rating: newRating,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      content: newContent,
      region: newRegion,
      isVerified: true,
    });

    alert('감사합니다! 고객님의 소중한 방문 세척 후기가 등록되었습니다.');
    setIsWriteModalOpen(false);
    setNewAuthor('');
    setNewContent('');
  };

  const filteredReviews = selectedCategory === 'all'
    ? reviews
    : reviews.filter((r) => r.applianceId === selectedCategory);

  return (
    <section id="reviews" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300">
            REAL CUSTOMER REVIEWS
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            생생한 <span className="text-blue-600">방문 세척 실제 고객 후기</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            직접 서비스를 받으신 고객님들께서 작성해주신 100% 리얼 검증 후기입니다.
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200/80 shadow-lg mb-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-5 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8">
            <div className="text-5xl font-black text-gray-900">
              4.9 <span className="text-lg text-gray-400 font-bold">/ 5.0</span>
            </div>
            <div className="flex justify-center md:justify-start space-x-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              누적 방문 세척 고객 후기 12,480건 기준
            </p>
          </div>

          <div className="md:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 w-full text-xs text-gray-600 font-medium">
              <div className="flex items-center space-x-2">
                <span className="w-16">친절도</span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[99%]" />
                </div>
                <span className="font-bold text-gray-800">99.8%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16">세척완벽도</span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[98%]" />
                </div>
                <span className="font-bold text-gray-800">99.4%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16">재이용의사</span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[99%]" />
                </div>
                <span className="font-bold text-gray-800">99.6%</span>
              </div>
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>나도 세척 후기 작성하기</span>
            </button>
          </div>

        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: '전체 후기' },
            { id: 'aircon', label: '에어컨' },
            { id: 'washer', label: '세탁기' },
            { id: 'dryer', label: '건조기' },
            { id: 'purifier', label: '공기청정기' },
            { id: 'dehumidifier', label: '제습기' },
            { id: 'fridge', label: '냉장고' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {rev.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-extrabold text-gray-900">{rev.author}</span>
                      {rev.isVerified && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200 flex items-center space-x-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>인증고객</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500">{rev.region} | {rev.date}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">
                {rev.applianceName}
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                {rev.content}
              </p>

              {/* Photos if any */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex space-x-2 pt-1">
                  {rev.photos.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="세척 후기 사진"
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200 hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              )}

              {/* Technician Reply */}
              {rev.technicianReply && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-gray-700 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>홈케어스 엔지니어 답변</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{rev.technicianReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Write Review Modal */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-gray-900">방문 세척 후기 작성</h3>
                <button onClick={() => setIsWriteModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">성함 *</label>
                    <input
                      type="text"
                      placeholder="예: 홍길동"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">연락처 뒤4자리</label>
                    <input
                      type="text"
                      placeholder="예: 5005"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">가전 구분</label>
                    <select
                      value={newApplianceCategory}
                      onChange={(e) => setNewApplianceCategory(e.target.value as ApplianceCategory)}
                      className="w-full p-2.5 rounded-xl border border-gray-300"
                    >
                      <option value="aircon">에어컨</option>
                      <option value="washer">세탁기</option>
                      <option value="dryer">건조기</option>
                      <option value="purifier">공기청정기</option>
                      <option value="dehumidifier">제습기</option>
                      <option value="fridge">냉장고</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">지역</label>
                    <input
                      type="text"
                      placeholder="예: 전주 덕진구"
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">세척 별점 평가</label>
                  <div className="flex space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">후기 내용 *</label>
                  <textarea
                    rows={4}
                    placeholder="세척 서비스 결과 및 만족스러웠던 점을 솔직히 남겨주세요."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow"
                  >
                    후기 등록 완료
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
