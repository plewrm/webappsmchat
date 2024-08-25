import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreatePostModal, setActiveTab } from '../redux/slices/modalSlice';
import { useTheme } from '../context/ThemeContext';
import gallery from '../assets/icons/gallery.svg';
import cancel from '../assets/anonymous/icon/image-close.svg';
import { BASE_URL, BEARER_TOKEN, CREATESTORY } from '../api/EndPoint';
import { setGlobalStoryState } from '../redux/slices/loaderSlice';
import styles from './CreatePost.module.css';
import heic2any from 'heic2any';
import toast from 'react-hot-toast';

const CreateStory = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({});
  const closeCreatePostModalHandler = () => dispatch(closeCreatePostModal());
  const [storyFile, setStoryFile] = useState(null);
  const activeTab = useSelector((state) => state.modal.activeTab); // Get activeTab from Redux state

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
  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      dispatch(setActiveTab(tab)); // Dispatch action to set active tab in Redux state only if it's different
    }
  };

  const handleGalleryClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*, .heic';
    fileInput.multiple = false;

    fileInput.addEventListener('change', (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        const file = files[0];
        setStoryFile(file);
        console.log(file);
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');

        const newMedia = { url, isVideo, isSelected: true };

        if (selectedMedia.length > 0) {
          const updatedMedia = selectedMedia.map((media) => ({ ...media, isSelected: false }));
          setSelectedMedia([newMedia, ...updatedMedia.slice(1)]);
        } else {
          setSelectedMedia([newMedia]);
        }
      }
    });

    fileInput.click();
  };

  const postStory = async () => {
    const storyObj = {
      text: null,
      media: storyFile
    };

    // Create a new FormData object
    const formData = new FormData();

    // Iterate over the keys in communityObj
    Object.keys(storyObj).forEach((key) => {
      const value = storyObj[key];
      formData.append(key, value);
    });

    console.log(formData);

    // Now `formData` contains the data in the required format for `form-data`.
    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    };

    try {
      const response = await fetch(`${BASE_URL}${CREATESTORY}`, {
        method: 'POST',
        headers: headers,
        body: formData
      });
      dispatch(setGlobalStoryState(true));
      // Check if the response status is within the range [200, 299]
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response data
      const responseData = await response.json();
      console.log(responseData);
      dispatch(closeCreatePostModal());
      toast.success('Story created successfully!');
    } catch (error) {
      console.error('Error creating story:', error.message);
      toast.error('try to upload story again!');
    }
  };

  const handleCancelClick = (index) => {
    const updatedMedia = [...selectedMedia];
    const wasDefaultSelected = updatedMedia[index].isSelected;

    updatedMedia.splice(index, 1);

    const updatedFilter = { ...selectedFilter };
    delete updatedFilter[index];

    // Update the indices of remaining filters greater than the canceled index
    Object.keys(updatedFilter).forEach((key) => {
      const filterIndex = parseInt(key, 10);
      if (filterIndex > index) {
        updatedFilter[filterIndex - 1] = updatedFilter[key];
        delete updatedFilter[key];
      }
    });

    // If the canceled image was default selected, make the next one default selected
    if (wasDefaultSelected && updatedMedia.length > 0) {
      const nextDefaultSelectedIndex = index === 0 ? 0 : index - 1;
      updatedMedia[nextDefaultSelectedIndex].isSelected = true;
    }

    setSelectedMedia(updatedMedia);
    setSelectedFilter(updatedFilter);
  };

  const handleMediaClick = (index) => {
    const updatedMedia = selectedMedia.map((media, i) => ({
      ...media,
      isSelected: i === index ? !media.isSelected : false
    }));

    setSelectedMedia(updatedMedia);
  };
  return (
    <>
      <>
        {!isMobileView ? (
          <div className={styles.header}>
            <div className={styles.IconContainer} onClick={closeCreatePostModalHandler}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.Icon}
              />
            </div>
            <span className={isDarkMode ? styles.tittle : styles['d-tittle']}>Create Story</span>
            {selectedMedia.length < 1 && (
              <div className={styles.postButtonBox}>
                <button className={styles.postBtn} style={{ cursor: 'not-allowed' }}>
                  Share
                </button>
              </div>
            )}
            {selectedMedia.length > 0 && (
              <div onClick={postStory} className={styles.postButtonBox}>
                <button className={styles.postBtn} style={{ background: '#6E44FF' }}>
                  Share
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={isDarkMode ? styles.header_mobile : styles['d-header_mobile']}>
            <div className={styles.IconContainer} onClick={closeCreatePostModalHandler}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.Icon}
              />
            </div>
            <span className={isDarkMode ? styles.tittle : styles['d-tittle']}>Create Story</span>

            {selectedMedia.length < 1 && (
              <div className={styles.postButtonBox_mobile}>
                <button className={styles.postBtn}>Share</button>
              </div>
            )}
            {selectedMedia.length > 0 && (
              <div onClick={postStory} className={styles.postButtonBox_mobile}>
                <button className={styles.postBtn} style={{ background: '#6E44FF' }}></button>
              </div>
            )}
          </div>
        )}
        <>
          <div className={styles.storyPhotoEdit}>
            {selectedMedia.length > 0 && (
              <div className={styles.storyEditedImg}>
                {selectedMedia.map((media, index) => (
                  <div key={index} className={styles.storyEditedImgInner}>
                    {media.isVideo ? (
                      <>
                        <video
                          controls
                          width="100%"
                          height="100%"
                          className={`${styles.uploadedVideo} ${media.isSelected ? styles.selected : ''}`}
                          onClick={() => handleMediaClick(index)}
                        >
                          <source src={media.url} type="video/mp4" />
                        </video>

                        <div className={styles.cancelIcon}>
                          <img
                            src={cancel}
                            className={styles.Info}
                            alt="cancel"
                            onClick={() => handleCancelClick(index)}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={media.url}
                          alt="image"
                          className={`${styles.uploadedVideo} ${media.isSelected ? styles.selected : ''}`}
                          onClick={() => handleMediaClick(index)}
                        />
                        <div className={styles.cancelIcon}>
                          <img
                            src={cancel}
                            className={styles.Info}
                            alt="cancel"
                            onClick={() => handleCancelClick(index)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.bottomPosition}>
            <div className={isDarkMode ? styles.cpIconsContainer : styles['d-cpIconsContainer']}>
              <div
                className={isDarkMode ? styles.cpIconBox : styles['d-cpIconBox']}
                onClick={handleGalleryClick}
              >
                <div className={styles.cpIcons}>
                  <img
                    src={isDarkMode ? '/lightIcon/galleryLight.svg' : '/darkIcon/galleryDark.svg'}
                    alt="gallery"
                    className={styles.Info}
                  />
                </div>
                <div className={styles.cpIconTextContainer}>
                  <p className={isDarkMode ? styles.cpIconText : styles['d-cpIconText']}>Gallery</p>
                </div>
              </div>
            </div>

            <div className={isDarkMode ? styles.cpToggleContainer : styles['d-cpToggleContainer']}>
              <p
                className={activeTab === 1 ? styles.toggleActive : styles['toggleNotActive']}
                onClick={() => handleTabClick(1)}
              >
                {' '}
                Post
              </p>
              <p
                className={activeTab === 2 ? styles.toggleActive : styles['toggleNotActive']}
                onClick={() => handleTabClick(2)}
              >
                {' '}
                Story
              </p>
            </div>
          </div>

          {/* {!isScreenLarge && (
            <>
              <div
                className={isDarkMode ? styles.cpToggleContainer : styles['d-cpToggleContainer']}
                style={{ background: isDarkMode ? '#616161' : '#191622' }}
              >
                <p
                  className={activeTab === 1 ? styles.toggleActive : styles['toggleNotActive']}
                  onClick={() => handleTabClick(1)}
                >
                  Post
                </p>
                <p
                  className={activeTab === 2 ? styles.toggleActive : styles['toggleNotActive']}
                  onClick={() => handleTabClick(2)}
                >
                  Story
                </p>
              </div>
            </>
          )} */}
        </>
      </>
    </>
  );
};

export default CreateStory;
