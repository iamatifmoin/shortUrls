import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [longURL, setLongURL] = useState();
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();

    if (longURL) navigate(`auth?createNew=${longURL}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lh:text-7xl text-white text-center font-extrabold">
        Welcome to shortUrls
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        <Input
          type="url"
          value={longURL}
          placeholder="Enter URL"
          className="h-full flex-1 py-4 px-4"
          onChange={(e) => setLongURL(e.target.value)}
        />
        <Button className="h-full" type="submit">
          Shorten This Url
        </Button>
      </form>
      {/* <img src="/banner.jpg" alt="" className="w-full my-11 md:px-11" /> */}
    </div>
  );
};

export default LandingPage;
