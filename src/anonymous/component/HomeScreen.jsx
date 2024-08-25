import React, { useState, useEffect } from 'react';
import styles from './HomeScreen.module.css';
import profile from '../../assets/anonymous/icon/user-profile.svg';
import axios from 'axios';
import {
  BASE_URL,
  BEARER_TOKEN,
  DICCOVERCOMMUNITIES,
  MESSAGETIMELINE,
  GETANON,
  SELFTIMELINE,
  ADDMEMBER
} from '../../api/EndPoint';
import AnonumousPost from './Post/AnonumousPost';
import { setCommunityName, setAnonDetails } from '../../redux/slices/anonSlices';
import { useDispatch, useSelector } from 'react-redux';
import EachCommunity from './discover/EachCommunity';
import AllPostSkeleton from './Post/AllPostSkeleton';

const HomeScreen = ({ suggested, userName }) => {
  const [timeline, setTimeline] = useState(null);
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const anonDetails = useSelector((state) => state.community.anonDetails);

  // const getAnonProfile = async()=>{
  //   try {
  //     const headers = {
  //       'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
  //       'Content-Type': 'application/json',
  //     };

  //     const response = await axios.get(`${BASE_URL}${GETANON}`, { headers });
  //     console.log(response.data);
  //     if (response.data.message === "Success") {
  //       dispatch(setAnonDetails(response.data.data))
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   } finally {
  //     // dispatch(setAnonLoader(false))
  //   }
  // }

  // useEffect(()=>{
  //   getAnonProfile();
  // },[])
  // console.log(anonDetails)

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // userName
      let response = '';
      if (userName) {
        response = await axios.get(`${BASE_URL}${SELFTIMELINE}${userName}`, { headers });
      } else {
        response = await axios.get(`${BASE_URL}${MESSAGETIMELINE}`, { headers });
      }
      setTimeline(response.data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const [fetchedCommunities, setFetchedCommunities] = useState([]);
  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${DICCOVERCOMMUNITIES}`, { headers });
      setFetchedCommunities(response.data.communities);
    } catch (error) {
      console.error(error);
    }
  };

  const [localStatus, setLocalStatus] = useState([]);
  const joinCommunity = async (content, index) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${BASE_URL}${ADDMEMBER}`,
        { communityName: content.name, username: anonDetails.name },
        { headers }
      );
      const localState = [...localStatus];
      localState[index] = true;
      setLocalStatus(localState);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // if (anonDetails) {
    //   fetchTimeline()
    //   fetchData();
    // }
    fetchTimeline();
    fetchData();
  }, [globalAnonPost, anonDetails]);

  const [selectStatus, setSelectStatus] = useState(false);
  const goToCommunity = (name) => {
    dispatch(setCommunityName(name));
    setSelectStatus(true);
  };

  return (
    <>
      {selectStatus ? (
        <EachCommunity closeCommunity={() => setSelectStatus(false)} />
      ) : (
        <div className={styles.hsComponent}>
          {loading && <AllPostSkeleton />}
          {/* <div
            className={styles.hsHeaderTitleContainer}
            style={{ display: fetchedCommunities.length === 0 ? 'none' : '' }}
          >
            <p className={styles.hsHeaderTitle}>Communities for you:</p>
          </div> */}

          {/* {
           
            <div
              className={styles.hsCardContainer}
              style={{ display: fetchedCommunities.length === 0 ? 'none' : '' }}
            >
              {fetchedCommunities &&
                fetchedCommunities.map((community, index) => (
                  <div onClick={() => goToCommunity(community.name)} className={styles.hsCardBox}>
                    <div className={styles.hsCardBoxInner} key={community.id}>
                      <div className={styles.cardProfileContainer}>
                        <img
                          src={community.displayPicture}
                          alt="image"
                          className={styles.cardProfile}
                        />
                      </div>
                      <div className={styles.cardNameContainer}>
                        <p className={styles.cardName}>{community.name}</p>
                      </div>
                      <div className={styles.followerCountContainer}>
                        <div className={styles.profileIconContainer}>
                          <img src={profile} alt="profile" className={styles.profileIcon} />
                        </div>
                        <span className={styles.followerNumber}>{community.memberCount}</span>
                      </div>
                      <div className={styles.cardBioContainer}>
                        <p className={styles.cardBio}>{community.description}</p>
                      </div>
                      {!localStatus[index] ? (
                        <button
                          className={styles.cardJoinButton}
                          onClick={(event) => {
                            joinCommunity(community, index);
                            event.stopPropagation();
                          }}
                        >
                          Join
                        </button>
                      ) : (
                        <button className={styles.joinedBtn}>Joined</button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          } */}
          {(timeline === null || timeline.length === 0) && !loading && (
            <div>
              <p style={{ color: '#FCFCFC', textAlign: 'center', paddingTop: '10%' }}>
                Join a community to see posts
              </p>
            </div>
          )}
          <AnonumousPost timeline={timeline} />
        </div>
      )}
    </>
  );
};

