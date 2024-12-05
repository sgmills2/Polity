import sqlite3

def seed_database():
    conn = sqlite3.connect('polity.db')
    cursor = conn.cursor()

    # Create table if it doesn't exist
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
        # Add more politicians as needed
    ]

    cursor.executemany('INSERT OR REPLACE INTO politicians (id, name, state, chamber) VALUES (?, ?, ?, ?)', politicians)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_database()
