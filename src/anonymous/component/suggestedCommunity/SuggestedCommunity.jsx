import React, { useState, useEffect, useRef } from 'react';
import styles from './SuggestedCommunity.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, BEARER_TOKEN, MESSAGETIMELINE } from '../../../api/EndPoint';
import axios from 'axios';
import {
  setCommunityName,
  addMember,
  removeMember,
  fetchCommunities
} from '../../../redux/slices/anonSlices';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { setOpenCommunity } from '../../../redux/slices/modalSlice';

const SuggestedCommunity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeline, setTimeline] = useState(null);
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const fetchedCommunities = useSelector((state) => state.community.communities);
  const joinedCommunities = useSelector((state) => state.community.joinedCommunities);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  const fetchTimeline = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${MESSAGETIMELINE}`, { headers });
      setTimeline(response.data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  const joinCommunity = (community) => {
    dispatch(addMember({ communityName: community.name, username: anonDetails.name })).catch(
      (error) => {
        console.error('Error joining community:', error);
      }
    );
  };

  const leaveCommunity = (community) => {
    dispatch(removeMember({ communityName: community.name, username: anonDetails.name })).catch(
      (error) => {
        console.error('Error leaving community:', error);
      }
    );
  };

  useEffect(() => {
    fetchTimeline();
  }, [globalAnonPost, anonDetails]);

  const goToCommunity = (name) => {
    navigate(`/anon/homepage/communities/${encodeURIComponent(name)}`);
  };

  const handleCreateCommunity = () => {
    navigate('anon/discovers');
    dispatch(setOpenCommunity(true));
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = 140; // assuming each item has a width of 140px
        const count = Math.ceil(containerWidth / itemWidth);
        setVisibleCount(count);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => {
      window.removeEventListener('resize', updateVisibleCount);
    };
  }, []);

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRightClick = () => {
    if (currentIndex < fetchedCommunities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isCommunityJoined = (community) => {
    return joinedCommunities.includes(community.name);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.suggestionHeader}>
        <div className={styles.suggestionTittleContainer}>
          <p className={styles.suggestionTittle}>Communities for you</p>
        </div>
        <p className={styles.createCommunity} onClick={handleCreateCommunity}>
          Create +
        </p>
      </div>

      <div className={styles.SuggestedCommunityContainer} ref={containerRef}>
        {fetchedCommunities &&
          fetchedCommunities
            .slice(currentIndex, currentIndex + visibleCount)
            .map((community, index) => (
              <div
                className={styles.suggestionBox}
                style={{ width: '140px' }}
                onClick={() => goToCommunity(community.name)}
                key={community.name}
              >
                <div className={styles.suggestionImgContainer}>
                  <img src={community.displayPicture} className={styles.suggestionImg} />
                </div>
                <div className={styles.peopleNameContainer}>
                  <p className={styles.peopleName}>{community.name}</p>
                </div>
                <div className={styles.profileCountContainer}>
                  <div className={styles.profileImgContainer}>
                    <img src="/Images/profile1.svg" className={styles.profileImg} />
                  </div>
                  <div className={styles.countTextContainer}>
                    <p className={styles.countText}>{community.memberCount}</p>
                  </div>
                </div>

                <button
                  onClick={(event) => {
                    isCommunityJoined(community)
                      ? leaveCommunity(community, currentIndex + index)
                      : joinCommunity(community, currentIndex + index);
                    event.stopPropagation();
                  }}
                  className={isCommunityJoined(community) ? styles.joinedBtn : styles.joinBtn}
                >
                  {isCommunityJoined(community) ? 'Joined' : 'Join'}
                </button>
              </div>
            ))}
      </div>
      {fetchedCommunities.length > 0 ? (
        <div style={{ display: 'flex' }}>
          <div className={styles.carouselController}>
            {currentIndex === 0 ? (
              <img src="/icon/leftCarousel.svg" />
            ) : (
              <img
                src="/icon/leftActive.svg"
                onClick={handleLeftClick}
                style={{ cursor: 'pointer' }}
              />
            )}
            {currentIndex > fetchedCommunities.length - visibleCount + 1 ? (
              <img src="/icon/RightInactive.svg" />
            ) : (
              <img
                src="/icon/rightCarousel.svg"
                onClick={handleRightClick}
                style={{ cursor: 'pointer' }}
              />
            )}
          </div>
        </div>
      ) : (
        <p style={{ color: '#FCFCFC', textAlign: 'center' }}>No suggestions found</p>
      )}
    </div>
  );
};

export default SuggestedCommunity;
