import React, { useEffect } from 'react';
import styles from '../HomeScreen.module.css';
import more from '../../../assets/icons/More.png';
import poll from '../../../assets/anonymous/icon/poll.svg';
import Fatrows from '../../../assets/anonymous/icon/fatrows.svg';
import ImageCarousel from './ImageCarousel.jsx';
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL, BEARER_TOKEN, VOTEFORPOLL } from '../../../api/EndPoint.js';
import { setAnonymousPostMoreOption } from '../../../redux/slices/modalSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectPost } from '../../../redux/slices/anonSlices.js';
import { setGlobalAnonPost } from '../../../redux/slices/anonSlices.js';
import { useNavigate } from 'react-router-dom';
import { getDate } from '../../../utils/time';

const AllPost = ({ post, admin, index, handleShowMoreOptions }) => {
  const navigate = useNavigate();
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const [change, setChange] = useState(false);
  useEffect(() => {}, [change, globalAnonPost]);

  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const selectPost = useSelector((state) => state.community.selectPost);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const CloseMoreOption = () => {
    dispatch(setAnonymousPostMoreOption(false));
    setShowConfirm(false);
  };
  const OpenShowConfirm = () => {
    setShowConfirm(true);
  };

  var totalVotes = 0;
  if (post.type === 3) {
    totalVotes = post.options.reduce((accumulator, option) => accumulator + option.votes, 0);
    if (totalVotes === 0) {
      totalVotes = 1;
    }
  }

  const handleVote = async (hash, communityName, sender, option) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${VOTEFORPOLL}`,
        { hash, communityName, sender, option },
        { headers }
      );
      dispatch(setGlobalAnonPost(!globalAnonPost));
      setChange(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const goToAnonProfile = (username) => {
    navigate(`/anon/${username}`);
  };

  const moreOpt = () => {
    dispatch(setSelectPost(post));
    dispatch(setAnonymousPostMoreOption(true));
    handleShowMoreOptions(post);
  };

  const goToCommunity = () => {
    navigate(`/anon/homepage/communities/${post.community.name}`);
  };

  return (
    <div>
      <div className={styles.communityPostContainer}>
        <div className={styles.communityPostBox}>
          <div className={styles.communityHeader}>
            {post && (
              <div className={styles.postProfileContainer}>
                <img
                  src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${post.author.avatar}.png`}
                  className={styles.postProfile}
                  alt="img"
                />
              </div>
            )}
            <div className={styles.postNameColumn}>
              <div
                onClick={() => goToAnonProfile(post.author.username)}
                className={styles.postNameContainer}
              >
                <p className={styles.postName}>@{post.author.username}</p>
              </div>
            </div>
            {post.community ? (
              <div className={styles.communityNameFlex}>
                <div className={styles.postUsernameContainer}>
                  <p className={styles.postUsername} onClick={goToCommunity}>
                    {post.community.name}{' '}
                  </p>
                </div>
                <span className={styles.postTimeStamp}> {getDate(post.timestamp)} </span>{' '}
              </div>
            ) : (
              <div className={styles.postUsernameContainer}>
                <p className={styles.postUsername}>Community Removed</p>
              </div>
            )}
            <div className={styles.postRightContainer}>
              {post.type === 3 && (
                <div className={styles.pollIconContainer}>
                  <img src={Fatrows} className={styles.pollIcon} alt="poll" />
                </div>
              )}
              <div className={styles.moreIconContainer} onClick={() => moreOpt()}>
                <img src={more} alt="more" className={styles.moreIcon} />
              </div>
            </div>
          </div>
          {post.type === 2 && (
            <div className={styles.postTextContainer}>
              <p className={styles.postText} style={{ whiteSpace: 'pre-line' }}>
                {post.description}
              </p>
            </div>
          )}

          {post.type === 0 && (
            <div className={styles.postPhotoContainer}>
              <div className={styles.postTextContainer}>
                <p className={styles.postText}>{post.description}</p>
              </div>
              {post.medias[0].type === 0 ? (
                <img src={post.medias[0].url} alt="Post" className={styles.mainPostImg} />
              ) : (
                <video className={styles.mainPostImg} controls>
                  <source src={post.medias[0].url} type="video/mp4" />
                </video>
              )}
              {/* <img src={post.medias[0].url} className={styles.mainPostImg} alt="Post" /> */}
            </div>
          )}

          {post.type === 1 && (
            <div className={styles.postPhotoContainer}>
              <p className={styles.postText}>{post.description}</p>
              <ImageCarousel images={post.medias} />
            </div>
          )}

          {post.type === 3 && (
            <div className={styles.poll}>
              <div className={styles.postTextContainer}>
                <p className={styles.postText}>{post.description}</p>
              </div>
              <div className={styles.options}>
                {post.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (!post.disableForUser) {
                        handleVote(post.hash, post.community.name, post.author.id, index + 1);
                      }
                    }}
                    className={styles.option}
                  >
                    {post.disableForUser ? (
                      //show
                      <div className={styles.barContainer}>
                        <div
                          className={`${styles.bar1} ${
                            option.votes > 0
                              ? option.isVotedFor
                                ? styles.userVoted
                                : styles.otherVoted
                              : ''
                          }`}
                          style={{ width: `${(option.votes / totalVotes) * 100}%` }}
                        >
                          {option.value}
                        </div>
                      </div>
                    ) : (
                      // "dont show"
                      <div className={styles.barContainer}>
                        <div
                          className={`${styles.bar1} ${
                            post.disableForUser
                              ? option.isVotedFor
                                ? styles.userVoted
                                : styles.otherVoted
                              : ''
                          }`}
                          style={{ width: `${(option.votes / totalVotes) * 100}%` }}
                        >
                          {option.value}
                        </div>
                      </div>
                    )}

                    {post.disableForUser ? (
                      <span className={styles.optionPercentage}>
                        {((option.votes / totalVotes) * 100).toFixed(2)}%
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPost;

{
  /* <div className={styles.postActionContainer}>
<div className={styles.postIconContainer}>
    <div className={styles.postIconbox}>
        <img src={heart} alt='heart' className={styles.postIcon} />
    </div>
    <div className={styles.postActionCountContainer}>
        <p className={styles.postActionCount}>30.2K</p>
    </div>
</div>

<div className={styles.postIconContainer}>
    <div className={styles.postIconbox}>
        <img src={message} alt='message' className={styles.postIcon} />
    </div>
    <div className={styles.postActionCountContainer}>
        <p className={styles.postActionCount}>30.2K</p>
    </div>
</div>

<div className={styles.postIconContainer}>
    <div className={styles.postIconbox}>
        <img src={share} alt='share' className={styles.postIcon} />
    </div>
    <div className={styles.postActionCountContainer}>
        <p className={styles.postActionCount}>30.2K</p>
    </div>
</div>

<div className={styles.postIconContainer}>
    <div className={styles.postIconbox}>
        <img src={save} alt='save' className={styles.postIcon} />
    </div>
</div>
</div> */
}
