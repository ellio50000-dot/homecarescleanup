import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { PHONE_NUMBERS } from '../data/mockData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>자주 묻는 질문 FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            궁금하신 점을 빠르게 해결해 드립니다
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-gray-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-xs sm:text-sm text-gray-900 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <span>Q. {faq.question}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/50 bg-white">
                    <span className="font-bold text-blue-600 mr-1.5">A.</span>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-sm font-extrabold text-gray-900">더 궁금한 점이 있으신가요?</div>
            <div className="text-xs text-gray-600 mt-0.5">365일 언제든 전화 문의주시면 친절하게 안내해 드립니다.</div>
          </div>
          <a
            href={`tel:${PHONE_NUMBERS.representative.replace('-', '')}`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5"
          >
            <Phone className="w-4 h-4" />
            <span>대표 전화 {PHONE_NUMBERS.representative}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
