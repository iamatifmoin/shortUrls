import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const RedirectLink = () => {
  const { shortUrl } = useParams();

  useEffect(() => {
    if (shortUrl) {
      window.location.href = `http://localhost:4000/${shortUrl}`;
    }
  }, [shortUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium">Redirecting...</p>
    </div>
  );
};

export default RedirectLink;
