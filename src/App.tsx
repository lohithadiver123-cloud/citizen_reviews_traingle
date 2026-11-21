import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandCenterView } from './components/dashboard/CommandCenterView';
import { CitizenDashboardView } from './components/citizen/CitizenDashboardView';
import { DepartmentDashboardView } from './components/department-portal/DepartmentDashboardView';
import { AITriageView } from './components/triage/AITriageView';
import { ComplaintManagementView } from './components/complaints/ComplaintManagementView';
import { CityIncidentMapView } from './components/map/CityIncidentMapView';
import { SectorIntelligenceView } from './components/sectors/SectorIntelligenceView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { DepartmentManagementView } from './components/departments/DepartmentManagementView';
import { SettingsView } from './components/settings/SettingsView';
import { ComplaintDetailModal } from './components/modals/ComplaintDetailModal';
import { LoginModal } from './components/auth/LoginModal';
import { 
  LayoutDashboard, 
  Sparkles, 
  ListFilter, 
  MapPin, 
  Grid3X3, 
  BarChart3, 
  Building2,
  User 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Dynamic Page View Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-[calc(100vh-57px)]">
          {activeTab === 'command-center' && <CommandCenterView />}
          {activeTab === 'citizen-portal' && <CitizenDashboardView />}
          {activeTab === 'department-portal' && <DepartmentDashboardView />}
          {activeTab === 'ai-triage' && <AITriageView />}
          {activeTab === 'complaints' && <ComplaintManagementView />}
          {activeTab === 'map' && <CityIncidentMapView />}
          {activeTab === 'sectors' && <SectorIntelligenceView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'departments' && <DepartmentManagementView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden sticky bottom-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-t border-[#223252] flex items-center justify-around py-2 px-1 text-[10px] font-mono">
        <button
          onClick={() => setActiveTab('command-center')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'command-center' ? 'text-[#C6FF5F]' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('citizen-portal')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'citizen-portal' ? 'text-[#C6FF5F] font-bold' : 'text-slate-400'}`}
        >
          <User className="w-4 h-4" />
          <span>Citizen</span>
        </button>
        <button
          onClick={() => setActiveTab('department-portal')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'department-portal' ? 'text-[#C6FF5F] font-bold' : 'text-slate-400'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Dept</span>
        </button>
        <button
          onClick={() => setActiveTab('ai-triage')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'ai-triage' ? 'text-[#C6FF5F] font-bold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Triage</span>
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'complaints' ? 'text-[#C6FF5F]' : 'text-slate-400'}`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Queue</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-[#C6FF5F]' : 'text-slate-400'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Map</span>
        </button>
      </div>

      {/* Global Incident Details Modal */}
      <ComplaintDetailModal />

      {/* Global Login / Role Gateway Modal */}
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
