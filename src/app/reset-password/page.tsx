"use client";

import Image from "next/image";
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const [email, setEmail] = useState<string>(''); // Initialize email as an empty string
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (value: string) => {
      setEmail(value); // Update the email state with the input value
    };

    const handleResendToken = async () => {
      if (!email) {
        toast.error("Please enter your email to resend verification token.");
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
        <Image src="/confirm.jpg" alt="" width={500} height={500} quality={100} className="w-full h-screen" />
      </div>

      <div className="lg:w-1/2 md:w-1/2 w-full h-screen flex flex-col items-center bg-gray-200 pt-6">
        <div className="flex flex-col gap-4 my-auto items-center w-full">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Reset Password</h1>     
          </div>

          <div className="flex flex-col justify-center mb-6 w-5/6">
            <p className="font-xs text-gray-600 mt-5">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full px-3 text-xs font-medium rounded-md focus:outline-none py-2"
                placeholder="example@gmail.com"
              />
          </div>

          <button onClick={handleResendToken} className="mb-4 bg-green-700 text-white w-5/6 px-4 py-2">
            {isLoading ? "Resetting" : "Continue"}
          </button>
        </div>
      </div>
      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
