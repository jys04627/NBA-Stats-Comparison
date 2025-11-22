import React, { useEffect, useState } from 'react';

const ComparisonView = ({ player1, player2 }) => {
    const [stats1, setStats1] = useState(null);
    const [stats2, setStats2] = useState(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [season1, setSeason1] = useState('');
    const [season2, setSeason2] = useState('');

    useEffect(() => {
        if (player1) {
            setLoading1(true);
            let url = `http://localhost:5000/api/stats?player_id=${player1.id}`;
            if (season1) url += `&season=${season1}`;

            fetch(url)
                .then(res => res.json())
                .then(data => setStats1(data))
                .catch(err => console.error(err))
                .finally(() => setLoading1(false));
        } else {
            setStats1(null);
            setSeason1('');
        }
    }, [player1, season1]);

    useEffect(() => {
        if (player2) {
            setLoading2(true);
            let url = `http://localhost:5000/api/stats?player_id=${player2.id}`;
            if (season2) url += `&season=${season2}`;

            fetch(url)
                .then(res => res.json())
                .then(data => setStats2(data))
                .catch(err => console.error(err))
                .finally(() => setLoading2(false));
        } else {
            setStats2(null);
            setSeason2('');
        }
    }, [player2, season2]);

    const renderSeasonSelector = (stats, currentSeason, setSeason) => {
        if (!stats || !stats.available_seasons) return null;

        return (
            <select
                value={currentSeason || stats.SEASON_ID}
                onChange={(e) => setSeason(e.target.value)}
                className="season-select"
            >
                {stats.available_seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                ))}
            </select>
        );
    };

    const renderStatRow = (label, key) => {
        const val1 = stats1 ? stats1[key] : '-';
        const val2 = stats2 ? stats2[key] : '-';

        // Highlight better stat
        let class1 = '';
        let class2 = '';

        if (stats1 && stats2 && typeof val1 === 'number' && typeof val2 === 'number') {
            if (val1 > val2) class1 = 'winner';
            if (val2 > val1) class2 = 'winner';
        }

        return (
            <div className="stat-row" key={key}>
                <div className={`stat-val ${class1}`}>{val1}</div>
                <div className="stat-label">{label}</div>
                <div className={`stat-val ${class2}`}>{val2}</div>
            </div>
        );
    };

    return (
        <div className="comparison-view">
            <div className="season-selectors" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>{renderSeasonSelector(stats1, season1, setSeason1)}</div>
                <div>{renderSeasonSelector(stats2, season2, setSeason2)}</div>
            </div>
            <div className="stats-grid">
                {renderStatRow('PPG', 'PPG')}
                {renderStatRow('RPG', 'RPG')}
                {renderStatRow('APG', 'APG')}
                {renderStatRow('GP', 'GP')}
                {renderStatRow('FG%', 'FG_PCT')}
                {renderStatRow('3P%', 'FG3_PCT')}
                {renderStatRow('FT%', 'FT_PCT')}
            </div>
        </div>
    );
};

export default ComparisonView;
