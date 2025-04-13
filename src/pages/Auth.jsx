import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useAuth } from "../context/AuthContext"; // ✅ Make sure this is correct

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth(); // ✅ Access user from context
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // ✅ Redirect if user is already logged in
    }
  }, [user, navigate]);

  return (
    <div className="mt-36 flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {searchParams.get("createNew")
          ? "Please login first."
          : "Login / SignUp"}
      </h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
