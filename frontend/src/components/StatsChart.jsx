import React from 'react';
import { Radar, Bar, Line, PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Filler,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend
);

const StatsChart = ({ stats1, stats2, player1Name, player2Name, chartType = 'radar', sizeScale = 1 }) => {
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


    // Configure options based on chart type
    const getOptions = () => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: true,
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

                            // Get the value based on chart type
                            const value = chartType === 'radar' || chartType === 'polarArea'
                                ? context.parsed.r
                                : context.parsed.y;

                            // Format based on stat type
                            if (context.label.includes('%')) {
                                // Percentage stats: multiply by 2 to get actual %
                                label += (value * 2).toFixed(1) + '%';
                            } else if (context.label === 'PPG') {
                                // PPG: divide by 1.5 to get actual value
                                label += (value / 1.5).toFixed(1);
                            } else {
                                // RPG, APG: divide by 2 to get actual value
                                label += (value / 2).toFixed(1);
                            }
                            return label;
                        }
                    }
                }
            }
        };

        // Add scale configuration based on chart type
        if (chartType === 'radar' || chartType === 'polarArea') {
            baseOptions.scales = {
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
            };
        } else {
            // Bar and Line charts use x and y scales
            baseOptions.scales = {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 50,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#888',
                        font: {
                            size: 11
                        },
                        stepSize: 5
                    }
                }
            };
        }

        return baseOptions;
    };

    const options = getOptions();

    // Render different chart types based on selection
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'line':
                return <Line data={data} options={options} />;
            case 'polarArea':
                return <PolarArea data={data} options={options} />;
            case 'radar':
            default:
                return <Radar data={data} options={options} />;
        }
    };

    return (
        <div className={`stats-chart-container ${chartType}-chart`}>
            <h3 className="chart-title">Stats Comparison</h3>
            <div className="chart-wrapper" style={{ maxWidth: `${350 * sizeScale}px` }}>
                {renderChart()}
            </div>
        </div>
    );
};

export default StatsChart;
