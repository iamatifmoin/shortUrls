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
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be 5 or more characters long" }),
});

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setError } = form;
  let [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");

  // const generateError = (err) => toast.error(err, { position: "bottom-right" });

  const onSubmit = async (values) => {
    try {
      const res = await axios.post("http://localhost:4000/login", values, {
        withCredentials: true,
      });

      const data = res.data;

      if (data.errors) {
        if (data.errors.email) {
          setError("email", { type: "manual", message: data.errors.email });
        }
        if (data.errors.password) {
          setError("password", {
            type: "manual",
            message: data.errors.password,
          });
        }
      } else {
        toast.success("Logged in successfully!", { position: "bottom-right" });
        // ✅ Save JWT token and user
        localStorage.setItem("jwt_token", data.token); // <-- store token
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        // ✅ Redirect to dashboard or with long URL
        setTimeout(() => {
          navigate(`/dashboard${longUrl ? `?createNew=${longUrl}` : ""}`);
        }, 1500);
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
          <Button type="submit">Login</Button>
        </form>
        <ToastContainer />
      </Form>
    </div>
  );
};

export default Login;
