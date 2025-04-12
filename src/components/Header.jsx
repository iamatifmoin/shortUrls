import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  // const user = false;
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { position: "bottom-right" });
    navigate("/");
  };

  return (
    <nav className="py-4 flex justify-around items-center">
      <Link to="/">
        {/* <img src="/logo.png" className="h-16" alt="shortUrls logo" /> */}
        <h1 className="text-4xl cursor-pointer">shortUrls</h1>
      </Link>

      <div>
        {!user ? (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden cursor-pointer">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel className="text-center">
                Welcome!
              </DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/dashboard" className="flex">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  My Links
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4 stroke-red-400" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
