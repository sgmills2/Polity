CREATE TABLE IF NOT EXISTS politicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    chamber TEXT NOT NULL CHECK(chamber IN ('senate', 'house'))
    voting_records TEXT,
    lawsuits TEXT
);