const SocialLogin = () => {
  return (
    <div className="mt-8">

      <div className="flex items-center gap-4">

        <div className="flex-1 h-px bg-slate-300"></div>

        <span className="text-slate-500 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-slate-300"></div>

      </div>

      <button
        className="w-full mt-6 border border-slate-300 rounded-xl py-3 hover:bg-slate-100 transition"
      >
        Continue with Google
      </button>

    </div>
  );
};

export default SocialLogin;