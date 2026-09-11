import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Create Firebase User
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    // Send user to backend
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: userCredential.user.uid,
        name: fullName,
        email,
        phone,
        photoURL: userCredential.user.photoURL || "",
      }),
    });

    const data = await response.json();

    console.log(data);

    alert("Account created successfully!");

    navigate("/");

  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join O-Kart today"
    >
      <form onSubmit={handleRegister}>

        <AuthInput
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={setFullName}
        />

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
        />

        <AuthInput
          label="Phone Number"
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={setPhone}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={setPassword}
        />

        <AuthButton text="Create Account" />

      </form>

      <p className="mt-6 text-center text-slate-600">
        Already have an account?

        <Link
          to="/"
          className="ml-2 text-sky-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>

    </AuthLayout>
  );
};

export default RegisterPage;