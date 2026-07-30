import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (err) {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 text-stone-800">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl font-semibold text-amber-700">
          O
        </div>
        <h1 className="text-2xl font-semibold">O-Kart</h1>
        <p className="mt-2 text-center text-sm text-stone-600">Authentic Products From Their Origin</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-3 font-medium transition hover:bg-stone-50 disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
};

export default AuthPage;
