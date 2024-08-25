import React, { useEffect, useState } from 'react';
import './Post.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  openWaveNearbyModal,
  openspinbuzzModal,
  closespinbuzzModal,
  openSpinbuzzMessageModal,
  closeSpinbuzzMessageModal
} from '../../../redux/slices/modalSlice';
import Spinbuzz from '../../../modals/Spinbuzz';
import SpinbuzzMessage from '../../../modals/SpinbuzzMessage';
import { useTheme } from '../../../context/ThemeContext';
import Posts from './Posts';
import AnonymousSpinbuzz from '../../../anonymous/modal/AnonymousSpinbuzz';

const Post = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const spinbuzzModalOpen = useSelector((state) => state.modal.spinbuzzModalOpen);
  const spinbuzzMessageModalOpen = useSelector((state) => state.modal.spinbuzzMessageModalOpen);
  const anonymousspinBuzz = useSelector((state) => state.modal.anonymousspinBuzz);

  const handleSendHiClick = () => {
    // Close the current Spinbuzz modal
    dispatch(closespinbuzzModal());

    // Open the second modal
    dispatch(openSpinbuzzMessageModal());
  };

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#FCFCFC' : '#110E18',
        borderRadius: isMobileView ? '0px' : '16px'
      }}
    >
      <Posts />
      {spinbuzzMessageModalOpen && <SpinbuzzMessage />}
    </div>
  );
};

export default Post;
