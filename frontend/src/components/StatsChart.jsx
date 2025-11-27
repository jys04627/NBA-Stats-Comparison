import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const StatsChart = ({ stats1, stats2, player1Name, player2Name }) => {
    if (!stats1 && !stats2) {
        return (
            <div className="stats-chart-container">
                <p className="no-stats">No stats available</p>
            </div>
        );
    }

    // Prepare data for the radar chart
    const data = {
        labels: ['PPG', 'RPG', 'APG', 'FG%', '3P%', 'FT%'],
        datasets: [
            {
                label: player1Name || 'Player 1',
                data: stats1 ? [
                    (stats1.PPG || 0) * 1.5,      // Scale up for visibility
                    (stats1.RPG || 0) * 2,        // Scale up for visibility
                    (stats1.APG || 0) * 2,        // Scale up for visibility
                    (stats1.FG_PCT || 0) * 50,    // Scale to 0-50 range
                    (stats1.FG3_PCT || 0) * 50,   // Scale to 0-50 range
                    (stats1.FT_PCT || 0) * 50     // Scale to 0-50 range
                ] : [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: player2Name || 'Player 2',
                data: stats2 ? [
                    (stats2.PPG || 0) * 1.5,      // Scale up for visibility
                    (stats2.RPG || 0) * 2,        // Scale up for visibility
                    (stats2.APG || 0) * 2,        // Scale up for visibility
                    (stats2.FG_PCT || 0) * 50,    // Scale to 0-50 range
                    (stats2.FG3_PCT || 0) * 50,   // Scale to 0-50 range
                    (stats2.FT_PCT || 0) * 50     // Scale to 0-50 range
                ] : [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 50,
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                    color: '#fff',
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: 'bold'
                    }
                },
                ticks: {
                    color: '#888',
                    backdropColor: 'transparent',
                    font: {
                        size: 11
                    },
                    stepSize: 5
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff',
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: 'bold'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#ff6b35',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        // Format based on stat type
                        if (context.label.includes('%')) {
                            // Percentage stats: multiply by 2 to get actual %
                            label += (context.parsed.r * 2).toFixed(1) + '%';
                        } else if (context.label === 'PPG') {
                            // PPG: divide by 1.5 to get actual value
                            label += (context.parsed.r / 1.5).toFixed(1);
                        } else {
                            // RPG, APG: divide by 2 to get actual value
                            label += (context.parsed.r / 2).toFixed(1);
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div className="stats-chart-container radar-chart">
            <h3 className="chart-title">Stats Comparison</h3>
            <div className="chart-wrapper">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
};

export default StatsChart;
