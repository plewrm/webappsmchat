import React, { useEffect, useState } from 'react';
import styles from './DiscoverComponent.module.css';
import style from '../suggestedCommunity/SuggestedCommunity.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCommunityStatus, addMember, removeMember } from '../../../redux/slices/anonSlices';

export default function DiscoverComponent({
  content,
  close,
  joinedCommunities,
  updateJoinedCommunities
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const joinStatus = useSelector((state) => state.community.joinStatus);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const [localStatus, setLocalStatus] = useState(false);

  useEffect(() => {
    if (joinedCommunities) {
      setLocalStatus(joinedCommunities.includes(content.name));
    }
  }, [joinedCommunities, content.name]);

  const joinCommunity = () => {
    dispatch(addMember({ communityName: content.name, username: anonDetails.name }))
      .then((response) => {
        dispatch(setCommunityStatus(true));
        setLocalStatus(true);
        updateJoinedCommunities([...joinedCommunities, content.name]);
      })
      .catch((error) => {
        console.error('Error joining community:', error);
      });
  };

  const leaveCommunity = () => {
    dispatch(removeMember({ communityName: content.name, username: anonDetails.name }))
      .then((response) => {
        dispatch(setCommunityStatus(false));
        setLocalStatus(false);
        updateJoinedCommunities(joinedCommunities.filter((name) => name !== content.name));
      })
      .catch((error) => {
        console.error('Error leaving community:', error);
      });
  };

  const openCommunity = () => {
    navigate(`/anon/homepage/communities/${encodeURIComponent(content.name)}`);
    close();
  };

  return (
    <div
      className={styles.hsCardContainer}
      onClick={() => {
        openCommunity();
        // openCommunity(content.name, content.isMember);
      }}
    >
      <div className={style.suggestionBox} style={{ width: '140px' }}>
        <div className={style.suggestionImgContainer}>
          <img
            src={content.displayPicture}
            className={style.suggestionImg}
            alt={`Profile of ${content.name}`}
          />
        </div>
        <div className={style.peopleNameContainer}>
          <p className={style.peopleName}>{content.name}</p>
        </div>
        <div className={style.profileCountContainer}>
          <div className={style.profileImgContainer}>
            <img src="/Images/profile1.svg" className={style.profileImg} alt="Profile" />
          </div>
          <div className={style.countTextContainer}>
            <p className={style.countText}>{content.memberCount}</p>
          </div>
        </div>
        {!localStatus ? (
          <button
            className={style.joinBtn}
            onClick={(event) => {
              joinCommunity();
              event.stopPropagation();
            }}
          >
            Join
          </button>
        ) : (
          <button
            className={style.joinedBtn}
            onClick={(event) => {
              leaveCommunity();
              event.stopPropagation();
            }}
          >
            Joined
          </button>
        )}
      </div>
    </div>
  );
}
