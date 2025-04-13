import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const [longURL, setLongURL] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleShorten = (e) => {
    e.preventDefault();

    if (longURL) {
      const encodedURL = encodeURIComponent(longURL);
      if (user) {
        navigate(`/dashboard?createNew=${encodedURL}`);
      } else {
        navigate(`/auth?createNew=${encodedURL}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-black text-white">
      <h2 className="mb-12 text-center text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl">
        Welcome to <span className="text-white">shortUrls</span>
      </h2>

      <form
        onSubmit={handleShorten}
        className="w-full max-w-2xl flex flex-col sm:flex-row gap-3"
      >
        <Input
          type="url"
          value={longURL}
          onChange={(e) => setLongURL(e.target.value)}
          placeholder="Paste your long URL here..."
          className="bg-white text-black placeholder:text-gray-500 py-6 px-4 flex-1"
        />
        <Button
          type="submit"
          className="py-6 px-6 bg-white text-black font-semibold hover:bg-gray-200 transition-all"
        >
          Shorten This URL
        </Button>
      </form>
    </div>
  );
};

export default LandingPage;
