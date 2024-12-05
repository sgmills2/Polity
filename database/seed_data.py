import sqlite3
import os
from pathlib import Path

def seed_database():
    # Get absolute path to database
    BASE_DIR = Path(__file__).resolve().parent.parent
    db_path = BASE_DIR / 'database' / 'polity.db'
    
    print(f"Attempting to connect to database at: {db_path}")
    
    # Create database directory if it doesn't exist
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    print("Creating table...")
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS politicians (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        chamber TEXT NOT NULL CHECK(chamber IN ('senate', 'house'))
    )
    ''')

    # Sample data
    politicians = [
        (1, 'Dianne Feinstein', 'CA', 'senate'),
        (2, 'Alex Padilla', 'CA', 'senate'),
        (3, 'Bernie Sanders', 'VT', 'senate'),
        (4, 'Elizabeth Warren', 'MA', 'senate'),
        (5, 'Alexandria Ocasio-Cortez', 'NY', 'house'),
    ]

    print("Inserting data...")
    cursor.executemany('INSERT OR REPLACE INTO politicians (id, name, state, chamber) VALUES (?, ?, ?, ?)', politicians)
    conn.commit()
    print("Database seeded successfully!")
    conn.close()

def fetch_members():
    BASE_DIR = Path(__file__).resolve().parent.parent
    db_path = BASE_DIR / 'database' / 'polity.db'
    
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    try:
        members = conn.execute('SELECT * FROM politicians ORDER BY name').fetchall()
        return [dict(member) for member in members]
    finally:
        conn.close()

if __name__ == "__main__":
    seed_database()
