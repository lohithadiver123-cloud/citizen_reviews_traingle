export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved';

export type UserRole = 'CITIZEN' | 'DEPARTMENT_OFFICER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  departmentId?: string; // e.g. 'dept-roads', 'dept-trees'
  departmentName?: string;
  citizenPhone?: string;
  ward?: string;
  avatar?: string;
}

export interface CivicSector {
  id: string; // '01' to '18'
  code: string;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  responsibleDepartment: string;
  description: string;
  totalComplaints: number;
  criticalComplaints: number;
  activeComplaints: number;
  resolvedComplaints: number;
  resolutionRate: number; // percentage
  trend: number[]; // 7 data points for sparkline
}

export interface Complaint {
  id: string; // e.g. 'CL-1042'
  title: string;
  description: string;
  sectorId: string;
  sectorName: string;
  sectorIcon: string;
  severity: Severity;
  priorityScore: number; // 0 - 100
  department: string;
  status: TicketStatus;
  ward: string; // e.g. 'Ward 12'
  locationName: string; // e.g. 'MG Road Junction, North Sector'
  coordinates: [number, number]; // [lat, lng]
  reportedAt: string; // ISO string or relative time
  resolvedAt?: string;
  citizenName?: string;
  language?: string;
  imageUrl?: string;
  aiReasoning: string;
  recommendedAction: string;
  assignedTeam?: string;
  slaHours: number;
  timeRemaining?: string;
}

export interface Department {
  id: string;
  name: string;
  sectorIds: string[];
  head: string;
  phone: string;
  email: string;
  activeTeams: number;
  totalPersonnel: number;
  openTickets: number;
  avgResolutionHours: number;
  slaCompliance: number; // percentage
  status: 'OPTIMAL' | 'HIGH_LOAD' | 'CRITICAL';
}

export interface WardMetric {
  ward: string;
  name: string;
  totalIncidents: number;
  criticalCount: number;
  resolutionRate: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number;
  lng: number;
}

export interface AIAnalysisResult {
  detectedSectorId: string;
  detectedSectorName: string;
  sectorIcon: string;
  severity: Severity;
  priorityScore: number;
  responsibleDepartment: string;
  aiReasoning: string;
  recommendedAction: string;
  confidenceScore: number; // e.g. 98.4%
  detectedLanguage: string;
  urgencyLevel: 'IMMEDIATE' | 'HIGH' | 'NORMAL' | 'ROUTINE';
  estimatedSLA: string;
}
