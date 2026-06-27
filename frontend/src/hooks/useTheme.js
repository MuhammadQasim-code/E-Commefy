import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme as toggle, setTheme } from '../features/theme/themeSlice';

const useTheme = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  const toggleTheme = () => dispatch(toggle());
  const changeTheme = (theme) => dispatch(setTheme(theme));

  return {
    theme: mode,
    isDark: mode === 'dark',
    toggleTheme,
    changeTheme,
  };
};

export default useTheme;
