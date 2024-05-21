import json
import os
from datetime import datetime, timedelta

import psycopg2


def get_secrets_json():
    secrets_file = open("secrets.json")
    secrets = json.load(secrets_file)
    secrets_file.close()
    return secrets["database"]


def connect_to_db():
    secrets = get_secrets_json()
    print("Connecting to database...")

    conn = psycopg2.connect(
        dbname=secrets["dbname"],
        host=secrets["host"],
        user=secrets["user"],
        password=secrets["password"],
        port=secrets["port"]
    )
    print("Connected!")
    return conn


def migrate(conn):
    current_location = __file__
    current_directory = os.path.dirname(current_location)
    parent_directory = os.path.dirname(current_directory)
    migration_file_location = os.path.join(parent_directory, "server", "db.sql")

    try:
        with open(migration_file_location, 'r') as file:
            query = file.read()

        print("Migrating database...")
        cursor = conn.cursor()
        cursor.execute(query)
        conn.commit()
        cursor.close()
        print("Migration complete!")
    except (Exception, psycopg2.Error) as error:
        print("Error migrating database:", error)


def check_migration(conn):
    cursor = conn.cursor()
    query = """
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_catalog = 'greenhouse'"""
    cursor.execute(query)

    tables = cursor.fetchall()

    if tables:
        print("Tables:")
        for table in tables:
            print(table)
    else:
        migrate(conn)

    cursor.close()


def delete_old_data(conn):
    cursor = conn.cursor()
    print("Deleting old data...")
    query = "DELETE FROM data_points"
    cursor.execute(query)
    conn.commit()
    print("Old data deleted!")
    cursor.close()


def populate_database(conn, checking_interval=5):
    current_location = __file__
    current_directory = os.path.dirname(current_location)
    parent_directory = os.path.dirname(current_directory)
    data_file_location = os.path.join(parent_directory, "generator", "output.txt")
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print("Populating database...")
    with open(data_file_location, 'r') as file:
        while True:
            data_entry = dict()
            for i in range(7):
                line = file.readline()
                if not line:
                    file.close()
                    print("End of file reached. Database populated!")
                    return
                if line:
                    data_pair = line.split(" ")
                    data_label = data_pair[0].lower().strip()
                    data_value = data_pair[1].strip()
                    data_entry[data_label] = data_value

            cursor = conn.cursor()

            query = f"""
                    INSERT INTO data_points (time, moist, temp, dist, watering, spraying, spraying_time)
                    VALUES ('{current_time}', {data_entry['moist']}, {data_entry['temp']}, {data_entry['dist']}, 
                    {data_entry['watering']}, {data_entry['spraying']}, {data_entry['spray_time']})"""
            cursor.execute(query)
            conn.commit()
            cursor.close()
            # add 'checking_interval' seconds to the current time
            current_time = (datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S") +
                            timedelta(seconds=checking_interval)).strftime("%Y-%m-%d %H:%M:%S")
            file.readline()


def check_entries(conn):
    cursor = conn.cursor()
    query = "SELECT COUNT(*) FROM data_points"
    cursor.execute(query)
    count = cursor.fetchone()[0]
    print(f"Database entries: {count}")
    cursor.close()


def main():
    conn = connect_to_db()
    migrate(conn)
    check_migration(conn)
    delete_old_data(conn)
    populate_database(conn)
    check_entries(conn)
    conn.close()
    print("Disconnected from database.")


if __name__ == "__main__":
    main()
