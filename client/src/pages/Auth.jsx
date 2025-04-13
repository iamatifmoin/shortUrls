import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-center mb-6">
        {searchParams.get("createNew")
          ? "Please login first."
          : "Login / SignUp"}
      </h1>
      <Tabs defaultValue="login" className="w-full sm:w-[400px]">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="login"
            className={({ selected }) =>
              `text-lg font-medium py-3 px-6 border-b-2 transition-all ${
                selected
                  ? "bg-black text-white border-white"
                  : "bg-white text-black border-transparent"
              }`
            }
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className={({ selected }) =>
              `text-lg font-medium py-3 px-6 border-b-2 transition-all ${
                selected
                  ? "bg-black text-white border-white"
                  : "bg-white text-black border-transparent"
              }`
            }
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="py-6">
          <Login />
        </TabsContent>
        <TabsContent value="signup" className="py-6">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
