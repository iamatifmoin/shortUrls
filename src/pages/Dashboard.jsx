import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import LinkCard from "../components/LinkCard";
import CreateLink from "../components/CreateLink";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [urls, setUrls] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <div>Loading...</div>; // or a spinner

  if (!user) return <Navigate to="/auth" />;

  useEffect(() => {
    if (user) {
      const fetchURLs = async () => {
        try {
          const res = await axios.get("http://localhost:4000/urls", {
            withCredentials: true,
          });
          setUrls(res.data);
          const urlIds = res.data.map((url) => url._id).join(",");
          const clickRes = await axios.get(
            `http://localhost:4000/clicks?urlIds=${urlIds}`,
            {
              withCredentials: true,
            }
          );
          setClicks(clickRes.data);

          console.log(clickRes.data);
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch URLs or clicks");
        }
      };
      fetchURLs();
    }
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

  // console.log(user);
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search links"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {filteredUrls.length > 0 ? (
        filteredUrls.map((url) => (
          <Card key={url._id}>
            <CardHeader>
              <LinkCard
                url={url}
                key={url._id}
                onDelete={(id) =>
                  setUrls((prev) => prev.filter((item) => item._id !== id))
                }
              />
            </CardHeader>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-sm mt-4">
          No links match your search.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
