import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../components/pages/userpost/Posts.css';
import { BASE_URL, BEARER_TOKEN, MYPOST, LIKE_UNLIKE_POST } from '../api/EndPoint';
import { getDate } from '../utils/time';
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
} from '../redux/slices/modalSlice';
import more from '../assets/icons/More.png';
import ImageCarousel from '../components/pages/userpost/ImageCarousel';
import UserLike from '../components/pages/userpost/UserLike';
import More from '../components/pages/userpost/More';
import like from '../assets/icons/like_heart.svg';
import unlike from '../assets/icons/unlike_heart.svg';
import msg from '../assets/icons/message-text.svg';
import share from '../assets/icons/send-2.svg';
import repost from '../assets/icons/repeat.svg';
import { Popover } from 'antd';
import save from '../assets/icons/Save.svg';
import viewRepost from '../assets/icons/viewRepost.svg';
import send from '../assets/icons/route-square.svg';
import axios from 'axios';
import { setComment } from '../redux/slices/postSlices';
import SavedPostModal from '../components/pages/userpost/userPostModals/SavedPostModal';
import AddCollection from '../components/pages/userpost/userPostModals/AddCollection';
import camera from '../assets/icons/camera_dark.svg';
import Share from '../components/pages/userpost/Share';
import repostedIcon from '../assets/icons/Frame 427321109.svg';
import { useNavigate, useParams } from 'react-router-dom';
import RepostModal from '../components/pages/userpost/userPostModals/RepostModal';
import UserRepost from '../components/pages/userpost/UserRepost';
import defaultProfile from '../assets/icons/Default_pfp.webp';
const SelfPost = ({ timeline }) => {
  const navigate = useNavigate();
  const { soconId } = useParams();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const repostModalOpen = useSelector((state) => state.modal.repostModalOpen);
  const moreModalOpen = useSelector((state) => state.modal.moreModalOpen);
  const saveModalOpen = useSelector((state) => state.modal.saveModalOpen);
  const userLikeListModal = useSelector((state) => state.modal.userLikeListModal);
  const saveAddCollection = useSelector((state) => state.modal.saveAddCollection);
  const [localComment, setLocalComment] = useState(null);
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const openCreatePostModalHandler = () => {
    dispatch(openCreatePostModal());
  };
  const userRepostListModal = useSelector((state) => state.modal.userRepostListModal);

  // const [timeline, setTimeline] = useState(null)
  // const getTimeline = async () => {
  //     try {
  //         const headers = {
  //             'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
  //             'Content-Type': 'application/json',
  //         };

  //         const response = await axios.get(`${BASE_URL}${MYPOST}${soconId}`, { headers });
  //         console.log(response.data)
  //         setTimeline(response.data.posts)
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  // const globalPostState = useSelector((state)=> state.loader.globalPostState)
  // useEffect(() => {
  //     getTimeline()
  // }, [useParams(), globalPostState])

  const handleMoreClick = (post) => {
    dispatch(openMoreModal());
    dispatch(setSelectedPost(post));
  };
  const [captionIndexMap, setCaptionIndexMap] = useState(new Map());
  const updateIndex = (index, setCaptionIndex) => {
    const captionTempMap = new Map(captionIndexMap);
    captionTempMap.set(index, setCaptionIndex);
    setCaptionIndexMap(captionTempMap);
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
      // setTimeline(timelineForLike)
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewReposttClick = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setViewRepost(true));
  };

  const handleRepostClick = (post) => {
    dispatch(openRepostModal());
    dispatch(setSelectedPost(post));
  };

  const expandPostModal = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setExpandPostModal(true));
    dispatch(setComment(localComment));
    dispatch(setOpponentProfile(false));
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };
  const handleShareClick = () => {
    dispatch(openShareModal());
  };
  const handleSaveClick = (post) => {
    dispatch(openSaveModal());
    dispatch(setSelectedPost(post));
  };
  const openLikeUser = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setUserLikeListModal(true));
  };
  return (
    <div style={{ background: isDarkMode ? '#FCFCFC' : '#110E18', minHeight: '100vh' }}>
      {(timeline === null || (timeline && timeline.length === 0)) && (
        // If timeline exists and its length is 0
        <div className="noPostContainer">
          <div className="noPostIconContainer">
            <img src={camera} alt="noPost" className="noPostIcon" />
          </div>
          <span className={isDarkMode ? 'noPostText' : 'd-noPostText'}>No Post Yet!</span>
          {/* <span className='noPostCreate' onClick={openCreatePostModalHandler}>Create Your First Post</span> */}
        </div>
      )}

      {timeline &&
        timeline.map((post, postIndex) => (
          <div key={postIndex} className={isDarkMode ? 'post-boxes' : 'd-post-boxes'}>
            <div className="post-header-container">
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
                <p className={isDarkMode ? 'post-id' : 'd-post-id'}>{'@' + post.author.username}</p>
              </div>

              {/* {post.isRepost && (
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

              <div className="more-container" onClick={() => handleMoreClick(post)}>
                <img src={more} className="more-icon" alt="more" />
              </div>
            </div>

            <div className="post-captions-container">
              <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                {post.type == 2
                  ? post.text
                  : post.images[captionIndexMap.get(postIndex) || 0].caption}
              </p>
            </div>

            {post.type !== 2 && (
              <div className="post-photo-containers">
                {/* {console.log(post.images)} */}
                <ImageCarousel
                  index={postIndex}
                  arrowClick={updateIndex}
                  images={post.images.map((element) => element.url)}
                  types={post.images.map((element) => element.type)}
                />
              </div>
            )}

            {/* {post.isRepost && (
        <div className='h'>
            <div className='post-captions-container'>
                <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>{post.title}</p>
            </div>

            <div className='post-header-container'>

                <div className='post-profile-container'>
                    <img src={post.profilePic} className='post-profile' alt='profile-pic' />
                </div>

                <div className='post-name-container'>
                    <p className='post-name'>{post.name}</p>
                </div>

                <div className='post-id-container'>
                    <p className='post-id'>{post.userName}</p>
                </div>

                {post.isRepost && (
                    <div className='isrepost-container'>
                        <div className='isrepost-logo-container'>
                            <img src={repost} alt="repost" className='isrepost-logo' />
                        </div>

                        <div className='isrepost-text-container'>
                            <p className='isrepost-text'>reposted</p>
                        </div>
                    </div>
                )}

                <div className='post-time-container'>
                    <p className='post-time'>{post.time}</p>
                </div>

                <div className='more-container'>
                    <img src={more} className='more-icon' alt='more' />
                </div>
            </div>
        </div>
    )} */}

            <div className="images-actions-container">
              <div className="img-action-container">
                <div className="img-action-icon-container">
                  <img
                    onClick={() => handleLike(post.isLiked, post.author.soconId, post.hash)}
                    src={post.isLiked ? like : unlike}
                    alt="like"
                    className="img-action-icon"
                  />
                </div>

                <div className="img-action-count-container" onClick={() => openLikeUser(post)}>
                  <p className="img-action-count">{post.likes.count}</p>
                </div>
              </div>

              <div className="img-action-container" onClick={() => expandPostModal(post)}>
                <div className="img-action-icon-container">
                  <img src={msg} alt="comment" className="img-action-icon" />
                </div>

                <div className="img-action-count-container">
                  <p className="img-action-count">{post.comments.count}</p>
                </div>
              </div>

              {post ? (
                <>
                  <div className="img-action-container">
                    {/* isReposted means repost done by me or not, isARepost means post is a repost or not */}
                    {post.isReposted && !post.isARepost ? ( // checks is it a original post
                      <Popover
                        placement="left"
                        arrow={false}
                        content={
                          <div className="repost-hover-container">
                            <div
                              className={
                                isDarkMode ? 'repostTetxsContainer' : 'd-repostTetxsContainer'
                              }
                            >
                              <img src={repost} className="repostIcons" alt="repost" />
                              <p className={isDarkMode ? 'repostTexts' : 'd-repostTetxts'}>
                                Repost
                              </p>
                            </div>
                            <div
                              className={
                                isDarkMode ? 'repostTetxsContainer' : 'd-repostTetxsContainer'
                              }
                            >
                              <img src={viewRepost} className="repostIcons" alt="Viewrepost" />
                              <p
                                onClick={() => handleViewReposttClick(post)}
                                className={isDarkMode ? 'repostTexts' : 'd-repostTetxts'}
                              >
                                View Repost
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <div className="img-action-icon-container">
                          <img src={repostedIcon} alt="repost" className="img-action-icon" />
                        </div>
                      </Popover>
                    ) : post.isARepost ? (
                      <div className="img-action-icon-container">
                        {/* need another img this already reposted post */}
                        <img src={repost} alt="repost" className="img-action-icon" />
                      </div>
                    ) : (
                      <Popover
                        placement="left"
                        arrow={false}
                        content={
                          <div className="repost-hover-container">
                            <div
                              className={
                                isDarkMode ? 'repostTetxsContainer' : 'd-repostTetxsContainer'
                              }
                            >
                              <img src={repost} className="repostIcons" alt="repost" />
                              <p
                                onClick={() => handleRepostClick(post)}
                                className={isDarkMode ? 'repostTexts' : 'd-repostTetxts'}
                              >
                                Repost
                              </p>
                            </div>
                            <div
                              className={
                                isDarkMode ? 'repostTetxsContainer' : 'd-repostTetxsContainer'
                              }
                            >
                              <img src={viewRepost} className="repostIcons" alt="Viewrepost" />
                              <p
                                onClick={() => handleViewReposttClick(post)}
                                className={isDarkMode ? 'repostTexts' : 'd-repostTetxts'}
                              >
                                View Repost
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <div className="img-action-icon-container">
                          <img src={repost} alt="repost" className="img-action-icon" />
                        </div>
                      </Popover>
                    )}
                    <div className="img-action-count-container">
                      <p className="img-action-count">{post.reposts}</p>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="img-action-container" onClick={handleShareClick}>
                <div className="img-action-icon-container">
                  <img src={share} alt="like" className="img-action-icon" />
                </div>

                <div className="img-action-count-container">
                  <p className="img-action-count">{post.shares}</p>
                </div>
              </div>

              <div className="save-img-action-container">
                <div className="img-action-icon-container" onClick={() => handleSaveClick(post)}>
                  <img src={save} alt="like" className="img-action-icon" />
                </div>
              </div>
            </div>

            <div className="post-action-by-friend-container">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* 
            <div style={{ width: "20px" }}>
                <img alt='likeimage' src={post.isLikedUserImg[1]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div> */}
              </div>

              <div className="post-action-like-friend-container">
                {post.likes.count != 0 && (
                  <p
                    className={isDarkMode ? 'post-action-like-friend' : 'd-post-action-like-friend'}
                  >
                    Liked by {post.author.username} and {post.likeCount} others
                  </p>
                )}
              </div>
            </div>

            {post.comments.count != 0 && (
              <div className="view-comment-container">
                <p className="view-comment">View all {post.comments.count} Comments</p>
              </div>
            )}

            <div className="friend-comment-container">
              {post.comments.length > 0 && (
                <div className="comment-item">
                  <div className="commenter-profile-container">
                    <img src={post.comments[0].img} alt="img" className="commenter-profile" />
                  </div>
                  <div className="commenter-name-container">
                    <p className="commenter-name">{post.comments[0].commentedBy}</p>
                  </div>
                  <div className="comment-text-container">
                    <p className="comment-text">{post.comments[0].comment}</p>
                  </div>
                </div>
              )}
            </div>

            <div
              className="add-comment-input-container"
              style={{ background: isDarkMode ? '#F2F2F2' : '#262330' }}
            >
              <div className="user-comment-photo-container">
                <img
                  src={post.author.pfp ? post.author.pfp : defaultProfile}
                  alt="img"
                  className="user-comment-photo"
                />
              </div>

              <input
                onChange={(e) => setLocalComment(e.target.value)}
                type="text"
                className="user-comment-box"
                placeholder="Add a comment..."
                style={{ background: isDarkMode ? '#F2F2F2' : '#262330' }}
              />

              <div onClick={() => expandPostModal(post)} className="ec-sendContainer">
                <img src={send} alt="img" className="ec-send" />
              </div>
            </div>
          </div>
        ))}
      {saveAddCollection && <AddCollection />}
      {saveModalOpen && <SavedPostModal />}
      {moreModalOpen && <More soconId={soconId} />}
      {userLikeListModal && <UserLike />}
      {shareModalOpen && <Share />}
      {repostModalOpen && <RepostModal />}
      {userRepostListModal && <UserRepost />}
    </div>
  );
};

export default SelfPost;
