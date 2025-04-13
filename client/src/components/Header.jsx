import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { position: "bottom-right" });
    navigate("/");
  };

  return (
    <nav className="py-4 px-6 flex justify-between items-center bg-black text-white">
      <Link
        to="/"
        className="text-3xl font-bold cursor-pointer flex items-center"
      >
        <span className="text-white">short</span>
        <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Urls
        </span>
      </Link>

      <div>
        {!user ? (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-white text-black hover:bg-gray-200"
          >
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border border-white">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white shadow-lg rounded-md">
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Link to="/dashboard" className="flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5" />
                  My Links
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 flex items-center cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5 stroke-red-400" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
