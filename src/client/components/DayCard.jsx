import React, { useState } from 'react';

function Card({ label, emoji, children, theme, pulse = false }) {
  return (
    <div
      className={`card ${pulse ? 'card-pulse' : ''}`}
      style={{ background: theme.cardBg, borderColor: `${theme.accent}22` }}
    >
      <p className="card-label" style={{ color: theme.accent }}>{emoji} {label}</p>
      {children}
    </div>
  );
}

export default function DayCard({ dayData, theme }) {
  const [jokeShown, setJokeShown] = useState(false);
  const { greeting, affirmation, joke, miniChallenge } = dayData;

  return (
    <main className="cards-wrap fade-in">

      <div className="greeting-wrap">
        <h2 className="greeting" style={{ color: theme.textColor }}>
          {greeting}
        </h2>
      </div>

      <Card label="Today's Affirmation" emoji="✨" theme={theme}>
        <p className="card-body affirmation-text" style={{ color: theme.textColor }}>
          "{affirmation}"
        </p>
      </Card>

      <Card label="Today's Joke" emoji="😄" theme={theme}>
        {jokeShown ? (
          <p className="card-body" style={{ color: theme.textColor }}>{joke}</p>
        ) : (
          <button
            className="reveal-btn"
            style={{ color: theme.accent, borderColor: theme.accent }}
            onClick={() => setJokeShown(true)}
          >
            Tap to reveal 👆
          </button>
        )}
      </Card>

      <Card label="Mini Challenge" emoji="🎯" theme={theme}>
        <p className="card-body" style={{ color: theme.textColor }}>{miniChallenge}</p>
      </Card>

      {/* Love Note — commented out for now
      <Card label="A Note from Your Person" emoji="💌" theme={theme} pulse>
        <p className="card-body love-note-text" style={{ color: theme.textColor }}>
          "{loveNote}"
        </p>
      </Card>
      */}

    </main>
  );
}
