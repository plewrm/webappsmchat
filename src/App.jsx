import React, { useEffect, useState } from 'react';
import Login from './components/login/Login';
import { useTheme } from './context/ThemeContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserProfile from './modals/UserProfile';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { setXmtp } from './redux/slices/authSlice';
import { Toaster } from 'react-hot-toast';
import useFirebaseMessaging from '@useweb/firebase/useFirebaseMessaging';
import toast from 'react-hot-toast';
import { BEARER_TOKEN, FIREBASETOKEN, BASE_URL } from './api/EndPoint';
import axios from 'axios';
import CreatePost from './modals/CreatePost';
import AnonymousCreatePost from './anonymous/modal/AnonymousCreatePost';
import AnonymousSpinbuzz from './anonymous/modal/AnonymousSpinbuzz';
import SpinbuzzMessage from './modals/SpinbuzzMessage';
import SelfProfileAnonumous from './anonymous/component/anonymousSelfProfile/SelfProfileAnonumous';
import './components/HomePage.css';
import Sidebar from './components/pages/Sidebar';
import AddPost from './components/pages/AddPost';
import Search from './components/pages/Search';
import Stories from './components/pages/Stories';
import Post from './components/pages/userpost/Post';
import Message from './components/messages/Message';
import WaveNearby from './modals/WaveNearby';
import { Hidden } from '@mui/material';
import TopBar from './components/pages/TopBar';
import Notifications from './components/pages/Notifications';
import ExpandPost from './components/pages/userpost/ExpandPost';
import HomeScreen from './anonymous/component/HomeScreen';
import Discover from './anonymous/component/discover/Discover';
import Chat from './anonymous/component/chats/Chat';
import AnonymousNotification from './anonymous/component/notification/AnonymousNotification';
import AnonymousAddPost from './anonymous/component/AddPost/AnonymousAddPost';
import MsgHomeScreen from './components/messages/MsgHomeScreen';
import Discovers from './components/discover/Discovers';
import SearchComponent from './components/search/SearchComponent';
import { useNavigate } from 'react-router-dom';
import Repost from './components/pages/userpost/Repost';
import EachCommunity from './anonymous/component/discover/EachCommunity';
import Spinbuzz from './modals/Spinbuzz';
import ProfileSetup from './modals/ProfileSetup';
import { setAnonDetails } from './redux/slices/anonSlices';
import NotFound from './components/pages/NotFound';
import SideBarAnon from './components/pages/SideBarAnon';
import MessageToggle from './components/messages/MessageToggle';
import TopBarAnon from './components/pages/TopBarAnon';
import { setAnonymousView } from './redux/slices/anonViewSlice';
import ScrollHook from './customHooks/ScrollHook';
import SpinbuzzV2 from './modals/spinbuzzNew/SpinbuzzV2';
import SpinbuzzChat from './modals/spinbuzzNew/SpinbuzzChat';
import VideoCall from './components/calling/VideoCall';
import AudioCall from './components/calling/AudioCall';
import { HuddleClient, HuddleProvider } from '@huddle01/react';
import { Offline } from 'react-detect-offline';
import ComingFeature from './modals/comingFeature/ComingFeature';
import MessageExpanded from './anonymous/component/chats/MessageExpanded';
import SuggestedCommunity from './anonymous/component/suggestedCommunity/SuggestedCommunity';
import AnonSearch from './anonymous/component/search/AnonSearch';
import AnonSearchComponent from './anonymous/component/search/AnonSearchComponent';
import SaveCollection from './components/pages/userpost/savePost/SaveCollection';
import SavePosts from './components/pages/userpost/savePost/SavePosts';
import SavePostsModal from './components/pages/userpost/savePost/SavePostsModal';
import AddCollectionModal from './components/pages/userpost/savePost/AddCollectionModal';
import UnSavePostModal from './components/pages/userpost/savePost/UnSavePostModal';

