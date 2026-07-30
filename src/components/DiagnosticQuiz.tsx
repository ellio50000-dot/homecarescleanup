import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import { ApplianceCategory } from '../types';

interface DiagnosticQuizProps {
  onOpenBooking: (applianceId?: string) => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({ onOpenBooking }) => {
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceCategory>('aircon');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const quizData: Record<ApplianceCategory, { title: string; symptoms: { id: string; text: string; severity: 'high' | 'medium' }[] }> = {
    aircon: {
      title: '에어컨 증상 진단',
      symptoms: [
        { id: 'ac-1', text: '바람에서 곰팡이/시큼한 걸레 냄새가 난다', severity: 'high' },
        { id: 'ac-2', text: '송풍구 날개 안쪽에 검은 먼지/곰팡이 점이 보인다', severity: 'high' },
        { id: 'ac-3', text: '바람이 예전보다 약하고 전기세가 많이 나온다', severity: 'medium' },
        { id: 'ac-4', text: '에어컨을 틀면 눈이 따갑거나 기침이 난다', severity: 'high' },
      ],
    },
    washer: {
      title: '세탁기 증상 진단',
      symptoms: [
        { id: 'w-1', text: '세탁물에 검은색 미역귀 이물질이 묻어나온다', severity: 'high' },
        { id: 'w-2', text: '세탁을 마쳐도 옷감에서 꿉꿉한 냄새가 난다', severity: 'high' },
        { id: 'w-3', text: '고무패킹 사이에 검은 곰팡이가 피어있다', severity: 'medium' },
        { id: 'w-4', text: '세탁조 클리너를 써도 이물질이 계속 나온다', severity: 'high' },
      ],
    },
    dryer: {
      title: '건조기 증상 진단',
      symptoms: [
        { id: 'd-1', text: '건조 시간이 기존보다 2배 이상 길어졌다', severity: 'high' },
        { id: 'd-2', text: '건조 후 수건이나 옷에서 쉰내가 난다', severity: 'high' },
        { id: 'd-3', text: '콘덴서 핀에 먼지가 하얗게 눌러붙어 있다', severity: 'high' },
        { id: 'd-4', text: '건조 후 옷감이 눅눅하고 먼지가 심하게 날린다', severity: 'medium' },
      ],
    },
    purifier: {
      title: '공기청정기 증상 진단',
      symptoms: [
        { id: 'p-1', text: '바람 토출구 안쪽 팬 날개에 먼지가 하얗게 매달려있다', severity: 'high' },
        { id: 'p-2', text: '틀었을 때 쿰쿰한 먼지 냄새가 풍긴다', severity: 'high' },
        { id: 'p-3', text: '공기청정 지수가 나쁨에서 잘 내려가지 않는다', severity: 'medium' },
      ],
    },
    dehumidifier: {
      title: '제습기 증상 진단',
      symptoms: [
        { id: 'dh-1', text: '물통 바닥이나 구석에 검은 물이끼/곰팡이가 피어있다', severity: 'high' },
        { id: 'dh-2', text: '작동 시 걸레 빤 물 냄새가 온 집안에 진동한다', severity: 'high' },
        { id: 'dh-3', text: '제습력이 약해져 물이 잘 차오르지 않는다', severity: 'medium' },
      ],
    },
    fridge: {
      title: '냉장고 증상 진단',
      symptoms: [
        { id: 'f-1', text: '냉장고 문을 열 때마다 상한 음식물 악취가 난다', severity: 'high' },
        { id: 'f-2', text: '선반 구석에 기름때나 국물 자국이 굳어있다', severity: 'medium' },
        { id: 'f-3', text: '문 고무패킹이 검게 오염되어 밀착력이 떨어진다', severity: 'high' },
      ],
    },
  };

  const currentQuiz = quizData[selectedAppliance];

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const hasHighSeverity = selectedSymptoms.some((id) =>
    currentQuiz.symptoms.find((s) => s.id === id)?.severity === 'high'
  );

  return (
    <section id="diagnostic" className="py-16 bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>스마트 가전 오염도 상태 진단</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            우리집 가전, 지금 세척이 필요할까요?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            가전 종류와 체크 항목을 선택하시면 세척 시급도 및 추천 케어 패키지를 바로 안내해 드립니다.
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 lg:p-8 max-w-4xl mx-auto shadow-2xl space-y-6">
          
          {/* Appliance Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              1. 진단할 가전 선택
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'aircon', label: '에어컨' },
                { id: 'washer', label: '세탁기' },
                { id: 'dryer', label: '건조기' },
                { id: 'purifier', label: '공기청정기' },
                { id: 'dehumidifier', label: '제습기' },
                { id: 'fridge', label: '냉장고' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedAppliance(item.id as ApplianceCategory);
                    setSelectedSymptoms([]);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedAppliance === item.id
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              2. 해당되는 증상을 모두 체크해주세요 ({currentQuiz.title})
            </label>
            <div className="space-y-2">
              {currentQuiz.symptoms.map((symptom) => {
                const isChecked = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-blue-900/60 border-blue-400 text-white shadow-inner'
                        : 'bg-slate-900/40 border-slate-700/70 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isChecked ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-600'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span>{symptom.text}</span>
                    </div>
                    {symptom.severity === 'high' && (
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                        위험 증상
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {selectedSymptoms.length === 0 ? (
                  <div className="text-slate-400 text-xs">증상을 선택하시면 세척 필요도를 진단해드립니다.</div>
                ) : hasHighSeverity ? (
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                    <span>[진단결과] 긴급 완전분해 세척 필요 (곰팡이/세균 번식 심각)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-5 h-5" />
                    <span>[진단결과] 정기 분해 세척 추천 단계</span>
                  </div>
                )}
              </div>

              {selectedSymptoms.length > 0 && (
                <span className="text-xs text-blue-300 font-semibold">
                  선택항목: {selectedSymptoms.length}개
                </span>
              )}
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-300">
                  {hasHighSeverity
                    ? '가전 내부 열교환기 및 드레인 팬에 곰팡이가 누적되어 공기 질 악화와 호흡기 질환의 원인이 됩니다. 지금 세척을 신청하세요.'
                    : '정기적인 분해 세척으로 가전 수명을 연장하고 전기료를 최대 25% 절감할 수 있습니다.'}
                </p>

                <button
                  onClick={() => onOpenBooking(selectedAppliance)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>진단 기반 가전 예약하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
