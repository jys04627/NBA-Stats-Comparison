from nba_api.stats.endpoints import playercareerstats
import pandas as pd
import time

# 2529 is old player ID (e.g. Chris Acker? No, 2529 is probably someone else)
# 2544 is LeBron
player_id = '2529' 

print(f"Fetching stats for player ID: {player_id}")

try:
    # NBA.com often blocks requests without headers. Adding standard headers.
    custom_headers = {
        'Host': 'stats.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://stats.nba.com/',
    }
    
    # Add timeout
    career = playercareerstats.PlayerCareerStats(player_id=player_id, timeout=60, headers=custom_headers)
    
    dfs = career.get_data_frames()
    if dfs:
        print("\nSuccess! Columns found:")
        print(dfs[0].columns)
        print("\nFirst row of data:")
        print(dfs[0].head(1))
    else:
        print("No data frames returned.")

except Exception as e:
    print(f"\nError occurred: {e}")
    print("This 'resultSet' error usually means the NBA API blocked the request or returned an invalid response.")
    print("Try waiting a few seconds or changing your IP/headers.")
