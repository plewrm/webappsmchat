import React, { useState } from 'react';
import './PostModal.css';
import { useDispatch } from 'react-redux';
import save from '../../../assets/icons/Save.svg';
import unmark from '../../../assets/icons/add-square-archive.svg';
import mark from '../../../assets/icons/added-square-archive.svg';
import picture from '../../../assets/images/post_2.png';
import picture2 from '../../../assets/images/frame.png';
import lightsave from '../../../assets/icons/light-save.svg';
import { closeSaveModal } from '../../../redux/slices/modalSlice';
import { useTheme } from '../../../context/ThemeContext';

const Savepost = () => {
  const [isForLater, setIsForLater] = useState(false);
  const [isFavorite, setIsFavorite] = useState(true);

  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const handleCloseModal = () => {
    dispatch(closeSaveModal());
  };

  const handleToggleForLater = () => {
    setIsForLater(!isForLater);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div>
      <label className="modal-overlay1" onClick={handleCloseModal}></label>
      <div className={isDarkMode ? 'postModal' : 'd-post-modal'}>
        <div className="modal-line"></div>

        <div className="share-header-container">
          <div className="share-modal-icon-container">
            {isDarkMode ? (
              <img src={lightsave} alt="share" className="share-modal-icon" />
            ) : (
              <img src={save} alt="share" className="share-modal-icon" />
            )}
          </div>
          <div className="share-title-container">
            <p className={isDarkMode ? 'share-title' : 'd-share-title'}>Save to</p>
          </div>
        </div>

        <div className="share-header-container">
          <div className="collection-container">
            <p className="collection">New Collection</p>
          </div>

          <div className="unmark-save-container">
            <img src={unmark} alt="unmark" className="unmark-save" />
          </div>
        </div>

        <div className="save-box">
          <div className="save-photo-container">
            <img src={picture} alt="image" className="save-photo" />
          </div>

          <div className="save-content-container">
            <p className={isDarkMode ? 'save-content' : 'd-save-content'}>For Later</p>
          </div>

          <div className="save-unsave-container" onClick={handleToggleForLater}>
            <img src={isForLater ? unmark : mark} className="save-unsave" alt="save-unsave" />
          </div>
        </div>

        <div className="save-box">
          <div className="save-photo-container">
            <img src={picture2} alt="image" className="save-photo" />
          </div>

          <div className="save-content-container">
            <p className={isDarkMode ? 'save-content' : 'd-save-content'}>Favorite</p>
          </div>

          <div className="save-unsave-container" onClick={handleToggleFavorite}>
            <img src={isFavorite ? unmark : mark} className="save-unsave" alt="save-unsave" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savepost;
