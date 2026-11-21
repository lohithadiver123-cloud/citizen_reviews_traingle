import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  ListFilter, 
  MapPin, 
  Grid3X3, 
  BarChart3, 
  Building2, 
  Settings,
  Layers,
  User,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  isSpecial?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, stats, sectors, currentUser, setIsLoginModalOpen } = useApp();

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'command-center',
          label: 'Command Center',
          icon: LayoutDashboard,
        }
      ]
    },
    {
      title: 'ROLE-SPECIFIC PORTALS',
      items: [
        {
          id: 'citizen-portal',
          label: 'Citizen Portal',
          icon: User,
          badge: 'Track',
          badgeColor: 'bg-[#C6FF5F]/20 text-[#C6FF5F]'
        },
        {
          id: 'department-portal',
          label: 'Department Portal',
          icon: Building2,
          badge: 'Dispatch',
          badgeColor: 'bg-[#43D9FF]/20 text-[#43D9FF]'
        }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'ai-triage',
          label: 'AI Complaint Triage',
          icon: Sparkles,
          isSpecial: true,
          badge: 'STAR',
          badgeColor: 'bg-[#C6FF5F] text-[#0B1020]'
        },
        {
          id: 'complaints',
          label: 'Complaint Queue',
          icon: ListFilter,
          badge: stats.criticalCount > 0 ? `${stats.criticalCount} Critical` : `${stats.totalReports}`,
          badgeColor: stats.criticalCount > 0 ? 'bg-[#FF4D5E]/20 text-[#FF4D5E] border border-[#FF4D5E]/40' : 'bg-[#243354] text-slate-300'
        },
        {
          id: 'map',
          label: 'City Incident Map',
          icon: MapPin,
        }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'sectors',
          label: 'Sector Intelligence',
          icon: Grid3X3,
          badge: `${sectors.length} Sectors`,
          badgeColor: 'bg-[#43D9FF]/20 text-[#43D9FF] border border-[#43D9FF]/30'
        },
        {
          id: 'analytics',
          label: 'Analytics & Insights',
          icon: BarChart3
        }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          id: 'departments',
          label: 'Departments',
          icon: Building2
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0B1020] border-r border-[#223252] flex flex-col justify-between shrink-0 h-[calc(100vh-57px)] sticky top-[57px] select-none overflow-y-auto">
      
      <div className="p-3 space-y-5">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-[#8E9EB8] uppercase">
              {section.title}
            </div>

            <div className="space-y-1 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? item.isSpecial 
                          ? 'bg-gradient-to-r from-[#162928] to-[#121A2B] text-[#C6FF5F] border border-[#C6FF5F]/40 shadow-sm' 
                          : 'bg-[#18233B] text-white border border-[#2C416A] shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121A2B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1 rounded-lg transition-colors ${
                        isActive 
                          ? item.isSpecial ? 'text-[#C6FF5F]' : 'text-[#43D9FF]' 
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-[#243354] text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Tactical Status Card & Gateway trigger */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-[#121A2B] to-[#0D1424] border border-[#223252] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-200">
            <Layers className="w-3.5 h-3.5 text-[#C6FF5F]" />
            <span>18 SECTOR MATRIX</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <p className="text-[11px] text-[#8E9EB8] leading-relaxed">
          Active Role: <strong className="text-white">{currentUser.name.split(' ')[0]}</strong> ({currentUser.role})
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="w-full py-1.5 px-2 rounded-lg bg-[#18233B] hover:bg-[#203154] border border-[#2C416A] text-[10px] font-mono text-[#C6FF5F] flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3 h-3" />
          <span>Switch User / Portal</span>
        </button>
      </div>

    </aside>
  );
};
