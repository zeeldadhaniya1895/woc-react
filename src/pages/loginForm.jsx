import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import authService from "../appwrite/auth.service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked); // Toggles the state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const { email, password } = e.target.elements;

    if (!email.value || !password.value) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await authService.handleUserLogin({
        email: email.value,
        password: password.value,
        rememberMe: rememberMe,
      });

      if (response.error) {
        
        if (error.code === 401) {
          email.value = '';
          password.value = '';
          setErrorMessage("Invalid email or password");
        } else if (error.message.includes('email')) {
          email.value = '';
          password.value = '';
          setErrorMessage("Invalid email format");
        } else if (error.message.includes('password')) {
          password.value = '';
          setErrorMessage("Invalid password");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      }
      else {
        navigate("/ide");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.",error);
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

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
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
                <a
                  href="#!"
                  className="text-sm text-[#A294F9] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#A294F9] text-white py-2 rounded-md hover:bg-[#8F82F5] focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:ring-offset-1"
              >
                Sign in
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <p className="px-4 text-sm text-gray-500">OR</p>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {ErrorMessage && <p className="text-red-500">{ErrorMessage}</p>}

              {/* Social login button */}
              <button
                type="button"
                className="flex items-center justify-center w-full bg-[#E5D9F2] text-gray-700 py-2 rounded-md hover:bg-[#CDC1FF] focus:outline-none focus:ring-2 focus:ring-[#A294F9] focus:ring-offset-1"
                onClick={async () => { const {user}=await authService.createAccountWithGoogle();console.log(user);return user }}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
            </form>
            {/* Sign up link */}
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#A294F9] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

