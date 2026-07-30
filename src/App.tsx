import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ApplianceServices } from './components/ApplianceServices';
import { ProcessSection } from './components/ProcessSection';
import { DiagnosticQuiz } from './components/DiagnosticQuiz';
import { ReviewsSection } from './components/ReviewsSection';
import { PartnerRecruitSection } from './components/PartnerRecruitSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingCallBar } from './components/FloatingCallBar';
import { BookingModal } from './components/BookingModal';
import { MyBookingLookupModal } from './components/MyBookingLookupModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SystemIntegrationModal } from './components/SystemIntegrationModal';
import { BookingData } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedApplianceId, setPreselectedApplianceId] = useState<string | undefined>(undefined);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSystemIntegrationOpen, setIsSystemIntegrationOpen] = useState(false);

  const handleOpenBooking = (applianceId?: string) => {
    setPreselectedApplianceId(applianceId);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (booking: BookingData) => {
    // booking completed
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        onOpenBooking={handleOpenBooking}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenSystemIntegration={() => setIsSystemIntegrationOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Hero Section */}
      <Hero
        onOpenBooking={handleOpenBooking}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
      />

      {/* 6 Appliances Service Section */}
      <ApplianceServices
        onOpenBooking={handleOpenBooking}
      />

      {/* Disassembly Process & Guarantee Section */}
      <ProcessSection />

      {/* Diagnostic Symptom Calculator */}
      <DiagnosticQuiz
        onOpenBooking={handleOpenBooking}
      />

      {/* Customer Reviews Section */}
      <ReviewsSection />

      {/* Technician Partner Recruitment Section */}
      <PartnerRecruitSection
        isOpenModal={isPartnerModalOpen}
        onCloseModal={() => setIsPartnerModalOpen(false)}
        onOpenModal={() => setIsPartnerModalOpen(true)}
      />

      {/* FAQ Accordion Section */}
      <FAQSection />

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Floating Call & Quick Booking Bar */}
      <FloatingCallBar
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Realtime Booking & Payment Gateway Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedApplianceId={preselectedApplianceId}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* My Reservation Lookup Modal */}
      <MyBookingLookupModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
      />

      {/* Owner & Admin Order Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onOpenSystemIntegration={() => {
          setIsAdminDashboardOpen(false);
          setIsSystemIntegrationOpen(true);
        }}
      />

      {/* DB, Notification, PG Gateway & Imweb Integration Guide Modal */}
      <SystemIntegrationModal
        isOpen={isSystemIntegrationOpen}
        onClose={() => setIsSystemIntegrationOpen(false)}
        onOpenAdminDashboard={() => {
          setIsSystemIntegrationOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />
    </div>
  );
}
