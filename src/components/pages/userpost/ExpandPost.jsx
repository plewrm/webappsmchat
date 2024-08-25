import React, { useState, useEffect, useRef } from 'react';
import './PostModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { setExpandPostModal } from '../../../redux/slices/modalSlice';
import {
  openMoreModal,
  openRepostModal,
  openShareModal,
  openSaveModal,
  setUserLikeListModal,
  setSelectedPost,
  setGlobalSearchScreen,
  setHashtag,
  setViewRepost,
  setScrollPosition
} from '../../../redux/slices/modalSlice';
import { useTheme } from '../../../context/ThemeContext';
import ImageCarousel from './ImageCarousel';
import Share from './Share';
import Repost from './Repost';
import More from './More';
import SavedPostModal from './userPostModals/SavedPostModal';
import UserLike from './UserLike';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETALLPOSTCOMMENTS,
  ADDCOMMENT,
  GETUSERPROFILE,
  LIKE_UNLIKE_POST,
  DELETECOMMENT,
  retrievedSoconId,
  GETPOSTBYHASH,
  LIKECOMMENT,
  FOLLOWING,
  SEARCHUSER
} from '../../../api/EndPoint';
import axios from 'axios';
import { getDate } from '../../../utils/time';
import { Popover } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

//import icons
import savedIcon from '../../../assets/icons/isSavedTrue.svg';
import defaultProfile from '../../../assets/icons/Default_pfp.webp';
import close from '../../../assets/icons/modal-close.svg';
import deletes from '../../../assets/icons/trash.svg';

