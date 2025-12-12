import React, { useEffect, useState } from 'react';
import './PlayerNews.css';

const PlayerNews = ({ playerName }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!playerName) return;

        setLoading(true);
        fetch(`http://localhost:5000/api/news?name=${playerName}`)
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching news:", err);
                setLoading(false);
            });
    }, [playerName]);

    if (loading) return <div className="news-loading">Loading news...</div>;
    if (news.length === 0) return <div className="news-empty">No recent news found for {playerName}</div>;

    return (
        <div className="player-news-container">
            <h4>Latest News</h4>
            <ul className="news-list">
                {news.map((item, index) => (
                    <li key={index} className="news-item">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <div className="news-title">{item.title}</div>
                            <div className="news-date">{new Date(item.published).toLocaleDateString()}</div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerNews;
