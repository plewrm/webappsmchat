import React, { useEffect, useRef, useState } from 'react';
import more from '../../../assets/icons/More.png';
import './Posts.css';
import ImageCarousel from './ImageCarousel';
import repost from '../../../assets/icons/repeat.svg';
import { useDispatch, useSelector } from 'react-redux';
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
  setViewRepost
} from '../../../redux/slices/modalSlice';
import Share from './Share';
import More from './More';
import SavedPostModal from './userPostModals/SavedPostModal';
import { useTheme } from '../../../context/ThemeContext';
import UserLike from './UserLike';
import './PostContainer.css';
import RepostModal from './userPostModals/RepostModal';
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
  HASHTAGPOSTS
} from '../../../api/EndPoint';
import { getDate } from '../../../utils/time';
import axios from 'axios';
import AddCollection from './userPostModals/AddCollection';
import { setComment } from '../../../redux/slices/postSlices';
import camera from '../../../assets/icons/camera_dark.svg';
import UserRepost from './UserRepost';
import { useNavigate } from 'react-router';
import ProfileSetup from '../../../modals/ProfileSetup';
import { Progress } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import defaultProfile from '../../../assets/icons/Default_pfp.webp';
const DiscoverTimeLinesPosts = ({
  isDiscover = false,
  isReposts = false,
  postByHashtag,
  isHashTag = false,
  dataItems,
  postClicked
}) => {
  // console.log(isHashTag)
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [firstLogin, setFirstLogin] = useState(localStorage.getItem('firstLogin'));
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const repostModalOpen = useSelector((state) => state.modal.repostModalOpen);
  const moreModalOpen = useSelector((state) => state.modal.moreModalOpen);
  const saveModalOpen = useSelector((state) => state.modal.saveModalOpen);
  const userLikeListModal = useSelector((state) => state.modal.userLikeListModal);
  const userRepostListModal = useSelector((state) => state.modal.userRepostListModal);
  const saveAddCollection = useSelector((state) => state.modal.saveAddCollection);
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const openCreatePostModalHandler = () => {
    dispatch(openCreatePostModal());
  };
  const navigate = useNavigate();
  const [change, setChange] = useState(false);
  const postLoader = useSelector((state) => state.loader.postLoader);
  const globalPostState = useSelector((state) => state.loader.globalPostState);
  const [isVisible, setIsVisible] = useState(false);
  const postRef = useRef(null);
  const repostRef = useRef(null);
  const [repostToggle, setRepostToggle] = useState([]);

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
  const handleRepostClick = (post) => {
    dispatch(openRepostModal());
    dispatch(setSelectedPost(post));
  };

  const handleMoreClick = (post) => {
    dispatch(openMoreModal());
    dispatch(setSelectedPost(post));
  };

  const handleSaveClick = (post) => {
    dispatch(openSaveModal());
    dispatch(setSelectedPost(post));
  };

  const openLikeUser = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setUserLikeListModal(true));
  };

  const expandPostModal = (post, index) => {
    dispatch(setSelectedPost(post));
    dispatch(setExpandPostModal(true));
    dispatch(setComment(commentReplies[index]));
    dispatch(setOpponentProfile(false));
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };

  const handleViewReposttClick = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setViewRepost(true));
    navigate('/repost');
  };

  const [viewProfile, setViewProfile] = useState(false);
  const [repostProfile, setrepostProfile] = useState(false);

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

  const [timeline, setTimeline] = useState(dataItems);
  const [userProfile, setUserProfile] = useState(null);
  // const [localComment, setLocalComment] = useState("");
  const [commentReplies, setCommentReplies] = useState([]);
  const handleCommentReplyChange = (index, value) => {
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
        likes: { count: timelineForLike[indexToUpdate].likes.count + (isLiked ? -1 : 1) } // Replace 'yourFieldName' with the actual field name you want to update
      };
      setTimeline(timelineForLike);
    } catch (error) {
      console.error(error);
    }
  };

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
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMyProfile();
  }, [change, globalPostState, postByHashtag]);
  const [captionIndexMap, setCaptionIndexMap] = useState(new Map());
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
  const [percent, setPercent] = useState(0);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (postRef.current) {
        console.log('scrollView', postRef.current.getBoundingClientRect());
        postRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500); // Increase timeout if necessary
    return () => clearTimeout(timer);
  }, [postClicked]);

  const outerPost = (post, index) => {
    getPostByHash(post.hash, post.author.soconId);
    dispatch(setExpandPostModal(true));
    dispatch(setComment(commentReplies[index]));
    dispatch(setOpponentProfile(false));
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };

  const innerPost = (post, index) => {
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
  return (
    <div className="upload-post-container">
      <>
        {dataItems && dataItems.length === 0 && (
          <div className="noPostContainer">
            <div className="noPostIconContainer">
              <img src={camera} alt="noPost" className="noPostIcon" />
            </div>
            <span className={isDarkMode ? 'noPostText' : 'd-noPostText'}>No Post Yet!</span>
            <span className="noPostCreate" onClick={openCreatePostModalHandler}>
              Create Your First Post
            </span>
          </div>
        )}
      </>
      {
        <>
          {postLoader && (
            <div className="loaderContainer">
              <div className="innerLoaderContainer">
                <span>Posting</span>
                <Progress
                  percent={percent}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068'
                  }}
                  showInfo={false}
                />
              </div>
            </div>
          )}
          {dataItems &&
            dataItems.map((post, postIndex) => (
              <div
                onClick={() => outerPost(post, postIndex)}
                key={postIndex}
                className={isDarkMode ? 'post-boxes' : 'd-post-boxes'}
              >
                {post.isARepost ? (
                  <div ref={post.hash == postClicked ? postRef : null}>
                    <div className="post-header-container" style={{ overflow: 'auto' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={(event) => {
                          goToRepostProfile(post);
                          event.stopPropagation();
                        }}
                      >
                        <div className="post-profile-container">
                          <img
                            src={post.author.pfp ? post.author.pfp : defaultProfile}
                            className="post-profile"
                            alt="profile-pic"
                          />
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
                          <img src={repost} alt="repost" className="isrepost-logo" />
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
                        <img src={more} className="more-icon" alt="more" />
                      </div>
                    </div>
                    {post.isARepost && (
                      <div className="post-captions-container">
                        <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                          {post.text}
                        </p>
                      </div>
                    )}
                    {post.parentPost ? (
                      <div
                        onClick={(event) => {
                          innerPost(post.parentPost, postIndex);
                          event.stopPropagation();
                        }}
                        className="original-post-container"
                      >
                        <div className="post-header-container">
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={(event) => {
                              goToProfile(post);
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
                          <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                            {post.parentPost.type === 2
                              ? post.parentPost.text
                              : post.parentPost.images[captionIndexMap.get(postIndex) || 0].caption}
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
                      <div className="original-post-container">
                        <div className="post-header-container">
                          <div>
                            <p style={{ color: '#FCFCFC' }}>
                              <LockOutlined /> This content isn't available at the moment
                            </p>
                            <p style={{ color: '#FCFCFC', fontSize: '0.753rem' }}>
                              When this happens, it's usually because the owner only shared it with
                              a small group of people, changed who can see it, or it's been deleted.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div ref={post.hash == postClicked ? postRef : null}>
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
                            <img
                              src={post.author.pfp ? post.author.pfp : defaultProfile}
                              className="post-profile"
                              alt="profile-pic"
                            />
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

                      {/* {post.isARepost && (
                                    <div className='isrepost-container'>
                                        <div className='isrepost-logo-container' >
                                            <img src={repost} alt="repost" className='isrepost-logo' />
                                        </div>

                                        <div className='isrepost-text-container'>
                                            <p className='isrepost-text'>reposted</p>
                                        </div>
                                    </div>
                                )} */}

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
                            isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'
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
                      <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                        {post.type === 2
                          ? post.text
                          : post.images[captionIndexMap.get(postIndex) || 0].caption}
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
                  </div>
                )}
                {
                  // post.isARepost ?
                  //     <></>
                  //     :
                  <div ref={post.hash == postClicked ? postRef : null}>
                    <div className="images-actions-container">
                      <div className="img-action-container">
                        <div className="img-action-icon-container">
                          <img
                            onClick={(event) => {
                              handleLike(post.isLiked, post.author.soconId, post.hash);
                              event.stopPropagation();
                            }}
                            //  src={post.isLiked ? like : unlike}
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
                          <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
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
                            src={isDarkMode ? '/messageLight.svg' : '/darkIcon/messageDark.svg'}
                            alt="comment"
                            className="img-action-icon"
                          />
                        </div>

                        <div className="img-action-count-container">
                          <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                            {post.comments.count}
                          </p>
                        </div>
                      </div>
                      {post ? (
                        <>
                          <div className="img-action-container">
                            {/* isReposted means repost done by me or not, isARepost means post is a repost or not */}
                            {
                              // post.isReposted && !post.isARepost ?                  // checks is it a original post
                              //     <Popover
                              //         placement='left'
                              //         arrow={false}
                              //         content={
                              //             <div className='repost-hover-container'>
                              //                 <div className={isDarkMode ? 'repostTetxsContainer' : 'd-repostTetxsContainer'}>
                              //                     <img src={repost} className='repostIcons' alt='repost' />
                              //                     <p className={isDarkMode ? 'repostTexts' : 'd-repostTetxts'}>Repost</p>
                              //                 </div>
                              //                 <div className={isDarkMode ? 'repostTetxsContainer' : 'd-repostTetxsContainer'}>
                              //                     <img src={viewRepost} className='repostIcons' alt='Viewrepost' />
                              //                     <p onClick={() => handleViewReposttClick(post)} className={isDarkMode ? 'repostTexts' : 'd-repostTetxts'}>View Repost</p>
                              //                 </div>
                              //             </div>}>
                              //         <div className='img-action-icon-container'>
                              //             <img src={repostedIcon} alt='repost' className='img-action-icon' />
                              //         </div>
                              //     </Popover>
                              //     :
                              // post.isARepost ?
                              //     <div className='img-action-icon-container'>
                              //         {/* need another img this already reposted post */}
                              //         <img src={repost} alt='repost' className='img-action-icon' />
                              //     </div>
                              //     :
                              <div className="popoverBoxContainer" ref={repostRef}>
                                <div
                                  className="img-action-icon-container"
                                  onClick={(e) => togglePopover(e, postIndex)}
                                >
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
                                    <div className={isDarkMode ? 'popoverData' : 'd-popoverData'}>
                                      <div>
                                        <div
                                          className={isDarkMode ? 'repostBox' : 'd-repostBox'}
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
                                          className={isDarkMode ? 'repostBox' : 'd-repostBox'}
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
                              </div>
                            }
                            <div className="img-action-count-container">
                              <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                                {post.reposts}
                              </p>
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
                            src={isDarkMode ? '/lightIcon/sendLight.svg' : '/darkIcon/sendDark.svg'}
                            alt="like"
                            className="img-action-icon"
                          />
                        </div>

                        <div className="img-action-count-container">
                          <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                            {post.shares}
                          </p>
                        </div>
                      </div>

                      <div className="save-img-action-container">
                        <div
                          className="img-action-icon-container"
                          onClick={(event) => {
                            handleSaveClick(post);
                            event.stopPropagation();
                          }}
                        >
                          <img
                            src={isDarkMode ? '/lightIcon/saveLight.svg' : '/darkIcon/saveDark.svg'}
                            alt="like"
                            className="img-action-icon"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="post-action-by-friend-container">
                      {/* <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: "20px" }}>
        <img alt='likeimage' src={post.isLikedUserImg[1]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    </div>
</div> */}

                      <div className="post-action-like-friend-container">
                        {post.likes.count != 0 && (
                          <p
                            className={
                              isDarkMode ? 'post-action-like-friend' : 'd-post-action-like-friend'
                            }
                          >
                            Liked by {post.author.username} and {post.likeCount} others
                          </p>
                        )}
                      </div>
                    </div>

                    {post.comments.count != 0 && (
                      <div
                        onClick={(event) => {
                          expandPostModal(post, postIndex);
                          event.stopPropagation();
                        }}
                        className="view-comment-container"
                      >
                        <p className="view-comment">View all {post.comments.count} Comments</p>
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

                      <input
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
                        style={{ background: isDarkMode ? '#F2F2F2' : '#262330' }}
                      />

                      <div
                        onClick={(event) => {
                          addComment(post, postIndex);
                          event.stopPropagation();
                        }}
                        className="sendCommentIconContainer"
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
                  </div>
                }
              </div>
            ))}
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

export default DiscoverTimeLinesPosts;
