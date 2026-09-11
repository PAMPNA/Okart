import { ReactNode } from "react";
import logo from "../../assets/images/okart-logo.png";
import foodBg from "../../assets/images/auth-food-bg.jpg";
interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
<div
  className="hidden md:flex flex-col justify-center items-center relative p-12 overflow-hidden"
  style={{
    backgroundColor: "#FFF8F0",
  }}
>
    <img
  src={foodBg}
  alt="Food Background"
  className="absolute inset-0 w-full h-full object-cover opacity-15"
/>

  <img
    src={logo}
    alt="O-Kart Logo"
    className="w-72 mb-8 drop-shadow-2xl"
  />

  

  <p className="text-center text-lg leading-8 mb-10 max-w-md">
    Bringing India's famous foods and sweets
    from every city straight to your doorstep.
  </p>

  <div className="space-y-5 text-xl">

    <p>🍛 Regional Special Foods</p>

    <p>🍬 Famous Indian Sweets</p>

    <p>🚚 Fast Doorstep Delivery</p>

    <p>⭐ Fresh & Trusted Quality</p>

  </div>

</div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-10">

          <div className="w-full max-w-md">

            <h2 className="text-4xl font-bold text-slate-800 text-center">
              {title}
            </h2>

            <p className="text-center text-slate-500 mt-2 mb-8">
              {subtitle}
            </p>

            {children}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthLayout;