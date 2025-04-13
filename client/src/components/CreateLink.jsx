import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { QRCode as QRVisual } from "react-qrcode-logo";
import { useAuth } from "../context/AuthContext";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  longUrl: z.string().url("Enter a valid URL"),
  customUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9_-]+$/.test(val), {
      message: "Custom URL must be alphanumeric",
    }),
});

const CreateLink = ({ onLinkCreated }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const rf = useRef();

  const longLink = searchParams.get("createNew");
  const [isDialogOpen, setIsDialogOpen] = React.useState(!!longLink);

  const token = localStorage.getItem("token");
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!token) {
    toast.error("User token is missing. Please log in again.");
    return;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      longUrl: longLink || "",
      customUrl: "",
    },
  });
  const longUrlValue = watch("longUrl");
  const CLOUDINARY_CLOUD_NAME = import.meta.env.CLOUDINARY_CLOUD_NAME;

  const onSubmit = async (data) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(data.longUrl);

      const res = await fetch(qrDataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "unsigned_qr_upload");
      formData.append("folder", "qrs");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await cloudinaryRes.json();

      if (!uploadData.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      const response = await fetch(`${VITE_API_BASE_URL}/urls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          user_id: user?._id,
          qr: uploadData.secure_url,
        }),
      });

      if (!response.ok) throw new Error("Failed to create URL");

      toast.success("Link created successfully!");
      setIsDialogOpen(false);
      if (onLinkCreated) onLinkCreated();

      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (err) {
      console.error(err);
      toast.error("Error creating link");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="bg-black text-white hover:bg-gray-800">
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black text-white p-6 rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl text-center mb-4">
            Create New
          </DialogTitle>
        </DialogHeader>
        {longUrlValue && (
          <div className="flex justify-center py-4">
            <QRVisual value={longUrlValue} size={250} />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Link Title"
              className="w-full bg-transparent border-b-2 border-white text-white focus:ring-0"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Enter URL"
              className="w-full bg-transparent border-b-2 border-white text-white focus:ring-0"
              {...register("longUrl")}
            />
            {errors.longUrl && (
              <p className="text-red-500 text-sm">{errors.longUrl.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Card className="p-2 text-white">shorturls.in</Card>/
            <Input
              placeholder="Custom URL (Optional)"
              className="bg-transparent border-b-2 border-white text-white focus:ring-0"
              {...register("customUrl")}
            />
          </div>
          {errors.customUrl && (
            <p className="text-red-500 text-sm">{errors.customUrl.message}</p>
          )}

          <DialogFooter className="flex justify-start mt-4">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
            >
              Create Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
