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
import QRCode from "qrcode"; // <-- for toDataURL
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const rf = useRef();

  const longLink = searchParams.get("createNew");
  const [isDialogOpen, setIsDialogOpen] = React.useState(!!longLink);

  const token = localStorage.getItem("jwt_token");

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

  //   console.log("user from context:", user);
  const onSubmit = async (data) => {
    console.log("user from context:", user);
    try {
      // Generate QR code as Data URL
      const qrDataUrl = await QRCode.toDataURL(data.longUrl);

      // Convert base64 Data URL to Blob
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "unsigned_qr_upload");
      formData.append("folder", "qrs");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/drabxbmsa/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await cloudinaryRes.json();

      if (!uploadData.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      // Send to backend (make sure user_id is included in the request body)
      const response = await fetch("http://localhost:4000/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Ensure the request includes the session or token
        body: JSON.stringify({
          ...data,
          user_id: user?._id, // Pass the user_id from the authenticated user
          qr: uploadData.secure_url,
        }),
      });

      if (!response.ok) throw new Error("Failed to create URL");

      //   setSearchParams({}); // close the dialog
      toast.success("Link created successfully!");
      setIsDialogOpen(false); // close modal first
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
    // <Dialog
    //   defaultOpen={longLink}
    //   onOpenChange={(res) => {
    //     if (!res) setSearchParams({});
    //   }}
    // >
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button>Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {longUrlValue && (
          <div className="flex justify-center py-4">
            <QRVisual value={longUrlValue} size={250} />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input placeholder="Link Title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <Input placeholder="Enter URL" {...register("longUrl")} />
          {errors.longUrl && (
            <p className="text-red-500 text-sm">{errors.longUrl.message}</p>
          )}

          <div className="flex items-center gap-2">
            <Card className="p-2">shorturls.in</Card>/
            <Input
              placeholder="Custom URL (Optional)"
              {...register("customUrl")}
            />
          </div>
          {errors.customUrl && (
            <p className="text-red-500 text-sm">{errors.customUrl.message}</p>
          )}

          <DialogFooter className="sm:justify-start">
            <Button type="submit">Create Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
