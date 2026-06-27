import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
  };
};

export default useAuth;
