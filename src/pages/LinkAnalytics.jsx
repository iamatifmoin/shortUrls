import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const LinkAnalytics = () => {
  const { id } = useParams();
  const [clicks, setClicks] = useState([]);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const [clickRes, urlRes] = await Promise.all([
        axios.get(`http://localhost:4000/clicks/${id}`),
        axios.get(`http://localhost:4000/urls/${id}`),
      ]);
      setClicks(clickRes.data);
      setUrl(urlRes.data);
    };

    fetchAnalytics();
  }, [id]);

  const clicksByDate = clicks.reduce((acc, click) => {
    const date = new Date(click.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const clicksByDevice = clicks.reduce((acc, click) => {
    const device = click.device || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(clicksByDate),
    datasets: [
      {
        label: "Clicks Over Time",
        data: Object.values(clicksByDate),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const deviceData = {
    labels: Object.keys(clicksByDevice),
    datasets: [
      {
        label: "Devices",
        data: Object.values(clicksByDevice),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  if (!url) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{url.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <strong>Original URL:</strong> {url.original_url}
            </p>
            <p>
              <strong>Short URL:</strong> {url.short_url}
            </p>
            <p>
              <strong>Created at:</strong>{" "}
              {new Date(url.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Expiration Status:</strong>{" "}
              {url.expiration_status ? "Expired" : "Active"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clicks over time chart */}
      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={lineData} options={{ responsive: true }} />
        </CardContent>
      </Card>

      {/* Device/Browser breakdown chart */}
      <Card>
        <CardHeader>
          <CardTitle>Device/Browser Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            <Bar data={deviceData} options={{ responsive: true }} />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => (window.location.href = "/dashboard")}
        className="w-full mt-4"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default LinkAnalytics;
