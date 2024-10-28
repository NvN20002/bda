from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('health_warehouse.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    conn = get_db_connection()
    
    # Get severity counts
    severity_counts = pd.read_sql_query("""
        SELECT Type, COUNT(*) as count 
        FROM health_metrics 
        GROUP BY Type
    """, conn)
    
    # Get average vitals by type
    vitals_by_type = pd.read_sql_query("""
        SELECT 
            Type,
            AVG(Temperature) as avg_temperature,
            AVG(Heart_Rate) as avg_heart_rate,
            AVG(Respiratory_Rate) as avg_respiratory_rate,
            AVG(Oxygen_Saturation) as avg_oxygen_saturation
        FROM health_metrics
        GROUP BY Type
    """, conn)
    
    # Get all records for detailed view
    all_records = pd.read_sql_query("""
        SELECT * FROM health_metrics
    """, conn)
    
    conn.close()
    
    return jsonify({
        'severity_counts': severity_counts.to_dict('records'),
        'vitals_by_type': vitals_by_type.to_dict('records'),
        'all_records': all_records.to_dict('records')
    })

if __name__ == '__main__':
    app.run(debug=True)