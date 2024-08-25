import React, { useEffect, useState } from 'react';
import styles from './SavePosts.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultProfile from '../../../../assets/icons/Default_pfp.webp';
import { Popover } from 'antd';
import savedIcon from '../../../../assets/icons/isSavedTrue.svg';
import ImageCarousel from '../ImageCarousel';
import { BASE_URL, BEARER_TOKEN, FETCHALLPOST } from '../../../../api/EndPoint';
import axios from 'axios';
import { getDate } from '../../../../utils/time';
import { LockOutlined } from '@ant-design/icons';
import {
  openShareModal,
  setSelectedPost,
  setUnSavePosts
} from '../../../../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Share from '../Share';
import AddCollection from '../userPostModals/AddCollection';
import SavedPostModal from '../userPostModals/SavedPostModal';
import More from '../More';
import UserLike from '../UserLike';
import RepostModal from '../userPostModals/RepostModal';
import UserRepost from '../UserRepost';

const SavePosts = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const { collectionName } = location.state;
  const [collectionData, setCollectionData] = useState(null);
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const saveAddCollection = useSelector((state) => state.modal.saveAddCollection);
  const saveModalOpen = useSelector((state) => state.modal.saveModalOpen);
  const moreModalOpen = useSelector((state) => state.modal.moreModalOpen);
  const userLikeListModal = useSelector((state) => state.modal.userLikeListModal);
  const repostModalOpen = useSelector((state) => state.modal.repostModalOpen);
  const userRepostListModal = useSelector((state) => state.modal.userRepostListModal);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        };

        const url = `${BASE_URL}${FETCHALLPOST.replace(':collectionName', collectionName)}`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          const data = response.data;
          console.log('data', data);
          setCollectionData(data.data.collection);
          setPosts(data.data.collection.posts);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [collectionName]);

  const [captionIndexMap, setCaptionIndexMap] = useState(new Map());

  const handleUnSavePost = (post) => {
    dispatch(setUnSavePosts(true));
    dispatch(setSelectedPost(post));
  };

  const handleShareClick = (post) => {
    dispatch(openShareModal());
    dispatch(setSelectedPost(post));
  };
  return (
    <div className={isDarkMode ? styles.savedContainer : styles['d-savedContainer']}>
      <div className={styles.header} style={{ padding: '20px 20px 0px 20px' }}>
        <div className={styles.headerLeft}>
          <div className={styles.iconContainer_arrow} onClick={() => navigate(-1)}>
            <img
              src={isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'}
              className={styles.icon}
            />
          </div>
          <div className={styles.headerLeftInner}>
            <div className={styles.headerTittleContainer}>
              <p className={isDarkMode ? styles.tittle : styles['d-tittle']}>
                {collectionData?.name} ({posts.length})
              </p>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={`${styles.popoverContainer}`}>
            <div className={styles.iconContainer_add}>
              <img
                src={isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'}
                className={styles.icon}
              />
            </div>
          </div>
        </div>
      </div>

      {posts?.map((post, postIndex) => (
        <div key={postIndex} className={isDarkMode ? 'post-boxes' : 'd-post-boxes'}>
          {post.isARepost ? (
            <>
              <div className="post-header-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    <img
                      src={isDarkMode ? '/lightIcon/repostLight.svg' : '/darkIcon/repostDark.svg'}
                      alt="repost"
                      className="isrepost-logo"
                    />
                  </div>

                  <div className="isrepost-text-container">
                    <p className={isDarkMode ? 'isrepost-text' : 'd-isrepost-text'}>reposted</p>
                  </div>
                </div>

                <div className="post-time-container">
                  <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                    {getDate(post.createdAt)}
                  </p>
                </div>

                <div className="more-container">
                  <img
                    src={isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'}
                    className="more-icon"
                    alt="more"
                  />
                </div>
              </div>
              {post.isARepost && (
                <div className="post-captions-container">
                  <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                    {/* {HighlightHashtags(post.text)} */}
                  </p>
                </div>
              )}
              {post.parentPost ? (
                <div
                  className={isDarkMode ? 'original-post-container' : 'd-original-post-container'}
                >
                  <div className="post-header-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="post-profile-container">
                        <img
                          src={
                            post.parentPost.author.pfp ? post.parentPost.author.pfp : defaultProfile
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
                      {/* {post.parentPost.type === 2
                                  ? HighlightHashtags(post.parentPost.text)
                                  : HighlightHashtags(
                                    post.parentPost.images[captionIndexMap.get(postIndex) || 0]
                                      .caption
                                  )} */}
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
                        // arrowClick={updateIndex}
                        // index={postIndex}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={isDarkMode ? 'original-post-container' : 'd-original-post-container'}
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
                          When this happens, it's usually because the owner only shared it with a
                          small group of people, changed who can see it, or it's been deleted.
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

                <div className="post-time-container">
                  <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                    {getDate(post.createdAt)}
                  </p>
                </div>

                {/* <div key={postIndex} className="user-like-buttons">
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
                          </div> */}

                <div className="more-container">
                  <img
                    src={isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'}
                    className="more-icon"
                    alt="more"
                  />
                </div>
              </div>
              <div className="post-captions-container">
                <p
                  style={{ whiteSpace: 'pre-line' }}
                  className={isDarkMode ? 'post-captions' : 'd-post-captions'}
                >
                  {/* {post.type === 2
                              ? HighlightHashtags(post.text)
                              : HighlightHashtags(
                                post.images[captionIndexMap.get(postIndex) || 0].caption
                              )} */}
                </p>
              </div>
              {post.type !== 2 && (
                <div className="post-photo-containers">
                  {/* {console.log(post.images)} */}
                  <ImageCarousel
                    images={post.images.map((element) => element.url)}
                    types={post.images.map((element) => element.type)}
                    isLiked={post.isLiked}
                    handleLike={() => handleLike(post.isLiked, post.author.soconId, post.hash)}
                    // arrowClick={updateIndex}
                    // index={postIndex}
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
              <div className="images-actions-container">
                <div className="img-action-container">
                  <div className="img-action-icon-container">
                    <img
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
                  <div className="img-action-count-container">
                    <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                      {post.likes.count}
                    </p>
                  </div>
                </div>
                <div className="img-action-container">
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
                    <div className="popoverBoxContainer">
                      <div
                        className="img-action-container"
                        // onClick={(e) => togglePopover(e, postIndex)}
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
                            {/* {repostToggle[postIndex] && (
                                        <>
                                          <div
                                            className={isDarkMode ? 'popoverData' : 'd-popoverData'}
                                          >
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
                                      )} */}
                          </>
                        }
                        <div className="img-action-count-container">
                          <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
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
                      src={isDarkMode ? '/lightIcon/sendLight.svg' : '/darkIcon/sendDark.svg'}
                      alt="share"
                      className="img-action-icon"
                    />
                  </div>

                  <div className="img-action-count-container">
                    <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
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
                    <div className="img-action-icon-container">
                      <img
                        src={isDarkMode ? '/lightIcon/saveLight.svg' : '/darkIcon/saveDark.svg'}
                        alt="like"
                        className="img-action-icon"
                      />
                    </div>
                  </div>
                )}
              </div>

              {post.comments.count != 0 && (
                <div className="view-comment-container">
                  <p className={isDarkMode ? 'view-comment' : 'd-view-comment'}>
                    {post.comments.count === 1
                      ? `View all ${post.comments.count} Comment`
                      : `View all ${post.comments.count} Comments`}
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

              {/* <div
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
                        </div> */}
            </>
          }
        </div>
      ))}
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

export default SavePosts;
