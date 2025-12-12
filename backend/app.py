from flask import Flask, jsonify, request
from flask_cors import CORS
import feedparser
from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats, commonplayerinfo

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

    try:
        all_players = players.get_players()
        
        # Filter by name
        matching_players = [
            p for p in all_players 
            if query in p['full_name'].lower()
        ][:20]  # Limit to 20 results
        
        # Return basic info - we'll fetch team info when player is selected
        return jsonify(matching_players)
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
        season_id = request.args.get('season')
        
        if df.empty:
            return jsonify({})

        if season_id:
            # Filter for the specific season
            season_data = df[df['SEASON_ID'] == season_id]
            if season_data.empty:
                return jsonify({"error": f"No data found for season {season_id}"}), 404
            # If a player played for multiple teams, the API usually provides a 'TOT' (Total) row.
            # We should prioritize that, or just take the last entry which is usually the latest team or total.
            # For now, taking the last row is a safe bet for 'latest context' of that season.
            target_season = season_data.iloc[-1].to_dict()
        else:
            # Default to the most recent season
            target_season = df.iloc[-1].to_dict()
        
        # Get list of all available seasons for this player
        # unique() returns a numpy array, so we convert to list
        available_seasons = df['SEASON_ID'].unique().tolist()
        target_season['available_seasons'] = available_seasons

        # Calculate per game stats if not present (usually they are totals)
        # Calculate per game stats if not present (usually they are totals)
        # GP = Games Played
        gp = target_season['GP']
        if gp > 0:
            target_season['PPG'] = round(target_season['PTS'] / gp, 1)
            target_season['RPG'] = round(target_season['REB'] / gp, 1)
            target_season['APG'] = round(target_season['AST'] / gp, 1)
        else:
            target_season['PPG'] = 0
            target_season['RPG'] = 0
            target_season['APG'] = 0
            
        return jsonify(target_season)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/news', methods=['GET'])
def get_player_news():
    player_name = request.args.get('name')
    if not player_name:
        return jsonify({"error": "Missing player name"}), 400

    try:
        # ESPN NBA RSS Feed
        feed_url = "https://www.espn.com/espn/rss/nba/news"
        feed = feedparser.parse(feed_url)
        
        # Simple keyword matching
        # Split player name into parts (e.g. "LeBron", "James") to match partials if needed,
        # but full name match is safer to reduce noise.
        # We'll check if the player's last name appears in the title or description.
        name_parts = player_name.split()
        last_name = name_parts[-1] if name_parts else player_name
        
        relevant_news = []
        for entry in feed.entries:
            title = entry.title
            description = entry.description
            
            # Check if full name or last name is in the text
            # Using last name is broader, might match other players with same last name (e.g. Green, Curry)
            # but usually better than getting nothing.
            if player_name.lower() in title.lower() or player_name.lower() in description.lower() or \
               last_name.lower() in title.lower() or last_name.lower() in description.lower():
                relevant_news.append({
                    "title": title,
                    "link": entry.link,
                    "published": entry.published,
                    "summary": description
                })
        
        return jsonify(relevant_news[:5]) # Return top 5 matches
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
