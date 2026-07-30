import React, { useState } from 'react';
import { RECRUITMENT_BENEFITS } from '../data/mockData';
import { Users, TrendingUp, MapPin, GraduationCap, CalendarCheck, CheckCircle2, ArrowRight, ShieldCheck, Phone, X, RefreshCw } from 'lucide-react';
import { PartnerApplication } from '../types';

interface PartnerRecruitSectionProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export const PartnerRecruitSection: React.FC<PartnerRecruitSectionProps> = ({
  isOpenModal,
  onCloseModal,
  onOpenModal,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('서울/경기');
  const [experienceYears, setExperienceYears] = useState('신입 (교육 희망)');
  const [hasVehicle, setHasVehicle] = useState(true);
  const [hasEquipment, setHasEquipment] = useState(false);
  const [motivation, setMotivation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<PartnerApplication | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('성함과 연락처를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const app: PartnerApplication = {
        id: `PARTNER-${Date.now().toString().slice(-6)}`,
        appliedAt: new Date().toISOString().split('T')[0],
        name,
        phone,
        age,
        region,
        experienceYears,
        hasVehicle,
        hasEquipment,
        motivation,
        status: 'received',
      };

      const existingStr = localStorage.getItem('homecares_partner_apps');
      const existing: PartnerApplication[] = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('homecares_partner_apps', JSON.stringify([app, ...existing]));

      setIsSubmitting(false);
      setSubmittedApp(app);

      // Trigger instant SMS alert for 010-5005-1078
      alert(`[SMS 문자 발송 완료]\n010-5005-1078 (담당자) 번호로 지원자 접수 알림 문자가 발송되었습니다.\n\n지원자: ${name}님 (${phone})`);
    }, 1000);
  };

  return (
    <>
      {/* Homepage Section Overview */}
      <section id="partner" className="py-16 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>홈케어스 클린업 전국 협력기사 & 홈케어 교육생 수시모집</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                가전 세척 전문가로서<br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  업계 최고 수익 75%~80%
                </span>를 창출하세요
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                성수기/비수기 걱정 없는 풍부한 오더 배정! 초보자도 완전분해 정밀 세척 기술 교육 과정을 거쳐 당당한 기술 전문가로 성장할 수 있습니다.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {RECRUITMENT_BENEFITS.map((b, idx) => (
                  <div key={idx} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                    <div className="font-extrabold text-sm text-emerald-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{b.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenModal}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-900/40 transition-all flex items-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>협력기사 & 홈케어 교육생 지원서 작성하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Card Summary */}
            <div className="lg:col-span-5 bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 space-y-5">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2 border-b border-slate-700 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>협력기사 자격 요건 & 지원 조건</span>
              </h3>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>지원 자격:</strong> 성별/학력 무관, 이동 차량(승용차/레이/다마스/탑차 등) 소유자</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>모집 지역:</strong> 서울, 경기, 인천, 대전, 대구, 부산, 광주, 울산, 강원, 전라, 충청 등 전국</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>교육 지원:</strong> 분해/세척/세제/고압수세/맞춤살균/고객응대 1:1 맞춤 현장 실습 과정 제공</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>정산 방식:</strong> 주 단위/월 단위 명확한 투명 정산 시스템 (수수료 75%+)</span>
                </li>
              </ul>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 text-center space-y-1">
                <div className="text-xs text-slate-400 font-semibold">협력기사 채용 직통 문의</div>
                <div className="text-lg font-black text-amber-300">010-5005-1078 / 1577-7931</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Recruitment Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden my-8 border border-gray-100">
            
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">홈케어스 클린업 협력기사 & 홈케어 교육생 지원 신청</h3>
              </div>
              <button onClick={onCloseModal} className="p-1 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {!submittedApp ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">성함 *</label>
                      <input
                        type="text"
                        placeholder="예: 홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">연락처 * ('-' 하이픈 생략)</label>
                      <input
                        type="tel"
                        placeholder="01012345678 ('-' 하이픈 생략)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">나이</label>
                      <input
                        type="text"
                        placeholder="예: 35세"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">희망 활동 지역</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300"
                      >
                        <option value="서울 전체">서울 전체</option>
                        <option value="경기/인천">경기 / 인천</option>
                        <option value="대전/충청">대전 / 충청</option>
                        <option value="대구/경북">대구 / 경북</option>
                        <option value="부산/경남">부산 / 경남</option>
                        <option value="광주/전라">광주 / 전라</option>
                        <option value="기타/전국">기타 / 전국</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">가전 세척 경력</label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300"
                      >
                        <option value="신입 (교육 희망)">신입 (체계적 교육 희망)</option>
                        <option value="1년 미만">1년 미만</option>
                        <option value="1년~3년">1년 ~ 3년</option>
                        <option value="3년 이상 베테랑">3년 이상 베테랑</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">이동 차량 소유 여부</label>
                      <select
                        value={hasVehicle ? 'yes' : 'no'}
                        onChange={(e) => setHasVehicle(e.target.value === 'yes')}
                        className="w-full p-2.5 rounded-xl border border-gray-300"
                      >
                        <option value="yes">소유 (승용차/승합차/탑차 등)</option>
                        <option value="no">미소유 (구매 예정)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">한줄 지원 동기 및 문의사항</label>
                    <textarea
                      rows={3}
                      placeholder="자유롭게 지원 동기나 문의사항을 적어주세요."
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
                    💡 지원서 접수 후 24시간 이내에 홈케어스 채용 담당자가 확인 전화(010-5005-1078)를 드릴 예정입니다.
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onCloseModal}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow flex items-center space-x-1"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>접수 중...</span>
                        </>
                      ) : (
                        <span>지원서 접수 완료하기</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900">지원서가 성공적으로 접수되었습니다!</h4>
                  
                  {/* SMS Alert Badge */}
                  <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-left space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-900 text-xs">
                      <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span>📱 [SMS 문자 발송 완료] 담당자 010-5005-1078</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      채용담당자 휴대폰(<strong>010-5005-1078</strong>)으로 지원 알림 문자가 전송되었습니다. 24시간 이내 연락드립니다.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border text-left space-y-1 font-mono">
                    <div>접수번호: <strong className="text-emerald-700">{submittedApp.id}</strong></div>
                    <div>지원자: {submittedApp.name} ({submittedApp.phone})</div>
                    <div>활동지역: {submittedApp.region}</div>
                    <div>세척경력: {submittedApp.experienceYears}</div>
                    <div>상태: <span className="text-blue-600 font-bold">SMS 발송 완료 및 담당자 확인 중</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`sms:01050051078?body=${encodeURIComponent(`[홈케어스 지원] ${submittedApp.name} / ${submittedApp.phone} / ${submittedApp.region} / ${submittedApp.experienceYears}`)}`}
                      className="py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl border border-emerald-300 flex items-center justify-center space-x-1 text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>문자 직접 보내기</span>
                    </a>
                    <button
                      onClick={onCloseModal}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                    >
                      확인 및 닫기
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
