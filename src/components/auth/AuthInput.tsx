interface AuthInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const AuthInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}: AuthInputProps) => {
  return (
    <div className="mb-5">

      <label className="block mb-2 font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-300 outline-none transition"
      />

    </div>
  );
};

export default AuthInput;