export default HomeScreen;

// import React, { useState } from 'react';
// import styles from './HomeScreen.module.css';
// import profileicon from '../../assets/anonymous/icon/user-profile.svg';
// import profile from '../../assets/anonymous/image/card-profile.svg'
// import more from '../../assets/icons/More.png';
// import back from '../../assets/anonymous/icon/arrow-left.svg'
// import { communitiesData } from '../../data/DummyData';

// const HomeScreen = () => {
//   const [activeTab, setActiveTab] = useState('About');

//   return (
// <div className={styles.hsComponent}>
//   <div className={styles.profileContainer}>

//     <div className={styles.profileHeader}>
//       <div className={styles.profileBackIconContainer}>
//         <img src={back} alt='back' className={styles.profileBackIcon} />
//       </div>

//       <div className={styles.profileTitleContainer}>
//         <p className={styles.profileTitle}>IIM Genius</p>
//       </div>

//       <div className={styles.profileMoreIconCOntainer}>
//         <img src={more} className={styles.profileMoreIcon} />
//       </div>
//     </div>

//     <div className={styles.profileInfoContainer}>

//       <div className={styles.profilePicContainer}>
//         <img src={profile} alt='profile' className={styles.profilePic} />
//       </div>

//       <div className={styles.profileNameContainer}>
//         <p className={styles.profileName}>Delhi Public School</p>
//       </div>

//       <div className={styles.profileclgContainer}>
//         <p className={styles.profileclg}>College/University</p>
//       </div>

//       <div className={styles.profileMemberBox}>
//         <div className={styles.profileFriendIconContainer}>
//           <img src={profileicon} alt='profileIcon' className={styles.profileFriendIcon} />
//         </div>
//         <div className={styles.profileMemberCountContainer}>
//           <p className={styles.profileMemberCount}>1.5k members</p>
//         </div>
//       </div>

//       <button className={styles.profileJoinButton}>Join Now</button>
//     </div>

//     <div className={styles.profileTabContainer}>
//       <button className={activeTab === 'Posts' ? styles.activeTabButton : styles.tabButton} onClick={() => setActiveTab('Posts')}>Posts</button>
//       <button className={activeTab === 'About' ? styles.activeTabButton : styles.tabButton} onClick={() => setActiveTab('About')}>About</button>
//     </div>

//     {activeTab === 'About' && (
//       <>
//         <div className={styles.descriptionContainer}>
//           <div className={styles.descriptionTitleContainer}>
//             <p className={styles.descriptionTitle}>Description</p>
//           </div>
//           <div className={styles.descriptionContentContainer}>
//             <p className={styles.descriptionContent}>Welcome to the Unofficial and Anonymous Community! This group offers a safe and inclusive space for open discussions and connections without the need for formal identification.</p>
//           </div>
//         </div>

//         <div className={styles.profileAboutMemberBox}>
//           <div className={styles.aboutMemberTitleContainer}>
//             <p className={styles.aboutMemberTitle}>Members</p>
//           </div>

//           <div className={styles.aboutMemberProfilesContainer}>
//             <div className={styles.AboutMemberBox}>
//               <div className={styles.memberProfilePicContainer}>
//                 <img src={profile} alt='profile' className={styles.memberProfilePic} />
//               </div>
//               <div className={styles.aboutMemberNameContainer}>
//                 <p className={styles.aboutMemberName}>IIM Genius</p>
//               </div>
//               <div className={styles.aboutMembersButtonContainer}>
//                 <button className={styles.aboutMembersButton}>View Profile</button>
//               </div>
//             </div>
//           </div>

//         </div>

//       </>
//     )}

//   </div>
// </div>
//   )
// }

// export default HomeScreen;
