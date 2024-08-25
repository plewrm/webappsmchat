import React, { useEffect, useState } from 'react';
import './DisplayError.css';
import { useTheme } from '../context/ThemeContext';

const DisplayError = ({ errorText, close }) => {
  const { isDarkMode } = useTheme();

  const closeDisplayError = () => {
    close();
  };

  return (
    <div className={isDarkMode ? 'displayError' : 'd-displayError'}>
      <div className={isDarkMode ? 'innerDisplayError' : 'd-innerDisplayError'}>
        <div className={isDarkMode ? 'errorText' : 'd-errorText'}>{errorText}</div>
        <div>
          <button
            onClick={() => closeDisplayError()}
            className={isDarkMode ? 'errorClose' : 'd-errorClose'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayError;
