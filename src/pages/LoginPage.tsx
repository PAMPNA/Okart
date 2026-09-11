import { useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import SocialLogin from "../components/auth/SocialLogin";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Navigating to Home...");


    navigate("/home");
  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue shopping"
    >
      <form onSubmit={handleLogin}>

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
        />

        <div className="text-right mb-5">
          <button
            type="button"
            className="text-sm text-sky-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <AuthButton text="Login" />

      </form>

      <SocialLogin />

      <p className="mt-6 text-center text-slate-600">
        Don't have an account?

        <Link
          to="/register"
          className="ml-2 text-sky-600 font-semibold hover:underline"
        >
          Register
        </Link>
      </p>

    </AuthLayout>
  );
};

export default LoginPage;