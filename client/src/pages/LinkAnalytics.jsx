import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
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
import QRCode from "qrcode";

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
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [clickRes, urlRes] = await Promise.all([
          axios.get(`${VITE_API_BASE_URL}/clicks/for/${id}`),
          axios.get(`${VITE_API_BASE_URL}/urls/${id}`),
        ]);
        setClicks(clickRes.data);
        setUrl(urlRes.data);

        // Generate QR code from short URL
        const qr = await QRCode.toDataURL(urlRes.data.short_url);
        setQrCodeUrl(qr);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
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
        borderColor: "#fff",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#48a9a6",
        pointBorderWidth: 2,
        pointRadius: 5,
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

  if (!url) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="min-h-screen px-4 py-10 bg-black text-white space-y-10">
      {/* URL Info + QR Code */}
      <Card className="bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{url.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Left: Info */}
            <div className="space-y-3">
              <p>
                <strong>Original URL:</strong> {url.original_url}
              </p>
              <p>
                <strong>Short URL:</strong> https://tinieurlz.vercel.app/
                {url.short_url}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(url.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {url.expiration_status ? "Expired" : "Active"}
              </p>
            </div>

            {/* Right: QR Code */}
            {qrCodeUrl && (
              <div className="flex justify-center md:justify-end">
                <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clicks Over Time */}
      <Card className="bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Clicks Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: "#fff" } } },
              scales: {
                x: {
                  grid: { color: "#444" },
                  ticks: { color: "#fff" },
                },
                y: {
                  grid: { color: "#444" },
                  ticks: { color: "#fff" },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <Card className="bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Device/Browser Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            <Bar
              data={deviceData}
              options={{
                responsive: true,
                plugins: { legend: { labels: { color: "#fff" } } },
                scales: {
                  x: { ticks: { color: "#fff" } },
                  y: { ticks: { color: "#fff" } },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <Button
        onClick={() => (window.location.href = "/dashboard")}
        className="w-full bg-white text-black font-bold hover:bg-zinc-200"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default LinkAnalytics;
