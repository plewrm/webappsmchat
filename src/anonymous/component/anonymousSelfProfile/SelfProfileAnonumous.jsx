import React, { useEffect, useState } from 'react';
import styles from './SelfProfileAnonymous.module.css';
import arrowLeft from '../../../assets/anonymous/icon/arrow-left.svg';
import more from '../../../assets/icons/More.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAnonymousLeaveCommunity,
  setAnonymousSelfProfile,
  setAnonymousJoinedMore,
  setCreatedCommunityMore,
  setPreviousPath
} from '../../../redux/slices/modalSlice';
import HomeScreen from '../HomeScreen';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETANON,
  COMMUNITIESJOINEDBYME,
  DELETECOMMUNITY,
  GETALLCOMMUNITIESCREATED,
  DELETEMEMBER
} from '../../../api/EndPoint';
import { setCommunityName, setCommunityStatus } from '../../../redux/slices/anonSlices';
import axios from 'axios';
import { Popover, Skeleton } from 'antd';
import EditProfile from './EditProfille';
import EachCommunity from '../discover/EachCommunity';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setAnonDetails } from '../../../redux/slices/anonSlices';
import { useTheme } from '../../../context/ThemeContext';
import SelfProfileAnonSkeleton from './SelfProfileAnonSkeleton';
const SelfProfileAnonumous = () => {
  const { username } = useParams();
  // console.log(username)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const anonymousLeaveCommunity = useSelector((state) => state.modal.anonymousLeaveCommunity);
  const anonymousJoinedMore = useSelector((state) => state.modal.anonymousJoinedMore);
  const createdCommunityMore = useSelector((state) => state.modal.createdCommunityMore);
  const previousPath = useSelector((state) => state.modal.previousPath);
  const [selectedCommunityImage, setSelectedCommunityImage] = useState('');
  const [selectedCommunityName, setSelectedCommunityName] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [innerActiveTab, setInnerActiveTab] = useState(1);
  const [editProfile, setEditProfile] = useState(false);
  const [change, setChange] = useState(false);
  const [communityAdminName, setCommunityAdminName] = useState(null);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const { isDarkMode } = useTheme();
  const [openCommunity, setOpenCommunity] = useState(false);

  const showLeaveCommunity = (communityImage, communityName, adminName) => {
    setSelectedCommunityImage(communityImage);
    setSelectedCommunityName(communityName);
    setCommunityAdminName(adminName);
    dispatch(setAnonymousLeaveCommunity(true));
    dispatch(setAnonymousJoinedMore(false));
  };
  const hideLeaveCommunity = () => {
    dispatch(setAnonymousLeaveCommunity(false));
  };

  const showMoreOption = (communityImage, communityName) => {
    setSelectedCommunityImage(communityImage);
    setSelectedCommunityName(communityName);
    dispatch(setAnonymousJoinedMore(true));
  };
  const showCreatedMore = (communityImage, communityName) => {
    setSelectedCommunityImage(communityImage);
    setSelectedCommunityName(communityName);
    dispatch(setCreatedCommunityMore(true));
  };
  const hideCreatedMore = () => {
    dispatch(setCreatedCommunityMore(false));
  };
  const hideMoreOption = () => {
    dispatch(setAnonymousJoinedMore(false));
  };
  const handleCloseProfile = () => {
    dispatch(setAnonymousSelfProfile(false));
    navigate(-1 || '/anon/homepage');
    // navigate('/anon/homepage');
  };
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  const handleInnerTabClick = (tabNumber) => {
    setInnerActiveTab(tabNumber);
  };
  const openEditProfile = () => {
    setEditProfile(true);
  };
  const closeEditProfile = () => {
    setEditProfile(false);
  };
  const [user, setUser] = useState(null);
  const fetchAnonDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      let response = await axios.get(`${BASE_URL}${GETANON}/${username}`, { headers });
      console.log(response.data);
      if (response.data.message === 'Success') {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [joinedCommunities, setJoinedCommunities] = useState(null);
  const fetchAllJoinedCommunities = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${COMMUNITIESJOINEDBYME}/${username}`, {
        headers
      });
      setJoinedCommunities(response.data.communities);
    } catch (error) {
      console.error(error);
    }
  };
  const [communitiesCreatedByMe, setCommunitiesCreatedByMe] = useState(null);
  const fetchCommunitiesCreatedByMe = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETALLCOMMUNITIESCREATED}/${username}`, {
        headers
      });
      setCommunitiesCreatedByMe(response.data.communities);
      // console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCurrentAnonDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      let response = await axios.get(`${BASE_URL}${GETANON}`, { headers });
      console.log(response.data);
      if (response.data.message === 'Success') {
        dispatch(setAnonDetails(response.data.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setUser(null);
    fetchAnonDetails();
    fetchAllJoinedCommunities();
    fetchCommunitiesCreatedByMe();
    if (!anonDetails) {
      fetchCurrentAnonDetails();
    }
    // if (username) { }
  }, [change, username]);

  const deleteCommunity = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.delete(`${BASE_URL}${DELETECOMMUNITY}${selectedCommunityName}`, {
        headers
      });
      setChange((prev) => !prev);
      console.log(response.data);
      hideCreatedMore();
    } catch (error) {
      console.error(error);
    }
  };

  const leaveCommunity = async () => {
    if (user.name === communityAdminName) {
      toast.error('You cannot leave this community!');
      return;
    }
    try {
      const leaveObj = {
        communityName: selectedCommunityName,
        username: user.name
      };
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${BASE_URL}${DELETEMEMBER}`, {
        data: leaveObj,
        headers
      });
      setChange((prev) => !prev);
      dispatch(setCommunityStatus(false));
      console.log(response.data);
      hideLeaveCommunity();
    } catch (error) {
      console.error(error.message);
    }
  };

  const [show, setShow] = useState(false);
  const goTo = (communityName) => {
    setShow(true);
    // dispatch(setCommunityName(communityName));
    navigate(`/anon/homepage/communities/${communityName}`);
    dispatch(setCommunityStatus(true));
  };

  const checkAge = (item) => {
    if (item == '0') {
      return 'Below 18';
    } else if (item == '1') {
      return '18-25';
    } else if (item == '2') {
      return '25-35';
    } else if (item == '3') {
      return '35-45';
    } else if (item == '4') {
      return '45-60';
    } else if (item == '5') {
      return 'Above 60';
    }
  };

  const handleOpenCommunity = () => {
    setOpenCommunity(true);
  };

  return (
    <>
      {show ? (
        <EachCommunity closeCommunity={() => setShow(false)} />
      ) : (
        <>
          <div className={styles.spContainer}>
            <div className={styles.InnerContainer}>
              <div className={styles.spHeader}>
                <div className={styles.goBack} onClick={handleCloseProfile}>
                  {anonDetails && anonDetails.name !== username && (
                    <img src={arrowLeft} alt="Back" />
                  )}
                </div>
                <div className={styles.nameContainer}>
                  <p className={styles.name}>Anonymous User</p>
                </div>
                {anonDetails && anonDetails.name === username && (
                  <Popover
                    placement="leftBottom"
                    trigger="click"
                    arrow={false}
                    content={
                      <>
                        {' '}
                        <div className={styles.moreOptionsTexts} onClick={openEditProfile}>
                          Edit Your Profile
                        </div>{' '}
                      </>
                    }
                  >
                    <div className={styles.moreIconContainer}>
                      <img src={more} className={styles.moreIcon} alt="more" />
                    </div>
                  </Popover>
                )}
              </div>
              {!user && <SelfProfileAnonSkeleton />}
              {user && (
                <>
                  <div className={styles.ProfileBox}>
                    <div className={styles.profilePicContainer}>
                      {/* as per avatar number */}
                      <img
                        src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`}
                        className={styles.profilePic}
                      />
                    </div>

                    <div className={styles.userNameContainer}>
                      <p className={styles.userName}>@{user.name}</p>
                    </div>

                    <div className={styles.ageContainer}>
                      {/* range needs to be add */}
                      <span className={styles.age}>{checkAge(user.ageRange)}</span>
                      {/* needs to implement city location on basic of lat and log */}
                      <span className={styles.city}>Pune</span>
                    </div>

                    <div className={styles.languageBox}>
                      {user.languages.map((language, index) => (
                        <div key={index} className={styles.langContainer}>
                          <p className={styles.language}>{language}</p>
                        </div>
                      ))}
                    </div>

                    <div className={styles.bioContainer}>
                      <p className={styles.bio} style={{ whiteSpace: 'pre-line' }}>
                        {user.bio}
                      </p>
                    </div>

                    <div className={styles.HobbiesBox}>
                      {user.hobbies.map((hobby, index) => (
                        <div key={index} className={styles.HobbiesContainer}>
                          <span className={styles.Hobbies}>{hobby}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.TabContainer}>
                    <div
                      className={styles.tabBox}
                      onClick={() => handleTabClick(1)}
                      style={{
                        borderBottom: activeTab === 1 ? '2px solid #6E44FF' : '0.5px solid #232D31'
                      }}
                    >
                      <p className={styles.tab}>Posts</p>
                    </div>
                    <div
                      className={styles.tabBox}
                      onClick={() => handleTabClick(2)}
                      style={{
                        borderBottom: activeTab === 2 ? '2px solid #6E44FF' : '0.5px solid #232D31'
                      }}
                    >
                      <p className={styles.tab}>Communities</p>
                    </div>
                  </div>{' '}
                </>
              )}
            </div>

            <div className={styles.TabContentContainer}>
              {activeTab === 1 && (
                <div>
                  <HomeScreen userName={username} suggested={'none'} />
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <div className={styles.InnerTabContainer}>
                    <div
                      className={styles.InnerTabBox}
                      onClick={() => handleInnerTabClick(1)}
                      style={{ background: innerActiveTab === 1 ? '#1E163A' : '' }}
                    >
                      {anonDetails && anonDetails.name === username ? (
                        <p className={styles.InnerTab}>Created by You</p>
                      ) : (
                        <p className={styles.InnerTab}>Created by Them</p>
                      )}
                    </div>
                    <div
                      className={styles.InnerTabBox}
                      onClick={() => handleInnerTabClick(2)}
                      style={{ background: innerActiveTab === 2 ? '#1E163A' : '' }}
                    >
                      {anonDetails && anonDetails.name === username ? (
                        <p className={styles.InnerTab}>Joined by You</p>
                      ) : (
                        <p className={styles.InnerTab}>Joined by Them</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.innerTabConentContainer}>
                    {innerActiveTab === 1 && (
                      <div className={styles.joinedCommunitesContainer}>
                        {communitiesCreatedByMe && communitiesCreatedByMe.length > 0 ? (
                          communitiesCreatedByMe.map((item, index) => (
                            <div className={styles.joinedCommunitiesBox} key={index}>
                              <div
                                onClick={() => goTo(item.name)}
                                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
                              >
                                <div className={styles.communitesProfiePicContainer}>
                                  <img
                                    src={item.displayPicture}
                                    className={styles.communitesProfiePic}
                                    alt="profilePic"
                                  />
                                </div>
                                <div className={styles.communitesNameContainer}>
                                  <p className={styles.communitesName}>{item.name}</p>
                                </div>
                              </div>
                              {anonDetails && anonDetails.name === username && (
                                <div className={styles.rightSection}>
                                  <div
                                    className={styles.communitesMoreContainer}
                                    onClick={() => showCreatedMore(item.displayPicture, item.name)}
                                  >
                                    <img src={more} alt="more" className={styles.communitiesMore} />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div>
                            <div className="noPostContainer">
                              <span
                                className={isDarkMode ? 'noPostText' : 'd-noPostText'}
                                style={{ color: '#FCFCFC' }}
                              >
                                Join Community to see post
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {innerActiveTab === 2 && (
                      <div className={styles.joinedCommunitesContainer}>
                        {joinedCommunities &&
                          joinedCommunities.map((item, index) => (
                            <div className={styles.joinedCommunitiesBox} key={index}>
                              <div
                                onClick={() => goTo(item.name)}
                                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
                              >
                                <div className={styles.communitesProfiePicContainer}>
                                  <img
                                    src={item.displayPicture}
                                    className={styles.communitesProfiePic}
                                    alt="profilePic"
                                  />
                                </div>
                                <div className={styles.communitesNameContainer}>
                                  <p className={styles.communitesName}>{item.name}</p>
                                </div>
                              </div>
                              <div className={styles.rightSection}>
                                {anonDetails && anonDetails.name === username ? (
                                  anonDetails &&
                                  anonDetails.name !== item.admin.username && (
                                    <button
                                      className={styles.joinedButton}
                                      onClick={() =>
                                        showLeaveCommunity(
                                          item.displayPicture,
                                          item.name,
                                          item.admin.username
                                        )
                                      }
                                    >
                                      Leave
                                    </button>
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {anonymousLeaveCommunity && (
            <div className={styles.leaveOverLay} onClick={hideLeaveCommunity}>
              <div className={styles.leaveContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.selectedCommunityBox}>
                  <div className={styles.userImgContainer}>
                    <img src={selectedCommunityImage} alt="image" className={styles.userImg} />
                  </div>
                  <div className={styles.communityUserName}>
                    <p className={styles.communityUserNameText}>{selectedCommunityName}</p>
                  </div>
                  <div className={styles.leaveConfirmTextContainer}>
                    <p className={styles.leaveConfirmText}>
                      Are you sure want to leave this community
                    </p>
                  </div>
                </div>

                <div className={styles.leaveButtonContainer}>
                  <button className={styles.leaveButton} onClick={hideLeaveCommunity}>
                    Now Now
                  </button>
                  <button onClick={leaveCommunity} className={styles.leaveButton}>
                    Leave
                  </button>
                </div>
              </div>
            </div>
          )}

          {anonymousJoinedMore && (
            <div className={styles.leaveOverLay} onClick={hideMoreOption}>
              <div className={styles.leaveContainerMore} onClick={(e) => e.stopPropagation()}>
                <div className={styles.selectedCommunityBox}>
                  <div className={styles.userImgContainer}>
                    <img src={selectedCommunityImage} alt="image" className={styles.userImg} />
                  </div>
                  <div className={styles.communityUserNameMore}>
                    <p className={styles.communityUserNameMoreText}>{selectedCommunityName}</p>
                  </div>
                  <div className={styles.communityOptionNameMore}>
                    <p className={styles.communityOptionNameMoreText} style={{ color: 'red' }}>
                      Report this community
                    </p>
                  </div>
                  <div className={styles.communityOptionNameMore}>
                    <p className={styles.communityOptionNameMoreText} style={{ color: 'red' }}>
                      Block this community
                    </p>
                  </div>
                  <div className={styles.communityOptionNameMore} onClick={hideMoreOption}>
                    <p className={styles.communityOptionNameMoreText}>Cancel</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {createdCommunityMore && (
            <div className={styles.leaveOverLay} onClick={hideCreatedMore}>
              <div className={styles.leaveContainerMore} onClick={(e) => e.stopPropagation()}>
                <div className={styles.selectedCommunityBox}>
                  <div className={styles.userImgContainer}>
                    <img src={selectedCommunityImage} alt="image" className={styles.userImg} />
                  </div>
                  <div className={styles.communityUserNameMore}>
                    <p className={styles.communityUserNameMoreText}>{selectedCommunityName}</p>
                  </div>
                  {/* <div className={styles.communityOptionNameMore}>
                    <p className={styles.communityOptionNameMoreText}>Edit this community</p>
                  </div> */}
                  <div onClick={deleteCommunity} className={styles.communityOptionNameMore}>
                    <p className={styles.communityOptionNameMoreText} style={{ color: 'red' }}>
                      Delete this community
                    </p>
                  </div>
                  <div className={styles.communityOptionNameMore} onClick={hideCreatedMore}>
                    <p className={styles.communityOptionNameMoreText}>Cancel</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {editProfile && user && (
            <EditProfile anonProfile={user} closeEditProfile={closeEditProfile} />
          )}
        </>
      )}
    </>
  );
};

export default SelfProfileAnonumous;
