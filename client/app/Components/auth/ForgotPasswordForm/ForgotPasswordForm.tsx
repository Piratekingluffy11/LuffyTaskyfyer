"use client";
import { useUserContext } from "@/context/userContext";
import React, { useState } from "react";

function ForgotPasswordForm() {
  const { forgotPasswordEmail } = useUserContext();

  // state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      await forgotPasswordEmail(email); // Assuming this is an async function
      setEmail(""); // Clear input after submission
    } catch (err) {
      setError("There was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="relative m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full"
      onSubmit={handleSubmit}
    >
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Enter email to reset password
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            name="email"
            placeholder="luffy@gmail.com"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            required
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={loading}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="Background" />
    </form>
  );
}

export default ForgotPasswordForm;

