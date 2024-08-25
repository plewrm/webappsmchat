import React, { useEffect, useState } from 'react';
import './PostModal.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeMoreModal,
  setShowReportModal,
  setShowReportUserModal
} from '../../../redux/slices/modalSlice';
import { useTheme } from '../../../context/ThemeContext';
import darkunfollow from '../../../assets/icons/dark-unfollow.svg';
import darkcopylink from '../../../assets/icons/dark-link.svg';
import darkonNotification from '../../../assets/icons/dark-notification-bing.svg';
import darkhidepost from '../../../assets/icons/dark-hidepost.svg';
import darkblockpost from '../../../assets/icons/dark-block.svg';
import darkreprtpost from '../../../assets/icons/dark-danger.svg';
import lightunfollow from '../../../assets/icons/light-unfollow.svg';
import lightcopylink from '../../../assets/icons/light-link.svg';
import lightonNotification from '../../../assets/icons/light-notification-bing.svg';
import lighthidepost from '../../../assets/icons/light-hidepost.svg';
import lightblockpost from '../../../assets/icons/light-block.svg';
import lightreprtpost from '../../../assets/icons/light-danger.svg';
import more from '../../../assets/icons/More.svg';
import close from '../../../assets/icons/modal-close.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  DELETEPOST,
  retrievedSoconId,
  FOLLOW_UNFOLLOW_USER,
  BLOCKEDUSERBYID,
  FOLLOWING
} from '../../../api/EndPoint';
import axios from 'axios';
import deletes from '../../../assets/icons/trash.svg';
import toast from 'react-hot-toast';
import { setGlobalPostState } from '../../../redux/slices/loaderSlice';
import ReportModal from '../../../modals/userProfileModals/ReportModal';
import { fetchFollowingUsers, followUser, unfollowUser } from '../../../redux/slices/postSlices';
const More = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [blockAccountModalDiscover, setBlockAccountModalDiscover] = useState(false);
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const showReportUserModal = useSelector((state) => state.modal.showReportUserModal);
  const showReportModal = useSelector((state) => state.modal.showReportModal);
  const [followDiscoverUsers, setFollowDiscoverUsers] = useState({});
  const globalPostState = useSelector((state) => state.loader.globalPostState);

  const mentionData = useSelector((state) => state.posts.mentionData);
  const status = useSelector((state) => state.posts.status);
  const followingUsers = useSelector((state) => state.posts.followingUsers);
  // console.log('selected post data', selectedPost);

  const openConfirmDelete = () => {
    setConfirmDelete(true);
  };
  const closeConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const handleCloseModal = () => {
    dispatch(closeMoreModal());
  };

  const deletePost = async () => {
    if (selectedPost.author.soconId !== retrievedSoconId) {
      toast.error('you cannot delete this post!');
      return;
    }
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.delete(`${BASE_URL}${DELETEPOST}${selectedPost.hash}`, {
        headers
      });
      dispatch(setGlobalPostState(!globalPostState));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    dispatch(closeMoreModal());
    setConfirmDelete(false);
  };

  const copyThePost = async () => {
    const linkToCopy = `https://app.socialcontinent.xyz/homepage/post/${selectedPost.hash}/${selectedPost.author.soconId}`;
    await navigator.clipboard.writeText(linkToCopy);
    toast.success('Link copied successfully');
  };

  // const followDiscoverUser = async (authorSoconId) => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };
  //     const response = await axios.post(
  //       `${BASE_URL}${FOLLOW_UNFOLLOW_USER}${authorSoconId}`,
  //       {},
  //       { headers }
  //     );
  //     console.log(response.data);
  //     toast.success('Followed successfully!');
  //     setFollowDiscoverUsers((prev) => ({ ...prev, [authorSoconId]: true }));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const followDiscoverUser = (authorSoconId) => {
    console.log('More option follow');
    dispatch(followUser(authorSoconId));
  };

  // const unfollowDiscoverUser = async (authorSoconId) => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };
  //     const response = await axios.delete(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${authorSoconId}`, {
  //       headers
  //     });
  //     console.log(response.data);
  //     toast.success('Unfollowed successfully!');
  //     setFollowDiscoverUsers((prev) => ({ ...prev, [authorSoconId]: false }));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const unfollowDiscoverUser = (authorSoconId) => {
    console.log('More option unfollow');
    dispatch(unfollowUser(authorSoconId));
  };

  const isScreenLarge = window.innerWidth > 500;

  const openBlockConfirmationDiscover = () => {
    setBlockAccountModalDiscover(true);
    // handleCloseModal();
  };

  const closeBlockConfirmationDiscover = () => {
    setBlockAccountModalDiscover(false);
  };

  const blockAccountDiscover = async (selectedPost) => {
    if (!selectedPost) {
      console.error('User details are missing or invalid');
      return;
    }
    try {
      const token = BEARER_TOKEN || sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await fetch(`${BASE_URL}${BLOCKEDUSERBYID}${selectedPost.author.soconId}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('blockdata', data);
      dispatch(setGlobalPostState(!globalPostState));
      setBlockAccountModalDiscover(false);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const openReportPost = () => {
    dispatch(setShowReportModal(true));
  };

  const openReportUser = () => {
    dispatch(setShowReportUserModal(true));
  };

  // const [mentionData, setMentionData] = useState(null);
  // const fetchAllMentions = async () => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };
  //     const response = await axios.get(
  //       `${BASE_URL}${FOLLOWING}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
  //       { headers }
  //     );
  //     setMentionData(response.data.following.users);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFollowingUsers());
    }
  }, [status, dispatch]);

  // const isFollowingUser = (authorSoconId) => {
  //   return (
  //     mentionData?.some((user) => user.soconId === authorSoconId) ||
  //     followDiscoverUsers[authorSoconId]
  //   );
  // };

  const isFollowingUser = (authorSoconId) => {
    return followingUsers.includes(authorSoconId);
  };

  // useEffect(() => {
  //   fetchAllMentions();
  // }, [globalPostState, followDiscoverUsers]);

  return (
    <div>
      <div
        className={isDarkMode ? 'post-modal-overlay' : 'd-post-modal-overlay'}
        onClick={handleCloseModal}
      >
        <div
          className={isDarkMode ? 'post-modals-container' : 'd-post-modals-container'}
          onClick={(e) => e.stopPropagation()}
        >
          {!confirmDelete && (
            <>
              {selectedPost.author.soconId !== retrievedSoconId && (
                <>
                  <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className="modal-unfollow-container">
                      {isDarkMode ? (
                        <img src={lightunfollow} alt="unfollow" className="modal-unfollow" />
                      ) : (
                        <img src={darkunfollow} alt="unfollow" className="modal-unfollow" />
                      )}
                    </div>
                    {isFollowingUser(selectedPost.author.soconId) ? (
                      <div
                        onClick={() => unfollowDiscoverUser(selectedPost.author.soconId)}
                        className="more-name-container"
                      >
                        <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Unfollow</p>
                      </div>
                    ) : (
                      <div
                        onClick={() => followDiscoverUser(selectedPost.author.soconId)}
                        className="more-name-container"
                      >
                        <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Follow</p>
                      </div>
                    )}

                    <div className="close-post-modal-container" onClick={handleCloseModal}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/closeModalLight.svg'
                            : '/darkIcon/closeModalDark.svg'
                        }
                        alt="close"
                        className="close-post-modal"
                      />
                    </div>
                  </div>

                  <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className="modal-unfollow-container">
                      {isDarkMode ? (
                        <img src={lightcopylink} alt="unfollow" className="modal-unfollow" />
                      ) : (
                        <img src={darkcopylink} alt="unfollow" className="modal-unfollow" />
                      )}
                    </div>
                    <div onClick={copyThePost} className="more-name-container">
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Copy link</p>
                    </div>
                  </div>
                  <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className="modal-unfollow-container">
                      {isDarkMode ? (
                        <img src={lightcopylink} alt="unfollow" className="modal-unfollow" />
                      ) : (
                        <img src={darkcopylink} alt="unfollow" className="modal-unfollow" />
                      )}
                    </div>
                    <div onClick={openReportUser} className="more-name-container">
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>
                        Report @{selectedPost.author.username}
                      </p>
                    </div>
                  </div>

                  <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className="modal-unfollow-container">
                      {isDarkMode ? (
                        <img src={lightcopylink} alt="unfollow" className="modal-unfollow" />
                      ) : (
                        <img src={darkcopylink} alt="unfollow" className="modal-unfollow" />
                      )}
                    </div>
                    <div onClick={openReportPost} className="more-name-container">
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Report this Post</p>
                    </div>
                  </div>

                  <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'} onClick="">
                    <div className="modal-unfollow-container">
                      {isDarkMode ? (
                        <img src={lightblockpost} alt="unfollow" className="modal-unfollow" />
                      ) : (
                        <img src={darkblockpost} alt="unfollow" className="modal-unfollow" />
                      )}
                    </div>
                    <div className="more-name-container" onClick={openBlockConfirmationDiscover}>
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>
                        Block @{selectedPost.author.username}
                      </p>
                    </div>
                  </div>

                  {/* <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className='modal-unfollow-container'>
                      {isDarkMode ? <img src={lightonNotification} alt='unfollow' className='modal-unfollow' /> : <img src={darkonNotification} alt='unfollow' className='modal-unfollow' />}
                    </div>
                    <div className='more-name-container'>
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Turn on notification on this account</p>
                    </div>
                  </div> */}

                  {/* <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className='modal-unfollow-container'>
                      {isDarkMode ? <img src={lighthidepost} alt='unfollow' className='modal-unfollow' /> : <img src={darkhidepost} alt='unfollow' className='modal-unfollow' />}
                    </div>
                    <div className='more-name-container'>
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Hide Post</p>
                    </div>
                  </div> */}

                  {/* <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className='modal-unfollow-container'>
                      {isDarkMode ? <img src={lightreprtpost} alt='unfollow' className='modal-unfollow' /> : <img src={darkreprtpost} alt='unfollow' className='modal-unfollow' />}
                    </div>
                    <div className='more-name-container'>
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Repost post</p>
                    </div>
                  </div> */}
                </>
              )}
              {selectedPost.author.soconId === retrievedSoconId && (
                <>
                  <div className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}>
                    <div className="modal-unfollow-container">
                      {isDarkMode ? (
                        <img src={lightcopylink} alt="unfollow" className="modal-unfollow" />
                      ) : (
                        <img src={darkcopylink} alt="unfollow" className="modal-unfollow" />
                      )}
                    </div>
                    <div onClick={copyThePost} className="more-name-container">
                      <p className={isDarkMode ? 'more-name' : 'd-more-name'}>Copy link</p>
                    </div>
                  </div>
                  <div
                    onClick={openConfirmDelete}
                    className={isDarkMode ? 'more-modals-box' : 'd-more-modals-box'}
                  >
                    <div className="modal-unfollow-container">
                      <img src={deletes} alt="unfollow" className="modal-unfollow" />
                    </div>

                    <div className="more-name-container">
                      <p
                        className={isDarkMode ? 'more-name' : 'd-more-name'}
                        style={{ color: 'red' }}
                      >
                        Delete this post
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {confirmDelete && (
            <div className="postDeleteContainer">
              <span className={isDarkMode ? 'postDeleteText' : 'd-postDeleteText'}>
                Are you sure want to delete this post ?
              </span>
              <div className="postDeleteButtonContainer">
                <button
                  className={isDarkMode ? 'cancelDelete' : 'd-cancelDelete'}
                  onClick={closeConfirmDelete}
                >
                  Cancel
                </button>
                <button
                  onClick={deletePost}
                  className={isDarkMode ? 'cancelDelete' : 'd-cancelDelete'}
                >
                  Yes, Sure!
                </button>
              </div>
            </div>
          )}

          {/* block user confirmation for discover */}
          {blockAccountModalDiscover && (
            <div
              className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
              // onClick={closelogoutConfirmation}
            >
              <div
                className={
                  isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'
                }
                onClick={(e) => e.stopPropagation()}
              >
                <div className="confirmationTextContainer">
                  <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                    Are you sure you want block @{selectedPost.author.username} ?
                  </p>
                </div>
                <div className="confirmationsButtonCOntainer">
                  <button
                    className={
                      isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'
                    }
                    onClick={closeBlockConfirmationDiscover}
                  >
                    Cancel
                  </button>
                  <button
                    className={
                      isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'
                    }
                    onClick={() => blockAccountDiscover(selectedPost)}
                  >
                    Yes, Sure
                  </button>
                </div>
              </div>
            </div>
          )}

          {showReportModal && (
            <ReportModal soconPostId={selectedPost.author.soconId} postHash={selectedPost.hash} />
          )}
          {showReportUserModal && <ReportModal soconId={selectedPost.author.soconId} />}
        </div>
      </div>
    </div>
  );
};

export default More;
