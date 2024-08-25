import { useState, useEffect } from 'react';

const usePrefersColorScheme = () => {
  const getPrefersColorScheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [colorScheme, setColorScheme] = useState(getPrefersColorScheme());
  // console.log('show color scheme', colorScheme);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // console.log('show color scheme', colorScheme);
  return colorScheme;
};
export default usePrefersColorScheme;
