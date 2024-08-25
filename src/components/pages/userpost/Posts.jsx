import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import {
  openMoreModal,
  openRepostModal,
  openShareModal,
  openSaveModal,
  setUserLikeListModal,
  setExpandPostModal,
  setSelectedPost,
  setOpponentProfile,
  openCreatePostModal,
  setViewRepost,
  setHashtag,
  setGlobalSearchScreen,
  setSavePostModal,
  setScrollPosition,
  setUnSavePosts
} from '../../../redux/slices/modalSlice';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETALLTIMELINEPOST,
  LIKE_UNLIKE_POST,
  GETUSERPROFILE,
  ADDCOMMENT,
  DISCOVER,
  retrievedSoconId,
  REPOST,
  GETPOSTBYHASH,
  HASHTAGPOSTS,
  FOLLOWING,
  SEARCHUSER,
  FOLLOWERS,
  FOLLOW_UNFOLLOW_USER,
  GETSUGGESTEDUSER
} from '../../../api/EndPoint';
import { useTheme } from '../../../context/ThemeContext';
import { getDate } from '../../../utils/time';
import { setComment } from '../../../redux/slices/postSlices';
import { Popover } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { Progress } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { fetchFollowingUsers, followUser, unfollowUser } from '../../../redux/slices/postSlices';
import './PostContainer.css';
import './Posts.css';
import RepostModal from './userPostModals/RepostModal';
import ImageCarousel from './ImageCarousel';
import Share from './Share';
import More from './More';
import SavedPostModal from './userPostModals/SavedPostModal';
import UserLike from './UserLike';
import axios from 'axios';
import AddCollection from './userPostModals/AddCollection';
import camera from '../../../assets/icons/camera_dark.svg';
import UserRepost from './UserRepost';
import ProfileSetup from '../../../modals/ProfileSetup';
import Stories from '../Stories';
import defaultProfile from '../../../assets/icons/Default_pfp.webp';
import savedIcon from '../../../assets/icons/isSavedTrue.svg';
import lightBack from '../../../assets/icons/light_mode_arrow_left.svg';
import darkBack from '../../../assets/icons/dark_mode_arrow_left.svg';
import SuggestedPosts from './SuggestedPosts';
import SuggestedPeople from './SuggestedPeople';
import UserPostSkeleton from './UserPostSkeleton';
const Posts = ({
  isDiscover = false,
  isReposts = false,
  postByHashtag,
  isHashTag = false,
  myPost = false,
  myTimeline,
  hide
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [firstLogin, setFirstLogin] = useState(localStorage.getItem('firstLogin'));
  const [change, setChange] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repostToggle, setRepostToggle] = useState([]);
  const [followDiscoverUsers, setFollowDiscoverUsers] = useState({});
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const repostModalOpen = useSelector((state) => state.modal.repostModalOpen);
  const moreModalOpen = useSelector((state) => state.modal.moreModalOpen);
  const saveModalOpen = useSelector((state) => state.modal.saveModalOpen);
  const userLikeListModal = useSelector((state) => state.modal.userLikeListModal);
  const userRepostListModal = useSelector((state) => state.modal.userRepostListModal);
  const saveAddCollection = useSelector((state) => state.modal.saveAddCollection);
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const postLoader = useSelector((state) => state.loader.postLoader);
  const globalPostState = useSelector((state) => state.loader.globalPostState);
  const repostRef = useRef(null);
  const currentUserSoconId = retrievedSoconId || sessionStorage.getItem('soconId');
  const isHomepage = location.pathname === '/homepage';
  const isUserProfilePage = location.pathname.includes('/profile/');
  const mentionData = useSelector((state) => state.posts.mentionData);
  const status = useSelector((state) => state.posts.status);
  const followingUsers = useSelector((state) => state.posts.followingUsers);
  const [viewProfile, setViewProfile] = useState(false);
  const [repostProfile, setrepostProfile] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [commentReplies, setCommentReplies] = useState([]);
  const [showGlobalMentions, setShowGlobalMentions] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [currentIndexInLoop, setCurrentIndexInLoop] = useState(null);
  const [captionIndexMap, setCaptionIndexMap] = useState(new Map());
  const [percent, setPercent] = useState(0);
  const scrollPositionRedux = useSelector((state) => state.modal.scrollPosition);
  const postRefs = useRef([]);

  // console.log('length of timeline', timeline);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reward');
            entry.target
              .querySelector('.images-actions-container-anislie')
              .classList.add('animate-slide');
          } else {
            entry.target.classList.remove('animate-reward');
            entry.target
              .querySelector('.images-actions-container-anislie')
              .classList.remove('animate-slide');
          }
        });
      },
      {
        threshold: 0.1 // Trigger when 10% of the post is visible
      }
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [timeline]);

  const openCreatePostModalHandler = () => {
    dispatch(openCreatePostModal());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (repostRef.current && !repostRef.current.contains(event.target)) {
        // Click occurred outside of the modal, close it
        setRepostToggle([]);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const togglePopover = (event, index) => {
    // console.log('clicked')
    event.stopPropagation();
    // setIsVisible(!isVisible);
    setRepostToggle((prevState) => {
      const updatedRepostToggle = [...prevState];
      updatedRepostToggle[index] = !updatedRepostToggle[index];
      return updatedRepostToggle;
    });
  };

  const handleShareClick = (post) => {
    dispatch(openShareModal());
    dispatch(setSelectedPost(post));
  };

  const handleUnSavePost = (post) => {
    dispatch(setUnSavePosts(true));
    dispatch(setSelectedPost(post));
  };

  const handleRepostClick = (post) => {
    dispatch(openRepostModal());
    dispatch(setSelectedPost(post));
    togglePopover();
  };

  const handleMoreClick = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(openMoreModal());
  };

  const handleSaveClick = (post) => {
    // dispatch(openSaveModal());
    dispatch(setSavePostModal(true));
    dispatch(setSelectedPost(post));
  };

  const openLikeUser = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setUserLikeListModal(true));
  };

  const expandPostModal = (post, index) => {
    // console.log("position of scroll",window.scrollY);
    dispatch(setScrollPosition(window.scrollY));
    dispatch(setSelectedPost(post));
    dispatch(setExpandPostModal(true));
    dispatch(setComment(commentReplies[index]));
    dispatch(setOpponentProfile(false));
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };

  useEffect(() => {
    if (window.scroll && scrollPositionRedux) {
      window.scroll({
        top: scrollPositionRedux,
        behavior: 'smooth'
      }); // Restore scroll position
      if (timeline.length) dispatch(setScrollPosition(0));
      // console.log({ scrollPositionRedux });
    }
  }, [scrollPositionRedux, window, timeline]);

  useEffect(() => {
    // console.log('adding listener');
    window.addEventListener('scroll', { scrollPositionRedux });
    return () => {
      // console.log('removing listener');
      window.removeEventListener('scroll', { scrollPositionRedux });
    };
  }, []);

  const handleViewReposttClick = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setViewRepost(true));
    navigate('/repost');
  };

  const goToProfile = (post) => {
    dispatch(setSelectedPost(post));
    setViewProfile(true);
    // navigate(`/profile/${post.author.username}`);
    navigate(`/profile/${post.author.username}/${post.author.soconId}`, {
      state: { soconId: post.author.soconId }
    });
  };

  const goToRepostProfile = (post) => {
    dispatch(setSelectedPost(post));
    setrepostProfile(true);
    navigate(`/profile/${post.author.username}/${post.author.soconId}`, {
      state: { soconId: post.author.soconId }
    });
  };

  // useEffect(() => {
  //   const fetchGLobalUsers = async () => {
  //     try {
  //       const headers = {
  //         Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       };
  //       const response = await axios.get(
  //         `${BASE_URL}${SEARCHUSER}${showGlobalMentions}?page=1&pageSize=2`,
  //         { headers }
  //       );
  //       setMetionData(response.data.users);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchGLobalUsers();
  // }, [showGlobalMentions]);

  const handleCommentReplyChange = (index, value) => {
    setCurrentIndexInLoop(index);
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      // console.log(e.target.value.slice(lastAtIndex + 1).split(' ')[0])
      setShowGlobalMentions(value.slice(lastAtIndex + 1).split(' ')[0]);
    }
    const atIndex = value.lastIndexOf('@');
    const spaceIndex = value.lastIndexOf(' ');
    if (atIndex > spaceIndex) {
      setShowPopover(true);
    } else {
      setShowPopover(false);
    }
    const newCommentReplies = [...commentReplies];
    newCommentReplies[index] = value;
    setCommentReplies(newCommentReplies);
  };

  const handleLike = async (isLiked, authorId, postHash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = !isLiked
        ? await axios.put(
            `${BASE_URL}${LIKE_UNLIKE_POST}${authorId}/${postHash}`,
            {},
            { headers: headers }
          )
        : await axios.delete(`${BASE_URL}${LIKE_UNLIKE_POST}${authorId}/${postHash}`, {
            headers: headers
          });

      const timelineForLike = [...timeline];

      const indexToUpdate = timelineForLike.findIndex((item) => item.hash === postHash);

      timelineForLike[indexToUpdate] = {
        ...timelineForLike[indexToUpdate],
        isLiked: !isLiked,
        likes: {
          ...timelineForLike[indexToUpdate].likes,
          count: timelineForLike[indexToUpdate].likes.count + (isLiked ? -1 : 1),
          author: {
            ...timelineForLike[indexToUpdate].likes.author
          }
        }
      };

      // console.log('timelineForLike', timelineForLike);
      setTimeline(timelineForLike);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeline = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      let response = '';
      if (isReposts) {
        response = await axios.get(
          `${BASE_URL}${REPOST}${selectedPost.author.soconId}/${selectedPost.hash}`,
          { headers }
        );
        console.log('setTimeline', response.data);
        setTimeline(response.data.reposts);
        console.log(response.data);
      } else if (isHashTag) {
        // const planeTag = postByHashtag.slice(1);
        dispatch(setHashtag(''));
        if (postByHashtag.length > 0) {
          response = await axios.get(`${BASE_URL}${HASHTAGPOSTS}${postByHashtag}`, { headers });
          setTimeline(response.data.posts);
          if (response.data.posts.length === 0) {
            hide();
          }
        } else {
          console.log('no thing');
        }
      } else if (myPost) {
        setTimeline(myTimeline);
      } else {
        response = await axios.get(`${BASE_URL}${isDiscover ? DISCOVER : GETALLTIMELINEPOST}`, {
          headers
        });
        setTimeline(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("Print timeline image video tag",timeline);

  const selectMention = (mentionName) => {
    const lastIndex = commentReplies[currentIndexInLoop].lastIndexOf('@');
    if (lastIndex !== -1) {
      const updatedComment = `${commentReplies[currentIndexInLoop].substring(0, lastIndex)}@${mentionName}`;
      // setTimeLineComment(updatedComment);
      const newCommentReplies = [...commentReplies];
      newCommentReplies[currentIndexInLoop] = updatedComment;
      setCommentReplies(newCommentReplies);
    }
    // setTimeLineComment(`${timeLineComment}${mentionName}`)
    setShowPopover(false);
  };

  const content = (
    <div className={isDarkMode ? 'mentionPeopleContainer' : 'd-mentionPeopleContainer'}>
      {mentionData &&
        mentionData.map((item, index) => (
          <div className="mentionBox" key={index}>
            <div className="mentionProfileContianer">
              <img
                src={item.pfp ? item.pfp : defaultProfile}
                alt="image"
                className="mentionProfile"
              />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                selectMention(item.username);
              }}
              className="mentionColumn"
            >
              <div className="mentionUsernameContainer">
                <p className={isDarkMode ? 'mentionUsername' : 'd-mentionUsername'}>
                  {item.display_name}
                </p>
              </div>
              <div className="mentionNameContainer">
                <p className={isDarkMode ? 'mentionName' : 'd-mentionName'}>{item.username}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

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
      setUserProfile(response.data.profile);
      // console.log("Show reward point", response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyProfile();
    getTimeline();
  }, [change, globalPostState, postByHashtag, myTimeline]);

  const updateIndex = (index, setCaptionIndex) => {
    const captionTempMap = new Map(captionIndexMap);
    captionTempMap.set(index, setCaptionIndex);
    setCaptionIndexMap(captionTempMap);
  };

  const addComment = async (post, index) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${ADDCOMMENT}${post.author.soconId}/${post.hash}`,
        { commentText: commentReplies[index] },
        { headers: headers }
      );
      setChange(true);
      setCommentReplies([]);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (postLoader) {
      if (percent === 95) {
      } else {
        const interval = setInterval(() => {
          setPercent((prevPercent) => Math.min(prevPercent + 19, 100));
        }, 500);
        return () => clearInterval(interval);
      }
    }
  }, [percent, postLoader]);

  const outerPost = (post, index) => {
    // console.log('position of scroll', window.scrollY);
    dispatch(setScrollPosition(window.scrollY));
    getPostByHash(post.hash, post.author.soconId);
    dispatch(setExpandPostModal(true));
    dispatch(setComment(commentReplies[index]));
    dispatch(setOpponentProfile(false));
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };

  const innerPost = (post, index) => {
    dispatch(setScrollPosition(window.scrollY));
    getPostByHash(post.hash, post.author.soconId);
    dispatch(setExpandPostModal(true));
    dispatch(setComment(commentReplies[index]));
    dispatch(setOpponentProfile(false));
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };

  const getPostByHash = async (hash, soconId) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETPOSTBYHASH}${soconId}/${hash}`, {
        headers
      });
      dispatch(setSelectedPost(response.data.post));
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event, postIndex) => {
    if (event.key === 'Enter') {
      addComment(timeline[postIndex], postIndex);
      event.preventDefault(); // Prevents the default behavior of the Enter key (e.g., new line in textarea)
    }
  };

  const goPostsTags = (tag) => {
    dispatch(setGlobalSearchScreen(true));
    dispatch(setHashtag(tag));
  };

  const HighlightHashtags = (text) => {
    const parseText = (text) =>
      text.split(/(?<=\s|^)(#\w+)(?=\s|$)/g).map((part, index) =>
        /^#\w+$/.test(part) ? (
          <span
            key={index}
            onClick={(e) => {
              goPostsTags(part);
              e.stopPropagation();
            }}
            className="hashtag"
          >
            {part}
          </span>
        ) : (
          part
        )
      );

    return <div>{parseText(text)}</div>;
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFollowingUsers());
    }
  }, [status, dispatch]);

  const isFollowingUser = (authorSoconId) => {
    return followingUsers.includes(authorSoconId);
  };

  const followUserDiscover = (authorSoconId) => {
    console.log('follow in posts');
    dispatch(followUser(authorSoconId));
  };

  const unFollowUserDiscover = (authorSoconId) => {
    console.log('unfollow in posts');
    dispatch(unfollowUser(authorSoconId));
  };

  const rewardPoints = 2000;
  const getMedallionImage = (points) => {
    if (points >= 1500) {
      return <img src="/icon/MedallionsGold.svg" alt="Gold Medallion" className="star-icon" />;
    } else if (points >= 500) {
      return <img src="/icon/MedallionsSilver.svg" alt="Silver Medallion" className="star-icon" />;
    } else {
      return <img src="/icon/MedallionsBronce.svg" alt="Bronce Medallion" className="star-icon" />;
    }
  };

  const getRewardPointsClass = (points) => {
    if (points >= 1500) {
      return 'reward-points gold-border';
    } else if (points >= 500) {
      return 'reward-points silver-border';
    } else {
      return 'reward-points bronze-border';
    }
  };

  return (
    <div className="upload-post-container">
      <>
        {!loading ? (
          <>
            {timeline && timeline.length === 0 && !myPost && !isReposts && !isHashTag && (
              // new code for suggested people if user new here
              <>
                <SuggestedPeople />
                <SuggestedPosts
                  isDiscover={false}
                  isReposts={false}
                  postByHashtag
                  isHashTag={false}
                  myPost={false}
                  myTimeline
                  hide
                />
              </>
            )}
          </>
        ) : (
          <>
            <UserPostSkeleton />
          </>
        )}
      </>
      {
        <>
          {postLoader && (
            <div>
              <div className="innerLoaderContainer">
                <Progress
                  percent={percent}
                  strokeColor={{
                    '0%': '#6E44FF',
                    '100%': '#6E44FF'
                  }}
                  showInfo={false}
                />
              </div>
            </div>
          )}
          {timeline && timeline.length > 0 && (
            <>
              {timeline &&
                timeline.map((post, postIndex) => (
                  <div
                    onClick={() => outerPost(post, postIndex)}
                    key={postIndex}
                    className={isDarkMode ? 'post-boxes' : 'd-post-boxes'}
                    ref={(el) => (postRefs.current[postIndex] = el)}
                  >
                    {/* {(postIndex >= 4 && postIndex % 10 === 4) || (postIndex >= 10 && (postIndex - 10) % 20 === 0) && <Stories />} */}
                    {post.isARepost ? (
                      <>
                        <div className="post-header-container">
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={(event) => {
                              goToRepostProfile(post);
                              event.stopPropagation();
                            }}
                          >
                            <div className="post-profile-container">
                              <div className="profile-wrapper">
                                <img
                                  src={post.author.pfp ? post.author.pfp : defaultProfile}
                                  className="post-profile"
                                  alt="profile-pic"
                                />
                                {/* {userProfile && ( */}
                                <div className="reward-container">
                                  {getMedallionImage(rewardPoints)}
                                  {/* {getMedallionImage(userProfile.rewardPoints)} */}
                                  <div className="reward-points-container">
                                    <span className={getRewardPointsClass(rewardPoints)}>
                                      {rewardPoints}
                                    </span>
                                  </div>
                                </div>
                                {/* )} */}
                              </div>
                            </div>

                            <div className="post-name-container">
                              <p className={isDarkMode ? 'post-name' : 'd-post-name'}>
                                {post.author.display_name}
                              </p>
                            </div>

                            <div className="post-id-container">
                              <p className={isDarkMode ? 'post-id' : 'd-post-id'}>
                                {'@' + post.author.username}
                              </p>
                            </div>
                          </div>

                          <div className="isrepost-container">
                            <div className="isrepost-logo-container">
                              <img
                                src={
                                  isDarkMode
                                    ? '/lightIcon/repostLight.svg'
                                    : '/darkIcon/repostDark.svg'
                                }
                                alt="repost"
                                className="isrepost-logo"
                              />
                            </div>

                            <div className="isrepost-text-container">
                              <p className={isDarkMode ? 'isrepost-text' : 'd-isrepost-text'}>
                                reposted
                              </p>
                            </div>
                          </div>

                          <div className="post-time-container">
                            <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                              {getDate(post.createdAt)}
                            </p>
                          </div>

                          <div
                            className="more-container"
                            onClick={(event) => {
                              handleMoreClick(post);
                              event.stopPropagation();
                            }}
                          >
                            <img
                              src={
                                isDarkMode
                                  ? '/lightIcon/more_h_Light.svg'
                                  : '/darkIcon/more_h_Dark.svg'
                              }
                              className="more-icon"
                              alt="more"
                            />
                          </div>
                        </div>
                        {post.isARepost && (
                          <div className="post-captions-container">
                            <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                              {HighlightHashtags(post.text)}
                            </p>
                          </div>
                        )}
                        {post.parentPost ? (
                          <div
                            onClick={(event) => {
                              innerPost(post.parentPost, postIndex);
                              event.stopPropagation();
                            }}
                            className={
                              isDarkMode ? 'original-post-container' : 'd-original-post-container'
                            }
                          >
                            <div className="post-header-container">
                              <div
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={(event) => {
                                  goToProfile(post.parentPost);
                                  event.stopPropagation();
                                }}
                              >
                                <div className="post-profile-container">
                                  <img
                                    src={
                                      post.parentPost.author.pfp
                                        ? post.parentPost.author.pfp
                                        : defaultProfile
                                    }
                                    className="post-profile"
                                    alt="profile-pic"
                                  />
                                </div>

                                <div className="post-name-container">
                                  <p className={isDarkMode ? 'post-name' : 'd-post-name'}>
                                    {post.parentPost.author.display_name}
                                  </p>
                                </div>

                                <div className="post-id-container">
                                  <p className={isDarkMode ? 'post-id' : 'd-post-id'}>
                                    {'@' + post.parentPost.author.username}
                                  </p>
                                </div>
                              </div>

                              <div className="post-time-container">
                                <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                                  {getDate(post.parentPost.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div className="post-captions-container">
                              <p
                                className={isDarkMode ? 'post-captions' : 'd-post-captions'}
                                style={{ whiteSpace: 'pre-line' }}
                              >
                                {post.parentPost.type === 2
                                  ? HighlightHashtags(post.parentPost.text)
                                  : HighlightHashtags(
                                      post.parentPost.images[captionIndexMap.get(postIndex) || 0]
                                        .caption
                                    )}
                              </p>
                            </div>

                            {post.parentPost.type !== 2 && (
                              <div className="post-photo-containers">
                                <ImageCarousel
                                  images={post.parentPost.images.map((element) => element.url)}
                                  types={post.parentPost.images.map((element) => element.type)}
                                  isLiked={post.isLiked}
                                  handleLike={() =>
                                    handleLike(
                                      post.parentPost.isLiked,
                                      post.parentPost.author.soconId,
                                      post.parentPost.hash
                                    )
                                  }
                                  arrowClick={updateIndex}
                                  index={postIndex}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={
                              isDarkMode ? 'original-post-container' : 'd-original-post-container'
                            }
                          >
                            <div className="post-header-container">
                              <div>
                                <div style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}>
                                  <p style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}>
                                    <LockOutlined /> This content isn't available at the moment
                                  </p>
                                  <p
                                    // style={{ color: '#FCFCFC', fontSize: '0.753rem' }}
                                    style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                                  >
                                    When this happens, it's usually because the owner only shared it
                                    with a small group of people, changed who can see it, or it's
                                    been deleted.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {' '}
                        <div className="post-header-container">
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={(event) => {
                              goToProfile(post);
                              event.stopPropagation();
                            }}
                          >
                            <div className="post-profile-container">
                              {post.author.pfp ? (
                                <div className="profile-wrapper">
                                  <img
                                    src={post.author.pfp ? post.author.pfp : defaultProfile}
                                    className="post-profile"
                                    alt="profile-pic"
                                  />
                                  {/* {userProfile && ( */}
                                  <div className="reward-container">
                                    {getMedallionImage(rewardPoints)}
                                    {/* {getMedallionImage(userProfile.rewardPoints)} */}
                                    <div className="reward-points-container">
                                      <span className={getRewardPointsClass(rewardPoints)}>
                                        {rewardPoints}
                                      </span>
                                    </div>
                                  </div>
                                  {/* )} */}
                                </div>
                              ) : (
                                <img
                                  src={`https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg`}
                                  className="post-profile"
                                  alt="profile-pic"
                                />
                              )}
                            </div>

                            <div className="post-name-container">
                              <p className={isDarkMode ? 'post-name' : 'd-post-name'}>
                                {post.author.display_name}
                              </p>
                            </div>

                            <div className="post-id-container">
                              <p className={isDarkMode ? 'post-id' : 'd-post-id'}>
                                {'@' + post.author.username}
                              </p>
                            </div>
                          </div>

                          <div className="post-time-container">
                            <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                              {getDate(post.createdAt)}
                            </p>
                          </div>

                          <div key={postIndex} className="user-like-buttons">
                            {post.author.soconId !== currentUserSoconId &&
                            !isHomepage &&
                            !isUserProfilePage ? (
                              isFollowingUser(post.author.soconId) ? (
                                <button
                                  className={
                                    isDarkMode ? 'like-user-following' : 'd-like-user-following'
                                  }
                                  onClick={(e) => {
                                    unFollowUserDiscover(post.author.soconId);
                                    e.stopPropagation();
                                  }}
                                >
                                  Following
                                </button>
                              ) : (
                                <button
                                  className={isDarkMode ? 'like-user-follow' : 'd-like-user-follow'}
                                  onClick={(e) => {
                                    followUserDiscover(post.author.soconId);
                                    e.stopPropagation();
                                  }}
                                >
                                  Follow
                                </button>
                              )
                            ) : (
                              <></>
                            )}
                          </div>

                          <div
                            className="more-container"
                            onClick={(event) => {
                              handleMoreClick(post);
                              event.stopPropagation();
                            }}
                          >
                            <img
                              src={
                                isDarkMode
                                  ? '/lightIcon/more_h_Light.svg'
                                  : '/darkIcon/more_h_Dark.svg'
                              }
                              className="more-icon"
                              alt="more"
                            />
                          </div>
                        </div>
                        {/* {
                                post.isARepost && <div className='post-captions-container'>
                                    <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>{post.text}</p>
                                </div>
                            } */}
                        <div className="post-captions-container">
                          <p
                            style={{ whiteSpace: 'pre-line' }}
                            className={isDarkMode ? 'post-captions' : 'd-post-captions'}
                          >
                            {post.type === 2
                              ? HighlightHashtags(post.text)
                              : HighlightHashtags(
                                  post.images[captionIndexMap.get(postIndex) || 0].caption
                                )}
                          </p>
                        </div>
                        {post.type !== 2 && (
                          <div className="post-photo-containers">
                            {/* {console.log(post.images)} */}
                            <ImageCarousel
                              images={post.images.map((element) => element.url)}
                              types={post.images.map((element) => element.type)}
                              isLiked={post.isLiked}
                              handleLike={() =>
                                handleLike(post.isLiked, post.author.soconId, post.hash)
                              }
                              arrowClick={updateIndex}
                              index={postIndex}
                            />
                            {/* <ImageCarousel index={postIndex} arrowClick={updateIndex} images={post.images.map(element => element.url)} /> */}
                          </div>
                        )}
                      </>
                    )}
                    {
                      // post.isARepost ?
                      //     <></>
                      //     :
                      <>
                        <div className="images-actions-container-anislie">
                          <div className="images_actions_container_inner">
                            <div className="img-action-container">
                              <div className="img-action-icon-container">
                                <img
                                  onClick={(event) => {
                                    handleLike(post.isLiked, post.author.soconId, post.hash);
                                    event.stopPropagation();
                                  }}
                                  src={
                                    isDarkMode
                                      ? post.isLiked
                                        ? '/icon/redHeart.svg'
                                        : '/lightIcon/heartLight.svg'
                                      : post.isLiked
                                        ? '/icon/redHeart.svg'
                                        : '/darkIcon/heartDark.svg'
                                  }
                                  alt="like"
                                  className="img-action-icon"
                                />
                              </div>
                              <div
                                className="img-action-count-container"
                                onClick={(event) => {
                                  openLikeUser(post);
                                  event.stopPropagation();
                                }}
                              >
                                <p
                                  className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}
                                >
                                  {post.likes.count}
                                </p>
                              </div>
                            </div>
                            <div
                              className="img-action-container"
                              onClick={(event) => {
                                expandPostModal(post, postIndex);
                                event.stopPropagation();
                              }}
                            >
                              <div className="img-action-icon-container">
                                <img
                                  src={
                                    isDarkMode ? '/messageLight.svg' : '/darkIcon/messageDark.svg'
                                  }
                                  alt="comment"
                                  className="img-action-icon"
                                />
                              </div>

                              <div className="img-action-count-container">
                                <p
                                  className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}
                                >
                                  {post.comments.count}
                                </p>
                              </div>
                            </div>
                            {post ? (
                              <>
                                <div className="popoverBoxContainer" ref={repostRef}>
                                  <div
                                    className="img-action-container"
                                    onClick={(e) => togglePopover(e, postIndex)}
                                  >
                                    {/* isReposted means repost done by me or not, isARepost means post is a repost or not */}
                                    {
                                      <>
                                        <div className="img-action-icon-container">
                                          <img
                                            src={
                                              isDarkMode
                                                ? '/lightIcon/repostLight.svg'
                                                : '/darkIcon/repostDark.svg'
                                            }
                                            alt="repost"
                                            className="img-action-icon"
                                          />
                                        </div>
                                        {repostToggle[postIndex] && (
                                          <>
                                            <div
                                              className={
                                                isDarkMode ? 'popoverData' : 'd-popoverData'
                                              }
                                            >
                                              <div>
                                                <div
                                                  className={
                                                    isDarkMode ? 'repostBox' : 'd-repostBox'
                                                  }
                                                  onClick={(event) => {
                                                    handleRepostClick(post);
                                                    event.stopPropagation();
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      isDarkMode
                                                        ? '/lightIcon/repostLight.svg'
                                                        : '/darkIcon/repostDark.svg'
                                                    }
                                                    className="repostIcons"
                                                    alt="repost"
                                                  />
                                                  <p
                                                    className={
                                                      isDarkMode
                                                        ? 'popoverRepostText'
                                                        : 'd-popoverRepostText'
                                                    }
                                                  >
                                                    Repost
                                                  </p>
                                                </div>
                                                <div
                                                  className={
                                                    isDarkMode ? 'repostBox' : 'd-repostBox'
                                                  }
                                                  onClick={(event) => {
                                                    handleViewReposttClick(post);
                                                    event.stopPropagation();
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      isDarkMode
                                                        ? '/lightIcon/viewRepostLight.svg'
                                                        : '/darkIcon/viewRepostDark.svg'
                                                    }
                                                    className="repostIcons"
                                                    alt="repost"
                                                  />
                                                  <p
                                                    className={
                                                      isDarkMode
                                                        ? 'popoverRepostText'
                                                        : 'd-popoverRepostText'
                                                    }
                                                  >
                                                    View Repost
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    }
                                    <div className="img-action-count-container">
                                      <p
                                        className={
                                          isDarkMode ? 'img-action-count' : 'd-img-action-count'
                                        }
                                      >
                                        {post.reposts}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            <div
                              className="img-action-container"
                              onClick={(event) => {
                                handleShareClick(post);
                                event.stopPropagation();
                              }}
                            >
                              <div className="img-action-icon-container">
                                <img
                                  src={
                                    isDarkMode
                                      ? '/lightIcon/sendLight.svg'
                                      : '/darkIcon/sendDark.svg'
                                  }
                                  alt="share"
                                  className="img-action-icon"
                                />
                              </div>

                              <div className="img-action-count-container">
                                <p
                                  className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}
                                >
                                  {post.shares}
                                </p>
                              </div>
                            </div>

                            {post.isSaved ? (
                              <div className="save-img-action-container">
                                <div className="img-action-icon-container">
                                  <img
                                    src={savedIcon}
                                    alt="like"
                                    className="img-action-icon"
                                    onClick={(event) => {
                                      handleUnSavePost(post);
                                      event.stopPropagation();
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="save-img-action-container">
                                <div
                                  className="img-action-icon-container"
                                  onClick={(event) => {
                                    handleSaveClick(post);
                                    event.stopPropagation();
                                  }}
                                >
                                  <img
                                    src={
                                      isDarkMode
                                        ? '/lightIcon/saveLight.svg'
                                        : '/darkIcon/saveDark.svg'
                                    }
                                    alt="like"
                                    className="img-action-icon"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="post-action-by-friend-container">
                          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: "20px" }}>
                          <img alt='likeimage' src={post.isLikedUserImg[1]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        </div>
                      </div> */}

                          {/* <div className="post-action-like-friend-container">
                            {post.likes.count > 0 && (
                              <p
                                className={
                                  isDarkMode
                                    ? 'post-action-like-friend'
                                    : 'd-post-action-like-friend'
                                }
                              >
                                {post.likes.author && (
                                  <p
                                    className="postLiked"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      navigate(
                                        `/profile/${post.likes.author.username}/${post.likes.author.soconId}`
                                      );
                                    }}
                                  >
                                    Liked by {post.likes.author.username}
                                  </p>
                                )}
                                {post.likes.count - 1 > 0 && (
                                  <p
                                    className="postLiked"
                                    onClick={(event) => {
                                      openLikeUser(post);
                                      event.stopPropagation();
                                    }}
                                  >
                                    {' '}
                                    and {post.likes.count - 1} others
                                  </p>
                                )}
                              </p>
                            )}
                          </div> */}
                        </div>

                        {/* {post.comments.count != 0 && (
                          <div
                            onClick={(event) => {
                              expandPostModal(post, postIndex);
                              event.stopPropagation();
                            }}
                            className="view-comment-container"
                          >
                            <p className={isDarkMode ? 'view-comment' : 'd-view-comment'}>
                              {post.comments.count === 1
                                ? `View all ${post.comments.count} Comment`
                                : `View all ${post.comments.count} Comments`}
                            </p>
                          </div>
                        )} */}

                        {post.comments && post.comments.comment && (
                          <div className="latest-comment-container">
                            <div className="user-comment-photo-box">
                              <img
                                src={
                                  post.comments.comment.author.pfp
                                    ? post.comments.comment.author.pfp
                                    : defaultProfile
                                }
                                alt="img"
                                className="user-comment-photo"
                              />
                            </div>

                            <p className="comment-text">
                              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {post.comments.comment.author.display_name}
                              </span>{' '}
                              <strong>{post.comments.comment.text}</strong>
                            </p>
                          </div>
                        )}

                        {/* <div className='friend-comment-container'>
                      {post.comments.length > 0 && (
                        <div className='comment-item'>
                          <div className='commenter-profile-container'>
                            <img src={post.comments[0].img} alt='img' className='commenter-profile' />
                          </div>
                          <div className='commenter-name-container'>
                            <p className='commenter-name'>{post.comments[0].commentedBy}</p>
                          </div>
                          <div className='comment-text-container'>
                            <p className='comment-text'>{post.comments[0].comment}</p>
                          </div>
                        </div>
                      )}
                    </div> */}

                        <div
                          className="add-comment-input-container"
                          style={{ background: isDarkMode ? '#F2F2F2' : '#262330' }}
                        >
                          <div className="user-comment-photo-container">
                            {userProfile && (
                              <img
                                src={userProfile.pfp ? userProfile.pfp : defaultProfile}
                                alt="img"
                                className="user-comment-photo"
                              />
                            )}
                          </div>

                          <Popover
                            visible={currentIndexInLoop === postIndex && showPopover}
                            content={content}
                            trigger="click"
                            placement="bottomLeft"
                            destroyTooltipOnHide
                            overlayClassName="custom-popover"
                            arrow={false}
                          >
                            <input
                              onKeyDown={(event) => handleKeyDown(event, postIndex)}
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                              onChange={(e) => {
                                // setLocalComment(e.target.value)
                                handleCommentReplyChange(postIndex, e.target.value);
                                e.stopPropagation();
                              }}
                              value={commentReplies[postIndex] || ''}
                              type="text"
                              className={isDarkMode ? 'user-comment-box' : 'd-user-comment-box'}
                              placeholder="Add a comment..."
                            />
                          </Popover>

                          <div
                            onClick={(event) => {
                              addComment(post, postIndex);
                              event.stopPropagation();
                            }}
                            className="sendCommentIconContainer"
                            style={{ cursor: commentReplies[postIndex] ? 'pointer' : 'no-drop' }}
                          >
                            {commentReplies[postIndex] ? (
                              <img
                                src="/darkIcon/sendMsgDark.svg"
                                alt="send"
                                className="sendCommentIcon"
                              />
                            ) : (
                              <img
                                src={
                                  isDarkMode
                                    ? '/lightIcon/unsendLight.svg'
                                    : '/darkIcon/msgUnsendDark.svg'
                                }
                                alt="Send"
                                className="sendCommentIcon"
                              />
                            )}{' '}
                          </div>
                        </div>
                      </>
                    }
                  </div>
                ))}
              <SuggestedPeople />
              <SuggestedPosts
                isDiscover={false}
                isReposts={false}
                postByHashtag={true}
                isHashTag={false}
                myPost={false}
                myTimeline={true}
                hide={true}
              />
            </>
          )}
        </>
      }
      {firstLogin === 'true' && userProfile && (
        <ProfileSetup details={userProfile} closeSetup={() => setFirstLogin(false)} />
      )}
      {shareModalOpen && <Share />}
      {saveAddCollection && <AddCollection />}
      {saveModalOpen && <SavedPostModal />}
      {moreModalOpen && <More />}
      {userLikeListModal && <UserLike />}
      {repostModalOpen && <RepostModal />}
      {userRepostListModal && <UserRepost />}
    </div>
  );
};

export default Posts;
