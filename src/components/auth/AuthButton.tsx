interface AuthButtonProps {
  text: string;
}

const AuthButton = ({ text }: AuthButtonProps) => {
  return (
    <button
      type="submit"
      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition duration-300"
    >
      {text}
    </button>
  );
};

export default AuthButton;