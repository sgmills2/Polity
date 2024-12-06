import requests
import os
from dotenv import load_dotenv

load_dotenv()

def fetch_members(chamber=None, state=None):
    API_KEY = os.getenv('CONGRESS_API_KEY')
    base_url = "https://api.congress.gov/v3/member"
    
    # Add query parameters for filtering
    params = {
        'api_key': API_KEY,
        'format': 'json',
        'limit': 250  # Get maximum results
    }
    
    if chamber:
        params['chamber'] = chamber.upper()
    if state:
        params['state'] = state.upper()

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError as e:
        raise Exception(f"Error fetching members: {str(e)}")

if __name__ == "__main__":
    try:
        members = fetch_members()
        print(members)
    except requests.HTTPError as e:
        print(e)