import { useEffect, useLayoutEffect, useState } from 'react';
import { computer, window as neuWindow } from '@neutralinojs/lib';
import './App.css';

interface SystemStats {
  usedGB: number;
  totalGB: number;
  percent: number;
}

export default function App() {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useLayoutEffect(() => {
    neuWindow.setDraggableRegion('widget-drag-handle').catch(console.error);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const memory = await computer.getMemoryInfo();
        const used = (memory.physical.total - memory.physical.available) / (1024 ** 3);
        const total = memory.physical.total / (1024 ** 3);
        const percent = (used / total) * 100;
        
        setStats({ usedGB: used, totalGB: total, percent });
      } catch (error) {
        console.error("Failed to fetch system stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="swiftui-widget" id="widget-drag-handle">
      {}
      <div className="hstack header">
        <span className="title">Mac Vitals</span>
      </div>
      
      {}
      <div className="vstack content">
        <div className="hstack label-row">
          <span className="headline">Memory Usage</span>
          <span className="subheadline">
            {stats ? `${stats.usedGB.toFixed(1)} GB` : '--'}
          </span>
        </div>
        
        {}
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${stats?.percent || 0}%` }}
          />
        </div>
        
        <div className="hstack footer-row">
          <span className="footnote">0 GB</span>
          <span className="footnote">{stats ? `${stats.totalGB.toFixed(0)} GB` : '--'}</span>
        </div>
      </div>
    </div>
  );
}
