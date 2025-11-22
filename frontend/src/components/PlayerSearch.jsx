import React, { useState } from 'react';

const PlayerSearch = ({ onSelectPlayer, label }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/search?name=${value}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error searching players:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="player-search">
            <h3>{label}</h3>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search for a player..."
                className="search-input"
            />
            {loading && <div className="loading">Searching...</div>}
            {results.length > 0 && (
                <ul className="results-list">
                    {results.map((player) => (
                        <li key={player.id} onClick={() => {
                            onSelectPlayer(player);
                            setQuery(player.full_name);
                            setResults([]);
                        }}>
                            {player.full_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlayerSearch;
