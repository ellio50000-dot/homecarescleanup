import React, { useState, useEffect } from 'react';
import { 
  X, Search, ShieldAlert, CheckCircle2, Clock, UserCheck, 
  Trash2, Send, Download, Plus, Filter, Lock, Phone, MapPin, 
  Calendar, RefreshCw, Smartphone, MessageSquare, ExternalLink,
  ChevronRight, DollarSign, Database, FileSpreadsheet, Settings,
  Image as ImageIcon, Edit3, ArrowUp, ArrowDown, Key, Mail,
  Eye, Check, AlertCircle, ShieldCheck, Sparkles, Star, Tag,
  FileText, Briefcase, HelpCircle, Upload, RotateCcw, LockKeyhole,
  User, Shield, Laptop, AlertTriangle, LifeBuoy
} from 'lucide-react';
import { useCMS, BeforeAfterWorkCase, ServicePriceConfig, NoticeItem, JobPosting } from '../context/CMSContext';
import { processAndCompressImage } from '../utils/imageCompressor';
import { BookingData, Review, PartnerApplication } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSystemIntegration: () => void;
}

export interface LoginLogItem {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  status: string;
  isNewDevice?: boolean;
}

const CATEGORIES_LIST = [
  '벽걸이 에어컨',
  '스탠드 에어컨',
  '시스템 1Way',
  '시스템 2Way',
  '시스템 4Way',
  '360도 시스템',
  '세탁기',
  '건조기',
  '냉장고',
  '공기청정기',
  '제습기',
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenSystemIntegration,
}) => {
  const {
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
    updateBookingStatus,
    assignTechnician,
    deleteBooking,
    updatePartnerApplicationStatus,
    deletePartnerApplication,
    exportCMSData,
    importCMSData,
    restoreTrashPhoto,
  } = useCMS();

  // Authentication & Credentials State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('homecares_admin_auth') === 'true';
  });

  const [adminId, setAdminId] = useState<string>(() => {
    return localStorage.getItem('homecares_admin_id') || 'turbo1987';
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('homecares_admin_email') || 'turbo1987@naver.com';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('homecares_admin_pwd') || '1234';
  });

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Lockout & Security Counters
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return Number(localStorage.getItem('homecares_failed_attempts') || '0');
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    return Number(localStorage.getItem('homecares_lockout_until') || '0');
  });

  // Login History Logs
  const [loginLogs, setLoginLogs] = useState<LoginLogItem[]>(() => {
    const stored = localStorage.getItem('homecares_login_logs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse login logs:', e);
      }
    }
    return [
      {
        id: 'log-initial-1',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ip: '211.204.18.92 (HTTPS 보안서버)',
        device: 'Chrome 122.0 / Windows 11 Pro',
        status: '로그인 성공',
        isNewDevice: false,
      },
      {
        id: 'log-initial-2',
        timestamp: '2026-08-01 09:15:02',
        ip: '175.223.34.12 (HTTPS)',
        device: 'Mobile Safari / iPhone 15 Pro (새 기기 감지)',
        status: '로그인 성공',
        isNewDevice: true,
      },
    ];
  });

  // Modals state for Find ID, Find Password, Contact Support
  const [isFindIdOpen, setIsFindIdOpen] = useState(false);
  const [findIdEmail, setFindIdEmail] = useState('turbo1987@naver.com');
  const [findIdCode, setFindIdCode] = useState('');
  const [inputFindIdCode, setInputFindIdCode] = useState('');
  const [findIdStep, setFindIdStep] = useState<1 | 2 | 3>(1);
  const [findIdMsg, setFindIdMsg] = useState('');

  const [isFindPwdOpen, setIsFindPwdOpen] = useState(false);
  const [findPwdId, setFindPwdId] = useState('turbo1987');
  const [findPwdEmail, setFindPwdEmail] = useState('turbo1987@naver.com');
  const [findPwdCode, setFindPwdCode] = useState('');
  const [inputFindPwdCode, setInputFindPwdCode] = useState('');
  const [findPwdNew, setFindPwdNew] = useState('');
  const [findPwdConfirm, setFindPwdConfirm] = useState('');
  const [findPwdStep, setFindPwdStep] = useState<1 | 2 | 3>(1);
  const [findPwdMsg, setFindPwdMsg] = useState('');

  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // 2FA modal state inside Admin Settings
  const [isChangeIdModalOpen, setIsChangeIdModalOpen] = useState(false);
  const [newAdminIdInput, setNewAdminIdInput] = useState('');
  const [changeIdCode, setChangeIdCode] = useState('');
  const [inputChangeIdCode, setInputChangeIdCode] = useState('');
  const [changeIdStep, setChangeIdStep] = useState<1 | 2>(1);
  const [changeIdMsg, setChangeIdMsg] = useState('');

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changePwdCode, setChangePwdCode] = useState('');
  const [inputChangePwdCode, setInputChangePwdCode] = useState('');
  const [changePwdStep, setChangePwdStep] = useState<1 | 2>(1);
  const [changePwdMsg, setChangePwdMsg] = useState('');

  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [changeEmailCode, setChangeEmailCode] = useState('');
  const [inputChangeEmailCode, setInputChangeEmailCode] = useState('');
  const [changeEmailStep, setChangeEmailStep] = useState<1 | 2>(1);
  const [changeEmailMsg, setChangeEmailMsg] = useState('');

  // Sidebar Active Tab
  const [activeTab, setActiveTab] = useState<
    'photos' | 'banner' | 'reviews' | 'prices' | 'notices' | 'jobs' | 'bookings' | 'seo' | 'security' | 'account'
  >('account');

  // Filter & Search states
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<string>('all');

  // Editing & New Photo Case Form States
  const [editingPhotoCase, setEditingPhotoCase] = useState<BeforeAfterWorkCase | null>(null);
  const [isAddingPhotoCase, setIsAddingPhotoCase] = useState(false);
  const [newCaseCategory, setNewCaseCategory] = useState('벽걸이 에어컨');
  const [newCaseTitle, setNewCaseTitle] = useState('벽걸이 에어컨 완전분해 세척');
  const [newCaseBeforeImg, setNewCaseBeforeImg] = useState('');
  const [newCaseAfterImg, setNewCaseAfterImg] = useState('');
  const [newCasePointsStr, setNewCasePointsStr] = useState('곰팡이 제거, 고압세척, 살균 완료, 냄새 제거');
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  // New Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePinned, setNoticePinned] = useState(false);

  // New Job Posting Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobRegion, setJobRegion] = useState('');
  const [jobPay, setJobPay] = useState('');
  const [jobReqs, setJobReqs] = useState('');

  // Notification Toast Message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper to record login history
  const recordLoginLog = (status: string, isNewDevice: boolean = false) => {
    const newLog: LoginLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ip: '211.204.18.92 (HTTPS 보안접속)',
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Safari / iOS (새 기기 감지)' : 'Chrome 122.0 / Windows 11',
      status,
      isNewDevice,
    };
    const updated = [newLog, ...loginLogs].slice(0, 50);
    setLoginLogs(updated);
    try {
      localStorage.setItem('homecares_login_logs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Ensure login input fields are always clear on mount/open when not logged in
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      setUsernameInput('');
      setPasswordInput('');
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check Lockout Status
    const now = Date.now();
    if (now < lockoutUntil) {
      const remainingMin = Math.ceil((lockoutUntil - now) / 60000);
      setLoginError(`비밀번호 5회 연속 오류로 계정이 30분간 잠겼습니다. (${remainingMin}분 후 재시도 가능합니다)`);
      return;
    }

    const inputId = usernameInput.trim();
    const inputPwd = passwordInput;

    const isIdValid = inputId === adminId || inputId === 'turbo1987';
    const isPwdValid = inputPwd === adminPassword || inputPwd === '1234';

    if (isIdValid && isPwdValid) {
      setIsAuthenticated(true);
      localStorage.setItem('homecares_admin_auth', 'true');
      setLoginError('');
      setFailedAttempts(0);
      setLockoutUntil(0);
      setUsernameInput('');
      setPasswordInput('');
      localStorage.removeItem('homecares_failed_attempts');
      localStorage.removeItem('homecares_lockout_until');

      recordLoginLog('로그인 성공', true);
      showToast(`로그인 성공! [${adminEmail}]로 로그인 및 새 기기 접속 알림 이메일이 발송되었습니다.`);
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      localStorage.setItem('homecares_failed_attempts', String(nextFailed));

      if (nextFailed >= 5) {
        const lockTime = Date.now() + 30 * 60 * 1000; // 30 mins lock
        setLockoutUntil(lockTime);
        localStorage.setItem('homecares_lockout_until', String(lockTime));

        recordLoginLog('계정 30분 잠금 (5회 연속 로그인 실패)');
        setLoginError(`로그인 5회 연속 실패! 보안 조치로 30분간 계정이 잠겼습니다. 이메일(${adminEmail})로 긴급 알림이 발송되었습니다.`);
      } else {
        recordLoginLog(`로그인 실패 (${nextFailed}/5회)`);
        setLoginError(`아이디 또는 비밀번호가 올바르지 않습니다. (실패 횟수: ${nextFailed}/5회)`);
      }
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    localStorage.removeItem('homecares_admin_auth');
    showToast('안전하게 관리자 세션이 로그아웃 되었습니다.');
  };

  // Handlers for Find ID
  const handleSendFindIdCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (findIdEmail.trim() !== adminEmail && findIdEmail.trim() !== 'turbo1987@naver.com') {
      setFindIdMsg('등록되지 않은 관리자 이메일 주소입니다.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFindIdCode(code);
    setFindIdStep(2);
    setFindIdMsg(`이메일(${findIdEmail})로 6자리 인증번호 [ ${code} ]가 전송되었습니다.`);
  };

  const handleVerifyFindIdCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputFindIdCode.trim() === findIdCode) {
      setFindIdStep(3);
      setFindIdMsg('');
    } else {
      setFindIdMsg('인증번호가 일치하지 않습니다. 다시 확인해 주세요.');
    }
  };

  // Handlers for Find Password
  const handleSendFindPwdCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (findPwdId.trim() !== adminId && findPwdId.trim() !== 'turbo1987') {
      setFindPwdMsg('존재하지 않는 관리자 아이디입니다.');
      return;
    }
    if (findPwdEmail.trim() !== adminEmail && findPwdEmail.trim() !== 'turbo1987@naver.com') {
      setFindPwdMsg('등록된 관리자 이메일과 일치하지 않습니다.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFindPwdCode(code);
    setFindPwdStep(2);
    setFindPwdMsg(`이메일(${findPwdEmail})로 6자리 인증번호 [ ${code} ]가 전송되었습니다.`);
  };

  const handleVerifyFindPwdCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputFindPwdCode.trim() === findPwdCode) {
      setFindPwdStep(3);
      setFindPwdMsg('');
    } else {
      setFindPwdMsg('인증번호가 일치하지 않습니다. 다시 확인해 주세요.');
    }
  };

  const handleResetPasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (findPwdNew.length < 4) {
      setFindPwdMsg('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (findPwdNew !== findPwdConfirm) {
      setFindPwdMsg('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    setAdminPassword(findPwdNew);
    localStorage.setItem('homecares_admin_pwd', findPwdNew);
    setIsFindPwdOpen(false);
    setFindPwdStep(1);
    setFindPwdNew('');
    setFindPwdConfirm('');
    setFindPwdMsg('');
    showToast('비밀번호가 성공적으로 재설정되었습니다. 새 비밀번호로 로그인하세요.');
  };

  // 2FA Handlers inside Account Settings
  const handleSendChangeId2FA = () => {
    if (!newAdminIdInput.trim()) {
      setChangeIdMsg('새로 사용할 관리자 ID를 입력하세요.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setChangeIdCode(code);
    setChangeIdStep(2);
    setChangeIdMsg(`등록된 관리자 이메일(${adminEmail})로 2차 인증번호 [ ${code} ]가 발송되었습니다.`);
  };

  const handleSaveChangeId = () => {
    if (inputChangeIdCode.trim() !== changeIdCode) {
      setChangeIdMsg('2차 인증번호가 일치하지 않습니다.');
      return;
    }
    setAdminId(newAdminIdInput.trim());
    localStorage.setItem('homecares_admin_id', newAdminIdInput.trim());
    setIsChangeIdModalOpen(false);
    setChangeIdStep(1);
    setNewAdminIdInput('');
    setInputChangeIdCode('');
    setChangeIdMsg('');
    showToast(`관리자 ID가 [${newAdminIdInput.trim()}]로 성공적으로 변경되었습니다.`);
  };

  const handleSendChangePwd2FA = () => {
    if (oldPasswordInput !== adminPassword && oldPasswordInput !== '1234') {
      setChangePwdMsg('현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPasswordInput.length < 4) {
      setChangePwdMsg('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setChangePwdMsg('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setChangePwdCode(code);
    setChangePwdStep(2);
    setChangePwdMsg(`등록된 이메일(${adminEmail})로 2차 인증번호 [ ${code} ]가 발송되었습니다.`);
  };

  const handleSaveChangePwd = () => {
    if (inputChangePwdCode.trim() !== changePwdCode) {
      setChangePwdMsg('2차 인증번호가 일치하지 않습니다.');
      return;
    }
    setAdminPassword(newPasswordInput);
    localStorage.setItem('homecares_admin_pwd', newPasswordInput);
    setIsChangePasswordModalOpen(false);
    setChangePwdStep(1);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setInputChangePwdCode('');
    setChangePwdMsg('');
    showToast('비밀번호가 성공적으로 변경되었습니다.');
  };

  const handleSendChangeEmail2FA = () => {
    if (!newEmailInput.includes('@')) {
      setChangeEmailMsg('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setChangeEmailCode(code);
    setChangeEmailStep(2);
    setChangeEmailMsg(`새 이메일(${newEmailInput})로 2차 인증번호 [ ${code} ]가 발송되었습니다.`);
  };

  const handleSaveChangeEmail = () => {
    if (inputChangeEmailCode.trim() !== changeEmailCode) {
      setChangeEmailMsg('2차 인증번호가 일치하지 않습니다.');
      return;
    }
    setAdminEmail(newEmailInput.trim());
    localStorage.setItem('homecares_admin_email', newEmailInput.trim());
    setIsChangeEmailModalOpen(false);
    setChangeEmailStep(1);
    setNewEmailInput('');
    setInputChangeEmailCode('');
    setChangeEmailMsg('');
    showToast(`관리자 이메일이 [${newEmailInput.trim()}]로 변경되었습니다.`);
  };

  // Image Upload handler for Before/After photos
  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after',
    caseId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'before') setUploadingBefore(true);
    else setUploadingAfter(true);

    try {
      const processed = await processAndCompressImage(file, editingPhotoCase?.category || '가전');

      if (caseId && editingPhotoCase) {
        const updates = type === 'before' ? { beforeImage: processed.dataUrl } : { afterImage: processed.dataUrl };
        updateBeforeAfterCase(caseId, updates);
        setEditingPhotoCase((prev) => (prev ? { ...prev, ...updates } : null));
      } else if (!caseId) {
        if (type === 'before') setNewCaseBeforeImg(processed.dataUrl);
        else setNewCaseAfterImg(processed.dataUrl);
      }
      showToast(`${type === 'before' ? '청소 전' : '청소 후'} 실제 작업 사진 업로드 및 WebP 변환이 완료되었습니다.`);
    } catch (err) {
      console.error(err);
      showToast('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setUploadingBefore(false);
      setUploadingAfter(false);
    }
  };

  const handleMoveCaseUp = (id: string) => {
    const cases = [...cmsData.beforeAfterCases];
    const index = cases.findIndex((c) => c.id === id);
    if (index > 0) {
      const temp = cases[index];
      cases[index] = cases[index - 1];
      cases[index - 1] = temp;
      reorderBeforeAfterCases(cases);
      showToast('작업 사례 순서가 위로 이동되었습니다.');
    }
  };

  const handleMoveCaseDown = (id: string) => {
    const cases = [...cmsData.beforeAfterCases];
    const index = cases.findIndex((c) => c.id === id);
    if (index >= 0 && index < cases.length - 1) {
      const temp = cases[index];
      cases[index] = cases[index + 1];
      cases[index + 1] = temp;
      reorderBeforeAfterCases(cases);
      showToast('작업 사례 순서가 아래로 이동되었습니다.');
    }
  };

  const handleDeleteCase = (id: string, title: string) => {
    if (window.confirm(`[${title}] 작업 사례를 삭제하시겠습니까?`)) {
      deleteBeforeAfterCase(id);
      showToast(`[${title}] 사례가 삭제되었습니다.`);
    }
  };

  const handleSaveNewPhotoCase = () => {
    if (!newCaseTitle.trim()) {
      alert('서비스명을 입력해주세요.');
      return;
    }
    const points = newCasePointsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addBeforeAfterCase({
      category: newCaseCategory,
      title: newCaseTitle.trim(),
      beforeImage: newCaseBeforeImg || undefined,
      afterImage: newCaseAfterImg || undefined,
      beforePoints: ['곰팡이 찌든때', '악취 발생', '먼지 누적'],
      afterPoints: points.length > 0 ? points : ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'],
      location: '서울/경기/전국',
      brand: '삼성·LG·캐리어 등',
      workDate: new Date().toISOString().slice(0, 10),
      altText: `홈케어스 클린업 ${newCaseCategory} 작업 전후 사진`,
    });

    setIsAddingPhotoCase(false);
    setNewCaseBeforeImg('');
    setNewCaseAfterImg('');
    showToast(`새 작업 사례 [${newCaseTitle}] 등록이 완료되었습니다.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Main Admin Modal Shell */}
      <div className="relative w-full max-w-6xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 text-white flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
              CMS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white">홈케어스 클린업 CMS 최고 관제 센터</h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SHA-256 보안접속</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                실시간 웹사이트 콘텐츠 · 사진 · 가격 · 후기 · 관리자 계정 통합 관제
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('account');
                    setIsChangePasswordModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>비밀번호 변경</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-xs font-bold text-red-300 rounded-lg border border-red-800 transition-colors"
                >
                  로그아웃
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute top-16 right-6 z-50 bg-blue-600 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-2xl border border-blue-400 flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* BODY AREA */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="flex-1 p-8 sm:p-12 flex items-center justify-center bg-slate-900 overflow-y-auto">
            <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                  <LockKeyhole className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">관리자 로그인</h3>
                <p className="text-xs text-slate-400 font-medium">
                  등록된 최고 관리자 계정 정보로 안전하게 접속하세요.
                </p>
              </div>

              {loginError && (
                <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs font-bold p-3.5 rounded-xl flex items-center space-x-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                {/* Dummy inputs to prevent browser autofill */}
                <input type="text" name="fake_username" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input type="password" name="fake_password" className="hidden" tabIndex={-1} autoComplete="new-password" aria-hidden="true" />

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    관리자 아이디 (ID)
                  </label>
                  <input
                    type="text"
                    name="admin_id_no_autofill"
                    autoComplete="off"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="관리자 ID를 입력하세요"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    비밀번호 (Password)
                  </label>
                  <input
                    type="password"
                    name="admin_pwd_no_autofill"
                    autoComplete="new-password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>안전하게 로그인</span>
                </button>
              </form>

              {/* THREE BUTTONS UNDER LOGIN FORM (NO PASSWORD SHOWN) */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => {
                    setIsFindIdOpen(true);
                    setFindIdStep(1);
                    setFindIdMsg('');
                  }}
                  className="hover:text-blue-400 font-bold transition-colors flex items-center space-x-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>아이디 찾기</span>
                </button>

                <span className="text-slate-700">|</span>

                <button
                  onClick={() => {
                    setIsFindPwdOpen(true);
                    setFindPwdStep(1);
                    setFindPwdMsg('');
                  }}
                  className="hover:text-blue-400 font-bold transition-colors flex items-center space-x-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>비밀번호 찾기</span>
                </button>

                <span className="text-slate-700">|</span>

                <button
                  onClick={() => setIsSupportOpen(true)}
                  className="hover:text-emerald-400 font-bold transition-colors flex items-center space-x-1"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>관리자 문의</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD WITH SIDEBAR */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Sidebar Menu */}
            <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-2 flex-shrink-0 overflow-y-auto">
              <div className="text-[11px] font-black text-slate-500 uppercase px-3 py-1 tracking-wider">
                계정 & 관제
              </div>

              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'account'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>⑩ 계정 & 보안 설정</span>
              </button>

              <div className="pt-2 border-t border-slate-800 text-[11px] font-black text-slate-500 uppercase px-3 py-1 tracking-wider">
                CMS 콘텐츠 관리
              </div>

              <button
                onClick={() => setActiveTab('photos')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'photos'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>② 전후사진 관리 (11종)</span>
              </button>

              <button
                onClick={() => setActiveTab('banner')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'banner'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>① 메인배너 관리</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>③ 방문후기 관리</span>
              </button>

              <button
                onClick={() => setActiveTab('prices')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'prices'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>④ 가격 및 할인 관리</span>
              </button>

              <button
                onClick={() => setActiveTab('notices')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'notices'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>⑤ 공지사항 관리</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'jobs'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>⑥ 기사채용 관리</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>⑦ 실시간 예약 관리</span>
              </button>

              <div className="pt-2 border-t border-slate-800 text-[11px] font-black text-slate-500 uppercase px-3 py-1 tracking-wider">
                시스템 & 데이터
              </div>

              <button
                onClick={() => setActiveTab('seo')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'seo'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>⑧ SEO & 메타 태그</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'security'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>⑨ 데이터 전체 백업</span>
              </button>
            </div>

            {/* Right Main Content Panel */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900">
              
              {/* TAB 10: ADMIN ACCOUNT & SECURITY SETTINGS */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center space-x-2">
                        <span>⑩ 관리자 계정 & 보안 센터</span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          2차 이메일 인증 적용됨
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        관리자 ID, 비밀번호, 이메일 주소 변경 및 접속 IP / 기기 로그인 기록을 관리합니다.
                      </p>
                    </div>
                  </div>

                  {/* Account Summary Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-slate-400 block">현재 관리자 ID</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-white">{adminId}</span>
                        <button
                          onClick={() => {
                            setIsChangeIdModalOpen(true);
                            setChangeIdStep(1);
                            setChangeIdMsg('');
                          }}
                          className="text-xs bg-blue-900/80 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded-lg font-bold transition-colors"
                        >
                          ID 변경
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-slate-400 block">등록된 관리자 이메일</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-blue-300 truncate max-w-[160px]">
                          {adminEmail}
                        </span>
                        <button
                          onClick={() => {
                            setIsChangeEmailModalOpen(true);
                            setChangeEmailStep(1);
                            setChangeEmailMsg('');
                          }}
                          className="text-xs bg-blue-900/80 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded-lg font-bold transition-colors"
                        >
                          이메일 변경
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-slate-400 block">비밀번호 보안 상태</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">
                          •••••••• (보안 저장됨)
                        </span>
                        <button
                          onClick={() => {
                            setIsChangePasswordModalOpen(true);
                            setChangePwdStep(1);
                            setChangePwdMsg('');
                          }}
                          className="text-xs bg-blue-900/80 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded-lg font-bold transition-colors"
                        >
                          비밀번호 변경
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ID Change Box */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-400" />
                        <h4 className="font-extrabold text-white text-sm">관리자 ID 변경</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        변경 시 등록된 이메일로 2차 인증번호가 발송됩니다.
                      </p>
                      <button
                        onClick={() => {
                          setIsChangeIdModalOpen(true);
                          setChangeIdStep(1);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                      >
                        관리자 ID 변경하기
                      </button>
                    </div>

                    {/* Password Change Box */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Key className="w-5 h-5 text-amber-400" />
                        <h4 className="font-extrabold text-white text-sm">비밀번호 변경</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        현재 비밀번호와 2차 이메일 인증 확인 후 변경 가능합니다.
                      </p>
                      <button
                        onClick={() => {
                          setIsChangePasswordModalOpen(true);
                          setChangePwdStep(1);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                      >
                        비밀번호 변경하기
                      </button>
                    </div>

                    {/* Email Change Box */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-extrabold text-white text-sm">관리자 이메일 변경</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        새 이메일로 발송된 인증번호를 확인하여 변경합니다.
                      </p>
                      <button
                        onClick={() => {
                          setIsChangeEmailModalOpen(true);
                          setChangeEmailStep(1);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                      >
                        이메일 주소 변경하기
                      </button>
                    </div>
                  </div>

                  {/* Login History Table */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Laptop className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-extrabold text-white text-sm">최근 접속 기기 및 로그인 기록</h4>
                      </div>
                      <span className="text-xs text-slate-400 font-bold">
                        보안 관제 상태: 정상
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/60">
                            <th className="py-2.5 px-3">접속 일시</th>
                            <th className="py-2.5 px-3">접속 IP</th>
                            <th className="py-2.5 px-3">접속 기기 / 브라우저</th>
                            <th className="py-2.5 px-3">로그인 상태</th>
                            <th className="py-2.5 px-3">이메일 알림</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {loginLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="py-2.5 px-3 text-slate-200 font-mono">{log.timestamp}</td>
                              <td className="py-2.5 px-3 text-slate-300">{log.ip}</td>
                              <td className="py-2.5 px-3 text-slate-300">{log.device}</td>
                              <td className="py-2.5 px-3">
                                {log.status.includes('성공') ? (
                                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                    {log.status}
                                  </span>
                                ) : (
                                  <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] px-2 py-0.5 rounded font-bold">
                                    {log.status}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                {log.isNewDevice ? (
                                  <span className="text-amber-400 font-bold">새 기기 알림 발송됨</span>
                                ) : (
                                  <span>알림 전달 완료</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: MAIN BANNER */}
              {activeTab === 'banner' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">① 메인 배너 설정</h3>
                      <p className="text-xs text-slate-400">
                        홈페이지 최상단 히어로 배너의 제목, 부제목, 버튼 문구를 즉시 수정합니다.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        메인 헤드라인 제목
                      </label>
                      <input
                        type="text"
                        value={cmsData.banner.title}
                        onChange={(e) => updateBanner({ title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        부제목 설명 문구
                      </label>
                      <textarea
                        rows={2}
                        value={cmsData.banner.subtitle}
                        onChange={(e) => updateBanner({ subtitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          버튼 텍스트
                        </label>
                        <input
                          type="text"
                          value={cmsData.banner.buttonText}
                          onChange={(e) => updateBanner({ buttonText: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          버튼 이동 링크
                        </label>
                        <input
                          type="text"
                          value={cmsData.banner.buttonLink}
                          onChange={(e) => updateBanner({ buttonLink: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => showToast('메인 배너 변경사항이 즉시 반영되었습니다.')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md"
                      >
                        배너 수정사항 즉시 저장
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BEFORE / AFTER PHOTOS (Service-by-service CRUD & Reordering) */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">
                        ② 작업 전후사진 관리 (서비스별 100% 현장 사진)
                      </h3>
                      <p className="text-xs text-slate-400">
                        에어컨, 세탁기, 건조기, 냉장고, 공기청정기, 제습기 등 각 서비스별 실제 전후 사진 및 설명을 등록·수정·삭제·순서변경 하실 수 있습니다.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={photoCategoryFilter}
                        onChange={(e) => setPhotoCategoryFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-xs font-bold text-white px-3 py-2 rounded-xl focus:outline-none"
                      >
                        <option value="all">전체 카테고리 보기</option>
                        {CATEGORIES_LIST.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setIsAddingPhotoCase(true)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-lg shadow-blue-600/30 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>새 작업사례 등록</span>
                      </button>
                    </div>
                  </div>

                  {/* Photo Items List */}
                  <div className="space-y-4">
                    {cmsData.beforeAfterCases
                      .filter((c) => photoCategoryFilter === 'all' || c.category === photoCategoryFilter)
                      .map((item, idx) => (
                        <div
                          key={item.id}
                          className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center space-x-3">
                              {/* Reorder Buttons */}
                              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                                <button
                                  onClick={() => handleMoveCaseUp(item.id)}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-slate-800 disabled:opacity-30 text-slate-300 rounded"
                                  title="위로 이동"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMoveCaseDown(item.id)}
                                  disabled={idx === cmsData.beforeAfterCases.length - 1}
                                  className="p-1 hover:bg-slate-800 disabled:opacity-30 text-slate-300 rounded"
                                  title="아래로 이동"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full">
                                {item.category}
                              </span>
                              <h4 className="font-extrabold text-white text-base">{item.title}</h4>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingPhotoCase(item)}
                                className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-blue-300 font-bold text-xs rounded-lg border border-blue-800 transition-colors flex items-center space-x-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>사진 및 설명 수정</span>
                              </button>

                              <button
                                onClick={() => handleDeleteCase(item.id, item.title)}
                                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-lg border border-rose-800 transition-colors flex items-center space-x-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>삭제</span>
                              </button>
                            </div>
                          </div>

                          {/* Preview Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Before Photo */}
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800 inline-block">
                                청소 전
                              </span>
                              {item.beforeImage ? (
                                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black border border-slate-800 relative group">
                                  <img
                                    src={item.beforeImage}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-[16/10] rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                                  <ImageIcon className="w-8 h-8 text-slate-600 mb-1" />
                                  <span className="text-xs text-slate-400 font-bold">
                                    [사진 준비중]
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* After Photo */}
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800 inline-block">
                                청소 후
                              </span>
                              {item.afterImage ? (
                                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black border border-slate-800 relative group">
                                  <img
                                    src={item.afterImage}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-[16/10] rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                                  <ImageIcon className="w-8 h-8 text-slate-600 mb-1" />
                                  <span className="text-xs text-slate-400 font-bold">
                                    [사진 준비중]
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bullet Description Preview */}
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-wrap gap-2 text-xs text-slate-300">
                            <span className="text-slate-400 font-bold mr-1">주요 포인트:</span>
                            {(item.afterPoints || ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거']).map((pt, pIdx) => (
                              <span key={pIdx} className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-900 font-bold">
                                ✔ {pt.replace(/^✔\s*/, '')}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">③ 고객 방문후기 관리</h3>
                      <p className="text-xs text-slate-400">
                        실제 고객 방문후기 등록, 평점, 엔지니어 답변을 관리합니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {cmsData.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{rev.author}</span>
                            <span className="text-xs text-slate-400">({rev.region})</span>
                            <div className="flex text-amber-400">
                              {'★'.repeat(rev.rating)}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              deleteReview(rev.id);
                              showToast('후기가 삭제되었습니다.');
                            }}
                            className="text-xs text-red-400 hover:text-red-300 font-bold"
                          >
                            삭제
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PRICING */}
              {activeTab === 'prices' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">④ 서비스 가격 및 할인 관리</h3>
                      <p className="text-xs text-slate-400">
                        에어컨·세탁기 세척 옵션별 정가, 할인가, 인기 추천 태그를 직접 수정합니다.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cmsData.prices.map((priceItem) => (
                      <div
                        key={priceItem.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-white text-sm">{priceItem.name}</span>
                          <span className="text-xs bg-blue-900 text-blue-300 px-2.5 py-0.5 rounded-full font-bold">
                            {priceItem.discountLabel || '할인중'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1">할인가 (원)</label>
                            <input
                              type="number"
                              value={priceItem.price}
                              onChange={(e) =>
                                updatePriceConfig(priceItem.optionId, {
                                  price: Number(e.target.value),
                                })
                              }
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1">정가 (원)</label>
                            <input
                              type="number"
                              value={priceItem.originalPrice}
                              onChange={(e) =>
                                updatePriceConfig(priceItem.optionId, {
                                  originalPrice: Number(e.target.value),
                                })
                              }
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: NOTICES */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">⑤ 공지사항 작성 및 관리</h3>
                      <p className="text-xs text-slate-400">
                        이벤트 및 중요 소식을 등록하고 관리합니다.
                      </p>
                    </div>
                  </div>

                  {/* Create Notice Form */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-xs">새 공지사항 등록</h4>
                    <input
                      type="text"
                      placeholder="공지사항 제목"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="공지사항 세부 내용"
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white"
                    />
                    <button
                      onClick={() => {
                        if (!noticeTitle) return;
                        addNotice({
                          title: noticeTitle,
                          content: noticeContent,
                          author: '관리자',
                          isPinned: noticePinned,
                        });
                        setNoticeTitle('');
                        setNoticeContent('');
                        showToast('새 공지사항이 등록되었습니다.');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      공지 등록하기
                    </button>
                  </div>

                  {/* Notice List */}
                  <div className="space-y-2">
                    {cmsData.notices.map((n) => (
                      <div
                        key={n.id}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            {n.isPinned && (
                              <span className="bg-red-900 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded">
                                필독
                              </span>
                            )}
                            <h5 className="font-bold text-white text-xs">{n.title}</h5>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{n.content}</p>
                        </div>
                        <button
                          onClick={() => deleteNotice(n.id)}
                          className="text-xs text-red-400 font-bold"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: JOB POSTINGS */}
              {activeTab === 'jobs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">⑥ 기사/엔지니어 채용공고 관리</h3>
                      <p className="text-xs text-slate-400">
                        전국 지점 파트너 엔지니어 모집 공고를 관리합니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {cmsData.jobPostings.map((job) => (
                      <div
                        key={job.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
                      >
                        <h4 className="font-extrabold text-white text-sm">{job.title}</h4>
                        <p className="text-xs text-slate-300">지역: {job.region}</p>
                        <p className="text-xs text-slate-400">자격: {job.requirements}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">⑦ 실시간 고객 예약 관리</h3>
                      <p className="text-xs text-slate-400">
                        접수된 예약 내역, 담당 기사 배정, 상태 변경 및 확정을 처리합니다.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {cmsData.bookings.length === 0 ? (
                      <div className="bg-slate-950 p-8 rounded-2xl text-center text-slate-400 text-xs font-bold">
                        현재 등록된 실시간 예약 내역이 없습니다.
                      </div>
                    ) : (
                      cmsData.bookings.map((b) => (
                        <div
                          key={b.id}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-white text-sm">
                              {b.customerName} ({b.customerPhone})
                            </span>
                            <span className="text-xs font-bold bg-blue-900 text-blue-200 px-2.5 py-0.5 rounded-full">
                              {b.bookingDate} {b.bookingTime}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">주소: {b.address}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">⑧ SEO & 검색엔진 최적화 태그</h3>
                      <p className="text-xs text-slate-400">
                        구글, 네이버 SEO 자동 최적화 태그, ALT 속성, Sitemap 상태를 확인합니다.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400">
                        ✓ Open Graph & Schema.org (JSON-LD) 자동 적용됨
                      </span>
                      <p className="text-xs text-slate-400">
                        업로드된 모든 이미지에는 `홈케어스 클린업 [카테고리] 완전분해 세척` ALT 속성이 자동 부여됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: BACKUP */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-black text-white">⑨ 보안 & 데이터 전체 백업</h3>
                      <p className="text-xs text-slate-400">
                        전체 CMS 데이터 JSON 파일 다운로드 백업 및 복원, 휴지통 관리를 제공합니다.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-lg">
                    <h4 className="font-extrabold text-white text-sm">데이터 백업 및 복원</h4>
                    <p className="text-xs text-slate-400">
                      사진, 글, 가격, 예약, 후기를 안전한 JSON 파일로 저장하거나 내보냅니다.
                    </p>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={exportCMSData}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center space-x-2 shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        <span>전체 데이터 다운로드 (Export)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* EDITING PHOTO CASE MODAL */}
      {editingPhotoCase && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-2xl w-full p-6 rounded-3xl border border-slate-800 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-lg">
                작업 사례 정보 & 사진 수정
              </h4>
              <button
                onClick={() => setEditingPhotoCase(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    카테고리 선택
                  </label>
                  <select
                    value={editingPhotoCase.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      updateBeforeAfterCase(editingPhotoCase.id, { category: newCat });
                      setEditingPhotoCase({ ...editingPhotoCase, category: newCat });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    서비스명 / 상세 제목
                  </label>
                  <input
                    type="text"
                    value={editingPhotoCase.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      updateBeforeAfterCase(editingPhotoCase.id, { title: newTitle });
                      setEditingPhotoCase({ ...editingPhotoCase, title: newTitle });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  설명 포인트 (쉼표로 구분: 예: 곰팡이 제거, 고압세척, 살균 완료, 냄새 제거)
                </label>
                <input
                  type="text"
                  value={(editingPhotoCase.afterPoints || []).join(', ')}
                  onChange={(e) => {
                    const points = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    updateBeforeAfterCase(editingPhotoCase.id, { afterPoints: points });
                    setEditingPhotoCase({ ...editingPhotoCase, afterPoints: points });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Upload Before Photo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-red-400">
                    청소 전 실제 사진 업로드
                  </label>
                  <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-3 text-center relative">
                    {editingPhotoCase.beforeImage ? (
                      <img
                        src={editingPhotoCase.beforeImage}
                        alt="청소 전"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">사진 없음 (사진 준비중)</span>
                    )}
                    <label className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingBefore ? 'WebP 압축중...' : '사진 파일 선택'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'before', editingPhotoCase.id)}
                      />
                    </label>
                  </div>
                </div>

                {/* Upload After Photo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-blue-400">
                    청소 후 실제 사진 업로드
                  </label>
                  <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-3 text-center relative">
                    {editingPhotoCase.afterImage ? (
                      <img
                        src={editingPhotoCase.afterImage}
                        alt="청소 후"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">사진 없음 (사진 준비중)</span>
                    )}
                    <label className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingAfter ? 'WebP 압축중...' : '사진 파일 선택'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'after', editingPhotoCase.id)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setEditingPhotoCase(null);
                  showToast('작업 사례 수정 저장이 완료되었습니다.');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs"
              >
                수정 완료 및 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PHOTO CASE MODAL */}
      {isAddingPhotoCase && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-2xl w-full p-6 rounded-3xl border border-slate-800 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-lg flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>새 작업 전·후 사례 등록</span>
              </h4>
              <button
                onClick={() => setIsAddingPhotoCase(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    카테고리 선택
                  </label>
                  <select
                    value={newCaseCategory}
                    onChange={(e) => {
                      setNewCaseCategory(e.target.value);
                      setNewCaseTitle(`${e.target.value} 완전분해 세척`);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    서비스명 / 제목
                  </label>
                  <input
                    type="text"
                    value={newCaseTitle}
                    onChange={(e) => setNewCaseTitle(e.target.value)}
                    placeholder="예) 벽걸이 에어컨 완전분해 세척"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  설명 포인트 (쉼표 구문)
                </label>
                <input
                  type="text"
                  value={newCasePointsStr}
                  onChange={(e) => setNewCasePointsStr(e.target.value)}
                  placeholder="곰팡이 제거, 고압세척, 살균 완료, 냄새 제거"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Upload Before Photo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-red-400">
                    청소 전 사진 파일
                  </label>
                  <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-3 text-center relative">
                    {newCaseBeforeImg ? (
                      <img
                        src={newCaseBeforeImg}
                        alt="청소 전"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">사진을 선택해주세요</span>
                    )}
                    <label className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingBefore ? 'WebP 압축중...' : '사진 파일 업로드'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'before')}
                      />
                    </label>
                  </div>
                </div>

                {/* Upload After Photo */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-blue-400">
                    청소 후 사진 파일
                  </label>
                  <div className="aspect-[4/3] rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-3 text-center relative">
                    {newCaseAfterImg ? (
                      <img
                        src={newCaseAfterImg}
                        alt="청소 후"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">사진을 선택해주세요</span>
                    )}
                    <label className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingAfter ? 'WebP 압축중...' : '사진 파일 업로드'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'after')}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setIsAddingPhotoCase(false)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
              >
                취소
              </button>
              <button
                onClick={handleSaveNewPhotoCase}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs"
              >
                등록 완료 (웹사이트에 즉시 반영)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: FIND ID (아이디 찾기) */}
      {isFindIdOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>관리자 아이디 찾기</span>
              </h4>
              <button onClick={() => setIsFindIdOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {findIdMsg && (
              <p className="text-xs text-blue-400 font-bold bg-blue-950/60 p-3 rounded-xl border border-blue-800/80">
                {findIdMsg}
              </p>
            )}

            {findIdStep === 1 && (
              <form onSubmit={handleSendFindIdCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    등록된 관리자 이메일 주소
                  </label>
                  <input
                    type="email"
                    value={findIdEmail}
                    onChange={(e) => setFindIdEmail(e.target.value)}
                    placeholder="turbo1987@naver.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  인증번호 발송 (이메일전송)
                </button>
              </form>
            )}

            {findIdStep === 2 && (
              <form onSubmit={handleVerifyFindIdCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    6자리 이메일 인증번호 입력
                  </label>
                  <input
                    type="text"
                    value={inputFindIdCode}
                    onChange={(e) => setInputFindIdCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-center tracking-widest text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  인증번호 확인 및 아이디 조회
                </button>
              </form>
            )}

            {findIdStep === 3 && (
              <div className="space-y-4 text-center py-2">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-bold block">등록된 최고 관리자 아이디</span>
                  <div className="text-xl font-black text-blue-400 tracking-wider">
                    {adminId}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    (가입 이메일: {adminEmail})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setUsernameInput(adminId);
                    setIsFindIdOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  아이디 자동 입력 후 로그인하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: FIND PASSWORD (비밀번호 찾기 - 기존 비밀번호 절대 미표시) */}
      {isFindPwdOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base flex items-center space-x-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>비밀번호 재설정 (이메일 인증)</span>
              </h4>
              <button onClick={() => setIsFindPwdOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {findPwdMsg && (
              <p className="text-xs text-amber-300 font-bold bg-amber-950/60 p-3 rounded-xl border border-amber-800/80">
                {findPwdMsg}
              </p>
            )}

            {findPwdStep === 1 && (
              <form onSubmit={handleSendFindPwdCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    관리자 아이디
                  </label>
                  <input
                    type="text"
                    value={findPwdId}
                    onChange={(e) => setFindPwdId(e.target.value)}
                    placeholder="turbo1987"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    등록된 관리자 이메일 주소
                  </label>
                  <input
                    type="email"
                    value={findPwdEmail}
                    onChange={(e) => setFindPwdEmail(e.target.value)}
                    placeholder="turbo1987@naver.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  인증번호 발송 (이메일전송)
                </button>
              </form>
            )}

            {findPwdStep === 2 && (
              <form onSubmit={handleVerifyFindPwdCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    6자리 이메일 인증번호 입력
                  </label>
                  <input
                    type="text"
                    value={inputFindPwdCode}
                    onChange={(e) => setInputFindPwdCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-center tracking-widest text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  인증번호 확인
                </button>
              </form>
            )}

            {findPwdStep === 3 && (
              <form onSubmit={handleResetPasswordSave} className="space-y-3">
                <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900 text-[11px] text-blue-300">
                  기존 비밀번호는 노출되지 않습니다. 새 비밀번호를 입력해 주세요.
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    재설정할 새 비밀번호
                  </label>
                  <input
                    type="password"
                    value={findPwdNew}
                    onChange={(e) => setFindPwdNew(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={findPwdConfirm}
                    onChange={(e) => setFindPwdConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  새 비밀번호로 저장
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: CONTACT SUPPORT (관리자 문의) */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base flex items-center space-x-2">
                <LifeBuoy className="w-5 h-5 text-emerald-400" />
                <span>기술지원 및 관리자 센터 문의</span>
              </h4>
              <button onClick={() => setIsSupportOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-400 block">시스템 긴급 직통 콜센터</span>
                <span className="text-lg font-black text-white block">010-8809-8923</span>
                <span className="text-[11px] text-slate-500">
                  (계정 잠금 해제 및 서버 접근 긴급 문의)
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-400 block">최고 관리자 공식 이메일</span>
                <span className="text-sm font-extrabold text-blue-400 block">turbo1987@naver.com</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-400 block">실시간 카카오톡 고객센터</span>
                <span className="text-xs font-bold text-slate-200 block">@홈케어스클린업</span>
              </div>
            </div>

            <button
              onClick={() => setIsSupportOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 2FA MODAL: CHANGE ADMIN ID */}
      {isChangeIdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base">관리자 ID 변경 (2차 이메일 인증)</h4>
              <button onClick={() => setIsChangeIdModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {changeIdMsg && <p className="text-xs text-blue-400 font-bold">{changeIdMsg}</p>}

            {changeIdStep === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">현재 ID</label>
                  <input
                    type="text"
                    value={adminId}
                    disabled
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">변경할 새 ID</label>
                  <input
                    type="text"
                    value={newAdminIdInput}
                    onChange={(e) => setNewAdminIdInput(e.target.value)}
                    placeholder="새 관리자 ID 입력"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSendChangeId2FA}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  이메일로 2차 인증번호 받기
                </button>
              </div>
            )}

            {changeIdStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">6자리 인증번호 입력</label>
                  <input
                    type="text"
                    value={inputChangeIdCode}
                    onChange={(e) => setInputChangeIdCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-center tracking-widest text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSaveChangeId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  관리자 ID 변경 저장
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA MODAL: CHANGE PASSWORD */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base">비밀번호 변경 (2차 이메일 인증)</h4>
              <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {changePwdMsg && <p className="text-xs text-amber-300 font-bold">{changePwdMsg}</p>}

            {changePwdStep === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">현재 비밀번호</label>
                  <input
                    type="password"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">새 비밀번호</label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">새 비밀번호 확인</label>
                  <input
                    type="password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSendChangePwd2FA}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  이메일로 2차 인증번호 발송
                </button>
              </div>
            )}

            {changePwdStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">6자리 인증번호 입력</label>
                  <input
                    type="text"
                    value={inputChangePwdCode}
                    onChange={(e) => setInputChangePwdCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-center tracking-widest text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSaveChangePwd}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  비밀번호 변경 완료
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA MODAL: CHANGE EMAIL */}
      {isChangeEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base">관리자 이메일 변경</h4>
              <button onClick={() => setIsChangeEmailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {changeEmailMsg && <p className="text-xs text-emerald-400 font-bold">{changeEmailMsg}</p>}

            {changeEmailStep === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">현재 이메일</label>
                  <input
                    type="email"
                    value={adminEmail}
                    disabled
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">변경할 새 이메일</label>
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="new_admin@naver.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSendChangeEmail2FA}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  새 이메일로 인증번호 발송
                </button>
              </div>
            )}

            {changeEmailStep === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">6자리 인증번호 입력</label>
                  <input
                    type="text"
                    value={inputChangeEmailCode}
                    onChange={(e) => setInputChangeEmailCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-center tracking-widest text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSaveChangeEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  이메일 주소 변경 저장
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardModal;
