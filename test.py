# test_api.py
import nba_api
from nba_api.stats.endpoints import playercareerstats

career = playercareerstats.PlayerCareerStats(player_id='2529')

print(career.get_data_frames()[0].columns)