"use client";

import { use, useEffect, useState } from "react";
import { Menu, Bell, Search, Plus, User,UserRoundPen,CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMedicineDialog } from "./add-medicine-dialog";
import { UserButton } from "@clerk/nextjs";
import { useDetailsStore } from "@/lib/detailsContext";
import { useUser } from "@clerk/nextjs";

export default function DashboardNavbar({ onMenuClick }) {
  const router = useRouter();
  const [addMedicineOpen, setAddMedicineOpen] = useState(false);
   const {isDetailsUpdated,setIsDetailsUpdated} = useDetailsStore();
   const {user,isLoaded}= useUser();
   const[loading,setLoading]=useState(true);

 useEffect(() => {
  const fetchDetailsStatus = async () => {
    const cached = localStorage.getItem("isDetailsUpdated");

    if (cached !== null) {
      setIsDetailsUpdated(JSON.parse(cached));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/get-user?clerkId=${user?.id}`);
      const data = await res.json();

      if (res.ok) {
        setIsDetailsUpdated(data.isDetailsUpdated);
        localStorage.setItem("isDetailsUpdated", JSON.stringify(data.isDetailsUpdated));
      } else {
        console.error("Error fetching user:", data.error);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.id) fetchDetailsStatus();
}, [user]);


  if (!isLoaded||loading || isDetailsUpdated === null) {
    return (
    <div className="h-12 px-4 py-2 flex justify-end items-center bg-white shadow-sm">
      <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
  }
   
  const handleUpdateDetails = async() => {
    router.push("/login-form");
  };

  return (
    <>
    {!isDetailsUpdated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 text-sm flex items-center gap-2">
          <CircleAlert className="h-4 w-4 text-yellow-500" />
          <span>Please complete your user details to access all features.</span>
        </div>
      )}
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-8 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAddMedicineOpen(true)}
            className=" md:flex gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Medicine
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >

            <Bell className="h-5 w-5" />
          </Button>
          {isDetailsUpdated?(<div></div>):(<Button
            onClick={() => handleUpdateDetails()}
            className=" md:flex gap-1 bg-red-600 hover:bg-red-700"
          >
            <UserRoundPen className="h-4 w-4" />
            Add User Details
            <CircleAlert className="h-4 w-4" />
          </Button>)}
          
          

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  <UserButton/>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Add Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <Button
          onClick={() => setAddMedicineOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      {isDetailsUpdated?(<div></div>):(
        <div className="md:hidden fixed bottom-4 right-4 z-10">
        <Button
          onClick={() => handleUpdateDetails()}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-red-600 hover:bg-red-700"
        >
          <UserRoundPen className="h-6 w-6" />
        </Button>
      </div>
      )}
      

      {/* <AddMedicineDialog
        open={addMedicineOpen}
        onOpenChange={setAddMedicineOpen}
      /> */}
    </header>
    </>
  );
}
