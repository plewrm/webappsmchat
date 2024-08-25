import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from './pages/Sidebar';
import AddPost from './pages/AddPost';
import Search from './pages/Search';
import Stories from './pages/Stories';
import Post from './pages/userpost/Post';
import Message from './messages/Message';
import { useDispatch, useSelector } from 'react-redux';
import WaveNearby from '../modals/WaveNearby';
import UserProfile from '../modals/UserProfile';
import { Hidden } from '@mui/material';
import TopBar from './pages/TopBar';
import CreatePost from '../modals/CreatePost';
import { useTheme } from '../context/ThemeContext';
import Notifications from './pages/Notifications';
import ExpandPost from './pages/userpost/ExpandPost';
import HomeScreen from '../anonymous/component/HomeScreen';
import Discover from '../anonymous/component/discover/Discover';
import Chat from '../anonymous/component/chats/Chat';
import OpponentProfile from './pages/OpponentProfile';
import AnonymousNotification from '../anonymous/component/notification/AnonymousNotification';
import AnonymousAddPost from '../anonymous/component/AddPost/AnonymousAddPost';
import SelfProfileAnonumous from '../anonymous/component/anonymousSelfProfile/SelfProfileAnonumous';
import MsgHomeScreen from './messages/MsgHomeScreen';
import Discovers from './discover/Discovers';
import SearchComponent from './search/SearchComponent';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BEARER_TOKEN,
  BASE_URL,
  GETPROFILE,
  retrievedSoconId,
  retrievedToken
} from '../api/EndPoint';
import axios from 'axios';
import Repost from './pages/userpost/Repost';
import Share from './pages/userpost/Share';
import { setSoconIdByParams, setUsernameByParams } from '../redux/slices/modalSlice';

export default function HomeProfile() {
  const globalProfileState = useSelector((state) => state.loader.globalProfileState);
  useEffect(() => {}, [globalProfileState]);
  const { username } = useParams();
  const dispatch = useDispatch();
  const soconIdByParams = useSelector((state) => state.modal.soconIdByParams);
  const usernameByParams = useSelector((state) => state.modal.usernameByParams);
  const getUserProfileDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETPROFILE}/${username}`, { headers });
      console.log(response.data);
      dispatch(setSoconIdByParams(response.data.profile.soconId));
      dispatch(setUsernameByParams(response.data.profile.username));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
  }, [username]);
  const [maxHeight, setMaxHeight] = useState(window.innerHeight - window.innerHeight * 0.01); // Subtract 1% for the body margin
  const wavenearbyModalOpen = useSelector((state) => state.modal.wavenearbyModalOpen);
  const userProfile = useSelector((state) => state.modal.userProfile);
  const notificationModal = useSelector((state) => state.modal.notificationModal);
  const { homeTab, postTab, messageTab, notificationTab } = useSelector((state) => state.topbar);
  const expandPostModal = useSelector((state) => state.modal.expandPostModal);
  const anonymousView = useSelector((state) => state.anonView.anonymousView);
  const opponentProfile = useSelector((state) => state.modal.opponentProfile);
  const anonymousNotification = useSelector((state) => state.modal.anonymousNotification);
  const anonymousSelfProfile = useSelector((state) => state.modal.anonymousSelfProfile);
  const messageHomeScreen = useSelector((state) => state.modal.messageHomeScreen);
  const discoverView = useSelector((state) => state.modal.discoverView);
  const globalSearchScreen = useSelector((state) => state.modal.globalSearchScreen);
  const discoverTab = useSelector((state) => state.sideBar.discoverTab);
  const viewRepost = useSelector((state) => state.modal.viewRepost);
  // console.log(viewRepost)
  // const shareModalOpen = useSelector((state) => state.modal.shareModalOpen);

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!retrievedToken && !retrievedSoconId) {
      navigate('/');
    }

    const handleResize = () => {
      setMaxHeight(window.innerHeight - window.innerHeight * 0.01);
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Detach the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // screen types 'xs' 'sm' 'md' 'lg' 'xl'

  return (
    <div className="home-page-box-outer">
      <div className="home-page-box">
        {homeTab ? (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row">
              <Hidden only={['xs', 'sm', 'md']}>
                <Grid lg={2} direction="column">
                  <Grid xs={12} sx={{ marginRight: '7%', position: 'sticky', top: '0%' }}>
                    <Sidebar />
                  </Grid>
                </Grid>
              </Hidden>

              <Hidden only={['lg', 'xl']}>
                <Grid xs={12} sm={12} direction="column">
                  <Grid xs={12} sm={12}>
                    <TopBar />
                  </Grid>
                </Grid>
              </Hidden>

              <Grid xs={12} lg={6} direction="column">
                {!notificationModal && wavenearbyModalOpen ? (
                  <Grid xs={12} sx={{ marginRight: '2%', maxHeight: 'auto' }}>
                    {!userProfile && <WaveNearby />}
                  </Grid>
                ) : (
                  <>
                    <Grid xs={12} direction="column">
                      <Hidden only={['xs', 'sm', 'md']}>
                        <Grid xs={12} className={isDarkMode ? 'addpost-grid' : 'd-addpost-grid'}>
                          {!anonymousView && messageHomeScreen && <MsgHomeScreen />}
                          {anonymousView ? (
                            <AnonymousAddPost />
                          ) : (
                            !messageHomeScreen &&
                            !discoverView &&
                            !globalSearchScreen && <AddPost />
                          )}
                          {!anonymousView && discoverView && <Discovers />}
                          {!anonymousView && globalSearchScreen && <SearchComponent />}
                        </Grid>
                      </Hidden>

                      <Grid
                        xs={12}
                        sx={{ borderRadius: '16px', marginRight: '2%', maxHeight: 'auto' }}
                      >
                        {anonymousView ? (
                          discoverTab ? (
                            <Discover />
                          ) : (
                            <>
                              {!anonymousSelfProfile && !anonymousNotification && <HomeScreen />}
                              {anonymousSelfProfile && anonymousView && <SelfProfileAnonumous />}
                              {anonymousNotification && anonymousView && <AnonymousNotification />}
                            </>
                          )
                        ) : (
                          <>
                            {!anonymousView &&
                              !notificationModal &&
                              !expandPostModal &&
                              !messageHomeScreen &&
                              !discoverView &&
                              !globalSearchScreen &&
                              !viewRepost &&
                              usernameByParams === username && (
                                <UserProfile soconId={soconIdByParams} />
                              )}
                            {viewRepost && !anonymousView && <Repost />}
                            {notificationModal && !anonymousView && <Notifications />}
                            {expandPostModal && !anonymousView && <ExpandPost />}
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>

              <Hidden only={['xs', 'sm']}>
                <Grid
                  lg={4}
                  direction="column"
                  sx={{ position: 'sticky', top: '0%', height: '100vh' }}
                >
                  <Grid xs={12} sx={{ marginBottom: '4%' }}>
                    <Search />
                  </Grid>

                  <Grid xs={12} sx={{ marginBottom: '4%' }}>
                    {anonymousView ? <Chat /> : <Stories />}
                  </Grid>

                  <Grid xs={0}>{anonymousView ? <></> : <Message />}</Grid>
                </Grid>
              </Hidden>
            </Grid>
          </Box>
        ) : postTab ? (
          <CreatePost />
        ) : messageTab ? (
          <Message />
        ) : notificationTab ? (
          <Notifications />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
