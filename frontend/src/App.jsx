import React, { useState } from 'react';
import PlayerSearch from './components/PlayerSearch';
import ComparisonView from './components/ComparisonView';
import './App.css';

function App() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  return (
    <div className="app-container">
      <header>
        <h1>NBA Stats Comparison</h1>
      </header>

      <div className="comparison-container">
        <div className="player-slot">
          <PlayerSearch label="Player 1" onSelectPlayer={setPlayer1} />
          {player1 && (
            <div className="player-card">
              <h2>{player1.full_name}</h2>
              <p>ID: {player1.id}</p>
              {/* Stats will go here later */}
            </div>
          )}
        </div>

        <div className="vs-divider">VS</div>

        <div className="player-slot">
          <PlayerSearch label="Player 2" onSelectPlayer={setPlayer2} />
          {player2 && (
            <div className="player-card">
              <h2>{player2.full_name}</h2>
              <p>ID: {player2.id}</p>
            </div>
          )}
        </div>
      </div>

      {(player1 || player2) && (
        <div className="stats-section">
          <ComparisonView player1={player1} player2={player2} />
        </div>
      )}
    </div>
  );
}

export default App;
