import React, { useEffect, useState } from 'react';

const ComparisonView = ({ player1, player2 }) => {
    const [stats1, setStats1] = useState(null);
    const [stats2, setStats2] = useState(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        if (player1) {
            setLoading1(true);
            fetch(`http://localhost:5000/api/stats?player_id=${player1.id}`)
                .then(res => res.json())
                .then(data => setStats1(data))
                .catch(err => console.error(err))
                .finally(() => setLoading1(false));
        } else {
            setStats1(null);
        }
    }, [player1]);

    useEffect(() => {
        if (player2) {
            setLoading2(true);
            fetch(`http://localhost:5000/api/stats?player_id=${player2.id}`)
                .then(res => res.json())
                .then(data => setStats2(data))
                .catch(err => console.error(err))
                .finally(() => setLoading2(false));
        } else {
            setStats2(null);
        }
    }, [player2]);

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
