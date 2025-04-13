import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be 5 or more characters long" }),
});

const SignUp = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();
  let [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const generateError = (err) => toast.error(err, { position: "bottom-right" });

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post(
        `${VITE_API_BASE_URL}/register`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // or from cookies
          },
        },
        {
          withCredentials: true,
        }
      );
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          toast.success("Registered successfully!", {
            position: "bottom-right",
          });

          localStorage.setItem("token", data.token); // <-- store token
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);

          // ✅ Redirect to dashboard or with long URL
          setTimeout(() => {
            navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
          }, 1500);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="my-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default SignUp;
