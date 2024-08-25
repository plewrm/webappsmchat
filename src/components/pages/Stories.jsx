import React, { useState, useEffect, useRef } from 'react';
import './Stories.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeStoryViewModal,
  openStoryViewModal,
  openCreatePostModal,
  setActiveTab
} from '../../redux/slices/modalSlice';
import leftcarousel from '../../assets/icons/left-carousel.svg';
import leftLightMode from '../../assets/icons/arrow-left-story.svg';
import rightLightMode from '../../assets/icons/arrow-right-story.svg';
import rightcarousel from '../../assets/icons/right_carousel.svg';
import closeTrans from '../../assets/icons/s-close.svg';
import close from '../../assets/icons/modal-close.svg';
import heart from '../../assets/icons/heart.svg';
import redHeart from '../../assets/icons/like_heart.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETUSERSTORIES,
  GETALLSTORIES,
  DELETESTORY,
  GETPROFILE,
  retrievedSoconId,
  LIKETHESTORY,
  VIEWSTORY
} from '../../api/EndPoint';
import axios from 'axios';
import { getDate } from '../../utils/time';
import more from '../../assets/icons/s-more.svg';
import pause from '../../assets/icons/s-pause.svg';
import resume from '../../assets/icons/s-resume.svg';
import deletes from '../../assets/icons/trash.svg';
import activityIcon from '../../assets/icons/s-activity.svg';
import eye from '../../assets/icons/eye.svg';
import add from '../../assets/icons/s-add.svg';
import { useNavigate } from 'react-router-dom';
import { setGlobalStoryState } from '../../redux/slices/loaderSlice';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import defaultCover from '../../assets/images/plain-cover.png';
import AddStory from './stories/AddStory';

