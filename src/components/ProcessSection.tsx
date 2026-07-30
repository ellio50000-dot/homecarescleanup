import React from 'react';
import { ShieldCheck, Award, Sparkles, CheckCircle2, Wrench, Thermometer, Droplets, RefreshCw, Clock } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: '방문 및 시운전 정밀 점검',
      description: '전문 기사가 방문하여 분해 전 가전의 동작 상태, 소음, 풍량, 진동을 정밀 검사합니다.',
      icon: <Clock className="w-6 h-6 text-blue-600" />,
    },
    {
      step: '02',
      title: '100% 부품 완전 분해',
      description: '드레인, 송풍팬, 세탁조 스텐통, 고무패킹 등 분해 가능한 모든 부품을 안전하게 탈거합니다.',
      icon: <Wrench className="w-6 h-6 text-indigo-600" />,
    },
    {
      step: '03',
      title: '친환경 전용 세제 살포',
      description: '환경부 인증 인체에 유해하지 않은 친환경 곰팡이/기름때 전용 세제로 때를 분해시킵니다.',
      icon: <Droplets className="w-6 h-6 text-cyan-600" />,
    },
    {
      step: '04',
      title: '고압 수세 & 맞춤 살균 소독',
      description: '강력한 고압 수세와 맞춤 살균 소독(공기청정기 등 필요시 고온 스팀)으로 손이 닿지 않는 깊숙한 곳까지 세균 99.9% 멸균합니다.',
      icon: <Thermometer className="w-6 h-6 text-rose-600" />,
    },
    {
      step: '05',
      title: '피톤치드 연무 & UV 오존 케어',
      description: '천연 편백 피톤치드 연무 소독으로 잔여 냄새를 차단하고 실내 공간 항균 막을 형성합니다.',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    },
    {
      step: '06',
      title: '조립 후 시운전 기능테스트',
      description: '건조 후 완벽하게 재조립하고, 고객님과 함께 최종 작동 상태를 시운전하며 기능테스트를 완료합니다.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <section id="process" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
            SYSTEMATIC CLEANING PROCESS
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            체계적인 <span className="text-blue-600">6단계 분해 세척</span> 프로세스
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            전문 자격을 보유한 홈케어 엔지니어가 매뉴얼을 준수하여 정성을 다해 세척합니다.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-slate-50 hover:bg-blue-50/50 p-6 rounded-3xl border border-gray-200/80 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-gray-300 group-hover:text-blue-600 transition-colors">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Guarantees Cards */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-blue-800/80">
            
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="inline-flex p-3 rounded-2xl bg-blue-800/50 text-blue-300 border border-blue-600/40 mb-1">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="text-lg font-extrabold text-white">KB 1억원 배상책임보험</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                세척 작업 중 발생할 수 있는 이상이나 제품 손상에 대해 KB손해보험 1억원 배상책임으로 완벽 보상해 드립니다.
              </p>
            </div>

            <div className="space-y-2 pt-6 md:pt-0 md:pl-8">
              <div className="inline-flex p-3 rounded-2xl bg-blue-800/50 text-blue-300 border border-blue-600/40 mb-1">
                <RefreshCw className="w-7 h-7 text-sky-400" />
              </div>
              <h4 className="text-lg font-extrabold text-white">친환경 인증 세제 사용</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                아이와 반려동물도 안심할 수 있는 환경부 인증 인체 무해 친환경 약품과 세제만을 엄선하여 사용합니다.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
