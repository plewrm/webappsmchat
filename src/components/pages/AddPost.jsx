import React, { useState, useEffect, useRef } from 'react';
import './AddPost.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import {
  clearSelectedMedia,
  closeCreatePostModal,
  openCreatePostModal,
  setSelectedMedia
} from '../../redux/slices/modalSlice';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETUSERPROFILE,
  retrievedSoconId,
  CREATEPOST
} from '../../api/EndPoint';
import axios from 'axios';
import noProfile from '../../assets/icons/Default_pfp.webp';
import { setPostLoader, setGlobalPostState } from '../../redux/slices/loaderSlice';
import toast from 'react-hot-toast';

const AddPost = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [captionsArray, setCaptionsArray] = useState(['']);
  const [loading, setLoading] = useState(null);
  const globalPostState = useSelector((state) => state.loader.globalPostState);
  const textareaRef = useRef(null); // Create a ref for the textarea

  const openCreatePostModalHandler = () => {
    dispatch(openCreatePostModal(true));
  };

  const [userProfile, setUserProfile] = useState(null);
  const getMyProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETUSERPROFILE}${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      if (response.status === 503) {
        alert('Server is currently down. Please try again later.');
        return;
      }
      setUserProfile(response.data.profile);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMyProfile();
  }, []);

  const maxCaptionCharLimit = 512;

  const handleTextInput = (event, index) => {
    const value = event.target.value;
    if (value.length <= maxCaptionCharLimit) {
      const updatedCaptionsArray = [...captionsArray];
      updatedCaptionsArray[index] = value;
      setCaptionsArray(updatedCaptionsArray);

      // Adjust the height of the textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };
  const handlePost = async () => {
    setLoading(true);
    dispatch(setPostLoader(true));
    try {
      const postObj = {
        description: captionsArray[0],
        type: '2',
        isPrivate: false,
        captions: []
      };

      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
      };
      dispatch(closeCreatePostModal());
      const response = await axios.post(`${BASE_URL}${CREATEPOST}`, postObj, { headers });
      dispatch(setGlobalPostState(!globalPostState));
      setCaptionsArray(['']);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      toast.success('Post created successfully!');
      dispatch(clearSelectedMedia()); // Clear the selected media
    } catch (error) {
      console.error(error);
      toast.error('Failed to create post. Please try again later.');
    } finally {
      setLoading(false);
      dispatch(setPostLoader(false));
    }
  };

  const handleGalleryClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      const mediaFiles = files.map((file, index) => ({
        url: URL.createObjectURL(file),
        file,
        isVideo: file.type.startsWith('video'),
        isSelected: index === 0
      }));
      dispatch(setSelectedMedia(mediaFiles));
      openCreatePostModalHandler();
    };
    input.click();
  };

  return (
    <div className={isDarkMode ? 'addPostContainer' : 'd-addPostContainer'}>
      <div className="addPostHeader">
        <div className="addPostProfileContainer">
          {userProfile && (
            <img
              src={userProfile.pfp ? userProfile.pfp : noProfile}
              alt="profile"
              className="addPostProfile"
            />
          )}
        </div>

        <div className="addPostInputContainer">
          <textarea
            placeholder="What is happening?"
            ref={textareaRef} // Attach the ref to the textarea
            className={isDarkMode ? 'addPostInput' : 'd-addPostInput'}
            value={captionsArray[0]}
            onChange={(event) => handleTextInput(event, 0)}
          />
        </div>
      </div>

      <div className="addPostFooter">
        <div className="addPostIconsContainer">
          <img
            src={isDarkMode ? '/lightIcon/cameraLight.svg' : '/darkIcon/cameraDark.svg'}
            alt="camera"
            className="addPostIcons"
          />
        </div>
        <div className="addPostIconsContainer" onClick={handleGalleryClick}>
          <img
            src={isDarkMode ? '/lightIcon/galleryLight.svg' : '/darkIcon/galleryDark.svg'}
            alt="gallery"
            className="addPostIcons"
          />
        </div>

        <div className="sideFooterRight">
          <div className="addPostCharLimitContainer">
            <p className={isDarkMode ? 'addpostCharLimit' : 'd-addpostCharLimit'}>
              {maxCaptionCharLimit - (captionsArray[0] ? captionsArray[0].length : 0)} character
              limit
            </p>
          </div>
          {captionsArray.some((caption) => caption.trim().length > 0) ? (
            <button
              className={isDarkMode ? 'privacyContainer' : 'd-privacyContainer'}
              onClick={handlePost}
              style={{ background: '#6E44FF', cursor: 'pointer' }}
            >
              Post
            </button>
          ) : (
            <button className={isDarkMode ? 'privacyContainer' : 'd-privacyContainer'}>Post</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPost;