const ExpandPost = () => {
  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const repostRef = useRef(null);
  const { isDarkMode } = useTheme();
  const { hash, soconId } = useParams();

  //selectors
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const repostModalOpen = useSelector((state) => state.modal.repostModalOpen);
  const moreModalOpen = useSelector((state) => state.modal.moreModalOpen);
  const saveModalOpen = useSelector((state) => state.modal.saveModalOpen);
  const userLikeListModal = useSelector((state) => state.modal.userLikeListModal);
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const localComment = useSelector((state) => state.posts.comment);

  //state variables
  const [change, setChange] = useState(false);
  const [mentionData, setMetionData] = useState(null);
  const [commentReplies, setCommentReplies] = useState([]);
  const [showGlobalMentions, setShowGlobalMentions] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showreplyInput, setShowReplyInput] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyBoxes, setReplyBoxes] = useState({});
  const [viewReplyBoxes, setViewReplyBoxes] = useState({});
  const [repliedComments, setRepliedComments] = useState({});
  const [viewingReplies, setViewingReplies] = useState(false);
  const [timeLineComment, setTimeLineComment] = useState(localComment != null ? localComment : '');
  const [comments, setComments] = useState([]);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [repostToggle, setRepostToggle] = useState(false);
  const scrollPosition = useSelector((state) => state.modal.scrollPosition);

  const openReplyInput = () => {
    setShowReplyInput(true);
  };
  const closeReplyInput = () => {
    setShowReplyInput(false);
  };

  //handlers
  const handleCommentReplyChange = (index, value) => {
    const newCommentReplies = [...commentReplies];
    newCommentReplies[index] = value;
    setCommentReplies(newCommentReplies);
  };

  const handleKeyDown = (event, postIndex) => {
    if (event.key === 'Enter') {
      addComment(timeline[postIndex], postIndex);
      event.preventDefault(); // Prevents the default behavior of the Enter key (e.g., new line in textarea)
    }
  };

  const togglePopover = (event) => {
    event.stopPropagation();
    setRepostToggle(!repostToggle);
    console.log('Show toggle resp', repostToggle);
  };

  const closePopover = () => {
    setRepostToggle(false);
  };

  const handleViewReposttClick = (selectedPost) => {
    dispatch(setSelectedPost(selectedPost));
    dispatch(setViewRepost(true));
    navigate('/repost');
  };

  const updateIndex = (index, captionIndex) => {
    setCaptionIndex(captionIndex);
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

  const toggleReplyBox = (index) => {
    setReplyBoxes((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const handleInputChange = (e) => {
    setTimeLineComment(e.target.value);

    const lastAtIndex = e.target.value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      setShowGlobalMentions(e.target.value.slice(lastAtIndex + 1).split(' ')[0]);
    }

    const { value } = e.target;
    const atIndex = value.lastIndexOf('@');
    const spaceIndex = value.lastIndexOf(' ');
    if (atIndex > spaceIndex) {
      setShowPopover(true);
    } else {
      setShowPopover(false);
    }

    setIsTyping(e.target.value.trim().length > 0);

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment(selectedPost.author.soconId, selectedPost.hash); // Call addComment function
    }
  };

  const handleInputBlur = () => {
    // setShowPopover(false);
  };

  const handleCloseModal = () => {
    dispatch(setExpandPostModal(false));
    navigate(-1);
  };

  const handleShareClick = () => {
    dispatch(openShareModal());
  };

  const handleRepostClick = (selectedPost) => {
    dispatch(openRepostModal());
    dispatch(setSelectedPost(selectedPost));
    closePopover(); // Close the popover after repost click
  };

  const handleMoreClick = () => {
    dispatch(openMoreModal());
  };

  const openLikeUser = (post) => {
    dispatch(setSelectedPost(post));
    dispatch(setUserLikeListModal(true));
  };

  const getSelectedPostComments = async (hash, soconId) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const authorSoconId = soconId ? soconId : selectedPost.author.soconId;
      const postHash = hash ? hash : selectedPost.hash;

      const response = await axios.get(
        `${BASE_URL}${GETALLPOSTCOMMENTS}${authorSoconId}/${postHash}`,
        { headers }
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error(error);
    }
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
      await getSelectedPostComments(hash, soconId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedPost === null) {
      getPostByHash(hash, soconId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (repostRef.current && !repostRef.current.contains(event.target)) {
        // Click occurred outside of the modal, close it
        setRepostToggle(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const initialViewReplyBoxes = {};
    comments.forEach((comment, index) => {
      initialViewReplyBoxes[index] = false;
    });
    setViewReplyBoxes(initialViewReplyBoxes);
  }, [comments]);

  useEffect(() => {
    getMyProfile();
    getSelectedPostComments();
    fetchAllMentions();
  }, [useParams(), change]);

  useEffect(() => {
    const fetchGLobalUsers = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        };
        const response = await axios.get(
          `${BASE_URL}${SEARCHUSER}${showGlobalMentions}?page=1&pageSize=2`,
          { headers }
        );
        setMetionData(response.data.users);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGLobalUsers();
  }, [showGlobalMentions]);

  const toggleViewReplyBox = async (index, soconId, hash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETALLPOSTCOMMENTS}${soconId}/${hash}`, {
        headers: headers
      });
      const comments = response.data.comments;

      // Update the replied comments for the specific index
      setRepliedComments((prevState) => ({
        ...prevState,
        [index]: comments
      }));

      setViewingReplies(!viewingReplies); // Toggle viewing replies
    } catch (error) {
      console.error(error);
    }

    // Toggle the specific reply box identified by the index
    setViewReplyBoxes((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
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

      const updatedPost = {
        ...selectedPost,
        isLiked: !isLiked,
        ...selectedPost.comments,
        likes: {
          count: selectedPost.likes.count + (isLiked ? -1 : 1) // Replace 'yourFieldName' with the actual field name you want to update
        }
      };
      setChange(!change);
      dispatch(setSelectedPost(updatedPost));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveClick = () => {
    dispatch(openSaveModal());
  };

  //apis
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

  const addComment = async (authorId, postHash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // console.log(timeLineComment)
      const response = await axios.post(
        `${BASE_URL}${GETALLPOSTCOMMENTS}${authorId}/${postHash}`,
        { commentText: timeLineComment },
        { headers: headers }
      );
      getSelectedPostComments();
      const updatedPost = {
        ...selectedPost,
        comments: {
          ...selectedPost.comments,
          count: selectedPost.comments.count + 1
          // count: comments.length
        }
      };
      dispatch(setSelectedPost(updatedPost));
      setChange(!change);
      setTimeLineComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (hash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.delete(`${BASE_URL}${DELETECOMMENT}${hash}`, { headers });
      setChange(!change);
    } catch (error) {
      console.error(error);
    }
  };

  const likeComment = async (hash, soconId) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.put(
        `${BASE_URL}${LIKECOMMENT}${soconId}/${hash}`,
        {},
        { headers }
      );
      setChange(!change);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const unLikeComment = async (hash, soconId) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.delete(`${BASE_URL}${LIKECOMMENT}${soconId}/${hash}`, {
        headers
      });
      setChange(!change);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const replyToParentComment = async (authorId, commentHash, index) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${ADDCOMMENT}${authorId}/${commentHash}`,
        { commentText: commentReplies[index] },
        { headers: headers }
      );
      console.log('sub comment response', response.data);
      setChange(!change);
      setCommentReplies([]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllMentions = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // need to change later
      const response = await axios.get(
        `${BASE_URL}${FOLLOWING}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      // console.log(response.data.following)
      setMetionData(response.data.following.users);
    } catch (error) {
      console.error(error);
    }
  };

  const selectMention = (mentionName) => {
    const lastIndex = timeLineComment.lastIndexOf('@');
    if (lastIndex !== -1) {
      const updatedComment = `${timeLineComment.substring(0, lastIndex)}@${mentionName}`;
      setTimeLineComment(updatedComment);
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
            <div onClick={() => selectMention(item.username)} className="mentionColumn">
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

  const innerPost = (post) => {
    getPostByHash(post.hash, post.author.soconId);
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
  };

  const goToProfile = (soconId, username) => {
    navigate(`/profile/${username}/${soconId}`, { state: { soconId: soconId } });
    dispatch(setScrollPosition(0));
  };

  return (
    <div
      className={isDarkMode ? 'comments-outer-container' : 'd-comments-outer-container'}
      style={{ width: '100%', minHeight: '95vh', paddingBottom: '2vh' }}
    >
      {selectedPost && (
        <div>
          <div className={isDarkMode ? 'post-boxes' : 'd-post-boxes'} style={{ border: 'none' }}>
            <div className="post-header-container">
              <div className="close-comment-modal-container" onClick={handleCloseModal}>
                <img
                  src={isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'}
                  alt="back"
                  className="close-comment-modal"
                />
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() =>
                  goToProfile(selectedPost.author.soconId, selectedPost.author.username)
                }
              >
                <div className="post-profile-container">
                  <img
                    src={selectedPost.author.pfp ? selectedPost.author.pfp : defaultProfile}
                    className="post-profile"
                    alt="profile-pic"
                  />
                </div>

                <div className="post-name-container">
                  <p className={isDarkMode ? 'post-name' : 'd-post-name'}>
                    {selectedPost.author.display_name}
                  </p>
                </div>

                <div className="post-id-container">
                  <p className={isDarkMode ? 'post-id' : 'd-post-id'}>
                    {selectedPost.author.username}
                  </p>
                </div>
              </div>

              {selectedPost.isARepost && (
                <div className="isrepost-container">
                  <div className="isrepost-logo-container">
                    <img
                      src={isDarkMode ? '/lightIcon/repostLight.svg' : '/darkIcon/repostDark.svg'}
                      alt="repost"
                      className="isrepost-logo"
                    />
                  </div>

                  <div className="isrepost-text-container">
                    <p
                      className="isrepost-text"
                      style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                    >
                      reposted
                    </p>
                  </div>
                </div>
              )}

              <div className="post-time-container">
                <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                  {getDate(selectedPost.createdAt)}
                </p>
              </div>

              <div className="more-container" onClick={handleMoreClick}>
                <img
                  src={isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'}
                  className="more-icon"
                  alt="more"
                />
              </div>
            </div>
            {selectedPost.isARepost && (
              <div className="post-captions-container">
                <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                  {selectedPost.text}
                </p>
              </div>
            )}
            {selectedPost.isARepost ? (
              <>
                {selectedPost.parentPost ? (
                  <div
                    onClick={() => innerPost(selectedPost.parentPost)}
                    className={isDarkMode ? 'original-post-container' : 'd-original-post-container'}
                  >
                    <div className="post-header-container">
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={(event) => {
                          goToProfile(
                            selectedPost.parentPost.author.soconId,
                            selectedPost.parentPost.author.username
                          );
                          event.stopPropagation();
                        }}
                      >
                        <div className="post-profile-container">
                          <img
                            src={selectedPost.parentPost.author.pfp}
                            className="post-profile"
                            alt="profile-pic"
                          />
                        </div>
                        <div className="post-name-container">
                          <p className={isDarkMode ? 'post-name' : 'd-post-name'}>
                            {selectedPost.parentPost.author.display_name}
                          </p>
                        </div>

                        <div className="post-id-container">
                          <p className={isDarkMode ? 'post-id' : 'd-post-id'}>
                            {'@' + selectedPost.parentPost.author.username}
                          </p>
                        </div>
                      </div>

                      <div className="post-time-container">
                        <p className={isDarkMode ? 'post-time' : 'd-post-time'}>
                          {getDate(selectedPost.parentPost.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="post-captions-container">
                      <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>
                        {selectedPost.parentPost.type == 2
                          ? selectedPost.parentPost.text
                          : selectedPost.parentPost.images[captionIndex].caption}
                      </p>
                    </div>

                    {selectedPost.parentPost.type !== 2 && (
                      <div className="post-photo-containers">
                        <ImageCarousel
                          arrowClick={updateIndex}
                          images={selectedPost.parentPost.images.map((element) => element.url)}
                          types={selectedPost.parentPost.images.map((element) => element.type)}
                          isLiked={selectedPost.isLiked}
                          handleLike={() =>
                            handleLike(
                              selectedPost.parentPost.isLiked,
                              selectedPost.parentPost.author.soconId,
                              selectedPost.parentPost.hash
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="original-post-container">
                    <div className="post-header-container">
                      <p style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}>
                        This post is been deleted
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="post-captions-container">
                  <p
                    className={isDarkMode ? 'post-captions' : 'd-post-captions'}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {selectedPost.type === 2
                      ? HighlightHashtags(selectedPost.text)
                      : HighlightHashtags(selectedPost.images[captionIndex].caption)}
                  </p>
                </div>

                {selectedPost.type !== 2 && (
                  <div className="post-photo-containers">
                    <ImageCarousel
                      arrowClick={updateIndex}
                      images={selectedPost.images.map((element) => element.url)}
                      types={selectedPost.images.map((element) => element.type)}
                      isLiked={selectedPost.isLiked}
                      handleLike={() =>
                        handleLike(
                          selectedPost.parentPost.isLiked,
                          selectedPost.parentPost.author.soconId,
                          selectedPost.parentPost.hash
                        )
                      }
                    />
                  </div>
                )}
              </>
            )}
            <div className="images-actions-container">
              <div className="img-action-container">
                <div className="img-action-icon-container">
                  <img
                    onClick={() =>
                      handleLike(
                        selectedPost.isLiked,
                        selectedPost.author.soconId,
                        selectedPost.hash
                      )
                    }
                    src={
                      !selectedPost.isLiked
                        ? isDarkMode
                          ? '/lightIcon/heartLight.svg'
                          : '/darkIcon/heartDark.svg'
                        : '/icon/redHeart.svg'
                    }
                    alt="like"
                    className="img-action-icon"
                  />
                </div>

                <div
                  className="img-action-count-container"
                  onClick={() => openLikeUser(selectedPost)}
                >
                  <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                    {selectedPost.likes.count}
                  </p>
                </div>
              </div>

              <div className="img-action-container">
                <div className="img-action-icon-container">
                  <img
                    src={isDarkMode ? '/messageLight.svg' : '/darkIcon/messageDark.svg'}
                    alt="like"
                    className="img-action-icon"
                  />
                </div>

                <div className="img-action-count-container">
                  <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                    {selectedPost.comments.count}
                  </p>
                </div>
              </div>
              {selectedPost ? (
                <>
                  <div className="popoverBoxContainer" ref={repostRef}>
                    <div className="img-action-container" onClick={(e) => togglePopover(e)}>
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
                          {repostToggle && (
                            <>
                              <div className={isDarkMode ? 'popoverData' : 'd-popoverData'}>
                                <div>
                                  <div
                                    className={isDarkMode ? 'repostBox' : 'd-repostBox'}
                                    onClick={(event) => {
                                      handleRepostClick(selectedPost);
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
                                        isDarkMode ? 'popoverRepostText' : 'd-popoverRepostText'
                                      }
                                    >
                                      Repost
                                    </p>
                                  </div>
                                  <div
                                    className={isDarkMode ? 'repostBox' : 'd-repostBox'}
                                    onClick={(event) => {
                                      handleViewReposttClick(selectedPost);
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
                                        isDarkMode ? 'popoverRepostText' : 'd-popoverRepostText'
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
                        <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                          {selectedPost.reposts}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="img-action-container">
                <div className="img-action-icon-container" onClick={handleShareClick}>
                  <img
                    src={isDarkMode ? '/lightIcon/sendLight.svg' : '/darkIcon/sendDark.svg'}
                    alt="like"
                    className="img-action-icon"
                  />
                </div>

                <div className="img-action-count-container">
                  <p className={isDarkMode ? 'img-action-count' : 'd-img-action-count'}>
                    {selectedPost.shares}
                  </p>
                </div>
              </div>
              {selectedPost.isSaved ? (
                <div className="save-img-action-container">
                  <div onClick={() => handleSaveClick()} className="img-action-icon-container">
                    <img src={savedIcon} alt="like" className="img-action-icon" />
                  </div>
                </div>
              ) : (
                <div className="save-img-action-container">
                  <div onClick={() => handleSaveClick()} className="img-action-icon-container">
                    <img
                      src={isDarkMode ? '/lightIcon/saveLight.svg' : '/darkIcon/saveDark.svg'}
                      alt="save"
                      className="img-action-icon"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={isDarkMode ? 'ec-input-box' : 'd-ec-input-box'}>
              <div className="ec-img-container">
                {userProfile && (
                  <img
                    src={userProfile.pfp ? userProfile.pfp : defaultProfile}
                    alt="image"
                    className="ec-img"
                  />
                )}
              </div>
              <Popover
                visible={showPopover}
                content={content}
                trigger="click"
                placement="bottomLeft"
                destroyTooltipOnHide
                overlayClassName="custom-popover"
                arrow={false}
              >
                <input
                  type="text"
                  className={isDarkMode ? 'ec-input' : 'd-ec-input'}
                  placeholder="Add a comment..."
                  value={timeLineComment}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyPress={handleInputChange}
                />
              </Popover>
              <div
                className="ec-sendContainer"
                onClick={() => addComment(selectedPost.author.soconId, selectedPost.hash)}
              >
                <img
                  src={
                    isTyping
                      ? '/darkIcon/sendMsgDark.svg'
                      : isDarkMode
                        ? '/lightIcon/unsendLight.svg'
                        : '/darkIcon/msgUnsendDark.svg'
                  }
                  alt={isTyping ? 'unsend' : 'send'}
                  className="ec-send"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div>
          {comments && comments.length > 0 ? (
            // console.log("Show cmt count",comments)
            comments &&
            comments.map((comment, index) => (
              <div
                key={comment.id}
                className={isDarkMode ? 'comment-outer-box' : 'd-comment-outer-box'}
              >
                <div className="comment-box">
                  <div className="comment-modal-container">
                    <div className="comment-modal-first-column">
                      <div
                        onClick={() => goToProfile(comment.author.soconId, comment.author.username)}
                        style={{ display: 'flex', gap: '0.5vw', alignItems: 'center' }}
                      >
                        <div className="comments-profile-pic-container">
                          <img
                            src={comment.author.pfp ? comment.author.pfp : defaultProfile}
                            alt="profile"
                            className="comments-profile-pic"
                          />
                        </div>
                        <div className="comments-name-container">
                          <p className={isDarkMode ? 'comments-name' : 'd-comments-name'}>
                            {comment.author.username}
                          </p>
                        </div>
                      </div>
                      <div className="comments-time-container">
                        <p className={isDarkMode ? 'comments-time' : 'd-comments-time'}>
                          {getDate(comment.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="comment-modal-second-row">
                      <p className={isDarkMode ? 'main-comment' : 'd-main-comment'}>
                        {comment.text.split(/\s+/).map((word, index) => {
                          if (word.startsWith('@')) {
                            return (
                              <>
                                <a
                                  key={index}
                                  onClick={(event) => {
                                    goToProfile(comment.author.soconId, word.substring(1));
                                    event.preventDefault();
                                  }}
                                  className="mention-link"
                                >
                                  {word}
                                </a>
                                &nbsp;
                              </>
                            );
                          } else {
                            return word + ' ';
                          }
                        })}
                      </p>
                    </div>

                    <div onClick={() => toggleReplyBox(index)} className="comment-modal-third-row">
                      <p className={isDarkMode ? 'comment-reply' : 'd-comment-reply'}>Reply</p>
                    </div>
                  </div>

                  <div className="heart-icon-container">
                    {retrievedSoconId === comment.author.soconId && (
                      <Popover
                        arrow={false}
                        placement="leftTop"
                        trigger="click"
                        content={
                          <div className="comment-more-modal">
                            <div
                              onClick={() => {
                                deleteComment(comment.hash);
                              }}
                              className="more-comment-option-box"
                            >
                              <div className="deletecommentIconContainer">
                                <img src={deletes} alt="delete" className="deletecommentIcon" />
                              </div>
                              <span className="delete-comment-text">Delete Comment</span>
                            </div>
                          </div>
                        }
                      >
                        <div className="more-comment-options-container">
                          <img
                            src={
                              isDarkMode
                                ? '/lightIcon/more_h_Light.svg'
                                : '/darkIcon/more_h_Dark.svg'
                            }
                            className="more-comment-options"
                            alt="more"
                          />
                        </div>
                      </Popover>
                    )}
                    {comment.isLiked ? (
                      <div
                        onClick={() => unLikeComment(comment.hash, comment.author.soconId)}
                        className="heart-icon-image-container"
                      >
                        {/* red heart will come here*/}
                        <img src="/icon/redHeart.svg" alt="heart" className="heart-icon" />
                      </div>
                    ) : (
                      <div
                        onClick={() => likeComment(comment.hash, comment.author.soconId)}
                        className="heart-icon-image-container"
                      >
                        <img
                          src={isDarkMode ? '/lightIcon/heartLight.svg' : '/darkIcon/heartDark.svg'}
                          alt="heart"
                          className="heart-icon"
                        />
                      </div>
                    )}
                    <div className="comment-heart-count-container">
                      <p className={isDarkMode ? 'comment-heart-count' : 'd-comment-heart-count'}>
                        {comment.likes.count}
                      </p>
                    </div>
                  </div>
                </div>

                {replyBoxes[index] && (
                  <div className="commentReplies">
                    <div className={isDarkMode ? 'ec-input-box_reply' : 'd-ec-input-box_reply'}>
                      <div className="ec-img-container">
                        {userProfile && (
                          <img
                            src={userProfile.pfp ? userProfile.pfp : defaultProfile}
                            alt="image"
                            className="ec-img"
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        className={isDarkMode ? 'ec-input_reply' : 'd-ec-input_reply'}
                        placeholder="Add a comment..."
                        value={commentReplies[index] || ''}
                        onChange={(e) => handleCommentReplyChange(index, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            replyToParentComment(comment.author.soconId, comment.hash, index);
                          }
                        }}
                      />
                      <div className="ec-sendContainer">
                        {commentReplies[index] ? (
                          <img
                            src="/darkIcon/sendMsgDark.svg"
                            alt="unsend"
                            className="ec-send"
                            onClick={() =>
                              replyToParentComment(comment.author.soconId, comment.hash, index)
                            }
                          />
                        ) : (
                          <img
                            src={
                              isDarkMode
                                ? '/lightIcon/unsendLight.svg'
                                : '/darkIcon/msgUnsendDark.svg'
                            }
                            alt="send"
                            className="ec-send"
                          />
                        )}
                      </div>
                    </div>
                    <div className="closeReplyContainer">
                      <img
                        onClick={() => toggleReplyBox(index)}
                        src={close}
                        alt="close"
                        className="closeReply"
                      />
                    </div>
                  </div>
                )}
                {comment.comments.count > 0 && (
                  <div
                    onClick={() => toggleViewReplyBox(index, comment.author.soconId, comment.hash)}
                    className="comment-action-container"
                  >
                    <p className={isDarkMode ? 'comment-action' : 'd-comment-action'}>
                      {viewReplyBoxes[index]
                        ? `Hide ${comment.comments.count} Replies`
                        : `View ${comment.comments.count} Replies`}
                    </p>
                  </div>
                )}

                {viewReplyBoxes[index] && (
                  <div className="inner-container">
                    {repliedComments[index] &&
                      repliedComments[index].map((comment, commentIndex) => (
                        <div
                          key={commentIndex}
                          className={isDarkMode ? 'comment-outer-box' : 'd-comment-outer-box'}
                        >
                          <div className="comment-box">
                            <div className="comment-modal-container">
                              <div className="comment-modal-first-column">
                                <div
                                  onClick={() =>
                                    goToProfile(comment.author.soconId, comment.author.username)
                                  }
                                  style={{ display: 'flex', gap: '0.5vw', alignItems: 'center' }}
                                >
                                  <div className="comments-profile-pic-container">
                                    <img
                                      src={comment.author.pfp}
                                      alt="profile"
                                      className="comments-profile-pic"
                                    />
                                  </div>
                                  <div className="comments-name-container">
                                    <p className={isDarkMode ? 'comments-name' : 'd-comments-name'}>
                                      {comment.author.username}
                                    </p>
                                  </div>
                                </div>
                                <div className="comments-time-container">
                                  <p className={isDarkMode ? 'comments-time' : 'd-comments-time'}>
                                    {getDate(comment.timestamp)}
                                  </p>
                                </div>
                              </div>
                              <div className="comment-modal-second-row">
                                <p className={isDarkMode ? 'main-comment' : 'd-main-comment'}>
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                            <div className="heart-icon-container">
                              {retrievedSoconId === comment.author.soconId && (
                                <Popover
                                  arrow={false}
                                  placement="leftTop"
                                  content={
                                    <div className="comment-more-modal">
                                      <div
                                        onClick={() => {
                                          deleteComment(comment.hash);
                                          toggleViewReplyBox(
                                            index,
                                            comment.author.soconId,
                                            comment.text
                                          );
                                        }}
                                        className="more-comment-option-box"
                                      >
                                        <div className="deletecommentIconContainer">
                                          <img
                                            src={deletes}
                                            alt="delete"
                                            className="deletecommentIcon"
                                          />
                                        </div>
                                        <span className="delete-comment-text">Delete Comment</span>
                                      </div>
                                    </div>
                                  }
                                >
                                  <div className="more-comment-options-container">
                                    <img
                                      src={
                                        isDarkMode
                                          ? '/lightIcon/more_h_Light.svg'
                                          : '/darkIcon/more_h_Dark.svg'
                                      }
                                      className="more-comment-options"
                                      alt="more"
                                    />
                                  </div>
                                </Popover>
                              )}

                              {comment.isLiked ? (
                                <div
                                  onClick={() => {
                                    unLikeComment(comment.hash, comment.author.soconId);
                                  }}
                                  className="heart-icon-image-container"
                                >
                                  <img
                                    src="/icon/redHeart.svg"
                                    alt="heart"
                                    className="heart-icon"
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    likeComment(comment.hash, comment.author.soconId);
                                  }}
                                  className="heart-icon-image-container"
                                >
                                  <img
                                    src={
                                      isDarkMode
                                        ? '/lightIcon/heartLight.svg'
                                        : '/darkIcon/heartDark.svg'
                                    }
                                    alt="heart"
                                    className="heart-icon"
                                  />
                                </div>
                              )}
                              <div className="comment-heart-count-container">
                                <p
                                  className={
                                    isDarkMode ? 'comment-heart-count' : 'd-comment-heart-count'
                                  }
                                >
                                  {comment.likes.count}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: isDarkMode ? '#363636' : '#FCFCFC' }}>
              No Comments yet
            </p>
          )}
        </div>
      </div>

      {shareModalOpen && <Share />}
      {repostModalOpen && <Repost />}
      {saveModalOpen && <SavedPostModal />}
      {moreModalOpen && <More />}
      {userLikeListModal && <UserLike />}
    </div>
  );
};

export default ExpandPost;
