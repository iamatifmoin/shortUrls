import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const RedirectLink = () => {
  const { shortUrl } = useParams();

  useEffect(() => {
    if (shortUrl) {
      window.location.href = `http://localhost:4000/${shortUrl}`;
    }
  }, [shortUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="bg-white text-black w-full max-w-md shadow-xl rounded-xl animate-pulse">
        <CardContent className="p-6 flex items-center justify-center">
          <p className="text-lg font-semibold">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedirectLink;
