import React, { useMemo } from 'react';
import days from '../../data/days.json';
import { START_DATE, PARTNER_NAME } from './config.js';
import Header from './components/Header.jsx';
import DayCard from './components/DayCard.jsx';

export const VIBE_THEMES = {
  motivational: {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#ffd700',
    secondary: '#e94560',
    cardBg: 'rgba(255,255,255,0.08)',
    textColor: '#fff',
    mutedColor: 'rgba(255,255,255,0.65)',
    label: 'Motivational ⚡'
  },
  playful: {
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 60%, #ff9ff3 100%)',
    accent: '#fff',
    secondary: '#ffd93d',
    cardBg: 'rgba(255,255,255,0.28)',
    textColor: '#3d2c00',
    mutedColor: 'rgba(61,44,0,0.65)',
    label: 'Fun & Playful 🎉'
  },
  cozy: {
    gradient: 'linear-gradient(135deg, #f5e6d3 0%, #ffd1a4 50%, #e8b089 100%)',
    accent: '#8b4513',
    secondary: '#d4793a',
    cardBg: 'rgba(255,255,255,0.45)',
    textColor: '#4a2c1a',
    mutedColor: 'rgba(74,44,26,0.65)',
    label: 'Warm & Cozy 🍂'
  }
};

function getTodayData() {
  const start = new Date(START_DATE);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const dayIndex = ((diff % 90) + 90) % 90; // handle negative too
  return days[dayIndex];
}

export default function App() {
  const dayData = useMemo(() => getTodayData(), []);
  const theme = VIBE_THEMES[dayData.vibe];

  return (
    <div className="app" style={{ background: theme.gradient, minHeight: '100vh' }}>
      <Header theme={theme} dayNumber={dayData.day} partnerName={PARTNER_NAME} />
      <DayCard dayData={dayData} theme={theme} />
    </div>
  );
}
