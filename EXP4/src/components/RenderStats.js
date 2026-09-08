import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleOptimized } from '../redux/settingsSlice';
import { getRenderCounts, resetRenderCounts } from '../utils/renderTracker';

export default function RenderStats() {
  const dispatch = useDispatch();
  const optimized = useSelector((state) => state.settings.optimized);
  const [counts, setCounts] = useState(getRenderCounts());

  useEffect(() => {
    const id = setInterval(() => setCounts(getRenderCounts()), 400);
    return () => clearInterval(id);
  }, []);

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <section className="render-panel">
      <div className="render-panel-header">
        <div>
          <div className="render-panel-title">React rendering</div>
          <div className="render-panel-heading">{optimized ? 'Optimized' : 'Not optimized'}</div>
        </div>
        <label className="toggle-switch">
          <input type="checkbox" checked={optimized} onChange={() => dispatch(toggleOptimized())} />
          <span className="toggle-track"><span className="toggle-thumb" /></span>
          Optimized
        </label>
      </div>

      <div className="render-stats-grid">
        <div className="render-stat-card"><strong>{counts.CalendarView || 0}</strong><span>Calendar renders</span></div>
        <div className="render-stat-card"><strong>{counts.Events || 0}</strong><span>Event renders</span></div>
        <div className="render-stat-card"><strong>{counts.PostModal || 0}</strong><span>Post modal renders</span></div>
        <div className="render-stat-card"><strong>{counts.Sidebar || 0}</strong><span>Sidebar renders</span></div>
      </div>

      <p className="render-panel-footnote">
        Total tracked renders: {total}. Turn "Optimized" off to see Sidebar
        renders climb on every action — not just when its own data changes.
      </p>
      <button type="button" className="reset-link" onClick={() => resetRenderCounts()}>Reset counts</button>
    </section>
  );
}