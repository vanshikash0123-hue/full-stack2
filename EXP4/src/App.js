import React from 'react';
import UnscheduledList from './components/UnscheduledList';
import CalendarView from './components/CalendarView';
import UpcomingPosts from './components/UpcomingPosts';
import RenderStats from './components/RenderStats';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <div>
            <div className="brand-eyebrow">Content Planning</div>
            <h1>Social Scheduler</h1>
          </div>
        </div>
      </header>

      <main>
        <RenderStats />
        <div className="app-body">
          <UnscheduledList />
          <CalendarView />
          <UpcomingPosts />
        </div>
      </main>
    </div>
  );
}