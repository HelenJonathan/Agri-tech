"use client";

import Image from "next/image";
import { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({...signInData, [event.target.name]: event.target.value})
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make POST request to the API
      setIsLoading(true);
      const res = await axios.post('/api/signin', signInData);

      // Handle API response
      if (res.status === 200) {
        const { token, user } = res.data.data;

        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify((user)));
        
        toast.success(res.data.message);
        setSignInData({
          email: "",
          password: "",
        });
        window.location.href = "/"
      }
    } catch (error) {
        toast.error("An error occurred during Logginin. Please try again.");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="flex lg:flex-row md:flex-row">
      <div className="w-1/2 lg:flex md:flex hidden">
        <Image src="/login.jpg" alt="" width={500} height={500} quality={100} className="w-full h-screen" />
      </div>

      <div className="lg:w-1/2 md:w-1/2 w-full h-screen flex flex-col items-center bg-gray-200 pt-6">
        <div className="logo w-full flex justify-center">
          <a href="/">
            <Image src="/Adminlogo.png" alt="" width={500} height={500} quality={100} className="w-20" />
          </a>
        </div>

        <div className="sign_in_form w-3/4">
          <p className="text-xl my-4 text-center">Sign up</p>

          <form className="w-full flex flex-col gap-2" onSubmit={handleSignIn}>
            {/* Email field */}
            <div className="w-full flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className="bg-transparent p-2 border-2 border-gray-300 text-xs outline-none"
                value={signInData.email}
                onChange={signInChange}
                required
              />
            </div>

            {/* Password field */}
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-2">
                <label>Password</label>
              </div>
              <div className="toggle_password flex w-full items-center border-2 border-gray-300 pr-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="xxxxxxxxxxxxxxxxxx"
                  className="w-full bg-transparent p-2 text-xs outline-none"
                  value={signInData.password}
                  onChange={signInChange}
                  required
                />
                <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                  {showPassword ? <LuEye size={24} className="text-gray-500" /> : <FaRegEyeSlash size={24} className="text-gray-500" />}
                </div>
              </div>
            </div>

            <div className="forgot-password text-right text-xs">
                <a href="/forgotpassword" className="text-red-700">
                  Forgot Password?
                </a>
  
            </div>

            <button className="bg-green-700 text-white p-2 w-full text-center my-3">
            {isLoading ? 'Signing In...' : 'Sign in'}</button>
          </form>

          <div className="flex items-center gap-2 my-3">
            <hr className="flex-grow border-t-1 border-gray-400" />
            <p className="whitespace-nowrap text-xs">Or login with</p>
            <hr className="flex-grow border-t-1 border-gray-400" />
          </div>

          <div className="social_icons flex items-center justify-center gap-4">
            <Image src="/facebook.svg" alt="" width={500} height={500} quality={100} className="w-7 cursor-pointer" />
            <Image src="/gmail.png" alt="" width={500} height={500} quality={100} className="w-10 cursor-pointer" />
          </div>

          <p className="text-center text-xs my-6">
            Don't have an account? <a href="/signup" className="text-green-600">Sign Up</a>
          </p>
        </div>
      </div>
      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default SignIn;
