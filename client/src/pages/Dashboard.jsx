import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import LinkCard from "../components/LinkCard";
import CreateLink from "../components/CreateLink";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [urls, setUrls] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/auth" />;

  const fetchURLs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/urls", {
        withCredentials: true,
      });
      setUrls(res.data);
      const urlIds = res.data.map((url) => url._id).join(",");
      const clickRes = await axios.get(
        `http://localhost:4000/clicks?urlIds=${urlIds}`,
        { withCredentials: true }
      );
      setClicks(clickRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch URLs or clicks");
    }
  };

  useEffect(() => {
    if (user) fetchURLs();
  }, [user]);

  const filteredUrls = urls.filter((url) => {
    const title = url.title || "";
    const original = url.original_url || "";
    const short = url.short_url || "";
    const query = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(query) ||
      original.toLowerCase().includes(query) ||
      short.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{urls.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clicks.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Title + Create Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold">My Links</h1>
        <CreateLink onLinkCreated={fetchURLs} />
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <Input
          type="text"
          placeholder="Search links"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 bg-white text-black"
        />
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {filteredUrls.length > 0 ? (
          filteredUrls.map((url) => (
            <Card key={url._id} className="bg-white text-black">
              <CardHeader>
                <LinkCard
                  url={url}
                  onDelete={(id) =>
                    setUrls((prev) => prev.filter((item) => item._id !== id))
                  }
                />
              </CardHeader>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-400 mt-4">
            No links match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
