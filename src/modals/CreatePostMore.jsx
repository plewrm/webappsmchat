import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './CreatePost.css';
import more from '../assets/icons/more-square.svg';
import { Switch } from 'antd';

const CreatePostMore = ({ closeMoreModal }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? 'openMoreModal' : 'd-openMoreModal'}>
      <div className="cp-more-container">
        <div className="cp-more-header">
          <div className="cp-more-icons-container">
            <img src={more} className="cp-more-icons" />
          </div>
          <div className="more-option-title">
            <p className={isDarkMode ? 'more-option-text' : 'd-more-option-text'}>More Options</p>
          </div>
        </div>

        <div className="cp-content-container">
          <div className="cp-left-content-container">
            <div className="cp-first-option-container">
              <p className={isDarkMode ? 'cp-first-option' : 'd-cp-first-option'}>
                Likes and views
              </p>
            </div>
            <div className="cp-second-option-container">
              <p className={isDarkMode ? 'cp-second-option' : 'd-cp-second-option'}>
                Hide like and view counts on this post
              </p>
            </div>
            <div className="cp-third-option-container">
              <p className={isDarkMode ? 'cp-third-option' : 'd-cp-third-option'}>
                Only you can see the total number of likes and views on this post. You can change
                this later.
              </p>
            </div>
          </div>
          <Switch />
        </div>

        <div className="cp-content-container">
          <div className="cp-left-content-container">
            <div className="cp-first-option-container">
              <p className={isDarkMode ? 'cp-first-option' : 'd-cp-first-option'}>Comments</p>
            </div>
            <div className="cp-second-option-container">
              <p className={isDarkMode ? 'cp-second-option' : 'd-cp-second-option'}>
                Turn off commenting
              </p>
            </div>
            <div className="cp-third-option-container">
              <p className={isDarkMode ? 'cp-third-option' : 'd-cp-third-option'}>
                You can change this later by going to menu option on top of your post
              </p>
            </div>
          </div>
          <Switch />
        </div>

        <div className="cp-content-container">
          <div className="cp-left-content-container">
            <div className="cp-first-option-container">
              <p className={isDarkMode ? 'cp-first-option' : 'd-cp-first-option'}>Repost</p>
            </div>
            <div className="cp-second-option-container">
              <p className={isDarkMode ? 'cp-second-option' : 'd-cp-second-option'}>
                Turn off reposting
              </p>
            </div>
            <div className="cp-third-option-container">
              <p className={isDarkMode ? 'cp-third-option' : 'd-cp-third-option'}>
                You can change this later by going to menu option on top of your post
              </p>
            </div>
          </div>
          <Switch />
        </div>

        <div className="cp-content-container">
          <div className="cp-left-content-container">
            <div className="cp-first-option-container">
              <p className={isDarkMode ? 'cp-first-option' : 'd-cp-first-option'}>Share</p>
            </div>
            <div className="cp-second-option-container">
              <p className={isDarkMode ? 'cp-second-option' : 'd-cp-second-option'}>
                Turn off Sharing
              </p>
            </div>
            <div className="cp-third-option-container">
              <p className={isDarkMode ? 'cp-third-option' : 'd-cp-third-option'}>
                You can change this later by going to menu option on top of your post
              </p>
            </div>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default CreatePostMore;
