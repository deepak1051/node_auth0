import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Home = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);

  const sendToken = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      await axios.post(`/api/auth/callback`, {
        email: user.email,
        token,
      });
      setLoading(false);

      toast.success('Token sent successfully to your email.');
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {isAuthenticated ? (
        <>
          <h1 className="text-xl font-bold">Welcome, {user.name}!</h1>
          <button
            disabled={loading}
            onClick={sendToken}
            className={`cursor-pointer bg-green-500 text-white px-4 py-2 rounded  disabled:opacity-50 disabled:cursor-not-allowed `}
          >
            {loading ? 'Sending...' : 'Send Token via Email'}
          </button>
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default Home;
