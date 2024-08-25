import React, { useEffect, useState } from 'react';
import styles from '../discover/CreateCommunity.module.css';
import axios from 'axios';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETCOMMUNITIESMEMBERS,
  GETALLCOMMUNITIES,
  ADDMEMBER,
  GETANON
} from '../../../api/EndPoint';
import profileicon from '../../../assets/anonymous/icon/user-profile.svg';
import backBtn from '../../../assets/anonymous/icon/arrow-left.svg';
import AnonumousPost from '../Post/AnonumousPost';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedMoreOption, setPreviousPath } from '../../../redux/slices/modalSlice';
import SelfProfileAnonumous from '../anonymousSelfProfile/SelfProfileAnonumous';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { setCommunityStatus } from '../../../redux/slices/anonSlices';
import AnonymousAddPost from '../AddPost/AnonymousAddPost';
import { Skeleton, Button } from 'antd';
import EachCommunitySkeleton from './EachCommunitySkeleton';

export default function EachCommunity({ closeCommunity }) {
  const { communityName } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const joinStatus = useSelector((state) => state.community.joinStatus);
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const [activeTab, setActiveTab] = useState('Posts');
  const [comuunityDetails, setCommunityDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState(null);
  const [profile, setprofile] = useState(null);
  // const [previousPath, setPreviousPath] = useState('');

  useEffect(() => {
    fetchCommunityDetails();
  }, [location]);
  const back = () => {
    navigate('/anon/discovers');
  };

  const fetchCommunityDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETALLCOMMUNITIES}${encodeURIComponent(communityName)}/`,
        {
          headers
        }
      );

      setCommunityDetails(response.data.community);
      const res = await axios.get(`${BASE_URL}${GETCOMMUNITIESMEMBERS}/${communityName}/members`, {
        headers
      });
      // console.log(res.data)
      setMembers(res.data.members.users);
      setCommunityDetails(response.data.community);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCommunityMessage = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${BASE_URL}${GETALLCOMMUNITIES}/${communityName}/messages`,
        { headers }
      );
      // console.log(response.data)
      setMessages(response.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCommunityDetails();
    fetchCommunityMessage();
  }, [globalAnonPost, joinStatus]);

  const goToAnonProfile = (item) => {
    setprofile(item.username);
    // navigate()
    // closeCommunity();
    // dispatch(setPreviousPath(window.location.pathname))
    navigate(`/anon/${item.username}`);
  };

  const joinCommunity = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.get(`${BASE_URL}${GETANON}`, { headers });
      const username = res.data.data.name;
      const response = await axios.post(
        `${BASE_URL}${ADDMEMBER}`,
        { communityName: communityName, username: res.data.data.name },
        { headers }
      );
      dispatch(setCommunityStatus(true));
      setCommunityDetails({ ...comuunityDetails, isAMember: true }); // Update the state
    } catch (error) {
      console.error(error);
    }
  };

  const leaveCommunity = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const res = await axios.get(`${BASE_URL}${GETANON}`, { headers });
      const username = res.data.data.name;

      const response = await axios.delete(`${BASE_URL}${ADDMEMBER}`, {
        headers,
        data: { communityName: communityName, username }
      });
      dispatch(setCommunityStatus(false)); // Set community status to false (not a member)
      setCommunityDetails({ ...comuunityDetails, isAMember: false }); // Update the state
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {profile ? (
        <SelfProfileAnonumous username={profile} />
      ) : (
        <>
          {!comuunityDetails && <EachCommunitySkeleton />}

          <div className={styles.hsComponent}>
            {comuunityDetails && members && (
              <>
                {' '}
                <div className={styles.profileContainer}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileBackIconContainer}>
                      <img
                        // onClick={() => back()}
                        onClick={() => navigate(-1)}
                        src={backBtn}
                        alt="back"
                        className={styles.profileBackIcon}
                      />
                    </div>
                  </div>

                  <div className={styles.profileInfoContainer}>
                    <div className={styles.profilePicContainer}>
                      <img
                        src={comuunityDetails.displayPicture}
                        alt="profile"
                        className={styles.profilePic}
                      />
                    </div>

                    <div className={styles.profileNameContainer}>
                      <p className={styles.profileName}>{comuunityDetails.name}</p>
                    </div>

                    <div className={styles.profileclgContainer}>
                      <p className={styles.profileclg}>
                        {comuunityDetails.tags[0]} / {comuunityDetails.tags[1]}
                      </p>
                    </div>

                    <div className={styles.profileMemberBox}>
                      <div className={styles.profileFriendIconContainer}>
                        <img
                          src={profileicon}
                          alt="profileIcon"
                          className={styles.profileFriendIcon}
                        />
                      </div>
                      <div className={styles.profileMemberCountContainer}>
                        {/* count to be added */}
                        <p className={styles.profileMemberCount}>{members.length}</p>
                      </div>
                    </div>
                    {comuunityDetails.isAMember ? (
                      <button className={styles.profileJoinedButton} onClick={leaveCommunity}>
                        Joined
                      </button>
                    ) : (
                      <button onClick={joinCommunity} className={styles.profileJoinButton}>
                        Join now
                      </button>
                    )}
                  </div>

                  <div className={styles.profileTabContainer}>
                    <button
                      className={activeTab === 'Posts' ? styles.activeTabButton : styles.tabButton}
                      onClick={() => setActiveTab('Posts')}
                    >
                      Posts
                    </button>
                    <button
                      className={activeTab === 'About' ? styles.activeTabButton : styles.tabButton}
                      onClick={() => setActiveTab('About')}
                    >
                      About
                    </button>
                  </div>

                  {activeTab === 'About' && (
                    <>
                      <div className={styles.descriptionContainer}>
                        <div className={styles.descriptionTitleContainer}>
                          <p className={styles.descriptionTitle}>Description</p>
                        </div>
                        <div className={styles.descriptionContentContainer}>
                          <p className={styles.descriptionContent}>
                            {comuunityDetails.description}
                          </p>
                        </div>
                      </div>

                      <div className={styles.profileAboutMemberBox}>
                        <div className={styles.aboutMemberTitleContainer}>
                          <p className={styles.aboutMemberTitle}>Members</p>
                        </div>

                        <div className={styles.aboutMemberProfilesContainer}>
                          {members &&
                            members.map((member, index) => (
                              <div
                                key={index}
                                onClick={() => goToAnonProfile(member)}
                                className={styles.AboutMemberBox}
                              >
                                <div className={styles.memberProfilePicContainer}>
                                  {/* according to avater pfp will be their */}
                                  <img
                                    src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${member.avatar}.png`}
                                    alt="profile"
                                    className={styles.memberProfilePic}
                                  />
                                </div>
                                <div className={styles.aboutMemberNameContainer}>
                                  <p className={styles.aboutMemberName}>{member.username}</p>
                                </div>
                                <div className={styles.aboutMembersButtonContainer}>
                                  <button className={styles.aboutMembersButton}>
                                    View Profile
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'Posts' &&
                    (comuunityDetails.isAMember ? (
                      <>
                        <AnonymousAddPost communityName={communityName} />

                        <AnonumousPost
                          admin={comuunityDetails.admin.username}
                          communityMessage={messages}
                        />
                      </>
                    ) : (
                      <div style={{ color: '#FCFCFC', textAlign: 'center', paddingTop: '5%' }}>
                        Joined this community to view the posts
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
