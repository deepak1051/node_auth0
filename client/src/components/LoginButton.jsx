import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()}
      className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
    >
      Login
    </button>
  );
};

export default LoginButton;
