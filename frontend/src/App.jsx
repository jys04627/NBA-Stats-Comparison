import React, { useState } from 'react';
import PlayerSearch from './components/PlayerSearch';
import ComparisonView from './components/ComparisonView';
import Draggable from './components/Draggable';
import PlayerNews from './components/PlayerNews';
import './App.css';

function App() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);
  const [season1, setSeason1] = useState('');
  const [season2, setSeason2] = useState('');

  // Fetch stats for Player 1
  React.useEffect(() => {
    if (player1) {
      let url = `http://localhost:5000/api/stats?player_id=${player1.id}`;
      if (season1) url += `&season=${season1}`;

      fetch(url)
        .then(res => res.json())
        .then(data => setStats1(data))
        .catch(err => console.error(err));
    } else {
      setStats1(null);
      setSeason1('');
    }
  }, [player1, season1]);

  // Fetch stats for Player 2
  React.useEffect(() => {
    if (player2) {
      let url = `http://localhost:5000/api/stats?player_id=${player2.id}`;
      if (season2) url += `&season=${season2}`;

      fetch(url)
        .then(res => res.json())
        .then(data => setStats2(data))
        .catch(err => console.error(err));
    } else {
      setStats2(null);
      setSeason2('');
    }
  }, [player2, season2]);

  const getHeadshotUrl = (player, stats) => {
    if (!player) return '';

    // If we have stats with a specific season and team, try to get the historical image
    if (stats && stats.SEASON_ID && stats.TEAM_ID) {
      const year = stats.SEASON_ID.split('-')[0];
      return `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/${stats.TEAM_ID}/${year}/260x190/${player.id}.png`;
    }

    // Fallback to latest
    return `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;
  };

  return (
    <div className="app-container">
      <header className="animate-enter">
        <h1>NBA Stats Comparison</h1>
      </header>

      <div className="comparison-container">
        <div className="player-slot animate-enter delay-1">
          <PlayerSearch label="Player 1" onSelectPlayer={setPlayer1} />
          {player1 && (
            <div className="animate-enter">
              <Draggable className="player-card">
                {stats1 && stats1.TEAM_ID && (
                  <img
                    src={`https://cdn.nba.com/logos/nba/${stats1.TEAM_ID}/global/L/logo.svg`}
                    alt={stats1.TEAM_ABBREVIATION}
                    className="team-logo-bg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="player-image-container">
                  <img
                    src={getHeadshotUrl(player1, stats1)}
                    alt={player1.full_name}
                    className="player-headshot"
                    onError={(e) => {
                      // If historical fails, try latest, then placeholder
                      if (e.target.src.includes('ak-static')) {
                        e.target.src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player1.id}.png`;
                      } else {
                        e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }
                    }}
                  />
                </div>
                <div className="player-info">
                  <h2>{player1.full_name}</h2>
                  <p className="team-name">{stats1 ? stats1.TEAM_ABBREVIATION : ''}</p>
                </div>
                <PlayerNews playerName={player1.full_name} />
                {/* Stats will go here later */}
              </Draggable>
            </div>
          )}
        </div>

        <div className="vs-divider animate-enter delay-2">VS</div>

        <div className="player-slot animate-enter delay-3">
          <PlayerSearch label="Player 2" onSelectPlayer={setPlayer2} />
          {player2 && (
            <div className="animate-enter">
              <Draggable className="player-card">
                {stats2 && stats2.TEAM_ID && (
                  <img
                    src={`https://cdn.nba.com/logos/nba/${stats2.TEAM_ID}/global/L/logo.svg`}
                    alt={stats2.TEAM_ABBREVIATION}
                    className="team-logo-bg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="player-image-container">
                  <img
                    src={getHeadshotUrl(player2, stats2)}
                    alt={player2.full_name}
                    className="player-headshot"
                    onError={(e) => {
                      if (e.target.src.includes('ak-static')) {
                        e.target.src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player2.id}.png`;
                      } else {
                        e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }
                    }}
                  />
                </div>
                <div className="player-info">
                  <h2>{player2.full_name}</h2>
                  <p className="team-name">{stats2 ? stats2.TEAM_ABBREVIATION : ''}</p>
                </div>
                <PlayerNews playerName={player2.full_name} />
              </Draggable>
            </div>
          )}
        </div>
      </div>

      {(player1 || player2) && (
        <div className="stats-section">
          <ComparisonView
            player1={player1}
            player2={player2}
            stats1={stats1}
            stats2={stats2}
            season1={season1}
            season2={season2}
            setSeason1={setSeason1}
            setSeason2={setSeason2}
          />
        </div>
      )}
    </div>
  );
}

export default App;
