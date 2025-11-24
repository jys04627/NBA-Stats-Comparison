import React from 'react';

const ComparisonView = ({ player1, player2, stats1, stats2, season1, season2, setSeason1, setSeason2 }) => {

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
