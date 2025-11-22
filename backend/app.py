from flask import Flask, jsonify, request
from flask_cors import CORS
from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "NBA Stats Backend is running!"})

@app.route('/api/search', methods=['GET'])
def search_players():
    query = request.args.get('name', '').lower()
    if not query:
        return jsonify([])

    # Fetch all players (this might be slow if done every time, caching recommended in production)
    # For now, we fetch once or rely on nba_api's internal caching if available.
    # commonallplayers.CommonAllPlayers returns a list of all players.
    try:
        # IsOnlyCurrentSeason=0 allows searching for historic players too
        all_players = players.get_players()
        
        # Filter by name
        matching_players = [
            p for p in all_players 
            if query in p['full_name'].lower()
        ]
        
        return jsonify(matching_players[:20]) # Limit to 20 results
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_player_stats():
    player_id = request.args.get('player_id')
    if not player_id:
        return jsonify({"error": "Missing player_id"}), 400

    try:
        # Fetch career stats
        career = playercareerstats.PlayerCareerStats(player_id=player_id)
        df = career.get_data_frames()[0]
        
        # Get the most recent season (or specific season if requested)
        # For simplicity, we'll just return the last row (most recent season)
        if df.empty:
            return jsonify({})
            
        latest_season = df.iloc[-1].to_dict()
        
        # Calculate per game stats if not present (usually they are totals)
        # GP = Games Played
        gp = latest_season['GP']
        if gp > 0:
            latest_season['PPG'] = round(latest_season['PTS'] / gp, 1)
            latest_season['RPG'] = round(latest_season['REB'] / gp, 1)
            latest_season['APG'] = round(latest_season['AST'] / gp, 1)
        else:
            latest_season['PPG'] = 0
            latest_season['RPG'] = 0
            latest_season['APG'] = 0
            
        return jsonify(latest_season)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
