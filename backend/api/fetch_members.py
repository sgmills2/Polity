import requests
import os
from dotenv import load_dotenv

load_dotenv()

def fetch_members(chamber=None, state=None):
    # https://gpo.congress.gov/#/
    API_KEY = os.getenv('CONGRESS_API_KEY')
    base_url = "https://api.congress.gov/v3/member"
    
    # Add query parameters for filtering
    params = {
        'api_key': API_KEY,
        'format': 'json',
        'limit': 250,  # Get maximum results
        'inOffice': True  # Only get current members
    }
    
    if chamber:
        # Convert chamber to proper format for API
        chamber_map = {
            'senate': 'Senate',
            'house': 'House'
        }
        params['chamber'] = chamber_map.get(chamber.lower())
    
    if state:
        params['state'] = state.upper()

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Debug print
        print(f"API URL: {response.url}")
        print(f"Found {len(data.get('members', []))} members")
        
        return data
    except requests.HTTPError as e:
        print(f"Error response: {e.response.text if hasattr(e, 'response') else str(e)}")
        raise Exception(f"Error fetching members: {str(e)}")

if __name__ == "__main__":
    try:
        members = fetch_members()
        print(members)
    except requests.HTTPError as e:
        print(e)