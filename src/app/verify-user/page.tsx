"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailConfirmation = () => {
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [isVerified, setIsVerified] = useState<boolean>(false);

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

    const handleSubmit = async () => {
      try {
        const response = await axios.post('/api/verify-email', { code: code.join('') });
        if (response.data.success) {
          setIsVerified(true);
          toast.success('Email verified successfully!');
        } else {
          toast.error('Verification failed. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    };

    useEffect(() => {
        if(code.length === 6) {
            handleSubmit();
        }
    })
  
    const handleResend = () => {
      // Logic for resending the code goes here
      console.log('Resend code');
    };

  return (
    <div className="flex lg:flex-row md:flex-row">
      <div className="w-1/2 lg:flex md:flex hidden">
        <Image src="/confirm.jpg" alt="" width={500} height={500} quality={100} className="w-full h-screen" />
      </div>

      <div className="lg:w-1/2 md:w-1/2 w-full h-screen flex flex-col items-center bg-gray-200 pt-6">
      <div className="flex flex-col my-auto items-center">
          <div className="text-center">
            {/* <Image
              src="/check-icon.png"
              alt="Email Confirmation"
              width={500}
              height={500}
              className="w-16 h-16 mb-4"
            /> */}
            <h1 className="text-xl font-semibold mb-2">Email Confirmation</h1>
            <p className="text-gray-600 mb-6">Enter the code sent to <br /> <strong>Chikeziekelvin24@gmail.com</strong></p>
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

          {/* <button onClick={handleSubmit} className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
            Verify
          </button> */}
          <button>
            I didn’t receive any code. <span onClick={handleResend} className="text-green-500 underline cursor-pointer text-sm">Resend</span>
          </button>
        </div>
      </div>
      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default EmailConfirmation;
