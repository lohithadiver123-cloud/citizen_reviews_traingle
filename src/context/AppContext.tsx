import React, { createContext, useContext, useState, useMemo } from 'react';
import { Complaint, CivicSector, Department, TicketStatus, Severity, UserRole, AuthUser } from '../types';
import { INITIAL_COMPLAINTS } from '../data/complaints';
import { CIVIC_SECTORS } from '../data/sectors';
import { DEPARTMENTS } from '../data/departments';
import confetti from 'canvas-confetti';

export type NavigationTab = 
  | 'command-center'
  | 'citizen-portal'
  | 'department-portal'
  | 'ai-triage'
  | 'complaints'
  | 'map'
  | 'sectors'
  | 'analytics'
  | 'departments'
  | 'settings';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'success' | 'info';
  timestamp: string;
  ticketId?: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  // Auth & Roles
  currentUser: AuthUser;
  loginAs: (role: UserRole, departmentId?: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (b: boolean) => void;
  switchDepartment: (departmentId: string) => void;
  // Data
  complaints: Complaint[];
  sectors: CivicSector[];
  departments: Department[];
  selectedSectorForDrilldown: CivicSector | null;
  setSelectedSectorForDrilldown: (sector: CivicSector | null) => void;
  selectedComplaintForDetails: Complaint | null;
  setSelectedComplaintForDetails: (complaint: Complaint | null) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'reportedAt'>) => Complaint;
  updateComplaintStatus: (id: string, newStatus: TicketStatus) => void;
  deleteComplaint: (id: string) => void;
  notifications: AppNotification[];
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  // Global filters
  filterSector: string;
  setFilterSector: (s: string) => void;
  filterSeverity: string;
  setFilterSeverity: (s: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  filterWard: string;
  setFilterWard: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  resetAllFilters: () => void;
  // Quick pre-fill demo in triage
  activeDemoScenarioId: string | null;
  setActiveDemoScenarioId: (id: string | null) => void;
  // Statistics
  stats: {
    totalReports: number;
    criticalCount: number;
    highCount: number;
    inProgressCount: number;
    resolvedCount: number;
    resolutionRate: number;
    avgPriorityScore: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('command-center');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [selectedSectorForDrilldown, setSelectedSectorForDrilldown] = useState<CivicSector | null>(null);
  const [selectedComplaintForDetails, setSelectedComplaintForDetails] = useState<Complaint | null>(null);
  const [activeDemoScenarioId, setActiveDemoScenarioId] = useState<string | null>(null);

  // Authentication State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser>({
    id: 'user-admin',
    name: 'Commissioner Vandana Murthy, IAS',
    role: 'ADMIN',
    email: 'commissioner@civiclens.gov'
  });

  // Filters
  const [filterSector, setFilterSector] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterWard, setFilterWard] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: '🔴 Critical Escalation Alert',
      message: 'Water pipeline burst reported in Ward 12. Automated team dispatch initiated.',
      type: 'critical',
      timestamp: '3m ago',
      ticketId: 'CL-1042'
    },
    {
      id: 'notif-2',
      title: '⚡ Grid Restoration Update',
      message: 'Transformer repair completed in Ward 15. Service restored for 1,200 households.',
      type: 'success',
      timestamp: '18m ago',
      ticketId: 'CL-1038'
    }
  ]);

  const resetAllFilters = () => {
    setFilterSector('ALL');
    setFilterSeverity('ALL');
    setFilterStatus('ALL');
    setFilterWard('ALL');
    setSearchQuery('');
  };

  const loginAs = (role: UserRole, departmentId?: string) => {
    if (role === 'CITIZEN') {
      setCurrentUser({
        id: 'user-citizen-1',
        name: 'Rahul Sharma',
        role: 'CITIZEN',
        email: 'rahul.citizen@gmail.com',
        ward: 'Ward 8',
        citizenPhone: '+91 98765 43210'
      });
      setActiveTab('citizen-portal');
    } else if (role === 'DEPARTMENT_OFFICER') {
      const deptId = departmentId || 'dept-trees';
      const dept = DEPARTMENTS.find(d => d.id === deptId) || DEPARTMENTS[5];
      setCurrentUser({
        id: `officer-${dept.id}`,
        name: dept.head,
        role: 'DEPARTMENT_OFFICER',
        email: dept.email,
        departmentId: dept.id,
        departmentName: dept.name
      });
      setActiveTab('department-portal');
    } else {
      setCurrentUser({
        id: 'user-admin',
        name: 'Commissioner Vandana Murthy, IAS',
        role: 'ADMIN',
        email: 'commissioner@civiclens.gov'
      });
      setActiveTab('command-center');
    }
    setIsLoginModalOpen(false);
  };

  const switchDepartment = (departmentId: string) => {
    const dept = DEPARTMENTS.find(d => d.id === departmentId) || DEPARTMENTS[0];
    setCurrentUser(prev => ({
      ...prev,
      role: 'DEPARTMENT_OFFICER',
      name: dept.head,
      email: dept.email,
      departmentId: dept.id,
      departmentName: dept.name
    }));
    setActiveTab('department-portal');
  };

  const logout = () => {
    loginAs('ADMIN');
  };

  // Dynamically compute sectors with live complaint statistics
  const sectors = useMemo(() => {
    return CIVIC_SECTORS.map(baseSector => {
      const sectorComplaints = complaints.filter(c => c.sectorId === baseSector.id);
      const total = sectorComplaints.length;
      const critical = sectorComplaints.filter(c => c.severity === 'CRITICAL').length;
      const resolved = sectorComplaints.filter(c => c.status === 'Resolved').length;
      const active = total - resolved;
      const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

      return {
        ...baseSector,
        totalComplaints: total,
        criticalComplaints: critical,
        activeComplaints: active,
        resolvedComplaints: resolved,
        resolutionRate: rate
      };
    });
  }, [complaints]);

  // Dynamically compute departments with live ticket count
  const departments = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const deptComplaints = complaints.filter(c => dept.sectorIds.includes(c.sectorId) && c.status !== 'Resolved');
      const deptStatus: 'CRITICAL' | 'HIGH_LOAD' | 'OPTIMAL' = 
        deptComplaints.length >= 15 ? 'CRITICAL' : 
        deptComplaints.length >= 10 ? 'HIGH_LOAD' : 'OPTIMAL';
      return {
        ...dept,
        openTickets: deptComplaints.length,
        status: deptStatus
      };
    });
  }, [complaints]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalReports = complaints.length;
    const criticalCount = complaints.filter(c => c.severity === 'CRITICAL' && c.status !== 'Resolved').length;
    const highCount = complaints.filter(c => c.severity === 'HIGH' && c.status !== 'Resolved').length;
    const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const resolutionRate = totalReports > 0 ? Number(((resolvedCount / totalReports) * 100).toFixed(1)) : 0;
    const avgPriorityScore = totalReports > 0 ? Math.round(complaints.reduce((acc, c) => acc + c.priorityScore, 0) / totalReports) : 0;

    return {
      totalReports,
      criticalCount,
      highCount,
      inProgressCount,
      resolvedCount,
      resolutionRate,
      avgPriorityScore
    };
  }, [complaints]);

  const addComplaint = (newIncidentData: Omit<Complaint, 'id' | 'reportedAt'>): Complaint => {
    const nextNum = 1043 + complaints.length;
    const id = `CL-${nextNum}`;
    const newComplaint: Complaint = {
      ...newIncidentData,
      id,
      reportedAt: 'Just now'
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Trigger visual confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C6FF5F', '#43D9FF', '#FF4D5E']
      });
    } catch {
      // ignore in non-browser or test
    }

    // Add alert notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `⚡ Ticket Generated: ${id}`,
        message: `${newComplaint.sectorName} incident in ${newComplaint.ward}. AI Priority: ${newComplaint.priorityScore}/100. Routed to ${newComplaint.department}.`,
        type: newComplaint.severity === 'CRITICAL' ? 'critical' : 'success',
        timestamp: 'Just now',
        ticketId: id
      },
      ...prev
    ]);

    return newComplaint;
  };

  const updateComplaintStatus = (id: string, newStatus: TicketStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          resolvedAt: newStatus === 'Resolved' ? 'Just now' : c.resolvedAt
        };
      }
      return c;
    }));

    if (newStatus === 'Resolved') {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `✅ Incident Resolved: ${id}`,
          message: `Department field team has resolved this incident. Citizen notified.`,
          type: 'success',
          timestamp: 'Just now',
          ticketId: id
        },
        ...prev
      ]);
    }
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      currentUser,
      loginAs,
      logout,
      isLoginModalOpen,
      setIsLoginModalOpen,
      switchDepartment,
      complaints,
      sectors,
      departments,
      selectedSectorForDrilldown,
      setSelectedSectorForDrilldown,
      selectedComplaintForDetails,
      setSelectedComplaintForDetails,
      addComplaint,
      updateComplaintStatus,
      deleteComplaint,
      notifications,
      removeNotification,
      clearAllNotifications,
      filterSector,
      setFilterSector,
      filterSeverity,
      setFilterSeverity,
      filterStatus,
      setFilterStatus,
      filterWard,
      setFilterWard,
      searchQuery,
      setSearchQuery,
      resetAllFilters,
      activeDemoScenarioId,
      setActiveDemoScenarioId,
      stats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
