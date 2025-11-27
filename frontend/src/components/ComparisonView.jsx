import React, { useEffect, useRef, useState } from 'react';
import StatsChart from './StatsChart';

const ComparisonView = ({ player1, player2, stats1, stats2, season1, season2, setSeason1, setSeason2 }) => {
    const statsRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, []);

    // Retrigger animation when seasons change
    useEffect(() => {
        if (isVisible) {
            setIsVisible(false);
            setTimeout(() => {
                setIsVisible(true);
                setAnimationKey(prev => prev + 1);
            }, 50);
        }
    }, [season1, season2]);

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
        <div className={`comparison-view ${isVisible ? 'visible' : ''}`} ref={statsRef} key={animationKey}>
            <div className="season-selectors" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>{renderSeasonSelector(stats1, season1, setSeason1)}</div>
                <div>{renderSeasonSelector(stats2, season2, setSeason2)}</div>
            </div>

            {/* Chart Visualization */}
            <div className="charts-section">
                <StatsChart
                    stats1={stats1}
                    stats2={stats2}
                    player1Name={player1 ? player1.full_name : 'Player 1'}
                    player2Name={player2 ? player2.full_name : 'Player 2'}
                />
            </div>

            <div className="stats-grid">
                {renderStatRow('PPG', 'PPG')}
                {renderStatRow('RPG', 'RPG')}
                {renderStatRow('APG', 'APG')}
                {renderStatRow('FG%', 'FG_PCT')}
                {renderStatRow('3P%', 'FG3_PCT')}
                {renderStatRow('FT%', 'FT_PCT')}
            </div>
        </div>
    );
};

export default ComparisonView;
