import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import '../../pages/Stories.css';
import untick from '../../../assets/icons/h-untick.svg';
import tick from '../../../assets/icons/h-tick.svg';
import add from '../../../assets/icons/h-add.svg';
import close from '../../../assets/icons/modal-close.svg';
import darkBack from '../../../assets/icons/dark_mode_arrow_left.svg';
import lightBack from '../../../assets/icons/light_mode_arrow_left.svg';
import unselect from '../../../assets/icons/story-notselected.svg';
import select from '../../../assets/icons/story-select.svg';
import click from '../../../assets/icons/story-clicked.svg';
import unclick from '../../../assets/icons/story-unselect.svg';
import gallery from '../../../assets/icons/gallery.svg';
import addhighllight from '../../../assets/icons/add-highlight-dark.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  BEARER_TOKEN,
  BASE_URL,
  GETUSERHIGHLIGHT,
  ADDSTORIESTOHIGHLIGHT,
  CREATEHIGHLIGHT
} from '../../../api/EndPoint';
import axios from 'axios';
import {
  setShowChangeCover,
  setShowCoverStory,
  setShowChangeName
} from '../../../redux/slices/modalSlice';
import toast from 'react-hot-toast';
import { addToStoryData } from '../../../data/DummyData';

const AddStory = ({ closeAddToHighlight, storySelf }) => {
  // console.log(storySelf)
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const showCoverStory = useSelector((state) => state.modal.showCoverStory);
  const showChangeCover = useSelector((state) => state.modal.showChangeCover);
  const showChangeName = useSelector((state) => state.modal.showChangeName);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [story, setStory] = useState([]);
  const [hightlightTitle, setHighlightTitle] = useState('');
  const [highlightDetails, setHighlightDetails] = useState(null);

  const getHighLight = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETUSERHIGHLIGHT}${storySelf.author.soconId}`,
        { headers }
      );
      //TODO:change the 10 from the API
      console.log(response.data);
      setHighlightDetails(response.data.highlights.highlights);
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemClick = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((item) => item !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const addToHighlights = async () => {
    if (selectedItems.length === 0) {
      toast.error('please select atleast one highlight to add your story!');
      return;
    }
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${ADDSTORIESTOHIGHLIGHT}${selectedItems[0]}`,
        { stories: [storySelf.hash] },
        { headers }
      );
      //TODO:change the 10 from the API
      console.log(response.data);
      setSelectedImages(null);
      closeAddToHighlight();
      toast.success('story added to highlights!');
    } catch (error) {
      toast.error('something went wrong, try again!');
      console.error(error);
    }
  };

  const handleSubmitCreateHighlights = async () => {
    const postObj = {
      stories: [storySelf.hash],
      title: hightlightTitle,
      media: selectedFile,
      static_cover: storySelf.media[0].url
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
      closeCoverHighlight();
      closeChangeNameModal();
      toast.success('story added to that highlights!');
    } catch (error) {
      console.error(error);
    }
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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
      {isMobileView && (
        <>
          {!showCoverStory && (
            <div
              className={isDarkMode ? 'storyActivityContainer' : 'd-storyActivityContainer'}
              onClick={closeAddToHighlight}
            >
              <div
                className={isDarkMode ? 'storiesAddBox' : 'd-storiesAddBox'}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="activityHeader">
                  <div className="activityHeaderTitleContainer">
                    <p className={isDarkMode ? 'activityHeaderTitle' : 'd-activityHeaderTitle'}>
                      Highlights
                    </p>
                  </div>
                  <div className="activitysIconContainer" onClick={closeAddToHighlight}>
                    <img src={close} alt="close" className="activitysIcon" />
                  </div>
                </div>

                <div className="addStoryHeaders" onClick={openCoverHighlight}>
                  <div className="addStoryTitleContainer">
                    <p className="addStoryTitle">New Highlight</p>
                  </div>
                  <div className="addStoryImgContainer">
                    <img src={add} alt="add" className="addStoryImg" />
                  </div>
                </div>

                <div className={isDarkMode ? 'addStoriesContainer' : 'd-addStoriesContainer'}>
                  {highlightDetails &&
                    highlightDetails.map((item, index) => (
                      <div
                        className="addStoriesBox"
                        key={index}
                        onClick={() => handleItemClick(item.title)}
                      >
                        <div className="addStoriesProfileContainer">
                          <img src={item.coverPhoto} alt="img" className="addStoriesProfile" />
                        </div>
                        <div className="addStoriesNameContainer">
                          <p className={isDarkMode ? 'addStoriesName' : 'd-addStoriesName'}>
                            {item.title}
                          </p>
                        </div>
                        <div className="addStoriesIconsContainer">
                          <img
                            src={selectedItems.includes(item.title) ? tick : untick}
                            className="addStoriesIcons"
                          />
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  onClick={addToHighlights}
                  className="addStoriesBtn"
                  style={{ background: selectedItems.length > 0 ? '#6E44FF' : '#393644' }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {showCoverStory && (
            <div
              className={
                isDarkMode ? 'highlight-add-modal-overlay' : 'd-highlight-add-modal-overlay'
              }
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
                            src={isDarkMode ? lightBack : darkBack}
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
                          {hightlightTitle ? (
                            <img
                              onClick={() => handleSubmitCreateHighlights()}
                              src={select}
                              className="story-select"
                              alt="select"
                            />
                          ) : (
                            <img src={unselect} className="story-select" alt="select" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="add-highlight-cover-box">
                      <div className="highlight-cover-img-container">
                        <img
                          className="highlight-cover-img"
                          src={storySelf.media[0].url}
                          alt="selected image"
                        />
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
                    </div>
                  </>
                )}

                {!showChangeName && showChangeCover && (
                  <>
                    <div className="highlight-main-box">
                      <div className="highlight-left-header">
                        <div className="highlight-back-container" onClick={closeChangeCover}>
                          {isDarkMode ? (
                            <img src={lightBack} alt="back" className="highlight-back" />
                          ) : (
                            <img src={darkBack} alt="back" className="highlight-back" />
                          )}
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
                          <img src={select} className="story-select" alt="select" />
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
                            <img src={gallery} className="edit-cover-gallery" alt="image" />
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
                        <div key={hash} className="selected-cover-img-inner-container">
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
                          {isDarkMode ? (
                            <img src={lightBack} alt="back" className="highlight-back" />
                          ) : (
                            <img src={darkBack} alt="back" className="highlight-back" />
                          )}
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
                        <div
                          onClick={() => handleSubmitCreateHighlights()}
                          className="story-select-container"
                        >
                          <img src={select} className="story-select" alt="select" />
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
      )}

      {!isMobileView && (
        <>
          {!showCoverStory && (
            <div
              className={isDarkMode ? 'storyActivityContainer' : 'd-storyActivityContainer'}
              onClick={closeAddToHighlight}
            >
              <div
                className={isDarkMode ? 'storiesAddBox-mobile' : 'd-storiesAddBox-mobile'}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="activityHeader">
                  <div className="activityHeaderTitleContainer">
                    <p className={isDarkMode ? 'activityHeaderTitle' : 'd-activityHeaderTitle'}>
                      Add Highlights
                    </p>
                  </div>
                  <div className="activitysIconContainer" onClick={closeAddToHighlight}>
                    <img src={close} alt="close" className="activitysIcon" />
                  </div>
                </div>

                <div
                  className={
                    isDarkMode ? 'addStoriesContainer-mobile' : 'd-addStoriesContainer-mobile'
                  }
                >
                  <div className="addStoriesBox-mobile" onClick={openCoverHighlight}>
                    <div className="addStoriesProfileContainer">
                      <img src={addhighllight} alt="img" className="addStoriesProfile" />
                    </div>
                    <div className="addStoriesNameContainer">
                      <p className={isDarkMode ? 'addStoriesName' : 'd-addStoriesName'}>
                        Highlights
                      </p>
                    </div>
                  </div>
                  {highlightDetails &&
                    highlightDetails.map((item, index) => (
                      <div
                        className="addStoriesBox-mobile"
                        key={index}
                        onClick={() => handleItemClick(item.title)}
                      >
                        <div className="addStoriesProfileContainer">
                          <img src={item.coverPhoto} alt="img" className="addStoriesProfile" />
                        </div>
                        <div className="addStoriesNameContainer">
                          <p className={isDarkMode ? 'addStoriesName' : 'd-addStoriesName'}>
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  onClick={addToHighlights}
                  className="addStoriesBtn-mobile"
                  style={{ background: selectedItems.length > 0 ? '#6E44FF' : '#393644' }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {showCoverStory && (
            <div
              className={
                isDarkMode
                  ? 'highlight-add-modal-overlay-mobile'
                  : 'd-highlight-add-modal-overlay-mobile'
              }
            >
              <div
                className={
                  isDarkMode
                    ? 'light-highlightdd-modal-content-mobile'
                    : 'dark-highlightdd-modal-content-mobile'
                }
              >
                {!showChangeCover && (
                  <>
                    <div className="highlight-main-box-mobile">
                      <div className="highlight-left-header-mobile">
                        <div
                          className="highlight-back-container-mobile"
                          onClick={closeCoverHighlight}
                        >
                          <img
                            src={isDarkMode ? lightBack : darkBack}
                            alt="back"
                            className="highlight-back-mobile"
                          />
                        </div>
                        <div className="highlight-header-title-container-mobile">
                          <p
                            className={
                              isDarkMode
                                ? 'highlight-header-title-mobile'
                                : 'd-highlight-header-title-mobile'
                            }
                          >
                            New Highlight{' '}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="add-highlight-cover-box-mobile">
                      <div className="highlight-cover-img-container-mobile">
                        <img
                          className="highlight-cover-img-mobile"
                          src={storySelf.media[0].url}
                          alt="selected image"
                        />
                      </div>
                      <div className="change-cover-text-container-mobile" onClick={openChangeCover}>
                        <label htmlFor="fileInput">
                          <p className="change-cover-text-mobile">Change Cover</p>
                        </label>
                        <input
                          type="file"
                          id="fileInput"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileSelect}
                        />
                      </div>

                      <div
                        className={
                          isDarkMode
                            ? 'highlight-input-container-mobile'
                            : 'd-highlight-input-container-mobile'
                        }
                      >
                        <input
                          placeholder="Highlights"
                          className={
                            isDarkMode ? 'highlight-input-mobile' : 'd-highlight-input-mobile'
                          }
                          onChange={(event) => setHighlightTitle(event.target.value)}
                        />
                      </div>

                      <button
                        className="createStoriesBtn-mobile"
                        style={{ background: '#393644' }}
                        onClick={() => handleSubmitCreateHighlights()}
                      >
                        Create Highlight
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AddStory;
