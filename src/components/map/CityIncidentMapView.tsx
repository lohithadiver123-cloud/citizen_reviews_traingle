import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, Severity } from '../../types';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Flame, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  SlidersHorizontal,
  X,
  ExternalLink,
  Radio
} from 'lucide-react';

export const CityIncidentMapView: React.FC = () => {
  const { 
    complaints, 
    sectors, 
    filterSector, 
    setFilterSector,
    filterSeverity, 
    setFilterSeverity,
    filterWard, 
    setFilterWard,
    setSelectedComplaintForDetails,
    updateComplaintStatus,
    setActiveTab
  } = useApp();

  const [selectedIncident, setSelectedIncident] = useState<Complaint | null>(null);
  const [heatmapMode, setHeatmapMode] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filter complaints based on map controls
  const visibleComplaints = complaints.filter(c => {
    if (filterSector !== 'ALL' && c.sectorId !== filterSector) return false;
    if (filterSeverity !== 'ALL' && c.severity !== filterSeverity) return false;
    if (filterWard !== 'ALL' && c.ward !== filterWard) return false;
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on city coordinates (Bangalore: 12.9716, 77.5946)
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.6100],
        zoom: 12,
        zoomControl: false
      });

      // CartoDB Dark Matter tile layer for slick cyberpunk dark theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive or clean up
    };
  }, []);

  // Update map markers when visibleComplaints change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    visibleComplaints.forEach((comp) => {
      const isCritical = comp.severity === 'CRITICAL';
      const isHigh = comp.severity === 'HIGH';
      const isMedium = comp.severity === 'MEDIUM';

      const color = isCritical ? '#FF4D5E' : isHigh ? '#FF9B42' : isMedium ? '#FFD166' : '#47D18C';

      // Create glowing HTML marker
      const customIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            cursor: pointer;
          ">
            ${isCritical ? `
              <div style="
                position: absolute;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: rgba(255, 77, 94, 0.4);
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #121A2B;
              border: 2px solid ${color};
              box-shadow: 0 0 10px ${color}80;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: bold;
              color: white;
            ">
              ${comp.sectorIcon}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(comp.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedIncident(comp);
      });

      markersLayerRef.current?.addLayer(marker);
    });

  }, [visibleComplaints]);

  // Center map on a specific incident
  const handleCenterOn = (coords: [number, number]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 14, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      
      {/* Top Map Controls Header (Blueprint Section 10) */}
      <div className="glass-panel p-4 rounded-2xl border border-[#223252] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#43D9FF] animate-pulse" />
            <h1 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
              City Incident Map
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#18233B] text-[#C6FF5F] border border-[#2C416A]">
              {visibleComplaints.length} Pins Active
            </span>
          </div>
          <p className="text-xs text-[#8E9EB8] mt-0.5">
            Geospatial surveillance & active dispatch routing across all municipal wards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sector Filter */}
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#223252] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Sectors (18)</option>
            {sectors.map(sec => (
              <option key={sec.id} value={sec.id} className="bg-[#121A2B]">
                {sec.icon} #{sec.id} {sec.name}
              </option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#223252] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FF4D5E]"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL" className="bg-[#121A2B]">🔴 Critical</option>
            <option value="HIGH" className="bg-[#121A2B]">🟠 High</option>
            <option value="MEDIUM" className="bg-[#121A2B]">🟡 Medium</option>
            <option value="LOW" className="bg-[#121A2B]">🟢 Low</option>
          </select>

          {/* Ward Filter */}
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#223252] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Wards</option>
            {Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`).map(w => (
              <option key={w} value={w} className="bg-[#121A2B]">{w}</option>
            ))}
          </select>

          {/* Heatmap Mode Toggle */}
          <button
            onClick={() => setHeatmapMode(!heatmapMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              heatmapMode 
                ? 'bg-[#43D9FF]/20 text-[#43D9FF] border-[#43D9FF]' 
                : 'bg-[#0B1020] text-slate-300 border-[#223252] hover:text-white'
            }`}
          >
            {heatmapMode ? 'Heatmap: ON' : 'Heatmap: OFF'}
          </button>
        </div>
      </div>

      {/* Main Map Container & Right Details Panel */}
      <div className="relative h-[620px] rounded-2xl overflow-hidden border border-[#223252] shadow-2xl bg-[#0B1020]">
        
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top-Left Floating Legend */}
        <div className="absolute top-4 left-4 z-20 glass-panel p-3 rounded-xl border border-[#2C416A] text-[11px] font-mono space-y-1.5 shadow-xl">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px] pb-1 border-b border-[#223252]">
            INCIDENT SEVERITY
          </div>
          <div className="flex items-center gap-2 text-[#FF4D5E]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D5E] animate-ping" />
            <span>Critical Incident</span>
          </div>
          <div className="flex items-center gap-2 text-[#FF9B42]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9B42]" />
            <span>High Severity</span>
          </div>
          <div className="flex items-center gap-2 text-[#FFD166]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]" />
            <span>Medium Hazard</span>
          </div>
          <div className="flex items-center gap-2 text-[#47D18C]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#47D18C]" />
            <span>Resolved / Low</span>
          </div>
        </div>

        {/* Selected Incident Drawer (Blueprint Section 10) */}
        {selectedIncident && (
          <div className="absolute top-4 right-4 z-20 w-88 sm:w-96 glass-panel rounded-2xl border border-[#2C416A] shadow-2xl p-5 space-y-4 animate-in slide-in-from-right-4 duration-200 max-h-[580px] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-[#223252] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#43D9FF] tracking-wider">
                  INCIDENT SELECTED
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-extrabold font-mono text-white">
                    {selectedIncident.id}
                  </span>
                  {selectedIncident.severity === 'CRITICAL' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4D5E]/20 text-[#FF4D5E] border border-[#FF4D5E]/40">
                      🔴 CRITICAL
                    </span>
                  )}
                  {selectedIncident.severity === 'HIGH' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF9B42]/20 text-[#FF9B42] border border-[#FF9B42]/40">
                      🟠 HIGH
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg bg-[#0B1020] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {selectedIncident.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            {/* Photo preview if available */}
            {selectedIncident.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-[#223252] h-32 bg-[#0B1020]">
                <img
                  src={selectedIncident.imageUrl}
                  alt="Incident Photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Sector, Location, Priority Score (as specified in Blueprint Section 10) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0B1020] border border-[#223252]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Sector</div>
                <div className="font-semibold text-white truncate flex items-center gap-1 mt-0.5">
                  <span>{selectedIncident.sectorIcon}</span>
                  <span className="truncate">{selectedIncident.sectorName}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0B1020] border border-[#223252]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Priority Score</div>
                <div className="font-extrabold font-mono text-[#C6FF5F] text-sm mt-0.5">
                  {selectedIncident.priorityScore} / 100
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B1020] border border-[#223252] text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Location</div>
              <div className="font-semibold text-white mt-0.5">
                {selectedIncident.ward} · {selectedIncident.locationName}
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="p-2.5 rounded-xl bg-[#162035] border border-[#243354] text-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#8E9EB8]">AI Rationale</div>
              <p className="text-slate-300 text-[11px] italic">"{selectedIncident.aiReasoning}"</p>
            </div>

            {/* Actions: VIEW COMPLAINT / Centering */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => setSelectedComplaintForDetails(selectedIncident)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C6FF5F] to-[#a8f828] text-[#0B1020] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              >
                <span>[ VIEW COMPLAINT ]</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCenterOn(selectedIncident.coordinates)}
                className="w-full py-2 rounded-xl bg-[#18233B] hover:bg-[#203154] border border-[#2C416A] text-slate-200 text-xs font-mono flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5 text-[#43D9FF]" />
                <span>Focus Map Camera</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
