"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const EmailConfirmation = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow numeric input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Focus next input automatically
    if (value && index < code.length - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      const verificationToken = code.join(""); // Joining the 6 digits to form the token
      const response = await axios.post('/api/verify-email', { verificationToken, email });
  
      if (response.data.success) {
        toast.success("Email verified successfully!");
        router.push("/signin");
      } else {
        toast.error(response.data.error || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "An error occurred. Please try again later.";
      toast.error(errorMessage);
    }
  }, [code, email, router]);

  useEffect(() => {
    // Check if all 6 fields are filled
    if (code.every(val => val !== '') && code.length === 6) {
      handleSubmit(); // Since handleSubmit is memoized, it will not cause unnecessary re-renders
    }
  }, [code, handleSubmit]);

  const handleResendToken = async () => {
    if (!email) {
      toast.error("No email found to resend verification token.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/resend-token", { email });
      if (response.status === 200) {
        toast.success("Verification token resent successfully!");
      } else {
        toast.error(response.data.error || "Failed to resend token.");
      }
    } catch (error) {
      toast.error("An error occurred while resending the token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex lg:flex-row md:flex-row">
      <div className="w-1/2 lg:flex md:flex hidden">
        <Image
          src="/confirm.jpg"
          alt=""
          width={500}
          height={500}
          quality={100}
          className="w-full h-screen"
        />
      </div>

      <div className="lg:w-1/2 md:w-1/2 w-full h-screen flex flex-col items-center bg-gray-200 pt-6">
        <div className="flex flex-col my-auto items-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Email Confirmation</h1>
            <p className="text-gray-600 mb-6">
              Enter the code sent to <br /> <strong>{email}</strong>
            </p>
          </div>

          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-10 h-10 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
              />
            ))}
          </div>

          {/* <button
            onClick={handleSubmit}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Verify
          </button> */}

          <button>
            I didn’t receive any code.{" "}
            <span
              onClick={handleResendToken}
              className="resend-button text-green-500 underline cursor-pointer text-sm"
            >
              {isLoading ? "Resending..." : "Resend"}
            </span>
          </button>
        </div>
      </div>
      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default EmailConfirmation;
