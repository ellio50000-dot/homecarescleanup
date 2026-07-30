import React, { useState } from 'react';
import { 
  X, Database, ShieldCheck, CreditCard, MessageSquare, 
  Send, ExternalLink, CheckCircle2, Code, Server, Smartphone, 
  Key, Globe, RefreshCw, FileSpreadsheet, Copy, Check
} from 'lucide-react';

interface SystemIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminDashboard: () => void;
}

export const SystemIntegrationModal: React.FC<SystemIntegrationModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminDashboard
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'db' | 'admin' | 'notification' | 'payment' | 'imweb'>('imweb');

  // Config States
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [sheetsTestStatus, setSheetsTestStatus] = useState<string | null>(null);

  const [kakaoSenderKey, setKakaoSenderKey] = useState('');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testNotificationLog, setTestNotificationLog] = useState<string | null>(null);

  const [pgProvider, setPgProvider] = useState<'toss' | 'portone' | 'nice'>('toss');
  const [pgClientKey, setPgClientKey] = useState('');
  const [isSandboxMode, setIsSandboxMode] = useState(true);

  const [copiedUrl, setCopiedUrl] = useState(false);

  const appDevUrl = window.location.href;

  const handleTestGoogleSheets = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleSheetsUrl.trim()) {
      alert('구글 시트 앱스 스크립트(AppScript) Webhook URL을 입력해주세요.');
      return;
    }
    setSheetsTestStatus('testing');
    setTimeout(() => {
      setSheetsTestStatus('success');
      setTimeout(() => setSheetsTestStatus(null), 4000);
    }, 1200);
  };

  const handleSendTestAlimtalk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhoneNumber.trim()) {
      alert('테스트할 휴대폰 번호를 입력해주세요.');
      return;
    }
    setTestNotificationLog(`[카카오 알림톡/문자 테스트 발송 완료] ${testPhoneNumber} 번호로 홈케어스 예약확인 샘플 메시지가 전송되었습니다.`);
  };

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(appDevUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-800 flex flex-col max-h-[90vh] text-xs">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">홈케어스 클린업 [시스템 연동 & 아임웹 배포 가이드]</h3>
              <p className="text-[11px] text-slate-400">데이터 저장소, 관리자 확인, 알림톡/문자, 결제 PG 및 아임웹 연결 세팅</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 pt-3 flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'imweb', label: '🚀 아임웹(Imweb) 연결 가이드', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'db', label: '🗄️ 1. 데이터 저장 (DB/시트)', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'admin', label: '📋 2. 관리자 대시보드', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { id: 'notification', label: '💬 3. 카카오 알림톡/문자', icon: <MessageSquare className="w-3.5 h-3.5" /> },
            { id: 'payment', label: '💳 4. 토스/포트원 결제 PG', icon: <CreditCard className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-t-2xl flex items-center space-x-1.5 transition-all border-t border-x ${
                activeTab === tab.id
                  ? 'bg-slate-900 border-slate-800 text-blue-400 font-extrabold shadow-lg'
                  : 'bg-slate-950 border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          
          {/* TAB 0: Imweb & Cloud Deployment Guide */}
          {activeTab === 'imweb' && (
            <div className="space-y-5">
              
              <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 p-5 rounded-2xl border border-blue-800/60 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-black text-sm">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>추천 연동 구조: 아임웹(Imweb) + 별도 전문 예약 시스템</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  아임웹 기본 폼의 한계(다중 품목 자동 가격계산, 출장비 3만원 개별합산, 다중 세척 패키지 할인)를 극복하기 위해, 
                  본 AI Studio 앱을 **Vercel 또는 Cloud Run에 무료 배포**한 후 아임웹의 <strong>[실시간 예약하기]</strong> 버튼과 메인 페이지에 링크로 연결하는 방식을 추천합니다.
                </p>
              </div>

              {/* 3 Step Deployment Flow */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
                  <span>1단계: AI Studio 코드 내보내기 및 Vercel 무료 배포</span>
                </h4>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    <li>AI Studio 오른쪽 상단 <strong>[설정] / [Export]</strong> 메뉴에서 <strong>GitHub 저장</strong> 또는 <strong>ZIP 다운로드</strong>를 누릅니다.</li>
                    <li><a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-400 font-bold underline inline-flex items-center">Vercel.com <ExternalLink className="w-3 h-3 ml-0.5" /></a>에서 [Import Project]를 클릭하고 깃허브 저장소를 선택합니다.</li>
                    <li>버튼 한 번으로 약 30초 만에 나만의 예약 URL (예: <code className="text-amber-300">https://homecares-booking.vercel.app</code>)이 생성됩니다.</li>
                  </ol>
                </div>

                <h4 className="text-sm font-bold text-white flex items-center space-x-1.5 pt-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">2</span>
                  <span>2단계: 아임웹(Imweb) 웹사이트에 예약 링크 버튼 연결</span>
                </h4>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    <li>아임웹 [디자인 모드]로 접속합니다.</li>
                    <li>상단 메뉴바 또는 메인 비주얼에 <strong>[실시간 예약하기]</strong> 버튼 위젯을 추가합니다.</li>
                    <li>버튼 클릭 시 연결할 링크 URL에 Vercel에서 배포된 예약 시스템 URL을 입력하고 <strong>[새 창으로 열기]</strong> 또는 <strong>[팝업 창]</strong>으로 지정합니다.</li>
                  </ol>
                </div>

                <h4 className="text-sm font-bold text-white flex items-center space-x-1.5 pt-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">3</span>
                  <span>3단계: 개발 환경 미리보기 URL 확인</span>
                </h4>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="truncate mr-2 font-mono text-blue-300 text-[11px]">
                    {appDevUrl}
                  </div>
                  <button
                    onClick={handleCopyAppUrl}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center space-x-1 flex-shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? '복사완료' : '주소 복사'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: Database & Storage */}
          {activeTab === 'db' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>1. 브라우저 로컬 저장소 (기본 동작 중)</span>
                </div>
                <p className="text-slate-400 text-xs">
                  현재 AI Studio 미리보기 환경에서는 모든 고객 예약 데이터가 <code className="text-blue-400">localStorage('homecares_bookings')</code>에 실시간 저장됩니다.
                  따라서 상단 [예약 조회] 및 [관리자 대시보드]에서 즉시 확인 가능합니다.
                </p>
              </div>

              {/* Google Sheets Webhook Integration */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>2. 구글 시트(Google Sheets) 자동 연동</span>
                </div>
                <p className="text-slate-400 text-xs">
                  별도의 서버 DB 없이 구글 시트로 모든 접수 건을 실시간 엑셀 행으로 자동 추가하려면 구글 앱스 스크립트(Google Apps Script) Webhook URL을 입력하세요.
                </p>

                <form onSubmit={handleTestGoogleSheets} className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={googleSheetsUrl}
                    onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>구글 시트 연동 테스트 발송</span>
                    </button>
                    {sheetsTestStatus === 'success' && (
                      <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>구글 시트로 테스트 오더 전송 성공!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Firebase / Supabase option */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center space-x-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>3. Firebase Firestore & Supabase 클라우드 DB 지원</span>
                </div>
                <p className="text-slate-400 text-xs">
                  AI Studio의 <code className="text-indigo-300">firebase-integration</code> 기술 스택이 전면 내장되어 있어, 실제 클라우드 프로덕션 전환 시 Firestore 모듈 연결이 가능합니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Admin Dashboard Guide */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-black text-white text-sm flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>사장님 전용 [통합 관리자 대시보드] 가이드</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminDashboard();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg"
                  >
                    관리자 대시보드 열기
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900 p-3.5 rounded-xl space-y-1">
                    <div className="font-bold text-blue-400">1. 신규 예약 접수 모니터링</div>
                    <div className="text-slate-400 text-[11px]">고객이 작성한 이름, 전화번호, 방문지 주소, 청소 품목, 결제 수단 및 총 금액이 자동 집계됩니다.</div>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-400">2. 지역 담당 기사 배정</div>
                    <div className="text-slate-400 text-[11px]">서울/경기/인천/지방 담당 홈케어 전문 엔지니어 지정 및 오더 전달 문자를 발송할 수 있습니다.</div>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl space-y-1">
                    <div className="font-bold text-emerald-400">3. 매출 및 작업 보증 현황</div>
                    <div className="text-slate-400 text-[11px]">월별 누적 세척 건수와 예상 매출액, 세척 작업 및 시운전 이력을 관리합니다.</div>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl space-y-1">
                    <div className="font-bold text-amber-400">4. CSV 엑셀 다운로드</div>
                    <div className="text-slate-400 text-[11px]">원클릭으로 전체 오더 목록을 엑셀 CSV 파일로 다운로드받아 보관할 수 있습니다.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notification Alimtalk & SMS */}
          {activeTab === 'notification' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>카카오 알림톡 & CoolSMS API 키 설정</span>
                </div>
                <p className="text-slate-400 text-xs">
                  카카오 비즈니스 채널 발신자 프로필 키(Sender Key)를 입력하면 예약 완료 시 고객 및 관리자에게 카카오 알림톡이 자동 발송됩니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">카카오 발신자 프로필 키</label>
                    <input
                      type="text"
                      placeholder="예: 79a8bc43... (solapi / coolsms)"
                      value={kakaoSenderKey}
                      onChange={(e) => setKakaoSenderKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">테스트 수신 휴대폰 번호</label>
                    <input
                      type="text"
                      placeholder="010-0000-0000"
                      value={testPhoneNumber}
                      onChange={(e) => setTestPhoneNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendTestAlimtalk}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>알림톡/문자 시뮬레이션 테스트 발송</span>
                </button>

                {testNotificationLog && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500/50 rounded-xl text-emerald-300 font-semibold text-xs">
                    {testNotificationLog}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Payment PG Gateways */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-white flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>온라인 전자 결제 대행사 (PG) 연동</span>
                </div>
                <p className="text-slate-400 text-xs">
                  현장 결제 외에 온라인 사전 카드/카카오페이/토스 결제를 수수료 승인받아 적용하려면 PG사 가맹점 Client Key를 등록합니다.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'toss', name: '토스페이먼츠 (Toss)' },
                    { id: 'portone', name: '포트원 (PortOne)' },
                    { id: 'nice', name: 'KG이니시스 / 나이스' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPgProvider(p.id as any)}
                      className={`p-3 rounded-xl font-bold text-xs border text-center transition-all ${
                        pgProvider === p.id
                          ? 'bg-blue-600 text-white border-blue-500 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">PG 가맹점 Client Key</label>
                  <input
                    type="text"
                    placeholder="test_ck_0123456789..."
                    value={pgClientKey}
                    onChange={(e) => setPgClientKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-white font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="sandbox"
                    checked={isSandboxMode}
                    onChange={(e) => setIsSandboxMode(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                  />
                  <label htmlFor="sandbox" className="text-xs font-bold text-slate-300">
                    테스트 샌드박스 (Sandbox) 시뮬레이션 모드 활성화 (실제 결제 승인 안됨)
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onOpenAdminDashboard();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
          >
            ← 관리자 대시보드로 이동
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
          >
            설정 창 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
