import React, { useState, useEffect } from 'react';
import './StoryHighLight.css';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOpenAddHighLightModal,
  setShowChangeCover,
  setShowCoverStory,
  setShowChangeName
} from '../redux/slices/modalSlice';
import darkBack from '../assets/icons/dark_mode_arrow_left.svg';
import lightBack from '../assets/icons/light_mode_arrow_left.svg';
import unselect from '../assets/icons/story-notselected.svg';
import select from '../assets/icons/story-select.svg';
import click from '../assets/icons/story-clicked.svg';
import unclick from '../assets/icons/story-unselect.svg';
import gallery from '../assets/icons/gallery.svg';
import right from '../assets/icons/tick-square-blue.svg';
import axios from 'axios';
import {
  BASE_URL,
  BEARER_TOKEN,
  CREATEHIGHLIGHT,
  GETUSERSTORIES,
  GETARCHIVES
} from '../api/EndPoint';

const StoryHighLight = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [story, setStory] = useState([]);
  const [hightlightTitle, setHighlightTitle] = useState('');
  const showCoverStory = useSelector((state) => state.modal.showCoverStory);
  const showChangeCover = useSelector((state) => state.modal.showChangeCover);
  const showChangeName = useSelector((state) => state.modal.showChangeName);

  const closeHighlight = () => {
    dispatch(setOpenAddHighLightModal(false));
  };
  const openCoverHighlight = () => {
    dispatch(setShowCoverStory(true));
  };
  const closeCoverHighlight = () => {
    dispatch(setShowCoverStory(false));
  };

  const openChangeCover = () => {
    dispatch(setShowChangeCover(true));
    setSelectedCover(selectedImages.length > 0 ? selectedImages[0] : null);
  };

  const closeChangeCover = () => {
    dispatch(setShowChangeCover(false));
  };
  const openChangeNameModal = () => {
    dispatch(setShowChangeName(true));
  };
  const closeChangeNameModal = () => {
    dispatch(setShowChangeName(false));
  };

  const handleCoverImageClick = (hash) => {
    // Update selectedCover
    setSelectedCover(hash);

    // Check if the image is already selected
    const isImageSelected = selectedImages.includes(hash);

    // Update selectedImages based on whether the image is selected or not
    setSelectedImages((prevSelectedImages) => {
      if (isImageSelected) {
        // If the image is already selected, return the existing array
        return prevSelectedImages;
      } else {
        // If the image is not selected, add it to the array
        return [...prevSelectedImages, hash];
      }
    });
  };

  const getUserStories = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const selfStoryResponse = await axios.get(`${BASE_URL}${GETARCHIVES}`, { headers });
      //TODO:change the 10 from the API
      if (selfStoryResponse.data.stories.length > 0) {
        setStory(
          selfStoryResponse.data.stories.map((element) => ({
            hash: element.hash,
            url: element.media[0].url,
            type: element.media[0].type,
            isSelected: false
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserStories();
  }, []);

  const handleImageClick = (hash) => {
    const index = selectedImages.indexOf(hash);
    if (index === -1) {
      // when select, add it
      setSelectedImages([...selectedImages, hash]);
    } else {
      // Image is in the unselected array, remove it
      const newSelectedImages = [...selectedImages];
      newSelectedImages.splice(index, 1);
      setSelectedImages(newSelectedImages);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmitCreateHighlights = async () => {
    // const staticCoverUrl =
    //   !selectedFile || story.find((item) => item.hash === selectedImages[0]).url ;
    console.log(story.find((item) => item.hash === selectedImages[0].url));
    console.log(selectedFile);
    const postObj = {
      stories: JSON.stringify(selectedImages),
      title: hightlightTitle,
      media: selectedFile,
      static_cover: story.find((item) => item.hash === selectedImages[0]).url
    };

    const formData = new FormData();
    Object.keys(postObj).forEach((key) => {
      const value = postObj[key];
      if (Array.isArray(value)) {
        // Convert array to a JSON string and append it
        formData.append(key, JSON.stringify(value));
      } else {
        // Append the value directly
        formData.append(key, value);
      }
    });
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
      };
      const response = await axios.post(`${BASE_URL}${CREATEHIGHLIGHT}`, formData, { headers });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    dispatch(setOpenAddHighLightModal(false));
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
    <>
      {!showCoverStory && (
        <div className={isDarkMode ? 'highlight-modal-overlay' : 'd-highlight-modal-overlay'}>
          <div
            className={
              isDarkMode ? 'light-highlight-modal-content' : 'dark-highlight-modal-content'
            }
          >
            <div className="highlight-main-box">
              <div className="highlight-left-header">
                {isMobileView && (
                  <div className="highlight-back-container" onClick={closeHighlight}>
                    <img
                      src={
                        isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'
                      }
                      alt="back"
                      className="highlight-back"
                    />
                  </div>
                )}
                <div className="highlight-header-title-container">
                  <p className={isDarkMode ? 'highlight-header-title' : 'd-highlight-header-title'}>
                    Stories
                  </p>
                </div>
              </div>

              <div className="highlight-right-header">
                {isMobileView ? (
                  <div className="story-select-container">
                    {selectedImages.length > 0 ? (
                      <img
                        src={select}
                        className="story-select"
                        alt="select"
                        onClick={openCoverHighlight}
                      />
                    ) : (
                      <img src={unselect} className="story-select" alt="select" />
                    )}
                  </div>
                ) : (
                  <div className="story-select-container">
                    <img
                      src={right}
                      className="story-select"
                      alt="select"
                      onClick={openCoverHighlight}
                    />
                  </div>
                )}
              </div>
            </div>

            <div
              className={
                isDarkMode
                  ? 'highlight-images-outer-container'
                  : 'd-highlight-images-outer-container'
              }
            >
              {story.map((item) => (
                <div
                  className="highlight-images-inner-container"
                  key={item.hash}
                  onClick={() => handleImageClick(item.hash)}
                >
                  <div className="highlight-images-container">
                    {item.type === 0 ? (
                      <img src={item.url} className="highlight-images" />
                    ) : (
                      <video src={item.url} className="highlight-images" controls />
                    )}
                    <div className="highlight-unclick-container">
                      <img
                        src={selectedImages.includes(item.hash) ? click : unclick}
                        alt={selectedImages.includes(item.hash) ? 'click' : 'unclick'}
                        className="highlight-unclick"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCoverStory && (
        <div
          className={isDarkMode ? 'highlight-add-modal-overlay' : 'd-highlight-add-modal-overlay'}
        >
          <div
            className={
              isDarkMode ? 'light-highlightdd-modal-content' : 'dark-highlightdd-modal-content'
            }
          >
            {!showChangeCover && (
              <>
                <div className="highlight-main-box">
                  <div className="highlight-left-header">
                    <div className="highlight-back-container" onClick={closeCoverHighlight}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/arrowBackLight.svg'
                            : '/darkIcon/arrowBackDark.svg'
                        }
                        alt="back"
                        className="highlight-back"
                      />
                    </div>
                    <div className="highlight-header-title-container">
                      <p
                        className={
                          isDarkMode ? 'highlight-header-title' : 'd-highlight-header-title'
                        }
                      >
                        Create Highlight{' '}
                      </p>
                    </div>
                  </div>

                  <div className="highlight-right-header">
                    <div className="story-select-container">
                      <>
                        {isMobileView ? (
                          <>
                            {hightlightTitle ? (
                              <img
                                src={select}
                                className="story-select"
                                alt="select"
                                onClick={() => handleSubmitCreateHighlights()}
                              />
                            ) : (
                              <img src={unselect} className="story-select" alt="select" />
                            )}
                          </>
                        ) : (
                          <img
                            src={right}
                            className="story-select"
                            alt="select"
                            onClick={() => handleSubmitCreateHighlights()}
                          />
                        )}
                      </>
                    </div>
                  </div>
                </div>

                <div className="add-highlight-cover-box">
                  <div className="highlight-cover-img-container">
                    {selectedImages.length > 0 && (
                      <img
                        className="highlight-cover-img"
                        src={story.find((item) => item.hash === selectedImages[0]).url}
                        alt="selected image"
                      />
                    )}
                  </div>
                  <div className="change-cover-text-container" onClick={openChangeCover}>
                    <p className="change-cover-text">Change Cover</p>
                  </div>

                  <div
                    className={
                      isDarkMode ? 'highlight-input-container' : 'd-highlight-input-container'
                    }
                  >
                    <input
                      placeholder="Highlights"
                      className={isDarkMode ? 'highlight-input' : 'd-highlight-input'}
                      onChange={(event) => setHighlightTitle(event.target.value)}
                    />
                  </div>

                  {/* <div className="story-unsaved-container" >
                  {hightlightTitle ? (
                    <img src={checkedButton} alt="select" className="story-unsaved" onClick={() => handleSubmitCreateHighlights()} />
                  ) : (
                    <img src={uncheckButton} alt="select" className="story-unsaved" />
                  )}
                </div> */}
                </div>
              </>
            )}

            {!showChangeName && showChangeCover && (
              <>
                <div className="highlight-main-box">
                  <div className="highlight-left-header">
                    <div className="highlight-back-container" onClick={closeChangeCover}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/arrowBackLight.svg'
                            : '/darkIcon/arrowBackDark.svg'
                        }
                        alt="back"
                        className="highlight-back"
                      />
                    </div>
                    <div className="highlight-header-title-container">
                      <p
                        className={
                          isDarkMode ? 'highlight-header-title' : 'd-highlight-header-title'
                        }
                      >
                        Edit Cover{' '}
                      </p>
                    </div>
                  </div>

                  <div className="highlight-right-header">
                    <div className="story-select-container" onClick={openChangeNameModal}>
                      {isMobileView ? (
                        <img src={select} className="story-select" alt="select" />
                      ) : (
                        <img src={right} className="story-select" alt="select" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="edit-cover-photo-container">
                  {selectedFile ? (
                    <img
                      className="edit-cover-photo"
                      src={URL.createObjectURL(selectedFile)}
                      alt="selected image"
                    />
                  ) : selectedCover ? (
                    <img
                      className="edit-cover-photo"
                      src={story.find((item) => item.hash === selectedCover).url}
                      alt="selected image"
                    />
                  ) : null}
                </div>

                <div className="selected-cover-photo-container">
                  <div className="gallery_outer">
                    <div className="edit-cover-gallery-container">
                      <label htmlFor="fileInput">
                        <img
                          src={
                            isDarkMode ? '/lightIcon/galleryLight.svg' : '/darkIcon/galleryDark.svg'
                          }
                          className="edit-cover-gallery"
                          alt="image"
                        />
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>

                  {selectedImages.map((hash) => (
                    <div
                      key={hash}
                      className="selected-cover-img-inner-container"
                      onClick={() => handleCoverImageClick(hash)}
                    >
                      <div>
                        <img
                          className={`selected-cover-img-inner ${hash === selectedCover ? 'selected' : ''}`}
                          alt="image"
                          src={story.find((item) => item.hash === hash).url}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {showChangeName && (
              <>
                <div className="highlight-main-box">
                  <div className="highlight-left-header">
                    <div className="highlight-back-container" onClick={closeChangeNameModal}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/arrowBackLight.svg'
                            : '/darkIcon/arrowBackDark.svg'
                        }
                        alt="back"
                        className="highlight-back"
                      />
                    </div>
                    <div className="highlight-header-title-container">
                      <p
                        className={
                          isDarkMode ? 'highlight-header-title' : 'd-highlight-header-title'
                        }
                      >
                        Edit Cover
                      </p>
                    </div>
                  </div>

                  <div className="highlight-right-header">
                    <div className="story-select-container">
                      {isMobileView ? (
                        <img
                          src={select}
                          className="story-select"
                          alt="select"
                          onClick={() => handleSubmitCreateHighlights()}
                        />
                      ) : (
                        <img
                          src={right}
                          className="story-select"
                          alt="select"
                          onClick={() => handleSubmitCreateHighlights()}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="add-highlight-cover-box">
                  <div className="highlight-cover-img-container">
                    {selectedFile ? (
                      <img
                        className="edit-cover-photo"
                        src={URL.createObjectURL(selectedFile)}
                        alt="selected image"
                      />
                    ) : selectedCover ? (
                      <img
                        className="edit-cover-photo"
                        src={story.find((item) => item.hash === selectedCover).url}
                        alt="selected image"
                      />
                    ) : null}
                  </div>

                  <div
                    className={
                      isDarkMode ? 'highlight-input-container' : 'd-highlight-input-container'
                    }
                  >
                    <input
                      placeholder="Highlights"
                      className={isDarkMode ? 'highlight-input' : 'd-highlight-input'}
                      onChange={(event) => setHighlightTitle(event.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoryHighLight;