const Stories = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const storyViewModal = useSelector((state) => state.modal.storyViewModal);
  const globalStoryState = useSelector((state) => state.loader.globalStoryState);
  const globalProfileState = useSelector((state) => state.loader.globalProfileState);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [story, setStory] = useState(null);
  const [selfView, setSelfView] = useState(false);
  const [selfStory, setSelfStory] = useState(false);
  const [enableStoryTimer, setEnableStoryTimer] = useState(false);
  const [moreOption, setMoreOption] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [storyActivity, setStoryActivity] = useState(false);
  const [addToHighlight, setAddToHighlight] = useState(false);
  const videoRef = useRef(null); // Added video reference

  const openCreatePostModalHandler = () => {
    dispatch(setActiveTab(2)); // Set active tab to 2 before opening the CreatePost modal
    dispatch(openCreatePostModal());
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

  const togglePause = () => {
    setIsPaused((prevPaused) => {
      if (videoRef.current) {
        if (prevPaused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
      return !prevPaused;
    });
  };

  const openMoreOption = () => {
    setMoreOption(true);
  };
  const closeOpenMoreOption = () => {
    setMoreOption(false);
    setConfirmDelete(false);
  };
  const openconfirmDelete = () => {
    setConfirmDelete(true);
  };
  const openAddToHighlight = () => {
    setAddToHighlight(true);
  };
  const closeAddToHighlight = () => {
    setAddToHighlight(false);
  };

  const getstory = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const allStories = [];
      const selfStoryResponse = await axios.get(
        `${BASE_URL}${GETUSERSTORIES}${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );

      if (selfStoryResponse.data.stories.length > 0) {
        allStories.push(selfStoryResponse.data.stories);
        setSelfStory(true);
      }

      const notSelfStoryResponse = await axios.get(`${BASE_URL}${GETALLSTORIES}`, { headers });
      notSelfStoryResponse.data.stories.forEach((element) => {
        if (element.stories.length > 0) {
          allStories.push(element.stories);
        }
      });

      setStory(allStories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getstory();
  }, [globalStoryState, globalProfileState]);

  useEffect(() => {
    if (story) {
      if (currentStoryIndex === story.length) {
        return;
      }
      viewStory(
        story[currentStoryIndex][currentImageIndex]?.author.soconId,
        story[currentStoryIndex][currentImageIndex]?.hash
      );
    }
  }, [currentStoryIndex, currentImageIndex]);

  useEffect(() => {
    if (
      enableStoryTimer &&
      story &&
      !moreOption &&
      !isPaused &&
      !storyActivity &&
      !addToHighlight
    ) {
      const interval = setInterval(() => {
        if (currentStoryIndex >= 0 && currentStoryIndex < story.length) {
          const nextImageIndex = (currentImageIndex + 1) % story[currentStoryIndex].length;
          if (nextImageIndex === 0 && currentStoryIndex < story.length - 1) {
            // Move to the next array
            setCurrentStoryIndex((prevIndex) => prevIndex + 1);
            setCurrentImageIndex(0);
          } else if (nextImageIndex === 0 && currentStoryIndex === story.length - 1) {
            // Close the modal if it's the last image of the last array
            closeStoryModal();
          } else {
            setCurrentImageIndex(nextImageIndex);
          }
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [
    currentStoryIndex,
    currentImageIndex,
    enableStoryTimer,
    moreOption,
    isPaused,
    storyActivity,
    addToHighlight
  ]);

  const openStoryModal = (index) => {
    // console.log(index);
    setEnableStoryTimer(true);
    if (index === 0 && selfStory) {
      setSelfView(true);
    }
    setCurrentStoryIndex(index);
    // this solves bug
    setCurrentImageIndex(0);
    dispatch(openStoryViewModal());
    // viewStory(story[currentStoryIndex][currentImageIndex]?.author.soconId, story[currentStoryIndex][currentImageIndex]?.hash)
    // Add the viewed story to the viewedStories state
    // if (!viewedStories.includes(StoriesData[index].id)) {
    //     setViewedStories([...viewedStories, StoriesData[index].id]);
    // }
  };

  // console.log(currentStoryIndex)
  // console.log(currentImageIndex)

  const closeStoryModal = () => {
    dispatch(closeStoryViewModal());
    setEnableStoryTimer(false);
  };

  const viewStory = async (soconId, hash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${VIEWSTORY}${soconId}/${hash}`,
        {},
        { headers }
      );
      dispatch(setGlobalStoryState(!globalStoryState));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRightCarouselClick = () => {
    const nextImageIndex = (currentImageIndex + 1) % story[currentStoryIndex].length;
    if (nextImageIndex === 0 && currentImageIndex == story.length - 1) {
      closeStoryModal();
    }
    if (nextImageIndex === 0 && currentImageIndex >= story[currentStoryIndex].length - 1) {
      setCurrentStoryIndex((prevIndex) => prevIndex + 1);
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(nextImageIndex);
    }
  };

  const handleLeftCarouselClick = () => {
    const prevImageIndex =
      (currentImageIndex - 1 + story[currentStoryIndex].length) % story[currentStoryIndex].length;
    if (currentImageIndex === 0 && currentStoryIndex === 0) {
      closeStoryModal();
    } else if (prevImageIndex === story[currentStoryIndex].length - 1 && currentStoryIndex > 0) {
      // Move to the previous array
      setCurrentStoryIndex((prevIndex) => prevIndex - 1);
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(prevImageIndex);
    }
  };

  const renderStatusBars = (items) => (
    <div className="story-view-bar-container">
      {items.map((_, i) => (
        <div
          key={i}
          className={
            i === currentImageIndex
              ? `story-view-bar ${isPaused ? 'paused' : ''}`
              : 'story-unview-bar'
          }
          style={{ width: `${100 / items.length}%` }}
        ></div>
      ))}
    </div>
  );

  const [profile, setProfile] = useState(null);
  const goToProfile = (item) => {
    setProfile(item.soconId);
    console.log(item);
    navigate(`/profile/${item.username}/${item.soconId}`, { state: { soconId: item.soconId } });
    dispatch(closeStoryViewModal());
    setEnableStoryTimer(false);
  };

  const goToProfileFromView = (username, soconId) => {
    dispatch(closeStoryViewModal());
    setStoryActivity(false);
    setEnableStoryTimer(false);
    setProfile(true);
    navigate(`/profile/${username}/${soconId}`, { state: { soconId: soconId } });
  };

  const deleteStory = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      await axios.delete(
        `${BASE_URL}${DELETESTORY}${story[currentStoryIndex][currentImageIndex].hash}`,
        { headers }
      );
      setStory((list) =>
        list
          .map((element, index) =>
            index === currentStoryIndex && element.length > 1
              ? [...element.slice(0, currentImageIndex), ...element.slice(currentImageIndex + 1)]
              : element
          )
          .filter((element) => element.length > 1)
      );

      if (currentImageIndex == story[currentStoryIndex].length - 1) {
        if (story[currentStoryIndex].length === 1) {
          setSelfStory(false);
          closeStoryModal();
          setCurrentImageIndex(0);
        } else {
          setCurrentImageIndex(currentImageIndex - 1);
        }
      }
      dispatch(setGlobalStoryState(!globalStoryState));
      setConfirmDelete(false);
      setMoreOption(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserProfileDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // will replace 10 with actual socon id
      const response = await axios.get(
        `${BASE_URL}${GETPROFILE}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      setUserDetails(response.data.profile);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
  }, [globalProfileState]);

  // const likeStory = async (soconId, hash) => {
  //   try {
  //     const headers = {
  //       'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
  //       'Content-Type': 'application/json',
  //     };
  //     const response = await axios.post(`${BASE_URL}${LIKETHESTORY}${soconId}/${hash}`, {}, { headers });
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const likeStory = async (soconId, hash, currentStoryIndex, currentImageIndex) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${LIKETHESTORY}${soconId}/${hash}`,
        {},
        { headers }
      );

      // Assuming your response contains updated information about the liked status
      const isLiked = response.data.isLiked;

      // Update the state to reflect the changes
      setStory((prevStory) => {
        const updatedStory = [...prevStory];
        updatedStory[currentStoryIndex][currentImageIndex].isLiked = isLiked;
        return updatedStory;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [activity, setActivity] = useState(null);
  const openStoryActivity = async (hash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${VIEWSTORY}${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}/${hash}`,
        { headers }
      );
      console.log(response.data);
      setActivity(response.data.users);
      setStoryActivity(true);
    } catch (error) {
      console.error(error);
    }
  };
  const closeStoryActivity = () => {
    setStoryActivity(false);
  };

  const [storyReply, setStoryReply] = useState('');
  const handelStoryReply = async (modal) => {
    // console.log(selectedShares[0])
    // const canMessage = await isPeerOnXmtpNetwork(xmtp, selectedShares[0].walletAddress)
    // if (!canMessage) {
    //   toast.error("cannot message this user, try later!")
    //   return;
    // }
    // const conversation = await startConversation(xmtp, selectedShares[0]);
    // dispatch(setConversation(conversation))
    // let textInput = storyReply
    // // console.log(textInput)
    // const attachment = null
    // if (textInput || attachment) {
    //   const finalContent = textInput || attachment;
    //   const finalContentType = textInput
    //     ? ContentTypeText
    //     : ContentTypeAttachment;
    //   // send regular message
    //   if (!xmtp) return;
    //   console.log('xmtp sendng msg', xmtp)
    //   await sendMessage(xmtp, conversation, finalContent, finalContentType, selectedShare[0]);
    // }
  };

  return (
    <>
      <div className={isDarkMode ? 'storyContainer' : 'd-storyContainer'}>
        <div className="storyTitleContainer">
          <p className={isDarkMode ? 'storyTitle' : 'd-storyTitle'}>Stories</p>
        </div>

        <div className={isDarkMode ? 'storyScorll' : 'd-storyScorll'}>
          {!selfStory && (
            <>
              {userDetails ? (
                <div className="storyVerticalBox" onClick={openCreatePostModalHandler}>
                  <div className="StoryImgContainer_self">
                    <img
                      src={userDetails.pfp ? userDetails.pfp : defaultCover}
                      alt="storyImg"
                      className="StoryImg"
                    />
                  </div>
                  <div
                    className="storyProfileImgContainer"
                    style={{ border: isDarkMode ? '3px solid #FCFCFC' : '3px solid #110E18' }}
                  >
                    <img
                      src={userDetails.pfp ? userDetails.pfp : defaultProfile}
                      alt="profile"
                      className="storyProfileImg"
                    />
                    <div className="addNewStoryContainer">
                      <img
                        src={
                          isDarkMode ? '/lightIcon/addStoryLight.svg' : '/darkIcon/addStoryDark.svg'
                        }
                        className="addNewStory"
                        alt="add"
                      />
                    </div>
                  </div>
                  <div className="storyNameContainer_self">
                    <p className={isDarkMode ? 'storyName' : 'd-storyName'}>You</p>
                    {/* {userDetails.display_name ? userDetails.display_name : 'Self'} */}
                  </div>
                </div>
              ) : (
                <div className="storyVerticalBox" onClick={openCreatePostModalHandler}>
                  <div className="StoryImgContainer">
                    <img src={defaultCover} alt="storyImg" className="StoryImg" />
                  </div>
                  <div
                    className="storyProfileImgContainer"
                    style={{ border: isDarkMode ? '3px solid #FCFCFC' : '3px solid #110E18' }}
                  >
                    <img src={defaultProfile} alt="profile" className="storyProfileImg" />
                    <div className="addNewStoryContainer">
                      <img
                        src={
                          isDarkMode ? '/lightIcon/addStoryLight.svg' : '/darkIcon/addStoryDark.svg'
                        }
                        className="addNewStory"
                        alt="add"
                      />
                    </div>
                  </div>
                  <div className="storyNameContainer_self">
                    <p className={isDarkMode ? 'storyName' : 'd-storyName'}>You</p>
                  </div>
                </div>
              )}
            </>
          )}

          {story &&
            story
              .filter((item) => item && item.length > 0)
              .map((item, index) => (
                <div className="storyVerticalBox" key={index}>
                  <div
                    className="StoryImgContainer"
                    style={
                      item[0].isViewed
                        ? { border: '2px solid rgba(151, 151, 151, 1)', borderRadius: '12px' }
                        : { border: '2px solid rgba(110, 68, 255, 1)', borderRadius: '12px' }
                    }
                    onClick={() => openStoryModal(index)}
                  >
                    {item[0].media[0].type === 0 ? (
                      <img src={item[0].media[0].url} alt="storyImg" className="StoryImg" />
                    ) : (
                      <video className="StoryImg" preload="metadata" autoPlay={false}>
                        <source src={item[0].media[0].url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  {selfStory && index === 0 ? (
                    <div onClick={openCreatePostModalHandler} className="storyProfileImgContainer">
                      <img
                        src={item[0].author.pfp ? item[0].author.pfp : defaultProfile}
                        alt="profile"
                        className="storyProfileImg"
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="addNewStoryContainer">
                        <img
                          src={
                            isDarkMode
                              ? '/lightIcon/addStoryLight.svg'
                              : '/darkIcon/addStoryDark.svg'
                          }
                          className="addNewStory"
                          alt="add"
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="storyProfileImgContainer"
                      style={{ border: isDarkMode ? '3px solid #FCFCFC' : '3px solid #110E18' }}
                    >
                      <img
                        src={item[0].author.pfp ? item[0].author.pfp : defaultProfile}
                        alt="profile"
                        className="storyProfileImg"
                      />
                    </div>
                  )}
                  {selfStory && index === 0 ? (
                    <div className="storyNameContainer">
                      <p className={isDarkMode ? 'storyName' : 'd-storyName'}>
                        {item[0].author.display_name ? 'You' : 'User'}
                      </p>
                    </div>
                  ) : (
                    <div className="storyNameContainer">
                      <p className={isDarkMode ? 'storyName' : 'd-storyName'}>
                        {item[0].author.display_name ? item[0].author.display_name : 'User'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>

      <>
        {storyViewModal && story && currentStoryIndex < story.length && currentStoryIndex > -1 && (
          <div className="modal-overlay5" onClick={closeStoryModal}>
            <div
              onClick={(e) => e.stopPropagation()}
              onFocus={viewStory(
                story[currentStoryIndex][currentImageIndex]?.author.soconId,
                story[currentStoryIndex][currentImageIndex]?.hash
              )}
              className={isDarkMode ? 'light-modal-content5' : 'dark-modal-content5'}
            >
              {!isMobileView && (
                <div className="left0" onClick={handleLeftCarouselClick}>
                  {isDarkMode ? (
                    <img src={leftLightMode} alt="left" />
                  ) : (
                    <img src={leftcarousel} alt="left" />
                  )}
                </div>
              )}
              <div className={isDarkMode ? 'inside-story-box' : 'd-inside-story-box'}>
                {isMobileView && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div className="left0-mobile" onClick={handleLeftCarouselClick}>
                      {isDarkMode ? (
                        <img src={leftLightMode} alt="left" />
                      ) : (
                        <img src={leftcarousel} alt="left" />
                      )}
                    </div>
                    <div className="right0-mobile" onClick={handleRightCarouselClick}>
                      {isDarkMode ? (
                        <img src={rightLightMode} alt="right" />
                      ) : (
                        <img src={rightcarousel} alt="right" />
                      )}
                    </div>
                  </div>
                )}
                {renderStatusBars(story[currentStoryIndex])}

                <div className="insideStory-headers-containers">
                  <div
                    onClick={() => goToProfile(story[currentStoryIndex][currentImageIndex]?.author)}
                    className="inside-story-profile-container"
                  >
                    <img
                      src={
                        story[currentStoryIndex][currentImageIndex]?.author.pfp
                          ? story[currentStoryIndex][currentImageIndex]?.author.pfp
                          : defaultProfile
                      }
                      className="inside-story-profile"
                      alt="image"
                    />
                  </div>
                  <div
                    onClick={() => goToProfile(story[currentStoryIndex][currentImageIndex]?.author)}
                    className="insideStory-name-container"
                  >
                    <p className="insideStory-name">
                      {story[currentStoryIndex][currentImageIndex]?.author.display_name
                        ? story[currentStoryIndex][currentImageIndex]?.author.display_name
                        : 'User'}
                    </p>
                  </div>
                  <div className="insideStory-timeContainer">
                    <p className="insideStory-time">
                      {getDate(story[currentStoryIndex][currentImageIndex]?.timestamp)}
                    </p>
                  </div>
                  <div className="story-right-box">
                    <div className="storyBottomIconContainer" onClick={togglePause}>
                      {isPaused ? (
                        <img src={resume} alt="pause" className="pauseStory" />
                      ) : (
                        <img src={pause} alt="pause" className="pauseStory" />
                      )}
                    </div>
                    {currentStoryIndex === 0 && selfStory && (
                      <div className="storyBottomIconContainer" onClick={openMoreOption}>
                        <img src={more} alt="more" className="story-close" />
                      </div>
                    )}

                    <div className="storyBottomIconContainer" onClick={closeStoryModal}>
                      <img src={closeTrans} alt="close" className="story-close" />
                    </div>
                  </div>
                </div>

                <div
                  className="large-story-image-container"
                  style={{ background: isDarkMode ? '#FCFCFC' : '#110E18' }}
                >
                  {story[currentStoryIndex][currentImageIndex].media[0].type === 0 ? (
                    <img
                      src={story[currentStoryIndex][currentImageIndex]?.media[0].url}
                      alt="large-story-image"
                      className="large-story-image"
                    />
                  ) : (
                    <video ref={videoRef} autoPlay controls={false} className="large-story-image">
                      <source
                        src={story[currentStoryIndex][currentImageIndex]?.media[0].url}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {!(currentStoryIndex === 0 && selfStory) && (
                  <div className="insideStory-bottomInputContainer">
                    {/* <div
                        className={
                          isDarkMode
                            ? "story-input-bottom"
                            : "d-story-input-bottom"
                        }
                      >
                        <div className="insidestory-inputProfile-container">
                          <img
                            src={userDetails.pfp ? userDetails.pfp : defaultProfile}
                            alt="profilepic"
                            className="insidestory-inputProfile"
                          />
                        </div>
                        <input
                          className={
                            isDarkMode
                              ? "insideStory-input"
                              : "d-insideStory-input"
                          }
                          placeholder={`Reply to ${story[currentStoryIndex][currentImageIndex]?.author.display_name}...`}
                          onChange={(e) => setStoryReply(e.target.value)}
                          value={storyReply}
                        />
                      </div> */}

                    <div className="insideStory-bottomright">
                      <div
                        onClick={() =>
                          likeStory(
                            story[currentStoryIndex][currentImageIndex]?.author.soconId,
                            story[currentStoryIndex][currentImageIndex]?.hash,
                            currentStoryIndex,
                            currentImageIndex
                          )
                        }
                        className="bottomicon-container"
                      >
                        {story[currentStoryIndex][currentImageIndex]?.isLiked ? (
                          <img src={redHeart} alt="heart" className="bottomicon" />
                        ) : (
                          <img src={heart} alt="heart" className="bottomicon" />
                        )}
                      </div>
                      {/* <div onClick={() => handelStoryReply(story[currentStoryIndex][currentImageIndex]?.author)} className="bottomicon-container_share">
                             <img src={shareBackground} alt="share" className="bottomicon" />
                            </div> */}
                    </div>
                  </div>
                )}

                {currentStoryIndex === 0 && selfStory && (
                  <div className="insideStory-bottomInputContainer-self">
                    <div
                      className="selfBottomFooter"
                      onClick={() =>
                        openStoryActivity(story[currentStoryIndex][currentImageIndex]?.hash)
                      }
                    >
                      <div className="storyBottomIconContainer">
                        <img src={activityIcon} alt="img" className="storyBottomIcon" />
                      </div>
                      <span className="storyActivityText">Activity</span>
                    </div>

                    <div className="insideStory-bottomright">
                      {/* <div className="storyBottomIconContainer" onClick={openconfirmDelete}>
                          <img src='/icon/transDelete.svg' alt="img" className="storyBottomIcon" />
                        </div> */}
                      <div className="storyBottomIconContainer" onClick={openAddToHighlight}>
                        <img src={add} alt="img" className="storyBottomIcon" />
                      </div>
                      {/* <div className="storyBottomIconContainer">
                          <img src={shareBackground} alt="img" className="storyBottomIcon" />
                        </div> */}
                    </div>
                  </div>
                )}
              </div>
              {!isMobileView && (
                <div className="right0" onClick={handleRightCarouselClick}>
                  {isDarkMode ? (
                    <img src={rightLightMode} alt="right" />
                  ) : (
                    <img src={rightcarousel} alt="right" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {moreOption && (
          <div
            className={isDarkMode ? 'confirmDeleteContainer' : 'd-confirmDeleteContainer'}
            onClick={closeOpenMoreOption}
          >
            <div
              className={isDarkMode ? 'confirmDeleteBox' : 'd-confirmDeleteBox'}
              onClick={(e) => e.stopPropagation()}
            >
              {!confirmDelete && (
                <>
                  {!isMobileView && (
                    <div className="story-more-close-container" onClick={closeOpenMoreOption}>
                      <img src={close} alt="close" className="story-more-close" />
                    </div>
                  )}
                  {/* <div className="share-box">
                    <img src={share} alt="share" className="story-icon-delete" />
                    <span className="share-story-texts">Share Story</span>
                  </div> */}
                  <div className="delete-box" onClick={openconfirmDelete}>
                    <img src={deletes} alt="delete" className="story-icon-delete" />
                    <span className="delete-story-texts">Delete Story</span>
                  </div>
                </>
              )}
              {confirmDelete && (
                <>
                  <div className="delete-notify-container">
                    <p className={isDarkMode ? 'delete-notify' : 'd-delete-notify'}>
                      Are You Sure Want to Delete this story?
                    </p>
                  </div>
                  <div className="notify-button-containers">
                    <button
                      className={isDarkMode ? 'notify-button' : 'd-notify-button'}
                      onClick={closeOpenMoreOption}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteStory}
                      className={isDarkMode ? 'notify-button' : 'd-notify-button'}
                    >
                      Yes, Sure
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {storyActivity && (
          <div
            className={isDarkMode ? 'storyActivityContainer' : 'd-storyActivityContainer'}
            onClick={closeStoryActivity}
          >
            <div
              className={isDarkMode ? 'storyActivityBox' : 'd-storyActivityBox'}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="activityHeader">
                <div className="activityHeaderTitleContainer">
                  <p className={isDarkMode ? 'activityHeaderTitle' : 'd-activityHeaderTitle'}>
                    Stories Activity
                  </p>
                </div>
              </div>

              {isMobileView && (
                <div className="activityRow">
                  <div className="leftActivity">
                    <div className="activitysIconContainer">
                      <img src={eye} alt="img" className="activitysIcon" />
                    </div>
                    <div className="activityCountContainer">
                      <p className={isDarkMode ? 'activityCount' : 'd-activityCount'}>
                        {activity && activity.length}
                      </p>
                    </div>
                  </div>
                  <div className="rightActivity">
                    <div className="activitysIconContainer">
                      <img src={redHeart} alt="img" className="activitysIcon" />
                    </div>
                    <div className="activityCountContainer">
                      <p className={isDarkMode ? 'activityCount' : 'd-activityCount'}>
                        {activity && activity.filter((item) => item.isLiked === true).length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isMobileView && (
                <div className="activityRow">
                  <div className="leftActivity">
                    <div className="activitysIconContainer">
                      <img src={eye} alt="img" className="activitysIcon" />
                    </div>
                    <div className="activityCountContainer">
                      <p className={isDarkMode ? 'activityCount' : 'd-activityCount'}>
                        {activity && activity.length}
                      </p>
                    </div>
                  </div>
                  <div className="rightActivity">
                    <div className="activitysIconContainer">
                      <img src={redHeart} alt="img" className="activitysIcon" />
                    </div>
                    <div className="activityCountContainer">
                      <p className={isDarkMode ? 'activityCount' : 'd-activityCount'}>
                        {activity && activity.filter((item) => item.isLiked === true).length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={
                  isDarkMode ? 'activityProfileListContainer' : 'd-activityProfileListContainer'
                }
              >
                {activity &&
                  activity.map((item, index) => (
                    <div className="activityProfileList" key={index}>
                      <div className="activityProfileLeft">
                        <div
                          className="activityProfileContainer"
                          onClick={() => goToProfileFromView(item.username, item.soconId)}
                        >
                          <img
                            src={item.pfp ? item.pfp : defaultProfile}
                            alt="img"
                            className="activityProfile"
                          />
                        </div>
                        <div className="activityNameContainer">
                          <p className={isDarkMode ? 'activityName' : 'd-activityName'}>
                            {item.display_name ? item.display_name : 'User'}
                          </p>
                        </div>
                      </div>
                      <div className="activitysIconContainer">
                        <img
                          src={!item.isLiked ? eye : redHeart}
                          alt="img"
                          className="activitysIcon"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {addToHighlight && (
          <AddStory
            storySelf={story[0][currentImageIndex]}
            closeAddToHighlight={closeAddToHighlight}
          />
        )}
      </>
    </>
  );
};

export default Stories;
