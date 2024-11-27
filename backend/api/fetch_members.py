import requests

def fetch_members():
    API_KEY = "z6guUWb5M3W8WRDjLLag977YcWoiHJxhmX52ktau"
    URL = f"https://api.congress.gov/v3/member?api_key={API_KEY}"

    response = requests.get(URL)
    if response.status_code == 200:
        return response.json()  # Returns raw JSON data
    else:
        raise Exception(f"Failed to fetch members: {response.status_code}")
