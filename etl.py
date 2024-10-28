import pandas as pd
import sqlite3
from datetime import datetime

def extract_and_transform_data(csv_file):
    """Extract and transform health data from CSV."""
    try:
        # Try different encodings if UTF-8 fails
        try:
            df = pd.read_csv(csv_file, encoding='utf-8')
        except UnicodeDecodeError:
            print("UTF-8 decoding failed. Trying 'windows-1252' encoding.")
            df = pd.read_csv(csv_file, encoding='windows-1252')

        print("Original columns:", df.columns.tolist())

        # Clean column names - remove extra spaces and standardize
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.replace(r'[^\w]', '', regex=True)

        print("Cleaned columns:", df.columns.tolist())

        # Check if 'Type' column exists
        if 'Type' not in df.columns:
            raise ValueError("Missing 'Type' column in the data.")

        # Convert boolean columns to integers
        boolean_columns = ['Dehydration', 'Medicine_Overdose', 'Acidious', 'Cold', 'Cough']

        for col in boolean_columns:
            if col in df.columns:
                df[col] = df[col].map({'TRUE': 1, 'FALSE': 0})

        # Convert numeric columns
        numeric_columns = [
            'Temperature', 'Heart_Rate', 'Pulse', 'BPSYS',
            'BPDIA', 'Respiratory_Rate', 'Oxygen_Saturation',
            'PH', 'Type'
        ]

        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        # Add metadata
        df['loaded_at'] = datetime.now()

        return df

    except Exception as e:
        print(f"Error in extract_and_transform_data: {str(e)}")
        raise

def load_to_warehouse(df):
    """Load transformed data into SQLite database."""
    try:
        conn = sqlite3.connect('health_warehouse.db')

        # Create table and load data
        df.to_sql('health_metrics', conn, if_exists='replace', index=False)

        print("\nData loaded successfully!")
        print(f"Number of records loaded: {len(df)}")

        # Verify data
        verification = pd.read_sql("SELECT * FROM health_metrics LIMIT 1", conn)
        print("\nSample record from database:")
        print(verification)

        return conn

    except Exception as e:
        print(f"Error in load_to_warehouse: {str(e)}")
        raise

    finally:
        conn.close()

def get_summary_statistics(df):
    """Generate summary statistics for the data."""
    print("\nSummary Statistics:")
    print("\nCondition Type Distribution:")
    print(df['Type'].value_counts())

    print("\nNumerical Columns Statistics:")
    numeric_cols = ['Temperature', 'Heart_Rate', 'Pulse', 'Respiratory_Rate', 'Oxygen_Saturation']
    print(df[numeric_cols].describe())

if __name__ == "__main__":
    # Path to the CSV file
    csv_file = 'health_data.csv'  # Make sure this file exists in the working directory

    try:
        # Extract and transform data
        df = extract_and_transform_data(csv_file)

        # Check the contents of the DataFrame
        print("\nDataFrame after extraction and transformation:")
        print(df.head())  # Display the first few rows of the DataFrame
        print("DataFrame columns:", df.columns.tolist())  # Display the column names

        # Load data to warehouse
        load_to_warehouse(df)

        # Generate summary statistics
        get_summary_statistics(df)

    except Exception as e:
        print(f"Error in main execution: {str(e)}")
