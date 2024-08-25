import React, { useState, useEffect, useRef, useContext } from 'react';
import './UserProfile.css';
import { useTheme } from '../context/ThemeContext';
import moreH from '../assets/icons/s-more.svg';
import leftcarousel from '../assets/icons/left-carousel.svg';
import rightcarousel from '../assets/icons/right_carousel.svg';
import close from '../assets/icons/s-close.svg';
import share from '../assets/icons/send-2.svg';
import heart from '../assets/icons/heart.svg';
import { useDispatch, useSelector } from 'react-redux';
import greetMsg from '../assets/icons/greet-msg.svg';
import { useNavigate } from 'react-router-dom';
import noProfile from '../assets/icons/Default_pfp.webp';
import noCover from '../assets/images/plain-cover.png';
import {
  setEditProfile,
  setOpenAddHighLightModal,
  openShareModal
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
  DELETEACCOUNT
} from '../api/EndPoint';
import axios from 'axios';
import ShowFollowing from './ShowFollowing';
import { appendMessageData, setConversation } from '../redux/slices/chatSlice';
import { isPeerOnXmtpNetwork, startConversation } from '../xmtp/models/conversations';
import { useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Share from '../components/pages/userpost/Share';
import { getDate } from '../utils/time';
import leftBack from '../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../assets/icons/arrow-left-lightMode.svg';
import { clearMessageDb } from '../xmtp/models/db';
// import { setLoggedIn } from '../redux/slices/loggedInSlice';
//web3auth
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings
} from '@web3auth/wallet-connect-v2-adapter';
import { WalletConnectModal } from '@walletconnect/modal';
import {
  clientId,
  walletConnectProjectId,
  chainConfig,
  uiConfig,
  adapterSettings
} from '../constants/web3auth';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { username } = useParams();
  const { soconId } = useParams();
  const [visible, setVisible] = useState(false);
  const popoverRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig }
        });

        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
          privateKeyProvider,
          uiConfig: uiConfig
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: adapterSettings,
          loginSettings: {
            mfaLevel: 'none'
          },
          privateKeyProvider
        });

        web3auth.configureAdapter(openloginAdapter);

        const defaultWcSettings = await getWalletConnectV2Settings(
          CHAIN_NAMESPACES.EIP155,
          ['0x1', '0xaa36a7'],
          walletConnectProjectId
        );
        const walletConnectModal = new WalletConnectModal({
          projectId: walletConnectProjectId
        });
        const walletConnectV2Adapter = new WalletConnectV2Adapter({
          adapterSettings: {
            qrcodeModal: walletConnectModal,
            ...defaultWcSettings.adapterSettings
          },
          loginSettings: { ...defaultWcSettings.loginSettings }
        });

        web3auth.configureAdapter(walletConnectV2Adapter);
        setWeb3Auth(web3auth);

        await web3auth.init();

        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const togglePopover = () => {
    setVisible(!visible);
  };

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
      console.log('user profile', response.data);
      // setSoconId(response.data.profile.soconId)
      setUserDetails(response.data.profile);
      setFollow(response.data.profile.isFollowing);
    } catch (error) {
      console.error(error);
    }
  };

  const { isDarkMode } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [highlightStory, setHighlightStory] = useState(null);
  const [selfStory, setSelfStory] = useState(false);
  const [selfView, setSelfView] = useState(false);
  const [enableStoryTimer, setEnableStoryTimer] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  const [highlightDetails, setHighlightDetails] = useState(null);
  const [showFollowing, setShowFollowing] = useState(false);
  const [defaultTab, setDefaultTab] = useState(1); // Initialize defaultTab state
  const openAddHighLightModal = useSelector((state) => state.modal.openAddHighLightModal);
  const editProfile = useSelector((state) => state.modal.editProfile);
  const [follow, setFollow] = useState(null);
  const [greetMessageModal, setGreetMessageModal] = useState(null);
  const [chatModals, setChatModals] = useState(null);
  const xmtp = useSelector((state) => state.auth.xmtp);
  const { web3Auth } = useSelector((state) => state.auth);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);
  const globalProfileState = useSelector((state) => state.loader.globalProfileState);
  const [selecthighlightName, setSelectHighlightName] = useState(null);
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth <= 500);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [logoutAccountModal, setLogoutAccountModal] = useState(false);
  const [deleteHighlightConfirmation, setDeleteHighlightConformation] = useState(false);
  const openDeleteConfirmation = () => {
    setDeleteAccountModal(true);
  };
  // const closeDeleteConfirmation = () => { setDeleteAccountModal(false) }
  const openlogoutConfirmation = () => {
    setLogoutAccountModal(true);
  };
  const closelogoutConfirmation = () => {
    setLogoutAccountModal(false);
  };
  // const openDeleteHighlightConfirmation = () => { setDeleteHighlightConformation(true) }
  // const closeDeleteHighlightConfirmation = () => { setDeleteHighlightConformation(false) }

  useEffect(() => {
    const handleResize = () => {
      setIsScreenLarge(window.innerWidth <= 500);
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
      setFollow(response.data.profile.isFollowing);
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
      console.log(response.data);
      setHighlightDetails(response.data.highlights);
    } catch (error) {
      console.error(error);
    }
  };

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
      //TODO:change the 10 from the API
      if (selfStoryResponse.data.stories.length > 0) {
        setHighlightStory(selfStoryResponse.data.stories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeStoryModal = () => {
    // dispatch(closeStoryViewModal());
    setHighlightStory(null);
    setEnableStoryTimer(false);
  };

  const handleRightCarouselClick = () => {
    const nextImageIndex = (currentImageIndex + 1) % highlightStory.length;
    if (nextImageIndex === 0 && currentImageIndex == highlightStory.length - 1) {
      closeStoryModal();
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
      closeStoryModal();
    } else if (prevImageIndex === highlightStory.length - 1) {
      // Move to the previous array
      setCurrentImageIndex(0);
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
    console.log('open');
    dispatch(setOpenAddHighLightModal(true));
  };

  const openHighlightModal = (highlightName) => {
    getHighLightDetails(highlightName);
    setSelectHighlightName(highlightName);
    setEnableStoryTimer(true);
  };

  const openFollowers = () => {
    setShowFollowing(true);
    setDefaultTab(1); // Set defaultTab to 1 when Followers is clicked
  };
  const openFollowing = () => {
    setShowFollowing(true);
    setDefaultTab(2); // Set defaultTab to 2 when Following is clicked
  };
  const closeFollowing = () => {
    setShowFollowing(false);
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

  const deleteAccount = async () => {
    try {
      const BEARER_TOKEN = sessionStorage.getItem('token');
      const privateKey = localStorage.getItem('socon-privatekey');

      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const body = {
        privateKey: privateKey
      };

      const response = await axios.post(`${BASE_URL}${DELETEACCOUNT}`, body, { headers });
      logout();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
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

  const followUser = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${id}`, {}, { headers });
      console.log(response.data);
      setFollow((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const unFollowUser = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${id}`, { headers });
      console.log(response.data);
      setFollow((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const [followersCount, setFollowersCount] = useState(null);
  const [followingCount, setfollowingCount] = useState(null);
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const res1 = await axios.get(`${BASE_URL}${FOLLOWERS}/${soconId}`, { headers });
      const res2 = await axios.get(`${BASE_URL}${FOLLOWING}/${soconId}`, { headers });
      setFollowersCount(res1.data.followers.users.length);
      setfollowingCount(res2.data.following.users.length);
    } catch (error) {
      console.error(error);
    }
  };

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
      fetchData();
      getTimeline();
    }
  }, [soconId, globalProfileState, useParams()]);

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
      const response = await axios.delete(`${BASE_URL}${DELETEHIGHLIGHT}${selecthighlightName}`, {
        headers
      });
      setSelectHighlightName(null);
      console.log(response.data);
      toast.success('highlight deleted successfully!');
      closeStoryModal();
    } catch (error) {
      toast.error('something went wrong, try again!');
      console.error(error);
    }
  };

  const handleMobileBack = () => {
    navigate('/homepage');
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openDeleteHighlightConfirmation = (highlight) => {
    setIsDropdownOpen(false);
    setDeleteHighlightConformation(true);
  };

  const closeDeleteHighlightConfirmation = () => {
    setDeleteHighlightConformation(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDeleteConfirmation = (e) => {
    if (e.target.className === 'confirmationModalOverlay') {
      setDeleteHighlightConformation(false);
    }
  };

  return (
    <>
      {!showFollowing && (
        <>
          {isScreenLarge && (
            <div className={isDarkMode ? 'mobileBackContainer' : 'd-mobileBackContainer'}>
              <div className="leftBackContainer" onClick={handleMobileBack}>
                <img src={isDarkMode ? leftBackLight : leftBack} alt="back" className="leftBack" />
              </div>
            </div>
          )}
          <div className={isDarkMode ? 'userprofile-container' : 'd-userprofile-container'}>
            <div>
              <div className="user-cover-container">
                <img
                  src={userDetails.cover_photo ? userDetails.cover_photo : noCover}
                  alt="cover"
                  className="user-cover"
                />
              </div>

              <div className="user-profile-count-container">
                <div
                  className="users-profile-container"
                  onClick={() => {
                    getUserStories();
                  }}
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
                          {timelineCount || '0'}
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
                          {followersCount || '0'}
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
                          {followingCount || '0'}
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
                  {loggedInUser && username === loggedInUser.username && (
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
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                              onClick={openlogoutConfirmation}
                            >
                              <span className="popoverOption" style={{ color: '#F4323E' }}>
                                Log Out
                              </span>
                            </div>
                            <div
                              className={
                                isDarkMode ? 'popverOptionContainer' : 'd-popverOptionContainer'
                              }
                              onClick={openDeleteConfirmation}
                            >
                              <span className={isDarkMode ? 'popoverOption' : 'd-popoverOption'}>
                                Delete Account
                              </span>
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
                <div className="user-button-container">
                  {!follow ? (
                    <button
                      onClick={() => followUser(soconId)}
                      className={isDarkMode ? 'opponent-follow-button' : 'd-opponent-follow-button'}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      onClick={() => unFollowUser(soconId)}
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
                  highlightDetails.map((item) => (
                    <div
                      onClick={() => openHighlightModal(item.title)}
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
          {highlightStory && highlightStory.length > 0 && (
            <div className="modal-overlay5">
              <div className={isDarkMode ? 'light-modal-content5' : 'dark-modal-content5'}>
                {' '}
                {!isScreenLarge && (
                  <div className="left0" onClick={handleLeftCarouselClick}>
                    <img src={leftcarousel} alt="left" />
                  </div>
                )}
                <div className={isDarkMode ? 'inside-story-box' : 'd-inside-story-box'}>
                  {isScreenLarge && (
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
                          highlightStory && highlightStory[currentImageIndex].author.pfp
                            ? highlightStory[currentImageIndex].author.pfp
                            : noProfile
                        }
                        className="inside-story-profile"
                        alt="image"
                      />
                    </div>
                    <div className="insideStory-name-container">
                      <p className="insideStory-name">
                        {highlightStory && highlightStory[currentImageIndex].author.display_name}
                      </p>
                    </div>
                    <div className="insideStory-timeContainer">
                      <p className="insideStory-time">
                        {highlightStory && getDate(highlightStory[currentImageIndex].timestamp)}
                      </p>
                    </div>
                    <div className="story-right-box">
                      {/* <div 
                      onClick={() => openDeleteHighlightConfirmation(highlightStory[currentImageIndex])} 
                      className='storyBottomIconContainer'>
                        <img src={moreH} alt='more' />
                      </div> */}

                      <div onClick={toggleDropdown} className="storyBottomIconContainer">
                        <img src={moreH} alt="more" />
                      </div>

                      {isDropdownOpen && (
                        <div className="dropdownMenu">
                          <div
                            className="dropdownItem"
                            onClick={() =>
                              openDeleteHighlightConfirmation(highlightStory[currentImageIndex])
                            }
                          >
                            Delete Highlight
                          </div>
                        </div>
                      )}

                      <div className="storyBottomIconContainer" onClick={closeStoryModal}>
                        <img src={close} alt="close" className="story-close" />
                      </div>
                    </div>
                  </div>

                  <div className="large-story-image-container">
                    <img
                      src={highlightStory[currentImageIndex]?.media[0].url}
                      alt="large-story-image"
                      className="large-story-image"
                    />
                  </div>

                  {!selfStory && (
                    <div className="insideStory-bottomInputContainer">
                      <div className={isDarkMode ? 'story-input-bottom' : 'd-story-input-bottom'}>
                        <div className="insidestory-inputProfile-container">
                          <img
                            src={highlightStory[currentImageIndex].author.pfp}
                            alt="profilepic"
                            className="insidestory-inputProfile"
                          />
                        </div>
                        <input
                          className={isDarkMode ? 'insideStory-input' : 'd-insideStory-input'}
                          placeholder="Name"
                        />
                      </div>

                      <div className="insideStory-bottomright">
                        <div className="bottomicon-container">
                          <img src={heart} alt="heart" className="bottomicon" />
                        </div>
                        <div className="bottomicon-container">
                          <img src={share} alt="share" className="bottomicon" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {!isScreenLarge && (
                  <div className="right0" onClick={handleRightCarouselClick}>
                    <img src={rightcarousel} alt="right" />
                  </div>
                )}
              </div>
              {/* {deleteHighlightConfirmation && (
                <div className='confirmationModalOverlay' onClick={closeDeleteConfirmation}>
                  <div className='confirmationModalContainer' onClick={(e) => e.stopPropagation()}>
                    <div className='confirmationTextContainer' >
                      <p className='confirmationText'>Are you sure you want to delete your Highlights?</p>
                    </div>
                    <div className='confirmationsButtonCOntainer'>
                      <button className='cancelConfirmationButton' onClick={closeDeleteHighlightConfirmation}>Cancel</button>
                      <button className='confirmConfirmationButton' onClick={() => deleteHighlight(highlightStory[currentImageIndex])}>Delete</button>
                    </div>
                  </div>
                </div>
              )} */}

              {deleteHighlightConfirmation && (
                <div className="confirmationModalOverlay" onClick={closeDeleteConfirmation}>
                  <div className="confirmationModalContainer" onClick={(e) => e.stopPropagation()}>
                    <div className="confirmationTextContainer">
                      <p className="confirmationText">
                        Are you sure you want to delete your Highlights?
                      </p>
                    </div>
                    <div className="confirmationsButtonContainer">
                      <button
                        className="cancelConfirmationButton"
                        onClick={closeDeleteHighlightConfirmation}
                      >
                        Cancel
                      </button>
                      <button
                        className="confirmConfirmationButton"
                        onClick={() => deleteHighlight(highlightStory[currentImageIndex])}
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
          initialState={follow}
          closeFollowing={closeFollowing}
          defaultTab={defaultTab}
        />
      )}

      {shareModalOpen && profileLink && <Share link={profileLink} />}
      {deleteAccountModal && (
        <div
          className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
          onClick={closeDeleteConfirmation}
        >
          <div
            className={isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmationTextContainer">
              <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                Are you sure you want to delete your account?
              </p>
            </div>
            <div className="confirmationsButtonCOntainer">
              <button
                className={isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'}
                onClick={closeDeleteConfirmation}
              >
                Cancel
              </button>
              <button
                className={isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'}
                onClick={deleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {logoutAccountModal && (
        <div
          className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
          onClick={closelogoutConfirmation}
        >
          <div
            className={isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmationTextContainer">
              <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                Are you sure you want to logout your account?
              </p>
            </div>
            <div className="confirmationsButtonCOntainer">
              <button
                className={isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'}
                onClick={closelogoutConfirmation}
              >
                Cancel
              </button>
              <button
                className={isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'}
                onClick={logout}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
