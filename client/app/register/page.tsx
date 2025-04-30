"use client";

import React, { useEffect, useState } from "react";
import RegisterForm from "../Components/auth/RegisterForm/RegisterForm";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

function Page() {
  const { user, justRegistered } = useUserContext(); // ✅ Use justRegistered
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && user._id && justRegistered) { // ✅ Check for justRegistered state
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/"); // Redirect to home after registration
      }, 1000); // Optional delay for smoother UX

      return () => clearTimeout(timer);
    }
  }, [user, justRegistered, router]); // Dependency array now includes justRegistered

  if (isRedirecting) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid" />
      </div>
    );
  }

  return (
    <div className="auth-page w-full min-h-screen flex justify-center items-center bg-gray-50">
      <RegisterForm />
    </div>
  );
}

export default Page;
