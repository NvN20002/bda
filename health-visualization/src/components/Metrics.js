// src/Metrics.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Metrics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/metrics');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div>
      <h2>Health Metrics</h2>

      <h3>Severity Counts</h3>
      <ul>
        {data.severity_counts.map((item, index) => (
          <li key={index}>
            Type: {item.Type}, Count: {item.count}
          </li>
        ))}
      </ul>

      <h3>Average Vitals by Type</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Avg Temperature</th>
            <th>Avg Heart Rate</th>
            <th>Avg Respiratory Rate</th>
            <th>Avg Oxygen Saturation</th>
          </tr>
        </thead>
        <tbody>
          {data.vitals_by_type.map((item, index) => (
            <tr key={index}>
              <td>{item.Type}</td>
              <td>{item.avg_temperature}</td>
              <td>{item.avg_heart_rate}</td>
              <td>{item.avg_respiratory_rate}</td>
              <td>{item.avg_oxygen_saturation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>All Records</h3>
      <pre>{JSON.stringify(data.all_records, null, 2)}</pre>
    </div>
  );
};

export default Metrics;
