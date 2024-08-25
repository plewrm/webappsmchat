import React, { useState, useEffect, useRef } from 'react';
import gallery from '../../../assets/icons/gallery.svg';
import noProfile from '../../../assets/images/no-profile.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearMediaFiles,
  setAnonymousCreateProfile,
  setMediaFiles,
  setShowPollInputs
} from '../../../redux/slices/modalSlice';
import { Col, Row } from 'antd';
import axios from 'axios';
import { BASE_URL, BEARER_TOKEN, GETALLCOMMUNITIES } from '../../../api/EndPoint';
import { setGlobalAnonPost } from '../../../redux/slices/anonSlices';
import { useLocation } from 'react-router-dom';

const AnonymousAddPost = ({ communityName }) => {
  const dispatch = useDispatch();
  const [chooseCommunity, setChooseCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const location = useLocation();
  const isHomepage = location.pathname === '/anon/homepage';
  const maxCharLimit = 512;
  const textareaRef = useRef(null);

  const closeAnonymousCreatePost = () => {
    dispatch(setAnonymousCreateProfile(false));
    dispatch(clearMediaFiles());
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    dispatch(setMediaFiles(files));
    dispatch(setAnonymousCreateProfile(true));
  };

  const getJoinedCommunities = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETALLCOMMUNITIES}`, { headers });
      // // Filter communities where isMember is true
      // const filteredCommunities = response.data.communities.filter(
      //   (community) => community.isMember
      // );

      let filteredCommunities;
      if (isHomepage) {
        // Filter communities where isMember is true if on '/anon/homepage'
        filteredCommunities = response.data.communities.filter((community) => community.isMember);
      } else {
        // Otherwise, just get all communities
        filteredCommunities = response.data.communities.filter(
          (community) => community.isMember && community.name === communityName
        );
      }

      setJoinedCommunities(filteredCommunities);
      if (filteredCommunities.length === 0) {
        toast.error('Joined atleast one Community to post!');
        closeAnonymousCreatePost();
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getJoinedCommunities();
  }, []);

  const selectCommunity = (name) => {
    setChooseCommunity(name);
  };

  const anonDetails = useSelector((state) => state.community.anonDetails);
  useEffect(() => {}, [anonDetails]);

  const [startIndex, setStartIndex] = useState(0);
  const visibleItemsCount = 4;

  const handleRightClick = () => {
    if (startIndex + visibleItemsCount) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleLeftClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleCommunityNameChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxCharLimit) {
      setText(inputText);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const post = async () => {
    setLoading(true);
    if (!chooseCommunity) {
      toast.error('Please select a community to post!');
      setLoading(false);
      return;
    }

    try {
      const postObj = {
        description: text,
        type: 2
      };

      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${BASE_URL}${GETALLCOMMUNITIES}/${chooseCommunity}/messages`,
        postObj,
        { headers }
      );
      dispatch(setGlobalAnonPost(!globalAnonPost));
      console.log(response);
      dispatch(clearMediaFiles());
      setText('');
      setChooseCommunity(null);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
    dispatch(setAnonymousCreateProfile(false));
  };

  const handlePollIconClick = () => {
    dispatch(setAnonymousCreateProfile(true));
    dispatch(setShowPollInputs(true));
  };

  return (
    <div className="d-addPostContainer">
      <div className="addPostHeader">
        <div className="addPostProfileContainer">
          {anonDetails ? (
            <img
              src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`}
              alt="profile"
              className="addPostProfile"
            />
          ) : (
            <img src={noProfile} alt="profile" className="addPostProfile" />
          )}
        </div>
        <div className="addPostInputContainer">
          <textarea
            placeholder="Say something to your community..."
            ref={textareaRef}
            onChange={handleCommunityNameChange}
            value={text}
            className="d-addPostInput"
          />
        </div>
      </div>

      <div className="addPostFooter">
        <div
          className="addPostIconsContainer"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
          />
          <img src={gallery} alt="gallery" className="addPostIcons" />
        </div>
        <div className="addPostIconsContainer" onClick={handlePollIconClick}>
          <img src="/icon/poll.svg" alt="poll" className="addPostIcons" />
        </div>
        <div className="sideFooterRight">
          <div className="addPostCharLimitContainer">
            <p className="d-addpostCharLimit">{maxCharLimit - text.length} characters remaining</p>
          </div>
          {text.trim().length > 0 && chooseCommunity ? (
            <button
              className="d-privacyContainer"
              onClick={post}
              style={{ background: '#6E44FF', cursor: 'pointer' }}
            >
              Post
            </button>
          ) : (
            <button className="d-privacyContainer"> Post</button>
          )}
        </div>
      </div>
      {text.trim().length > 0 && (
        <div className="communitiesContainer">
          <div className="communtiesController">
            <div className="communtiesControllerTittleContainer">
              <p className="communtiesControllerTittle">Select Communities to post on:</p>
            </div>
            <div className="carouselController">
              {startIndex > 0 ? (
                <img
                  src="/icon/leftActive.svg"
                  onClick={handleLeftClick}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <img src="/icon/leftCarousel.svg" />
              )}
              {startIndex + visibleItemsCount < joinedCommunities.length ? (
                <img
                  src="/icon/rightCarousel.svg"
                  onClick={handleRightClick}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <img src="/icon/RightInactive.svg" />
              )}
            </div>
          </div>
          <Row gutter={16}>
            {joinedCommunities &&
              joinedCommunities
                .slice(startIndex, startIndex + visibleItemsCount)
                .map((item, index) => (
                  <Col
                    key={index}
                    span={6}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onClick={() => selectCommunity(item.name)}
                  >
                    <div className="connumitiesImagesContainer">
                      <img
                        src={item.displayPicture}
                        className={`communitiesImages ${chooseCommunity === item.name ? 'selectedCommunities' : ''}`}
                      />
                      {chooseCommunity === item.name && (
                        <img src="/icon/tickCircle.svg" className="selectCommunitiesTick" />
                      )}
                    </div>
                    <div className="communitiesNameContainer">
                      <p className="communitiesName">{item.name}</p>
                    </div>
                  </Col>
                ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default AnonymousAddPost;
