// src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
);

function App() {
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

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error fetching data: {error.message}</Typography>;

  // Prepare data for visualization
  const severityCounts = data.severity_counts.map(item => item.count);
  const severityTypes = data.severity_counts.map(item => item.Type);

  const avgTemperature = data.vitals_by_type.map(item => item.avg_temperature);
  const avgHeartRate = data.vitals_by_type.map(item => item.avg_heart_rate);
  const avgRespiratoryRate = data.vitals_by_type.map(item => item.avg_respiratory_rate);
  const avgOxygenSaturation = data.vitals_by_type.map(item => item.avg_oxygen_saturation);
  const vitalsTypes = data.vitals_by_type.map(item => item.Type);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Health Metrics Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>Severity Counts</Typography>
            <Bar
              data={{
                labels: severityTypes,
                datasets: [{
                  label: 'Count',
                  data: severityCounts,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Severity Counts',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Severity Types', // X-axis label
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Count', // Y-axis label
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" paragraph>
              This bar chart displays the count of different severity types recorded in the dataset. The X-axis represents the different severity types, while the Y-axis indicates the number of occurrences for each type.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>Average Vitals by Type</Typography>
            <Pie
              data={{
                labels: vitalsTypes,
                datasets: [{
                  label: 'Average Temperature',
                  data: avgTemperature,
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Average Temperature by Type',
                  },
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" paragraph>
              This pie chart illustrates the average temperature for different vitals types. Each slice represents a different vital type, showing its contribution to the overall average temperature.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>Line Chart of Average Vitals</Typography>
            <Line
              data={{
                labels: vitalsTypes,
                datasets: [
                  {
                    label: 'Avg Heart Rate',
                    data: avgHeartRate,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                  },
                  {
                    label: 'Avg Respiratory Rate',
                    data: avgRespiratoryRate,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                  },
                  {
                    label: 'Avg Oxygen Saturation',
                    data: avgOxygenSaturation,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Average Vitals Over Types',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Vital Types', // X-axis label
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Average Values', // Y-axis label
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" paragraph>
              This line chart depicts the average values of heart rate, respiratory rate, and oxygen saturation across different vital types. The X-axis represents the types of vitals, while the Y-axis shows the average values for each vital.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>All Records</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Temperature</TableCell>
                    <TableCell>Heart Rate</TableCell>
                    <TableCell>Respiratory Rate</TableCell>
                    <TableCell>Oxygen Saturation</TableCell>
                    <TableCell>Pulse</TableCell>
                    <TableCell>Loaded At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.all_records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.Type}</TableCell>
                      <TableCell>{record.Temperature}</TableCell>
                      <TableCell>{record.Heart_Rate}</TableCell>
                      <TableCell>{record.Respiratory_Rate}</TableCell>
                      <TableCell>{record.Oxygen_Saturation}</TableCell>
                      <TableCell>{record.Pulse}</TableCell>
                      <TableCell>{record.loaded_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
