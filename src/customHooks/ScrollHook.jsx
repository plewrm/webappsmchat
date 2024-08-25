import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollHook() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]); // Dependency on location ensures effect runs on path change
}

export default ScrollHook;