const huddleClient = new HuddleClient({
  projectId: import.meta.env.VITE_HUDDLE_PROJECT_ID,
  options: {
    // `activeSpeakers` will be most active `n` number of peers, by default it's 8
    activeSpeakers: {
      size: 12
    }
  }
});
const App = () => {
  ScrollHook();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const anonymousView = useSelector((state) => state.anonView.anonymousView);
  const backgroundColor = anonymousView ? '#191622' : isDarkMode ? 'rgb(239,237,248)' : '#191622';
  const isCreatePostModalOpen = useSelector((state) => state.modal.isCreatePostModalOpen);
  const spinbuzzMessageModalOpen = useSelector((state) => state.modal.spinbuzzMessageModalOpen);
  const anonymousspinBuzz = useSelector((state) => state.modal.anonymousspinBuzz);
  const anonymousCreateProfile = useSelector((state) => state.modal.anonymousCreateProfile);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const globalSearchScreen = useSelector((state) => state.modal.globalSearchScreen);
  const anonGlobalSearchScreen = useSelector((state) => state.modal.anonGlobalSearchScreen);
  const responseLoader = useSelector((state) => state.loader.responseLoader);
  const onWait = useSelector((state) => state.community.onWait);
  const anonMessageMobile = useSelector((state) => state.mobileActions.anonMessageMobile);
  const spinbuzzNew = useSelector((state) => state.spinbuzz.spinbuzzNew);
  const videoCall = useSelector((state) => state.call.videoCall);
  const audioCall = useSelector((state) => state.call.audioCall);
  const showSpinbuzzChat = useSelector((state) => state.spinbuzz.showSpinbuzzChat);
  const newFeature = useSelector((state) => state.modal.newFeature);
  const savePostModal = useSelector((state) => state.modal.savePostModal);
  const addCollectionModal = useSelector((state) => state.modal.addCollectionModal);
  const unSavePosts = useSelector((state) => state.modal.unSavePosts);
  useEffect(() => {}, [responseLoader]);

  const handleCloseSpinbuzz = () => {
    dispatch(setAnonymousView(false));
    navigate('/homepage');
  };

  const completeAnonProfileSetup = () => {
    dispatch(setAnonDetails(true));
  };

  useEffect(() => {}, [anonymousView]);

  const messageMobile = useSelector((state) => state.mobileActions.messageMobile);

  const initializeXmtp = async () => {
    const privateKey = localStorage.getItem('socon-privatekey');
    if (!privateKey) {
      console.log('No private key found, login again.');
      return;
    }
    const wallet = new ethers.Wallet(privateKey);
    // console.log('Wallet:', wallet);

    const xmtp = await Client.create(wallet);
    dispatch(setXmtp(xmtp));
    return xmtp;
  };

  const [setup, setSetup] = useState(false);
  useEffect(() => {
    initializeXmtp();
    if (localStorage.getItem('firstLogin') === 'true') {
      setSetup(true);
      localStorage.setItem('firstLogin', false);
    }
  }, []);

  const firebaseMessaging = useFirebaseMessaging({
    onMessage: (message) => {
      console.log(`Received foreground message`, message);
      const snackMessage = `${message?.notification.title} ${message?.notification.body}`;
      // console.log(snackMessage)
      toast.custom((t) => (
        <div className={`custom-toast-container ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <div className="custom-toast-content">
            <div className="flex items-start">
              <div className="custom-toast-avatar">
                <img src={message?.notification.image} alt="avatar-icon"></img>
              </div>
              <div className="ml-3 flex-1">
                <p className="custom-toast-message">{snackMessage}</p>
              </div>
            </div>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="custom-toast-close-button">
            {/* Close */}
            <img src={'/darkIcon/arrowrightToast.svg'} alt="avatar-icon"></img>
          </button>
        </div>
      ));
    }
  });

  useEffect(() => {
    firebaseMessaging.init();
  }, []);

  const sendFireBaseToken = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${BASE_URL}${FIREBASETOKEN}`,
        { firebaseToken: firebaseMessaging.fcmRegistrationToken },
        { headers }
      );
      // onMessage(messaging, (payload) => {
      //   console.log(payload)
      // })
    } catch (error) {
      console.error(error);
    }
  };

  if (firebaseMessaging.fcmRegistrationToken != null) {
    // console.log(firebaseMessaging.fcmRegistrationToken);
    sendFireBaseToken();
  }
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

  const themeStyles = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    color: isDarkMode ? 'white' : 'black'
  };
  return (
    <>
      <div style={themeStyles}>
        <HuddleProvider client={huddleClient}>
          {responseLoader ? (
            <div
              style={{ backgroundColor, minHeight: '100vh' }}
              className={isMobileView ? 'mobileMargin' : 'webMargin'}
            >
              <div className="loaderContainer">
                <div className={isDarkMode ? 'loader' : 'd-loader'}></div>
              </div>
            </div>
          ) : (
            <div>
              <Routes>
                <Route path="/" element={<Login />} />
              </Routes>
              {!['/', '/login'].includes(location.pathname) && (
                <div
                  style={{ backgroundColor, minHeight: '100vh' }}
                  className={isMobileView ? 'mobileMargin' : 'webMargin'}
                >
                  <Toaster
                    position="top-center"
                    reverseOrder={true}
                    toastOptions={{ success: { theme: { primary: '#4aed88' } } }}
                  ></Toaster>

                  {anonymousView ? (
                    <>
                      <div
                        className={
                          isMobileView ? 'home-page-box-outer_mobile' : 'home-page-box-outer'
                        }
                      >
                        <div className="home-page-box">
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container direction="row">
                              <Hidden only={['xs', 'sm', 'md']}>
                                <Grid lg={2.5} direction="column">
                                  <Grid
                                    xs={12}
                                    sx={{ marginRight: '8px', position: 'sticky', top: '0%' }}
                                  >
                                    <SideBarAnon />
                                  </Grid>
                                </Grid>
                              </Hidden>
                              <Routes>
                                <>
                                  {isMobileView && anonMessageMobile ? (
                                    <Route
                                      path="anon/homepage"
                                      element={
                                        <Grid lg={12} xs={12}>
                                          <Grid xs={0}>
                                            <Chat />
                                          </Grid>
                                        </Grid>
                                      }
                                    ></Route>
                                  ) : (
                                    <Route
                                      path="anon/homepage"
                                      element={
                                        <>
                                          <Hidden only={['xl', 'lg']}>
                                            <Grid xs={12} sm={12} direction="column">
                                              <Grid xs={12} sm={12}>
                                                <TopBarAnon />
                                              </Grid>
                                            </Grid>
                                          </Hidden>
                                          <Grid xs={12} lg={6} direction="column">
                                            <Grid xs={12} direction="column">
                                              <Hidden only={['xs', 'sm', 'md']}>
                                                <Grid
                                                  xs={12}
                                                  className={
                                                    isDarkMode ? 'addpost-grid' : 'd-addpost-grid'
                                                  }
                                                >
                                                  <AnonymousAddPost />
                                                </Grid>
                                              </Hidden>
                                              <Grid
                                                xs={12}
                                                sx={{
                                                  borderRadius: '16px',
                                                  marginRight: !isMobileView ? '8px' : '0%',
                                                  maxHeight: 'auto'
                                                }}
                                              >
                                                {anonymousView ? <HomeScreen /> : <Post />}
                                                {anonymousView ? (
                                                  <></>
                                                ) : (
                                                  setup && (
                                                    <ProfileSetup
                                                      closeSetup={() => setSetup(false)}
                                                    />
                                                  )
                                                )}
                                              </Grid>
                                            </Grid>
                                          </Grid>
                                        </>
                                      }
                                    />
                                  )}
                                </>
                                <Route
                                  path="/anon/:username"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                      >
                                        <SelfProfileAnonumous />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="anon/notifications"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <AnonymousNotification />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="*"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                      >
                                        <NotFound />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="anon/discovers"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <Discover />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="anon/homepage/communities/:communityName"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <EachCommunity />
                                      </Grid>
                                    </Grid>
                                  }
                                />
                              </Routes>
                              {!isMobileView && (
                                <>
                                  {anonGlobalSearchScreen ? (
                                    <>
                                      <Grid
                                        lg={3.5}
                                        direction="column"
                                        sx={{ position: 'sticky', top: '1%', maxHeight: '100vh' }}
                                      >
                                        <Grid xs={12} sx={{ marginBottom: '8px' }}>
                                          <AnonSearchComponent />
                                        </Grid>
                                      </Grid>
                                    </>
                                  ) : (
                                    <>
                                      <Grid
                                        lg={3.5}
                                        direction="column"
                                        sx={{ position: 'sticky', top: '1%', maxHeight: '100vh' }}
                                      >
                                        <Grid xs={12} sx={{ marginBottom: '8px' }}>
                                          <AnonSearch />
                                        </Grid>
                                        <Hidden only={['xs', 'sm', 'md']}>
                                          <Grid xs={12} sx={{ marginBottom: '8px' }}>
                                            <SuggestedCommunity />
                                          </Grid>
                                        </Hidden>

                                        <Hidden only={['xs', 'sm', 'md']}>
                                          <Grid xs={0}>
                                            <MessageExpanded />
                                          </Grid>
                                        </Hidden>
                                      </Grid>
                                    </>
                                  )}
                                </>
                              )}
                            </Grid>
                          </Box>
                        </div>
                      </div>
                      {anonymousCreateProfile && <AnonymousCreatePost />}
                      {anonymousspinBuzz && <AnonymousSpinbuzz />}
                      {spinbuzzMessageModalOpen && <SpinbuzzMessage />}
                      {newFeature && <ComingFeature />}
                      {anonymousView ? (
                        anonDetails ? (
                          <></>
                        ) : (
                          onWait && (
                            <Spinbuzz
                              done={completeAnonProfileSetup}
                              handleCloseSpinbuzz={handleCloseSpinbuzz}
                            />
                          )
                        )
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className={
                          isMobileView ? 'home-page-box-outer_mobile' : 'home-page-box-outer'
                        }
                      >
                        <div className="home-page-box">
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container direction="row">
                              {!location.pathname.startsWith('/videocall/') && (
                                <Hidden only={['xs', 'sm', 'md']}>
                                  <Grid lg={2.5} direction="column">
                                    <Grid
                                      xs={12}
                                      sx={{ marginRight: '8px', position: 'sticky', top: '1%' }}
                                    >
                                      <Sidebar />
                                    </Grid>
                                  </Grid>
                                </Hidden>
                              )}

                              <Routes>
                                <>
                                  {isMobileView && (messageMobile || globalSearchScreen) ? (
                                    <Route
                                      path="/homepage"
                                      element={
                                        <Grid lg={12}>
                                          <Grid xs={0}>
                                            {messageMobile && <Message />}
                                            {globalSearchScreen && <SearchComponent />}
                                          </Grid>
                                        </Grid>
                                      }
                                    ></Route>
                                  ) : (
                                    <Route
                                      path="/homepage"
                                      element={
                                        <>
                                          <Hidden only={['xl', 'lg']}>
                                            <Grid xs={12} sm={12} direction="column">
                                              <Grid xs={12} sm={12}>
                                                <TopBar />
                                              </Grid>
                                            </Grid>
                                          </Hidden>
                                          <Grid xs={12} lg={6} direction="column">
                                            <Grid xs={12} direction="column">
                                              <Hidden only={['xs', 'sm', 'md']}>
                                                <Grid
                                                  xs={12}
                                                  className={
                                                    isDarkMode ? 'addpost-grid' : 'd-addpost-grid'
                                                  }
                                                >
                                                  <AddPost />
                                                </Grid>
                                              </Hidden>
                                              <Grid
                                                xs={12}
                                                sx={{
                                                  borderRadius: '16px',
                                                  marginRight: !isMobileView ? '8px' : '0%',
                                                  maxHeight: 'auto'
                                                }}
                                              >
                                                <Post />
                                              </Grid>
                                            </Grid>
                                          </Grid>
                                        </>
                                      }
                                    />
                                  )}
                                </>

                                <Route
                                  path="/profile/:username/:soconId"
                                  element={
                                    <>
                                      {
                                        <Grid xs={12} lg={6} direction="column">
                                          <Grid
                                            xs={12}
                                            sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                          >
                                            <UserProfile />
                                          </Grid>
                                        </Grid>
                                      }
                                    </>
                                  }
                                />

                                <Route
                                  path="*"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                      >
                                        <NotFound />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="/repost"
                                  element={
                                    <>
                                      {' '}
                                      {
                                        <Grid xs={12} lg={6} direction="column">
                                          <Grid
                                            xs={12}
                                            sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                          >
                                            <Repost />
                                          </Grid>
                                        </Grid>
                                      }{' '}
                                    </>
                                  }
                                />

                                <Route
                                  path="/wavenearby"
                                  element={
                                    <>
                                      {
                                        <Grid xs={12} lg={6} direction="column">
                                          <Grid
                                            xs={12}
                                            sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                          >
                                            <WaveNearby />
                                          </Grid>
                                        </Grid>
                                      }
                                    </>
                                  }
                                />

                                <Route
                                  exact
                                  path="/notifications"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <Notifications />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="/messages"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <MsgHomeScreen />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="/discovers"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <Discovers />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="/saved"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <SaveCollection />
                                      </Grid>
                                    </Grid>
                                  }
                                />
                                <Route
                                  path="/saved/posts"
                                  element={
                                    <Grid xs={12} lg={6} direction="column">
                                      <Grid
                                        xs={12}
                                        sx={{
                                          marginRight: !isMobileView ? '8px' : '0%',
                                          maxHeight: 'auto'
                                        }}
                                      >
                                        <SavePosts />
                                      </Grid>
                                    </Grid>
                                  }
                                />

                                <Route
                                  path="/homepage/post/:hash/:soconId"
                                  element={
                                    <>
                                      {
                                        <Grid xs={12} lg={6} direction="column">
                                          <Grid
                                            xs={12}
                                            sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                          >
                                            <ExpandPost />
                                          </Grid>
                                        </Grid>
                                      }
                                    </>
                                  }
                                />

                                <Route
                                  path="/videocall/:roomid"
                                  element={
                                    <>
                                      {
                                        <Grid xs={12} lg={6} direction="column">
                                          <Grid
                                            xs={12}
                                            sx={{ marginRight: !isMobileView ? '8px' : '0%' }}
                                          >
                                            <VideoCall />
                                          </Grid>
                                        </Grid>
                                      }
                                    </>
                                  }
                                />
                              </Routes>

                              {!location.pathname.startsWith('/videocall/') && !isMobileView && (
                                <>
                                  {globalSearchScreen ? (
                                    <>
                                      <Grid
                                        lg={3.5}
                                        direction="column"
                                        sx={{ position: 'sticky', top: '1%', maxHeight: '100vh' }}
                                      >
                                        <Grid xs={12} sx={{ marginBottom: '8px' }}>
                                          <SearchComponent />
                                        </Grid>
                                      </Grid>
                                    </>
                                  ) : (
                                    <>
                                      <Grid
                                        lg={3.5}
                                        direction="column"
                                        sx={{ position: 'sticky', top: '1%', maxHeight: '100vh' }}
                                      >
                                        <Grid xs={12} sx={{ marginBottom: '8px' }}>
                                          <Search />
                                        </Grid>
                                        <Hidden only={['xs', 'sm', 'md']}>
                                          <Grid xs={12} sx={{ marginBottom: '8px' }}>
                                            <Stories />
                                          </Grid>
                                        </Hidden>

                                        <Hidden only={['xs', 'sm', 'md']}>
                                          <Grid xs={0}>
                                            <MessageToggle />
                                          </Grid>
                                        </Hidden>
                                      </Grid>
                                    </>
                                  )}
                                </>
                              )}
                            </Grid>
                          </Box>
                        </div>
                      </div>
                      {isCreatePostModalOpen && <CreatePost />}
                      {spinbuzzNew && <SpinbuzzV2 />}
                      {showSpinbuzzChat && <SpinbuzzChat />}
                      {/* {videoCall && <VideoCall />} */}
                      {audioCall && <AudioCall />}
                      {savePostModal && <SavePostsModal />}
                      {addCollectionModal && <AddCollectionModal />}
                      {unSavePosts && <UnSavePostModal />}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </HuddleProvider>
      </div>
    </>
  );
};

export default App;

// import React, { useState } from 'react';
// import Cropper from 'react-easy-crop';
// import { v4 as uuidv4 } from 'uuid';

// const App = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [showCropper, setShowCropper] = useState(false);

//   const handleImageChange = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);

//         reader.onload = () => {
//           setSelectedImage(reader.result);
//           setShowCropper(true);
//         };
//       }
//     };
//     input.click();
//   };

//   const onCropComplete = (croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   };

//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener('load', () => resolve(image));
//       image.addEventListener('error', (error) => reject(error));
//       image.setAttribute('crossOrigin', 'anonymous'); // for CORS image issue
//       image.src = url;
//     });

//   const getCroppedImg = async (imageSrc, crop) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     const { width: imgWidth, height: imgHeight } = image;
//     const { width: cropWidth, height: cropHeight, x: cropX, y: cropY } = crop;

//     canvas.width = cropWidth;
//     canvas.height = cropHeight;

//     ctx.drawImage(
//       image,
//       cropX,
//       cropY,
//       cropWidth,
//       cropHeight,
//       0,
//       0,
//       cropWidth,
//       cropHeight
//     );

//     return new Promise((resolve, reject) => {
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const fileUrl = URL.createObjectURL(blob);
//           resolve(fileUrl);
//         } else {
//           reject(new Error('Canvas is empty'));
//         }
//       }, 'image/jpeg');
//     });
//   };

//   const showCroppedImage = async () => {
//     try {
//       const croppedImageUrl = await getCroppedImg(selectedImage, croppedAreaPixels);
//       setCroppedImage(croppedImageUrl);
//       setShowCropper(false);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <button style={{ border: 'none', margin: '20px', cursor: 'pointer' }} onClick={handleImageChange}>
//         Select Image
//       </button>

//       {showCropper ? (
//         <div style={{ position: 'relative', width: '600px', height: '600px' }}>
//           <Cropper
//             image={selectedImage}
//             crop={crop}
//             zoom={zoom}
//             aspect={4 / 4}
//             onCropChange={setCrop}
//             onCropComplete={onCropComplete}
//             onZoomChange={setZoom}
//           />
//           <button onClick={showCroppedImage} style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
//             Crop
//           </button>
//         </div>
//       ) : (
//         <div style={{ width: '600px', height: '600px', border: '1px solid red' }}>
//           <img
//             src={croppedImage || ''}
//             alt="croppedImage"
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
