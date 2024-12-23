import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import authService from "../appwrite/auth.service";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
  
    const handleCheckboxChange = (event) => {
      setRememberMe(event.target.checked); // Toggles the state
    };
  const nevigate = useNavigate();
  const [ErrorMessage,setErrorMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, username } = e.target.elements;
    if (!email.value || !password.value || !username.value) {
      alert("Please fill in all fields");
      return;
    }
    setErrorMessage("");
    
    const { user, session, error } = await authService.createAccount({
      email: email.value,
      password: password.value,
      name: username.value,
    });
     
   if (error) {
      setErrorMessage(error.message);
    }
    else {
      nevigate("/ide");
    }

  };

  return (
    <section className="h-screen bg-[#E5D9F2] flex items-center justify-center">
      <div className="container max-w-6xl mx-auto p-6 bg-[#CDC1FF] shadow-md rounded-lg">
        <div className="flex flex-wrap items-center justify-center">
          {/* Left column */}
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Illustration"
            />
          </div>

          {/* Right column */}
          <div className="w-full lg:w-1/2 px-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username input */}
              <div>
                <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:border-[#A294F9]"
                />
              </div>

              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:border-[#A294F9]"
                />
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:border-[#A294F9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiFillEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-[#A294F9] focus:ring-[#A294F9] border-gray-300 rounded"
                    checked={rememberMe} // Controlled by state
                    onChange={handleCheckboxChange} // Updates the state
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#A294F9] text-white py-2 rounded-md hover:bg-[#8F82F5] focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:ring-offset-1"
              >
                Sign up
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <p className="px-4 text-sm text-gray-500">OR</p>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Social login button */}
              <button
                type="button"
                className="flex items-center justify-center w-full bg-[#E5D9F2] text-gray-700 py-2 rounded-md hover:bg-[#CDC1FF] focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:ring-offset-1"
                onClick={() => { authService.createAccountWithGoogle(); }}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
            </form>
            {ErrorMessage && <p className="text-red-500 mt-2">{ErrorMessage}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
