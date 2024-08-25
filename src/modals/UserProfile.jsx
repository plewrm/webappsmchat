import React, { useState, useEffect, useRef } from 'react';
import './UserProfile.css';
import { useTheme } from '../context/ThemeContext';
import leftcarousel from '../assets/icons/left-carousel.svg';
import rightcarousel from '../assets/icons/right_carousel.svg';
import close from '../assets/icons/s-close.svg';
import { useDispatch, useSelector } from 'react-redux';
import greetMsg from '../assets/icons/greet-msg.svg';
import { useNavigate } from 'react-router-dom';
import noProfile from '../assets/icons/Default_pfp.webp';
import noCover from '../assets/images/plain-cover.png';
import {
  setEditProfile,
  setOpenAddHighLightModal,
  openShareModal,
  setShowFollowing,
  setViewCover,
  setViewProfile,
  setLogoutAccountModal,
  setDeleteAccountModal,
  setShowReportModal
} from '../redux/slices/modalSlice';
import StoryHighLight from './StoryHighLight';
import Posts from '../components/pages/userpost/Posts';
import EditProfile from './EditProfile';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETPROFILE,
  GETUSERHIGHLIGHT,
  GETHIGHLIGHTDETAILS,
  GETUSERSTORIES,
  LOGOUT,
  DELETEHIGHLIGHT,
  FOLLOW_UNFOLLOW_USER,
  FOLLOWERS,
  FOLLOWING,
  MYPOST,
  retrievedSoconId,
  DELETEACCOUNT,
  BLOCKEDUSERBYID,
  UNBLOCKEDUSERBYID,
  ALLBLOCKEDUSERS
} from '../api/EndPoint';
import axios from 'axios';
import ShowFollowing from './ShowFollowing';
import { appendMessageData, setConversation } from '../redux/slices/chatSlice';
import { isPeerOnXmtpNetwork, startConversation } from '../xmtp/models/conversations';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Share from '../components/pages/userpost/Share';
import { getDate } from '../utils/time';
import leftBack from '../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../assets/icons/arrow-left-lightMode.svg';
import leftLightMode from '../assets/icons/arrow-left-story.svg';
import rightLightMode from '../assets/icons/arrow-right-story.svg';
import { clearMessageDb } from '../xmtp/models/db';
import { closeStoryViewModal } from '../redux/slices/modalSlice';
import UserProfileOptions from './userProfileModals/UserProfileOptions';
import UserProfileImage from './userProfileModals/UserProfileImage';
import blocked from '../assets/icons/forbidden.svg';
import defaultProfile from '../assets/icons/Default_pfp.webp';
import search from '../assets/icons/search.svg';
import searchLight from '../assets/icons/light-search.svg';
import ReportModal from './userProfileModals/ReportModal';
import Logoutsvg from '../assets/icons/logout.svg';
import Trashsvg from '../assets/icons/trash.svg';
import { fetchFollowingUsers, followUser, unfollowUser } from '../redux/slices/postSlices';
import Shieldslash from '../assets/icons/shieldslash.svg';
import Warning2 from '../assets/icons/warning2.svg';
import { Skeleton, Space } from 'antd';
import UserProfileSkeleton from './UserProfileSkeleton';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useParams();
  const { soconId } = useParams();
  const { isDarkMode } = useTheme();
  const popoverRef = useRef(null);
  const [selecthighlightName, setSelectHighlightName] = useState('');
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [deleteHighlightConfirmation, setDeleteHighlightConformation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enableStoryTimer, setEnableStoryTimer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightStory, setHighlightStory] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selfStory, setSelfStory] = useState(false);
  const [selfView, setSelfView] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  const [highlightDetails, setHighlightDetails] = useState([]);
  const [defaultTab, setDefaultTab] = useState(1); // Initialize defaultTab state
  // const [follow, setFollow] = useState(null);
  const [greetMessageModal, setGreetMessageModal] = useState(null);
  const [chatModals, setChatModals] = useState(null);
  const xmtp = useSelector((state) => state.auth.xmtp);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const globalProfileState = useSelector((state) => state.loader.globalProfileState);
  const viewCover = useSelector((state) => state.modal.viewCover);
  const viewProfile = useSelector((state) => state.modal.viewProfile);
  const openAddHighLightModal = useSelector((state) => state.modal.openAddHighLightModal);
  const showFollowing = useSelector((state) => state.modal.showFollowing);
  const editProfile = useSelector((state) => state.modal.editProfile);
  const deleteAccountModal = useSelector((state) => state.modal.deleteAccountModal);
  const logoutAccountModal = useSelector((state) => state.modal.logoutAccountModal);
  const showReportModal = useSelector((state) => state.modal.showReportModal);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockAccountModal, setBlockAccountModal] = useState(false);
  const [allblockAccountList, setAllBlockAccountList] = useState(false);
  const [allBlockedUsers, setAllBlockedUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [filteredBlockedUsers, setFilteredBlockedUsers] = useState([]);

  const status = useSelector((state) => state.posts.status);
  const followingUsers = useSelector((state) => state.posts.followingUsers);

  const togglePopover = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (searchName.trim()) {
      const filteredUsers = allBlockedUsers
        .filter(
          (user) =>
            user.username && user.username.toLowerCase().includes(searchName.trim().toLowerCase())
        )
        .sort((a, b) => {
          const matchesA = (a.username.match(new RegExp(searchName, 'gi')) || []).length;
          const matchesB = (b.username.match(new RegExp(searchName, 'gi')) || []).length;
          return matchesB - matchesA;
        });

      setFilteredBlockedUsers(filteredUsers);
    } else {
      setFilteredBlockedUsers([]);
    }
  }, [searchName, allBlockedUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  const containsLink = (text) => {
    const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;
    return linkRegex.test(text);
  };

  const convertLinksToHTML = (text) => {
    const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;
    return text.replace(linkRegex, (url) => {
      const shortenedUrl = url.length > 30 ? `${url.slice(0, 30)}...` : url;
      return `<a href="${url}" target="_blank" style="color: #6E44FF;">${shortenedUrl}</a>`;
    });
  };
  // const [soconId, setSoconId] = useState(location.state && location.state.soconId)
  const getUserProfileDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETPROFILE}/${username}`, { headers });
      // setSoconId(response.data.profile.soconId)
      setUserDetails(response.data.profile);

      // setFollow(response.data.profile.isFollowing);
      if (response.data.isBlocked) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 403) {
        setIsBlocked(true);
      }
    }
  };

  const openBlockConfirmation = () => {
    setBlockAccountModal(true);
  };
  const closeblockConfirmation = () => {
    setBlockAccountModal(false);
  };
  const openDeleteConfirmation = () => {
    dispatch(setDeleteAccountModal(true));
  };
  const openlogoutConfirmation = () => {
    dispatch(setLogoutAccountModal(true));
  };
  const openDeleteHighlightConfirmation = () => {
    setDeleteHighlightConformation(true);
  };
  const closeDeleteHighlightConfirmation = () => {
    setDeleteHighlightConformation(false);
  };
  const openallblockAccountModal = async () => {
    await blockedAccountList();
    setAllBlockAccountList(true);
  };

  const closeallblockAccountModal = () => {
    setAllBlockAccountList(false);
  };
  const handleOpenReportModal = () => {
    dispatch(setShowReportModal(true));
  };
  const blockAccountFunc = async (soconId) => {
    if (!soconId) {
      console.error('User details are missing or invalid');
      return;
    }
    try {
      const token = BEARER_TOKEN || sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await fetch(`${BASE_URL}${BLOCKEDUSERBYID}${soconId}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('blockdata', data);
      setBlockAccountModal(false);
      setHighlightDetails([]);
      setTimeline([]);
      setIsBlocked(true);
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const unBlockAccountFunc = async (soconIdToUnblock) => {
    if (!soconIdToUnblock) {
      console.error('User details are missing or invalid');
      return;
    }
    const url = `${BASE_URL}${UNBLOCKEDUSERBYID}${soconIdToUnblock}`;
    console.log(`Making request to URL: ${url}`);
    try {
      const token = BEARER_TOKEN || sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('resp show', data);
      setIsBlocked(false);
      setAllBlockedUsers((prevUsers) =>
        prevUsers.filter((user) => user.soconId !== soconIdToUnblock)
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const blockedAccountList = async () => {
    try {
      const token = BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${BASE_URL}${ALLBLOCKEDUSERS}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Print Blocked user list', data);
      setAllBlockedUsers(data.blockedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getCurrentUserDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${GETPROFILE}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        {
          headers
        }
      );
      setLoggedInUser(response.data.profile);
    } catch (error) {
      console.error(error);
    }
  };

  const getDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETPROFILE}/${soconId}`, {
        headers
      });
      //TODO:change the 10 from the API
      setUserDetails(response.data.profile);
      // setFollow(response.data.profile.isFollowing);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getHighLight = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETUSERHIGHLIGHT}${soconId}`, { headers });
      //TODO:change the 10 from the API
      setHighlightDetails(response.data.highlights);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log('print highlight', highlightDetails);

  useEffect(() => {
    getHighLight();
  }, [openAddHighLightModal]);

  const getHighLightDetails = async (highlightName) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETHIGHLIGHTDETAILS}${soconId}/${highlightName}`,
        { headers }
      );
      //TODO:change the 10 from the API
      setHighlightStory(response.data.highlight.stories);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserStories = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const selfStoryResponse = await axios.get(`${BASE_URL}${GETUSERSTORIES}${soconId}`, {
        headers
      });
      console.log('API call successful!');
      //TODO:change the 10 from the API
      if (selfStoryResponse.data.stories.length > 0) {
        setHighlightStory(selfStoryResponse.data.stories);
      }
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const closeStoryModal = () => {
    dispatch(closeStoryViewModal());
    setHighlightStory(null);
    setIsModalOpen(false);
    setEnableStoryTimer(false);
  };

  //   useEffect(() => {
  //     if (selecthighlightName) {
  //         getHighLightDetails(selecthighlightName);
  //     }
  // }, [selecthighlightName]);

  useEffect(() => {
    if (
      highlightDetails &&
      highlightDetails.length > 0 &&
      currentHighlightIndex < highlightDetails.length
    ) {
      const currentHighlight = highlightDetails[currentHighlightIndex];
      setSelectHighlightName(currentHighlight.title);
      getHighLightDetails(currentHighlight.title);
    } else {
      setSelectHighlightName('');
    }
  }, [currentHighlightIndex, highlightDetails]);

  const handleRightCarouselClick = () => {
    const nextImageIndex = (currentImageIndex + 1) % highlightStory.length;
    if (nextImageIndex === 0 && currentImageIndex == highlightStory.length - 1) {
      // closeStoryModal();
      if (highlightDetails.length - 1 - currentHighlightIndex > 0) {
        setCurrentHighlightIndex((currentHighlightIndex) => currentHighlightIndex + 1);
      }
    }
    if (nextImageIndex === 0) {
      // Move to the next array
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(nextImageIndex);
    }
  };

  const handleLeftCarouselClick = () => {
    const prevImageIndex = (currentImageIndex - 1 + highlightStory.length) % highlightStory.length;
    if (currentImageIndex === 0) {
      if (currentHighlightIndex > 0) {
        const newHighlightIndex = currentHighlightIndex - 1;
        setCurrentHighlightIndex(newHighlightIndex);
        const newHighlightStory = highlightDetails[newHighlightIndex].story;
        setCurrentImageIndex(newHighlightStory.length - 1);
      } else {
        console.log('No previous stories available');
      }
    } else {
      setCurrentImageIndex(prevImageIndex);
    }
  };

  const renderStatusBars = (item) => {
    return (
      <div className="story-view-bar-container">
        {[...Array(item.length)].map((_, i) => (
          <div
            key={i}
            className={i === currentImageIndex ? 'story-view-bar' : 'story-unview-bar'}
            style={{ width: `${100 / item.length}%` }}
          ></div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (soconId) {
      // getDetails();
      getHighLight();
      getCurrentUserDetails();
    }

    if (enableStoryTimer && highlightStory) {
      const interval = setInterval(() => {
        const nextImageIndex = (currentImageIndex + 1) % highlightStory.length;

        if (nextImageIndex === 0) {
          // Move to the next array
          setCurrentImageIndex(0);
          // Close the modal if it's the last image of the last array
          closeStoryModal();
        } else {
          setCurrentImageIndex(nextImageIndex);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentImageIndex, enableStoryTimer, selecthighlightName, globalProfileState, soconId]);

  // soconId
  const openEditProfile = () => {
    dispatch(setEditProfile(true));
  };

  const openHighlight = () => {
    dispatch(setOpenAddHighLightModal(true));
  };

  const openHighlightModal = (highlightName, index) => {
    setCurrentHighlightIndex(index);
    getHighLightDetails(highlightName);
    setSelectHighlightName(highlightName);
    setIsModalOpen(true);
    // setEnableStoryTimer(true);
    // if (index === 0 && selfStory) {
    //   setSelfView(true);
    // }
    // currentHighlightIndex(index);
    // setCurrentImageIndex(0)
    // dispatch(openHighlight());
  };

  const openFollowers = () => {
    dispatch(setShowFollowing(true));
    setDefaultTab(1); // Set defaultTab to 1 when Followers is clicked
  };
  const openFollowing = () => {
    dispatch(setShowFollowing(true));
    setDefaultTab(2); // Set defaultTab to 2 when Following is clicked
  };
  const closeFollowing = () => {
    dispatch(setShowFollowing(false));
  };

  const logout = async () => {
    await web3auth.logout();
    clearMessageDb();
    // dispatch(setLoggedIn(1))
    sessionStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('soconId');
    // localStorage.clear();
    navigate('/');
  };

  const [openMsgBox, setOpenMsgBox] = useState(false);

  const greet = async () => {
    const canMessage = await isPeerOnXmtpNetwork(xmtp, userDetails.walletAddress);
    if (!canMessage) {
      toast.error('cannot message this user, try later!');
      return;
    }
    setOpenMsgBox(true);
    const conversation = await startConversation(xmtp, userDetails);
    dispatch(setConversation(conversation));
    dispatch(
      appendMessageData({
        soconId: userDetails.soconId,
        display_name: userDetails.display_name,
        username: userDetails.username,
        timestamp: new Date().toDateString(),
        peerAddress: userDetails.walletAddress,
        isMaximized: true,
        isOpened: true,
        pfp: userDetails.pfp
      })
    );
  };

  // const followUser = async (id) => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };
  //     const response = await axios.post(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${id}`, {}, { headers });
  //     console.log(response.data);
  //     // setFollow((prev) => !prev);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const unFollowUser = async (id) => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };
  //     const response = await axios.delete(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${id}`, { headers });
  //     console.log(response.data);
  //     // setFollow((prev) => !prev);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const [followersCount, setFollowersCount] = useState(null);
  // const [followingCount, setfollowingCount] = useState(null);
  // const fetchData = async () => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };

  //     const res1 = await axios.get(`${BASE_URL}${FOLLOWERS}/${soconId}`, { headers });
  //     const res2 = await axios.get(`${BASE_URL}${FOLLOWING}/${soconId}`, { headers });
  //     setFollowersCount(res1.data.followers.users.length);
  //     setfollowingCount(res2.data.following.users.length);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const [timelineCount, setTimelineCount] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const getTimeline = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${MYPOST}${soconId}`, { headers });
      setTimeline(response.data.posts);
      setTimelineCount(response.data.posts.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
    if (soconId) {
      // fetchData();
      getTimeline();
    }
    if (!isBlocked) getHighLight();
  }, [soconId, globalProfileState, useParams(), isBlocked]);

  const [profileLink, setProfileLink] = useState(null);
  const shareProfile = async (username) => {
    try {
      // need to actual domain here instead of local
      const linkToCopy = `https://app.socialcontinent.xyz/profile/${username}`;
      await navigator.clipboard.writeText(linkToCopy);
      setProfileLink(linkToCopy);
      toast.success('Link copied successfully');
      dispatch(openShareModal());
    } catch (error) {
      console.error('Unable to copy to clipboard', error);
    }
  };

  const deleteHighlight = async (highlight) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${BASE_URL}${DELETEHIGHLIGHT}${highlight.title}`, {
        headers
      });

      // Remove the highlight from the state
      const updatedHighlights = highlightDetails.filter((h) => h.title !== highlight.title);
      setHighlightDetails(updatedHighlights);

      // Update the current index if necessary
      if (currentHighlightIndex >= updatedHighlights.length) {
        setCurrentHighlightIndex(updatedHighlights.length - 1);
      }

      setSelectHighlightName(null);
      console.log(response.data);
      toast.success('Highlight deleted successfully!');
      setDeleteHighlightConformation(false);

      // Close the modal after deleting the highlight
      closeStoryModal();
    } catch (error) {
      toast.error('Something went wrong, try again!');
      console.error(error);
    }
  };

  const handleMobileBack = () => {
    navigate('/homepage');
  };

  // const highlightpopoverRef = useRef(null);
  // const [visibility, setVisibility] = useState(false);
  // const toggleHighlightedit = () => {
  //   setVisibility(!visibility);
  // };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (highlightpopoverRef.current && !highlightpopoverRef.current.contains(event.target)) {
  //       setVisibility(false);
  //     }
  //   };

  //   if (visibility) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [visibility]);

  // const [highlight, setHighlight] = useState(null);
  // const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

  // const likeHighlight = async (soconId, hash, currentHighlightIndex, currentImageIndex) => {
  //   try {
  //     const headers = {
  //       'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
  //       'Content-Type': 'application/json',
  //     };
  //     const response = await axios.post(`${BASE_URL}${GETHIGHLIGHTDETAILS}${soconId}/${hash}`, {}, { headers });

  //     const isLiked = response.data.isLiked;

  //     setHighlight(prevHighlight => {
  //       if (prevHighlight) {
  //         const updatedHighlight = [...prevHighlight];
  //         if (updatedHighlight[currentHighlightIndex] && updatedHighlight[currentHighlightIndex][currentImageIndex]) {
  //           updatedHighlight[currentHighlightIndex][currentImageIndex].isLiked = isLiked;
  //         }
  //         return updatedHighlight;
  //       }
  //       return prevHighlight;
  //     });

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const handleOpenCover = () => {
    dispatch(setViewCover(true));
  };
  const handleOpenProfie = () => {
    dispatch(setViewProfile(true));
  };
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFollowingUsers());
    }
  }, [status, dispatch]);

  // const isFollowing = (authorSoconId) => {
  //   console.log('Checking following status for:', authorSoconId);
  //   return followingUsers.includes(authorSoconId);
  // };

  const isFollowing = followingUsers.includes(userDetails.soconId);

  const followUserProfile = (authorSoconId) => {
    console.log('Following user:', authorSoconId);
    dispatch(followUser(authorSoconId));
  };

  const unFollowUserProfile = (authorSoconId) => {
    console.log('Unfollowing user:', authorSoconId);
    dispatch(unfollowUser(authorSoconId));
  };

  const handleOpenSave = () => {
    navigate('/saved');
  };

  return (
    <>
      {!showFollowing && (
        <>
          {isMobileView && (
            <div className={isDarkMode ? 'mobileBackContainer' : 'd-mobileBackContainer'}>
              <div className="leftBackContainer" onClick={handleMobileBack}>
                <img src={isDarkMode ? leftBackLight : leftBack} alt="back" className="leftBack" />
              </div>
            </div>
          )}
          {!timeline && <UserProfileSkeleton />}
          <div className={isDarkMode ? 'userprofile-container' : 'd-userprofile-container'}>
            <div>
              <div className="user-cover-container" onClick={handleOpenCover}>
                <img
                  src={userDetails.cover_photo ? userDetails.cover_photo : noCover}
                  alt="cover"
                  className="user-cover"
                />
              </div>

              <div className="user-profile-count-container">
                <div
                  className="users-profile-container"
                  // onClick={() => { getUserStories() }}
                  onClick={handleOpenProfie}
                >
                  <img
                    src={userDetails.pfp ? userDetails.pfp : noProfile}
                    alt="profile"
                    className={isDarkMode ? 'user-profile' : 'd-user-profile'}
                  />
                </div>
                <div className={isDarkMode ? 'revealp-count-box' : 'd-revealp-count-box'}>
                  <div className="revealp-count-innerbox">
                    <div className="revealp-count-column">
                      <div className="revealp-counts-container">
                        <p className={isDarkMode ? 'revealp-counts' : 'd-revealp-counts'}>
                          {userDetails?.postCount || '0'}
                        </p>
                      </div>
                      <div className="revealp-count-name-container">
                        <p className={isDarkMode ? 'revealp-count-name' : 'd-revealp-count-name'}>
                          Posts
                        </p>
                      </div>
                    </div>

                    <div
                      className="revealp-count-column"
                      onClick={openFollowers}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="revealp-counts-container">
                        <p className={isDarkMode ? 'revealp-counts' : 'd-revealp-counts'}>
                          {userDetails?.followers || '0'}
                        </p>
                      </div>
                      <div className="revealp-count-name-container">
                        <p className={isDarkMode ? 'revealp-count-name' : 'd-revealp-count-name'}>
                          Followers
                        </p>
                      </div>
                    </div>

                    <div
                      className="revealp-count-column"
                      onClick={openFollowing}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="revealp-counts-container">
                        <p className={isDarkMode ? 'revealp-counts' : 'd-revealp-counts'}>
                          {userDetails?.following || '0'}
                        </p>
                      </div>
                      <div className="revealp-count-name-container">
                        <p className={isDarkMode ? 'revealp-count-name' : 'd-revealp-count-name'}>
                          Following
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="user-box1-outer">
                <div className="user-box1 ">
                  <div className="user-name-container">
                    <p className={isDarkMode ? 'user-name' : 'd-user-name'}>
                      {userDetails.display_name ? userDetails.display_name : 'User'}
                    </p>
                  </div>
                  <div className="user-verify-container">
                    <img src="/icon/bronze.svg" alt="verify" className="user-verify" />
                  </div>

                  <div className={isDarkMode ? 'rewardPtsContainer' : 'd-rewardPtsContainer'}>
                    <p className={isDarkMode ? 'rewardPts' : 'd-rewardPts'}>
                      {userDetails && userDetails.rewardPoints}
                    </p>
                  </div>

                  {loggedInUser && username === loggedInUser.username ? (
                    <div className="popoverContainerUserProfile" ref={popoverRef}>
                      <div className="user-more-container" onClick={togglePopover}>
                        <img
                          src={
                            isDarkMode
                              ? '/lightIcon/moreVerticalLight.svg'
                              : '/darkIcon/moreVerticalDark.svg'
                          }
                          alt="more"
                          className="user-more"
                        />
                      </div>
                      {visible && (
                        <div className={isDarkMode ? 'popovers lefttop' : 'd-popovers lefttop'}>
                          <div className="popover-contentUserProfile">
                            <div
                              onClick={openallblockAccountModal}
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                            >
                              <span className={isDarkMode ? 'popoverOption' : 'd-popoverOption'}>
                                <img src={blocked} alt="blk" className="profile-more-opt" />
                                Blocked Users
                              </span>
                            </div>

                            <div
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                              onClick={openlogoutConfirmation}
                            >
                              <span className={isDarkMode ? 'popoverOption' : 'd-popoverOption'}>
                                <img src={Logoutsvg} alt="out" className="profile-more-opt" />
                                Log Out
                              </span>
                            </div>
                            <div
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                              onClick={openDeleteConfirmation}
                            >
                              <span className="popoverOption" style={{ color: '#F4323E' }}>
                                <img src={Trashsvg} alt="out" className="profile-more-opt" />
                                Delete Account
                              </span>
                            </div>

                            <div
                              onClick={handleOpenSave}
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                            >
                              <span className={isDarkMode ? 'popoverOption' : 'd-popoverOption'}>
                                <img
                                  src={
                                    isDarkMode
                                      ? '/lightIcon/saveLight.svg'
                                      : '/darkIcon/saveDark.svg'
                                  }
                                  alt="blk"
                                  className="profile-more-opt"
                                />
                                Saved
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="popoverContainerUserProfile" ref={popoverRef}>
                      <div className="user-more-container" onClick={togglePopover}>
                        <img
                          src={
                            isDarkMode
                              ? '/lightIcon/moreVerticalLight.svg'
                              : '/darkIcon/moreVerticalDark.svg'
                          }
                          alt="more"
                          className="user-more"
                        />
                      </div>
                      {visible && !isBlocked && (
                        <div className={isDarkMode ? 'popovers lefttop' : 'd-popovers lefttop'}>
                          <div className="popover-contentUserProfile">
                            <div
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                            >
                              <span
                                className={isDarkMode ? 'popoverOption' : 'd-popoverOption'}
                                onClick={handleOpenReportModal}
                              >
                                <img src={Warning2} alt="unfollow" className="modal-unfollow" />
                                Report @{userDetails.username}
                              </span>
                            </div>
                            <div
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                              onClick={openBlockConfirmation}
                            >
                              <div className="modal-unfollow-container">
                                <span className="popoverOption" style={{ color: '#F4323E' }}>
                                  <img
                                    src={Shieldslash}
                                    alt="unfollow"
                                    className="modal-unfollow"
                                  />
                                  Block @{userDetails.username}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="user-id-container">
                  <p className={isDarkMode ? 'user-id' : 'd-user-id'}>@{userDetails.username}</p>
                </div>

                <div className="user-bio-container">
                  <p className={isDarkMode ? 'user-bio' : 'd-user-bio'}>
                    {containsLink(userDetails.url) ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: convertLinksToHTML(userDetails.url) }}
                      />
                    ) : (
                      userDetails.url
                    )}
                  </p>
                </div>

                <div className="user-bio-container">
                  <p
                    className={isDarkMode ? 'user-bio' : 'd-user-bio'}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {userDetails.bio}
                  </p>
                </div>
              </div>

              {loggedInUser && username === loggedInUser.username ? (
                <div className="user-button-container">
                  <button
                    className={isDarkMode ? 'user-edit-profile' : 'd-user-edit-profile'}
                    onClick={openEditProfile}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => shareProfile(username)}
                    className={isDarkMode ? 'user-edit-profile' : 'd-user-edit-profile'}
                  >
                    Share Profile
                  </button>
                </div>
              ) : (
                <>
                  {isBlocked ? (
                    <>
                      <div className="user-button-container">
                        <button
                          onClick={() => unBlockAccountFunc(soconId)}
                          className={
                            isDarkMode ? 'opponent-follow-button' : 'd-opponent-follow-button'
                          }
                        >
                          Unblock
                        </button>
                      </div>
                      <div className="user-not-found-container">
                        <span
                          className={isDarkMode ? 'd-user-not-found-text' : 'user-not-found-text'}
                        >
                          User Not Found
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="user-button-container">
                      {!isFollowing ? (
                        <button
                          onClick={() => followUserProfile(userDetails.soconId)}
                          className={
                            isDarkMode ? 'opponent-follow-button' : 'd-opponent-follow-button'
                          }
                        >
                          Follow
                        </button>
                      ) : (
                        <button
                          onClick={() => unFollowUserProfile(userDetails.soconId)}
                          className={
                            isDarkMode ? 'opponent-unfollow-button' : 'd-opponent-unfollow-button'
                          }
                        >
                          Unfollow
                        </button>
                      )}
                      <button
                        onClick={greet}
                        className={isDarkMode ? 'opponent-greet-button' : 'd-opponent-greet-button'}
                        style={{ background: isDarkMode ? '#DBD3F9' : '#1C1434', color: '#6E44FF' }}
                      >
                        <img src={greetMsg} alt="Greet Icon" className="opponent-greet-icon" />
                        Greet
                      </button>
                    </div>
                  )}
                </>
              )}
              <div className="user-highlight-container">
                {loggedInUser && username === loggedInUser.username && (
                  <div className="highlight-box" onClick={openHighlight}>
                    <div className="highlightImageContainer">
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/addHighLightLight.svg'
                            : '/darkIcon/addHighlightDark.svg'
                        }
                        alt="highlight"
                        className="highlightImage"
                      />
                    </div>
                    <div className="hightlight-text-container">
                      <p className={isDarkMode ? 'highlight-text' : 'd-highlight-text'}>
                        Highlight
                      </p>
                    </div>
                  </div>
                )}
                {highlightDetails &&
                  highlightDetails.map((item, index) => (
                    <div
                      onClick={() => openHighlightModal(item.title, index)}
                      key={item.id}
                      className="highlight-box"
                    >
                      <div className="highlightImageContainer">
                        <img src={item.coverPhoto} alt={item.title} className="highlightImage" />
                      </div>
                      <div className="hightlight-text-container">
                        <p className={isDarkMode ? 'highlight-text' : 'd-highlight-text'}>
                          {' '}
                          {item.title}{' '}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div>
                {/* this component showing all post from timeline */}
                {
                  // soconId && <SelfPost timeline={timeline} />
                  soconId && <Posts myTimeline={timeline} myPost={true} />
                }
              </div>
            </div>
          </div>

          {isModalOpen && highlightStory && highlightStory.length > 0 && (
            <div className="modal-overlay5">
              <div className={isDarkMode ? 'light-modal-content5' : 'dark-modal-content5'}>
                {!isMobileView && (
                  <div className="left0" onClick={handleLeftCarouselClick}>
                    {isDarkMode ? (
                      <img src={leftLightMode} alt="left" />
                    ) : (
                      <img src={leftcarousel} alt="left" />
                    )}
                  </div>
                )}

                <div className={isDarkMode ? 'inside-story-box' : 'd-inside-story-box'}>
                  {isMobileView && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div className="left0-mobile" onClick={handleLeftCarouselClick}>
                        {isDarkMode ? (
                          <img src={leftLightMode} alt="left" />
                        ) : (
                          <img src={leftcarousel} alt="left" />
                        )}
                      </div>
                      <div className="right0-mobile" onClick={handleRightCarouselClick}>
                        {isDarkMode ? (
                          <img src={rightLightMode} alt="right" />
                        ) : (
                          <img src={rightcarousel} alt="right" />
                        )}
                      </div>
                    </div>
                  )}
                  {renderStatusBars(highlightStory)}

                  <div className="insideStory-headers-containers">
                    <div className="inside-story-profile-container">
                      <img
                        src={
                          highlightStory &&
                          highlightStory[currentImageIndex] &&
                          highlightStory[currentImageIndex].author &&
                          highlightStory[currentImageIndex].author.pfp
                            ? highlightStory[currentImageIndex].author.pfp
                            : noProfile
                        }
                        className="inside-story-profile"
                        alt="image"
                      />
                    </div>
                    <div className="insideStory-name-container">
                      <p className="insideStory-name">
                        {highlightStory &&
                          highlightStory[currentImageIndex] &&
                          highlightStory[currentImageIndex].author &&
                          highlightStory[currentImageIndex].author.display_name}
                      </p>
                    </div>
                    <div className="insideStory-timeContainer">
                      <p className="insideStory-time">
                        {highlightStory?.[currentImageIndex]?.timestamp &&
                          getDate(highlightStory[currentImageIndex].timestamp)}
                      </p>
                    </div>
                    <div
                      className="story-right-box"
                      // ref={highlightpopoverRef}
                    >
                      <div
                        // onClick={toggleHighlightedit}
                        onClick={() =>
                          openDeleteHighlightConfirmation(highlightStory[currentImageIndex])
                        }
                        className="storyBottomIconContainer"
                      >
                        <img
                          // src={moreH}
                          src={
                            isDarkMode
                              ? '/lightIcon/trashlightimg.svg'
                              : '/darkIcon/trashdarkimg.svg'
                          }
                          alt="more"
                        />
                      </div>
                      {/* {visibility &&(
                        <div className={isDarkMode ? 'popovers lefttop' : 'd-popovers lefttop'}>
                        <div className="popover-contentUserProfile">
                          <div className={isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'} 
                          onClick={() => openDeleteHighlightConfirmation(highlightStory[currentImageIndex])}
                          >
                            <span className='popoverOption' style={{ color: '#F4323E' }}>Delete Highlight</span>
                          </div>
                          <div className={isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'} 
                          // onClick={}
                          >
                            <span className={isDarkMode ? 'popoverOption' : 'd-popoverOption'}>Edit Highlight</span>
                          </div>
                        </div>
                      </div>
                      )} */}

                      <div className="storyBottomIconContainer" onClick={closeStoryModal}>
                        <img src={close} alt="close" className="story-close" />
                      </div>
                    </div>
                  </div>

                  <div
                    className="large-story-image-container"
                    style={{ background: isDarkMode ? '#FCFCFC' : '#110E18' }}
                  >
                    <img
                      src={highlightStory[currentImageIndex]?.media[0].url}
                      alt="large-story-image"
                      className="large-story-image"
                    />
                  </div>

                  {/* {!selfStory && (
                    <div className="insideStory-bottomInputContainer">
                      <div className="insideStory-bottomright">
                        <div
                          onClick={() => {
                            if (highlight && highlight[currentHighlightIndex] && highlight[currentHighlightIndex][currentImageIndex]) {
                              likeHighlight(
                                highlight[currentHighlightIndex][currentImageIndex]?.author.soconId,
                                highlight[currentHighlightIndex][currentImageIndex]?.hash,
                                currentHighlightIndex,
                                currentImageIndex
                              )
                            }
                          }}
                          className="bottomicon-container"
                        >
                          {highlight && highlight[currentHighlightIndex] && highlight[currentHighlightIndex][currentImageIndex]?.isLiked
                            ? <img src={redHeart} alt="heart" className="bottomicon" />
                            : <img src={heart} alt="heart" className="bottomicon" />
                          }
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
                {!isMobileView && (
                  <div className="right0" onClick={handleRightCarouselClick}>
                    {isDarkMode ? (
                      <img src={rightLightMode} alt="right" />
                    ) : (
                      <img src={rightcarousel} alt="right" />
                    )}
                  </div>
                )}
              </div>
              {deleteHighlightConfirmation && (
                <div
                  className="confirmationModalOverlay"
                  onClick={closeDeleteHighlightConfirmation}
                >
                  <div className="confirmationModalContainer" onClick={(e) => e.stopPropagation()}>
                    <div className="confirmationTextContainer">
                      <p className="confirmationText">
                        Are you sure you want to delete your Highlights?
                      </p>
                    </div>
                    <div className="confirmationsButtonCOntainer">
                      <button
                        className="cancelConfirmationButton"
                        onClick={closeDeleteHighlightConfirmation}
                      >
                        Cancel
                      </button>
                      <button
                        className="confirmConfirmationButton"
                        onClick={() => deleteHighlight(highlightDetails[currentHighlightIndex])}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {openAddHighLightModal && <StoryHighLight details={userDetails} />}
          {editProfile && <EditProfile details={userDetails} />}
        </>
      )}

      {showFollowing && (
        <ShowFollowing
          soconId={soconId || retrievedSoconId}
          name={userDetails.display_name}
          initialState={isFollowing}
          closeFollowing={closeFollowing}
          defaultTab={defaultTab}
        />
      )}

      {shareModalOpen && profileLink && <Share link={profileLink} />}
      {(viewProfile || viewCover) && <UserProfileImage userDetails={userDetails} />}
      {(deleteAccountModal || logoutAccountModal) && <UserProfileOptions />}
      {showReportModal && <ReportModal />}
      {blockAccountModal && (
        <div
          className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
          // onClick={closelogoutConfirmation}
        >
          <div
            className={isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmationTextContainer">
              <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                Are you sure you want block @{userDetails.username} ?
              </p>
            </div>
            <div className="confirmationsButtonCOntainer">
              <button
                className={isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'}
                onClick={closeblockConfirmation}
              >
                Cancel
              </button>
              <button
                className={isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'}
                onClick={() => blockAccountFunc(soconId)}
              >
                Yes, Sure
              </button>
            </div>
          </div>
        </div>
      )}

      {allblockAccountList && (
        <div
          className={isDarkMode ? 'like-user-modal-overlay' : 'd-like-user-modal-overlay'}
          // onClick={closeLikeUser}
        >
          <div
            className={
              isDarkMode ? 'light-like-user-modal-content' : 'dark-like-user-modal-content'
            }
            // onClick={(e) => e.stopPropagation()}
          >
            <div className="like-user-header-box">
              <div className="liker-user-left-header">
                <div className="like-icon-container">
                  <img src={blocked} alt="blk" className="like-icon" />
                </div>
                <div className="like-title-container">
                  <p className={isDarkMode ? 'like-title' : 'd-like-title'}>
                    Blocked User ({allBlockedUsers.length})
                  </p>
                </div>
              </div>

              <div className="liker-user-right-header" onClick={closeallblockAccountModal}>
                <img
                  src={
                    isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'
                  }
                  className="like-user-close"
                />
              </div>
            </div>

            <div className={isDarkMode ? 'like-user-input-box' : 'd-like-user-input-box'}>
              <div className="like-search-icon-container">
                {isDarkMode ? (
                  <img src={searchLight} className="like-search-icon" alt="search" />
                ) : (
                  <img src={search} className="like-search-icon" alt="search" />
                )}
              </div>
              <div className="like-user-input-container">
                <input
                  placeholder="Search People here..."
                  type="text"
                  className={isDarkMode ? 'like-user-input' : 'd-like-user-input'}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            </div>
            <>
              {searchName.trim() ? (
                <div
                  className={isDarkMode ? 'user-like-main-container' : 'd-user-like-main-container'}
                >
                  {filteredBlockedUsers.length > 0 ? (
                    filteredBlockedUsers.map((user) => (
                      <div className="user-like-boxs" key={user.soconId}>
                        <div className="user-like-box-1">
                          <div className="user-like-image-container">
                            <img
                              src={user.pfp ? user.pfp : defaultProfile}
                              alt="image"
                              className="user-like-image"
                            />
                          </div>
                          <div className="user-like-box-2">
                            <div className="user-like-name-container">
                              <p className={isDarkMode ? 'user-like-name' : 'd-user-like-name'}>
                                {user.display_name}
                              </p>
                            </div>
                            <div className="user-like-id-container">
                              <p className={isDarkMode ? 'user-like-id' : 'd-user-like-id'}>
                                {user.username}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="user-like-buttons">
                          <button
                            className={isDarkMode ? 'like-user-follow' : 'd-like-user-follow'}
                            onClick={() => unBlockAccountFunc(user.soconId)}
                          >
                            Unblock
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#888' }}>
                      No results for "{searchName}"
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={isDarkMode ? 'user-like-main-container' : 'd-user-like-main-container'}
                >
                  {allBlockedUsers.length > 0 ? (
                    allBlockedUsers.map((user) => (
                      <div className="user-like-boxs" key={user.soconId}>
                        <div className="user-like-box-1">
                          <div className="user-like-image-container">
                            <img
                              src={user.pfp ? user.pfp : defaultProfile}
                              alt="image"
                              className="user-like-image"
                            />
                          </div>
                          <div className="user-like-box-2">
                            <div className="user-like-name-container">
                              <p className={isDarkMode ? 'user-like-name' : 'd-user-like-name'}>
                                {user.display_name}
                              </p>
                            </div>
                            <div className="user-like-id-container">
                              <p className={isDarkMode ? 'user-like-id' : 'd-user-like-id'}>
                                {user.username}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="user-like-buttons">
                          <button
                            className={isDarkMode ? 'like-user-follow' : 'd-like-user-follow'}
                            onClick={() => unBlockAccountFunc(user.soconId)}
                          >
                            Unblock
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#888' }}>No blocked users found.</p>
                  )}
                </div>
              )}
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
