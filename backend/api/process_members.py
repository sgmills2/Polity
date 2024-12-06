def process_data(raw_data, chamber=None, state=None):
    members = raw_data.get("members", [])
    processed = []

    for member in members:
        member_chamber = member.get("chamber", "").lower()
        member_state = member.get("state", "")
        
        if (not chamber or member_chamber == chamber.lower()) and \
           (not state or member_state == state.upper()):
            processed.append({
                "id": member["bioguideId"],
                "name": member["name"],
                "party": member.get("partyName", "Unknown"),
                "state": member_state,
                "chamber": member_chamber,
                "url": member.get("url", ""),
                "next_election": member.get("terms", [{}])[-1].get("endYear", ""),
                "twitter_account": member.get("socialMedia", {}).get("twitter", ""),
                "facebook_account": member.get("socialMedia", {}).get("facebook", ""),
            })

    return processed
