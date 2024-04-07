import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './Chart.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

function Chart({ ticker }) {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/data/${ticker}`)
    .then(response => {

      const responseData = response.data;
      const name = responseData.name;
      const parsedData = JSON.parse(responseData.prices);
      const dates = parsedData.map(item => item.Date);
      const values = parsedData.map(item => item.Close);

      // Calculate metrics
      const latestPrice = values[values.length - 1];
      const latestChange = ((values[values.length - 1] - values[values.length - 2]) / values[values.length - 2]) * 100;
 
      // Find the last trading day of the previous year
      const lastYear = new Date().getFullYear() - 1;
      const lastPriceLastYear = values[dates.findIndex(date => new Date(date).getFullYear() > lastYear) - 1];

      // Calculate YTD
      const ytdChange = ((latestPrice - lastPriceLastYear) / lastPriceLastYear) * 100;
      
      //Other Metrics
      const high = Math.max(...values);
      const highDate = dates[values.indexOf(high)];
      const low = Math.min(...values);
      const lowDate = dates[values.indexOf(low)];

      setData([
        {
          x: dates,
          y: values,
          type: 'scatter',
          mode: 'lines', // Changed to 'lines' to remove ticks
        }
      ]);
      setTitle(name); // Set the chart title
      setMetrics({ latestPrice, latestChange, ytdChange, high, highDate, low, lowDate });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [ticker]);
  

  return (
    <div className="chart">
      <Plot
        data={data}
        layout={{
          autosize: true, // Allows the chart to resize automatically
          title: title,
          height: 200,
          margin: {
            l: 35, r: 35, b: 35, t: 35, // Adjust margins to fit the container
            pad: 4
          }
        }}
        useResizeHandler={true} // Ensures the chart resizes with the container
        style={{ width: "100%", height: "100%" }} // Fill the container
      />
      <div className="chart-metrics">
        <p>Latest price: <span>{metrics.latestPrice ? metrics.latestPrice.toFixed(2) : 'N/A'}</span></p>
        <p>Latest change: <span style={{ color: metrics.latestChange > 0 ? 'red' : 'green' }}>
          {metrics.latestChange ? metrics.latestChange.toFixed(2) : 'N/A'}%
        </span></p>
        <p>YTD: <span style={{ color: metrics.ytdChange > 0 ? 'red' : 'green' }}>
          {metrics.ytdChange ? metrics.ytdChange.toFixed(2) : 'N/A'}%
        </span></p>
        <p>High: <span>{metrics.high ? metrics.high.toFixed(2) : 'N/A'}</span> on <span>{metrics.highDate ? formatDate(metrics.highDate) : 'N/A'}</span></p>
        <p>Low: <span>{metrics.low ? metrics.low.toFixed(2) : 'N/A'}</span> on <span>{metrics.lowDate ? formatDate(metrics.lowDate) : 'N/A'}</span></p>
      </div>
    </div>
  );
}

export default Chart;