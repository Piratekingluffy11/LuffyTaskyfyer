"use client";

import { useUserContext } from "@/context/userContext";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RegisterForm() {
  const router = useRouter();
  const {
    registerUser,
    userState,
    handlerUserInput,
    justRegistered,
    setJustRegistered,
  } = useUserContext();
  const { name, email, password } = userState;

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Redirect after successful registration
  useEffect(() => {
    if (justRegistered) {
      setJustRegistered(false); // Reset flag
      router.push("/login"); // Navigate to login page
    }
  }, [justRegistered]);

  return (
    <form
      onSubmit={registerUser} // ✅ Pass function reference, not registerUser()
      className="relative m-8 px-10 py-14 rounded-lg bg-white w-full max-w-md shadow-lg"
    >
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-xl font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-green-500 hover:text-indigo-500 transition-all duration-300"
          >
            Login here
          </Link>
        </p>

        <div className="flex flex-col mb-4">
          <label htmlFor="name" className="mb-1 text-gray-500">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handlerUserInput("name")}
            className="px-4 py-3 border-2 rounded-md outline-green-500 text-gray-800"
            placeholder="Luffy"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="mb-1 text-gray-500">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handlerUserInput("email")}
            className="px-4 py-3 border-2 rounded-md outline-green-500 text-gray-800"
            placeholder="luffy@gmail.com"
          />
        </div>

        <div className="relative flex flex-col mb-4">
          <label htmlFor="password" className="mb-1 text-gray-500">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlerUserInput("password")}
            className="px-4 py-3 border-2 rounded-md outline-green-500 text-gray-800"
            placeholder="***************"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute p-1 right-4 top-[50%] -translate-y-1/2 text-xl text-gray-500 opacity-60"
          >
            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        <button
          type="submit"
          disabled={!name || !email || !password}
          className="w-full py-3 font-bold bg-green-500 text-white rounded-md hover:bg-teal-500 transition-colors"
        >
          Register Now
        </button>
      </div>
      <img
        src="/flurry.png"
        alt="Flurry decoration"
        className="absolute bottom-0 right-0 w-20 opacity-20"
      />
    </form>
  );
}

export default RegisterForm;
