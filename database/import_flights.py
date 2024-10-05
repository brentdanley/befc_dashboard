import sqlite3
import csv
import argparse

# Connect to SQLite
conn = sqlite3.connect('befc_flights.db')
cursor = conn.cursor()

def preprocess_row(row):
    # Add 'N' prefix to tail_number if missing
    if not row[2].startswith('N'):
        row[2] = 'N' + row[2]

    # Skip maintenance records (example: if reservation_type is 'Maintenance')
    if row[24] == 'Maintenance':
        return None  # Return None to skip the row

    # Ensure row has exactly 34 values by appending None for missing fields
    while len(row) < 34:
        row.append(None)

    return row

def import_csv(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row

        for row in reader:
            row = preprocess_row(row)
            if row:
                try:
                    cursor.execute('INSERT OR IGNORE INTO flights VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', row)
                except sqlite3.IntegrityError as e:
                    print(f"Error inserting row: {e}")

    conn.commit()

def main():
    # Setup command line argument parsing
    parser = argparse.ArgumentParser(description='Import flight data from a CSV file into SQLite database.')
    parser.add_argument('csv_file', help='Path to the CSV file to import')
    
    args = parser.parse_args()

    # Call the import function with the provided CSV file path
    import_csv(args.csv_file)

    print(f"Successfully imported data from {args.csv_file}")

if __name__ == '__main__':
    main()

# Close the connection
conn.close()

