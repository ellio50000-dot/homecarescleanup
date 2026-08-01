import React, { useState } from 'react';
import { APPLIANCES_DATA } from '../data/mockData';
import { ApplianceCategory } from '../types';
import { Check, ShieldAlert, Sparkles, Clock, Calendar, ArrowRight, Wind, Shirt, Flame, Fan, Droplets, Snowflake, Phone } from 'lucide-react';
import { StandAirconBeforeAfter } from './StandAirconBeforeAfter';

interface ApplianceServicesProps {
  onOpenBooking: (applianceId?: string) => void;
}

export const ApplianceServices: React.FC<ApplianceServicesProps> = ({ onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<ApplianceCategory>('aircon');

  const selectedAppliance = APPLIANCES_DATA.find((item) => item.id === activeTab) || APPLIANCES_DATA[0];

  const getIcon = (id: ApplianceCategory) => {
    switch (id) {
      case 'aircon': return <Wind className="w-5 h-5" />;
      case 'washer': return <Shirt className="w-5 h-5" />;
      case 'dryer': return <Flame className="w-5 h-5" />;
      case 'purifier': return <Fan className="w-5 h-5" />;
      case 'dehumidifier': return <Droplets className="w-5 h-5" />;
      case 'fridge': return <Snowflake className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>홈케어스 클린업 6대 가전 토탈 클리닝</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            어떤 가전이라도 <span className="text-blue-600">완전 분해</span>하여 새것처럼 세척합니다
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            단순 외관 청소가 아닌, 분해 가능한 모든 부품을 탈거하여 고압 수세 및 맞춤 소독(공기청정기 등 필요시 고온 스팀)으로 유해균을 99.9% 소독합니다.
          </p>
        </div>

        {/* 6 Appliance Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {APPLIANCES_DATA.map((appliance) => {
            const isActive = activeTab === appliance.id;
            return (
              <button
                key={appliance.id}
                onClick={() => {
                  setActiveTab(appliance.id);
                }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-blue-500/20 shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {getIcon(appliance.id)}
                <span>{appliance.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Appliance Content Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
          
          {/* Top Banner inside Card */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-blue-600/30 rounded-xl text-blue-300 border border-blue-400/30">
                    {getIcon(selectedAppliance.id)}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedAppliance.title}</h3>
                </div>
                <p className="mt-2 text-blue-200 font-medium text-sm">{selectedAppliance.subtitle}</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>권장주기: {selectedAppliance.recommendedFrequency}</span>
                </span>
                <button
                  onClick={() => onOpenBooking(selectedAppliance.id)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{selectedAppliance.title.split(' ')[0]} 예약하기</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column - Description & Symptoms & Options */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">서비스 개요</h4>
                <p className="text-sm text-gray-700 leading-relaxed font-medium bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  {selectedAppliance.description}
                </p>
              </div>

              {/* Symptoms checklist */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5 mb-3">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>이럴 때 꼭 분해세척이 필요합니다!</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedAppliance.symptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options & Price List Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">세부 품목 및 투명한 정가표</h4>
                </div>
                <div className="space-y-2.5">
                  {selectedAppliance.options.map((opt) => {
                    const isPhoneInquiry = opt.name.includes('전화문의') || opt.description.includes('전화문의');
                    const hasDiscount = opt.originalPrice && opt.originalPrice > opt.price;
                    const discountPercent = hasDiscount
                      ? Math.round(((opt.originalPrice! - opt.price) / opt.originalPrice!) * 100)
                      : 0;

                    return (
                      <div
                        key={opt.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-2xl border transition-all gap-2 ${
                          isPhoneInquiry
                            ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-sm font-extrabold text-gray-900">{opt.name}</span>
                            {isPhoneInquiry && (
                              <a
                                href="tel:1577-7931"
                                className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md hover:bg-amber-200 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-amber-700" />
                                <span>1대만 청소시 전화상담</span>
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{opt.description} (소요시간 약 {opt.estimatedMinutes}분)</div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {hasDiscount ? (
                            <div className="flex items-center sm:flex-col sm:items-end gap-1.5 sm:gap-0">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-rose-500 font-bold line-through decoration-rose-500 decoration-2">
                                  {opt.originalPrice?.toLocaleString()}원
                                </span>
                                {discountPercent > 0 && (
                                  <span className="text-[10px] font-black text-white bg-rose-500 px-1.5 py-0.2 rounded-md">
                                    -{discountPercent}%
                                  </span>
                                )}
                              </div>
                              <div className="text-base sm:text-lg font-black text-blue-600 sm:text-blue-700">
                                {opt.price.toLocaleString()}원
                              </div>
                            </div>
                          ) : (
                            <div className="text-base sm:text-lg font-black text-blue-600 sm:text-blue-700">
                              {opt.price.toLocaleString()}원
                            </div>
                          )}

                          <button
                            onClick={() => onOpenBooking(selectedAppliance.id)}
                            className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center justify-end space-x-0.5 mt-0.5"
                          >
                            <span>선택</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Surcharges / Business Notice Box */}
                <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>추가요금 및 특수작업 안내</span>
                  </div>
                  {selectedAppliance.id === 'aircon' && (
                    <p className="text-slate-600 leading-relaxed">
                      • <strong>특수 모델 추가요금 (+4만원)</strong>: 무풍3구, 갤러리, 로봇, 연아3구, 아로마계열, 미켈란젤로, 오브제, LG로봇계열 제품 등은 작업 난이도에 따라 추가요금 4만원이 발생합니다.
                    </p>
                  )}
                  {selectedAppliance.id === 'washer' && (
                    <p className="text-slate-600 leading-relaxed">
                      • <strong>1대만 청소시 (드럼세탁기 위 건조기 설치)</strong>: 1대만 청소시 드럼세탁기 위에 건조기가 있는 경우 전화상담 후 안내해 드립니다. 작업장 사진을 보내주시면 상세히 안내해 드립니다. (1577-7931)
                    </p>
                  )}
                  {selectedAppliance.id === 'dryer' && (
                    <p className="text-slate-600 leading-relaxed">
                      • <strong>건조기 이동 및 특수공간</strong>: 건조기 이동, 드럼 세탁기 위 건조기가 놓인 경우, 주변 공간이 협소한 경우 특수 작업비(+6만원)가 적용됩니다.
                    </p>
                  )}
                  <p className="text-slate-600 leading-relaxed">
                    • <strong>사업장/업소 오염도 추가요금 (+2만원)</strong>: 사업장의 경우 먼지 오염도 및 기름때가 심할 경우 현장 오염도에 따라 추가요금 2만원이 발생될 수 있습니다. (에어컨/세탁기/건조기 공통)
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column - Disassembly Workflow Process */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Step Process Summary */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center justify-between">
                  <span>{selectedAppliance.title} 표준 분해세척 순서</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-extrabold">100% 완전분해</span>
                </h4>
                <div className="space-y-3">
                  {selectedAppliance.processSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-extrabold text-gray-900">{step.title}</span>
                        <p className="text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Full-width 100% Before/After Comparison Gallery below price table */}
        <StandAirconBeforeAfter onOpenBooking={() => onOpenBooking(selectedAppliance.id)} />

      </div>
    </section>
  );
};
