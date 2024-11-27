def process_data(raw_data):
    members = raw_data.get("members", [])
    processed = []

    for member in members:
        processed.append({
            "id": member["bioguideId"],
            "name": member["name"],
            "party": member["partyName"],
            "state": member["state"],
            "image": member["depiction"]["imageUrl"],
            "profile_url": member["url"],
        })

    return processed
