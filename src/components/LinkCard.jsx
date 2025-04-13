import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const LinkCard = ({ url, onDelete }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const deleteUrl = async () => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await axios.delete(`http://localhost:4000/urls/${url._id}`, {
        withCredentials: true,
      });
      toast.success("Link deleted successfully");
      onDelete(url._id); // Inform parent to update UI
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete link");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex-shrink-0">
        <img
          src={url?.qr}
          alt="QR code"
          className="h-32 w-32 object-contain ring-2 ring-blue-500 rounded-lg"
        />
      </div>
      <Link to={`/link/${url?._id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold text-white hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          https://shorturls.in/
          {url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-400 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm text-gray-400 flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(
              `https://shorturls.in/${url?.short_url}`
            )
          }
          className="text-white hover:bg-gray-700"
        >
          <Copy />
        </Button>
        <Button
          variant="ghost"
          onClick={downloadImage}
          className="text-white hover:bg-gray-700"
        >
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={deleteUrl}
          className="text-red-500 hover:bg-gray-700"
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
