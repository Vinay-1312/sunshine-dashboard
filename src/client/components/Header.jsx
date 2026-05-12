import React, { useEffect, useState } from 'react';

const EMOJIS = ['☀️', '🌟', '✨', '💫', '🌈', '🦋', '🌸', '💛', '🌻', '⭐'];

export default function Header({ theme, dayNumber, partnerName }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    setEmojis(
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        left: `${5 + Math.random() * 90}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${4 + Math.random() * 4}s`
      }))
    );
  }, []);

  return (
    <header className="header">
      <div className="floating-emojis" aria-hidden="true">
        {emojis.map(e => (
          <span
            key={e.id}
            className="floating-emoji"
            style={{ left: e.left, animationDelay: e.delay, animationDuration: e.duration }}
          >
            {e.emoji}
          </span>
        ))}
      </div>

      <div className="header-content">
        <h1 className="header-title" style={{ color: theme.accent }}>Daily Sunshine</h1>
        <div className="vibe-badge" style={{ background: theme.secondary, color: theme.textColor }}>
          {theme.label}
        </div>
        <p className="header-sub" style={{ color: theme.mutedColor }}>
          Just for you, {partnerName} 💛
        </p>
      </div>

      <div className="progress-wrap">
        <span className="progress-label" style={{ color: theme.accent }}>Day {dayNumber} of 90</span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(dayNumber / 90) * 100}%`, background: theme.accent }}
          />
        </div>
      </div>
    </header>
  );
}
