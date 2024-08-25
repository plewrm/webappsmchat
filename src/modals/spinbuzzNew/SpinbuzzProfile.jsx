import React, { useEffect, useState } from 'react';
import styles from './SpinbuzzV2.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setShowCompatibility,
  setShowWhoopsieClock,
  setSpinbuzzNew,
  setSpinbuzzProfile,
  decrementTimer,
  resetTimer,
  setShowWhoopsieFailed,
  setShowWhoopsieWrapped,
  setShowSpinbuzzChat,
  setShowSpinbuzzChatMsg,
  appendSpinbuzzMessageData,
  setSpinbuzzMessageData
} from '../../redux/slices/spinbuzzSlices';
import { setConversation } from '../../redux/slices/chatSlice';
import { sendMessage } from '../../xmtp/models/messages';
import { ContentTypeText } from '@xmtp/xmtp-js';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import defaultCover from '../../assets/images/plain-cover.png';
import closeTrans from '../../assets/icons/s-close.svg';
import { BASE_URL, BEARER_TOKEN, GETUSERPROFILE, retrievedSoconId } from '../../api/EndPoint';
import axios from 'axios';
import { setUserProfile } from '../../redux/slices/authSlice';
import { ContentTypeAttachment } from '@xmtp/content-type-remote-attachment';
import { startConversation } from '../../xmtp/models/conversations';
import SpinbuzzChat from './SpinbuzzChat';
import { useConversations } from '../../xmtp/hooks/useConversations';
import SpinbuzzMessage from '../SpinbuzzMessage';
import { setMessageData } from '../../redux/slices/chatSlice';
const SpinbuzzProfile = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const spinBuzzUser = useSelector((state) => state.spinbuzz.spinBuzzUser);
  const showCompatibility = useSelector((state) => state.spinbuzz.showCompatibility);
  const showWhoopsieClock = useSelector((state) => state.spinbuzz.showWhoopsieClock);
  const showWhoopsieFailed = useSelector((state) => state.spinbuzz.showWhoopsieFailed);
  const showWhoopsieWrapped = useSelector((state) => state.spinbuzz.showWhoopsieWrapped);
  const showSpinbuzzChat = useSelector((state) => state.spinbuzz.showSpinbuzzChat);
  const showSpinbuzzChatmsg = useSelector((state) => state.spinbuzz.showSpinbuzzChatmsg);
  const loadingProfile = useSelector((state) => state.spinbuzz.loadingProfile);
  const timer = useSelector((state) => state.spinbuzz.timer);
  const spinbuzzmessageData = useSelector((state) => state.spinbuzz.spinbuzzmessageData);
  const closeSpinbuzzProfile = () => {
    dispatch(setSpinbuzzProfile(false));
  };
  const openSpinbuzzNew = () => {
    dispatch(setSpinbuzzProfile(false));
    dispatch(setSpinbuzzNew(true));
  };
  const openCompatibility = (event) => {
    event.stopPropagation();
    dispatch(setShowCompatibility(true));
  };
  const closeCompatibility = () => {
    dispatch(setShowCompatibility(false));
  };
  const closeWhoopsieClock = () => {
    dispatch(setShowWhoopsieClock(false));
  };
  const closeWhoopsieFailed = () => {
    dispatch(setShowWhoopsieFailed(false));
  };
  const closeWhoopsieWrapped = () => {
    dispatch(setShowWhoopsieWrapped(false));
  };
  const openSpinbuzzChat = () => {
    dispatch(setShowSpinbuzzChat(true));
  };

  const closeSPinbuzzNew = () => {
    dispatch(setSpinbuzzNew(false));
  };
  const xmtp = useSelector((state) => state.auth.xmtp);
  // const [convoMessage,setConvomessage]=useState(null)
  // var conversations = useConversations(xmtp);
  useEffect(() => {
    const timerInterval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);
    return () => {
      clearInterval(timerInterval);
      dispatch(resetTimer());
    };
  }, [dispatch]);
  // useEffect(() => {
  //     console.log("sending...")
  //     if (showSpinbuzzChat) {
  //         sendMessageToUser();
  //     }
  // }, [showSpinbuzzChat])

  // useEffect(()=>{
  //     setConvomessage(conversations)
  // },[convoMessage])
  useEffect(() => {
    if (timer === 0) {
      dispatch(setShowWhoopsieClock(true));
    }
  }, [timer, dispatch]);

  // const sendMessageToUser = async () => {
  //     const finalContent = "Hi!";
  //     const finalContentType = ContentTypeText
  //     const conversation = await xmtp.conversations.newConversation(spinBuzzUser.walletAddress)
  //     // send regular message
  //     if (!xmtp) return;
  //     const result = await sendMessage(xmtp, conversation, finalContent, finalContentType, modal);
  //     dispatch(setShowSpinbuzzChatMsg(result))
  // };

  // const sendMessageToUser = async () => {
  //     try {
  //         let finalContent = "Hi!";
  //         let finalContentType = ContentTypeText;

  //         if (textInput || attachment) {
  //             finalContent = textInput || attachment;
  //             finalContentType = textInput ? ContentTypeText : ContentTypeAttachment;
  //         }

  //         const conversation = await xmtp.conversations.newConversation(spinBuzzUser.walletAddress);
  //         console.log("Print xmtp", xmtp);

  //         if (!xmtp) return;

  //         const result = await sendMessage(xmtp, conversation, finalContent, finalContentType, modal);
  //         dispatch(setShowSpinbuzzChatMsg(result));
  //         setTextInput(""); // Clearing text input after sending the message
  //         return result;
  //     } catch (error) {
  //         console.error("Error sending message:", error);
  //         return null;
  //     }
  // };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const strokeWidth = 8; // Set the width of the progress bar
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = ((10 * 60 - timer) / (10 * 60)) * circumference;

  const [userProfile, setUserProfile] = useState(null);

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
  useEffect(() => {
    getMyProfile();
  }, []);
  // const closeChat = () => {
  //     console.log("print items here",item)
  //     if (item.isOpened == true) {
  //         dispatch(setSpinbuzzMessageData({ index, newData: { ...item, isOpened: false } }));
  //     }
  // };

  return (
    <>
      <div
        className={isDarkMode ? styles.profileOuterContainer : styles['d-profileOuterContainer']}
        onClick={closeSpinbuzzProfile}
      >
        <div className={styles.profileInnerContainer}>
          <div className={styles.profileBox1} onClick={(e) => e.stopPropagation()}>
            <svg className={styles.circle} width="100%" viewBox="0 0 100 100">
              <circle
                className={styles.circleBackground}
                cx="50"
                cy="50"
                r={radius}
                strokeWidth={`${strokeWidth}px`}
              />
              <circle
                className={styles.circleProgress}
                cx="50"
                cy="50"
                r={radius}
                strokeWidth={`${strokeWidth}px`}
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className={isDarkMode ? styles.timerText : styles['d-timerText']}
              >
                {formatTime(timer)}
              </text>
            </svg>
          </div>
          <div className={styles.profileBox2} onClick={openCompatibility}>
            <div className={styles.compatibilityImgContainer}>
              <img src="/Images/compatibility.svg" className={styles.compatibilityImg} />
            </div>
            <div className={styles.compatibilityTextContainer}>
              <p className={isDarkMode ? styles.compatibilityText : styles['d-compatibilityText']}>
                Your compatibility with {spinBuzzUser.display_name} is
                <b> {Math.floor(spinBuzzUser.compatibility * 10)}%</b>
              </p>
            </div>
          </div>

          {loadingProfile ? (
            <div
              className={isDarkMode ? styles.profileBox3 : styles['d-profileBox3']}
              style={{ height: '500px', paddingTop: '100px' }}
            >
              <div className="loaderContainer">
                <div className={isDarkMode ? 'loader' : 'd-loader'}></div>
              </div>
            </div>
          ) : (
            <div
              className={isDarkMode ? styles.profileBox3 : styles['d-profileBox3']}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.coverImgContainer}>
                <img src={spinBuzzUser.cover_photo || defaultCover} className={styles.coverImg} />
                <div className={styles.moreIconContainer} onClick={closeSPinbuzzNew}>
                  <img src={closeTrans} className={styles.moreIcon} />
                </div>
              </div>
              <div className={isDarkMode ? styles.profileContainer : styles['d-profileContainer']}>
                <img src={spinBuzzUser.pfp || defaultProfile} className={styles.profile} />
              </div>
              <div className={styles.nameBoxContainer}>
                <div className={styles.nameContainer}>
                  <p className={isDarkMode ? styles.name : styles['d-name']}>
                    {spinBuzzUser.display_name || 'no name'}
                  </p>
                </div>
                <div className={styles.batchIconContainer}>
                  <img src="/icon/bronze.svg" alt="batch" className={styles.batchIcon} />
                </div>
                <div className={isDarkMode ? 'rewardPtsContainer' : 'd-rewardPtsContainer'}>
                  <p className={isDarkMode ? 'rewardPts' : 'd-rewardPts'}>
                    {Math.floor(spinBuzzUser.compatibility * 10)}
                  </p>
                </div>
              </div>
              <div className={styles.usernameContainer}>
                <p className={isDarkMode ? styles.username : styles['d-username']}>
                  {spinBuzzUser.username || 'no username'}
                </p>
              </div>
              <div className={isDarkMode ? styles.countBox : styles['d-countBox']}>
                <div className={styles.column1}>
                  <div className={styles.countContainer}>
                    <p className={isDarkMode ? styles.count : styles['d-count']}>
                      {spinBuzzUser.postCount}
                    </p>
                  </div>
                  <div className={styles.countNameContainer}>
                    <p className={isDarkMode ? styles.countName : styles['d-countName']}>Posts</p>
                  </div>
                </div>
                <div className={styles.column1}>
                  <div className={styles.countContainer}>
                    <p className={isDarkMode ? styles.count : styles['d-count']}>
                      {spinBuzzUser.followers}
                    </p>
                  </div>
                  <div className={styles.countNameContainer}>
                    <p className={isDarkMode ? styles.countName : styles['d-countName']}>
                      Followers
                    </p>
                  </div>
                </div>

                <div className={styles.column1}>
                  <div className={styles.countContainer}>
                    <p className={isDarkMode ? styles.count : styles['d-count']}>
                      {spinBuzzUser.following}
                    </p>
                  </div>
                  <div className={styles.countNameContainer}>
                    <p className={isDarkMode ? styles.countName : styles['d-countName']}>
                      Following
                    </p>
                  </div>
                </div>
              </div>
              <div className={isDarkMode ? styles.bioBox : styles['d-bioBox']}>
                <p className={isDarkMode ? styles.bio : styles['d-bio']}>
                  {spinBuzzUser.bio || 'no bio provided'}
                </p>
              </div>
              <div className={styles.urlContainer}>
                <div className={styles.linkImgContainer}>
                  <img src="/icon/link.svg" className={styles.linkImg} alt="link" />
                </div>
                <div className={styles.textLinkTextContainer}>
                  <a
                    href={spinBuzzUser.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.textLink}
                  >
                    {spinBuzzUser.url || 'no url provided'}
                  </a>
                </div>
              </div>
              <div className={styles.buttonsContainer}>
                <button
                  className={isDarkMode ? styles.spinButton : styles['d-spinButton']}
                  onClick={openSpinbuzzNew}
                >
                  Spin Again
                </button>
                <button
                  className={isDarkMode ? styles.sendHiButton : styles['d-sendHiButton']}
                  // onClick={openSpinbuzzChat}
                  onClick={async () => {
                    const isOpen = spinbuzzmessageData.some(
                      (modal) => modal.soconId === spinBuzzUser.soconId && modal.isOpened
                    );
                    if (!isOpen) {
                      const conversation = await startConversation(xmtp, spinBuzzUser);
                      sendMessage(xmtp, conversation, 'Hi!', ContentTypeText, spinBuzzUser);
                      dispatch(
                        appendSpinbuzzMessageData({
                          soconId: spinBuzzUser.soconId,
                          display_name: spinBuzzUser.display_name,
                          username: spinBuzzUser.username,
                          timestamp: new Date().toDateString(),
                          peerAddress: spinBuzzUser.walletAddress,
                          isMaximized: true,
                          isOpened: true,
                          pfp: spinBuzzUser.pfp
                        })
                      );
                      dispatch(setConversation(conversation));
                    }
                  }}
                >
                  <img src="/icon/sendHi.svg" alt="Greet Icon" className={styles.hiIcon} />
                  Send Hi!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCompatibility && (
        <div
          className={isDarkMode ? styles.compatibilityOuter : styles['d-compatibilityOuter']}
          onClick={closeCompatibility}
        >
          <div
            className={isDarkMode ? styles.compatibilityInner : styles['d-compatibilityInner']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.closeCompatibilityContainer} onClick={closeCompatibility}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.closeCompatibility}
              />
            </div>
            <div className={styles.bumpImgContainer}>
              <img src="/icon/bump.svg" alt="bump" className={styles.bumpImg} />
            </div>
            <div className={styles.compatibilityTittleContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityTittle : styles['d-compatibilityTittle']
                }
              >
                Compatibility Percentage
              </p>
            </div>
            <div className={styles.compatibilityContentContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityContent : styles['d-compatibilityContent']
                }
              >
                {userProfile?.display_name} & {spinBuzzUser.display_name}, based on your Socon
                activity, we believe you have <b>{Math.floor(spinBuzzUser.compatibility * 10)}%</b>{' '}
                of overall compatibility
              </p>
            </div>
            <div className={styles.compatibilityBtnContainer}>
              <button
                className={isDarkMode ? styles.compatibilityBtn : styles['d-compatibilityBtn']}
                onClick={closeCompatibility}
              >
                Okay, got it!
              </button>
            </div>
          </div>
        </div>
      )}
      {showWhoopsieClock && (
        <div className={isDarkMode ? styles.compatibilityOuter : styles['d-compatibilityOuter']}>
          <div
            className={isDarkMode ? styles.compatibilityInner : styles['d-compatibilityInner']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.closeCompatibilityContainer} onClick={closeWhoopsieClock}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.closeCompatibility}
              />
            </div>
            <div className={styles.bumpImgContainer}>
              <img src="/icon/clock.svg" alt="bump" className={styles.bumpImg} />
            </div>
            <div className={styles.compatibilityTittleContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityTittle : styles['d-compatibilityTittle']
                }
              >
                Whoopsie!
              </p>
            </div>
            <div className={styles.compatibilityContentContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityContent : styles['d-compatibilityContent']
                }
              >
                You weren't quick enough to make the first move. Spin again to find new matches.
              </p>
            </div>
            <div className={styles.compatibilityBtnContainer} onClick={openSpinbuzzNew}>
              <button className={isDarkMode ? styles.spinAgain : styles['d-spinAgain']}>
                Spin Again!
              </button>
            </div>
          </div>
        </div>
      )}
      {showWhoopsieFailed && (
        <div
          className={isDarkMode ? styles.compatibilityOuter : styles['d-compatibilityOuter']}
          onClick={closeWhoopsieFailed}
        >
          <div
            className={isDarkMode ? styles.compatibilityInner : styles['d-compatibilityInner']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.closeCompatibilityContainer} onClick={closeWhoopsieFailed}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.closeCompatibility}
              />
            </div>
            <div className={styles.bumpImgContainer}>
              <img src="/icon/bumpFail.svg" alt="bump" className={styles.bumpImg} />
            </div>
            <div className={styles.compatibilityTittleContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityTittle : styles['d-compatibilityTittle']
                }
              >
                Whoopsie!
              </p>
            </div>
            <div className={styles.compatibilityContentContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityContent : styles['d-compatibilityContent']
                }
              >
                Rahul has decided to spin again, opening up a world of new possibilities. Spin again
                to find new matches.
              </p>
            </div>
            <div className={styles.compatibilityBtnContainer} onClick={openSpinbuzzNew}>
              <button className={isDarkMode ? styles.spinAgain : styles['d-spinAgain']}>
                Spin Again!
              </button>
            </div>
          </div>
        </div>
      )}
      {showWhoopsieWrapped && (
        <div
          className={isDarkMode ? styles.compatibilityOuter : styles['d-compatibilityOuter']}
          onClick={closeWhoopsieWrapped}
        >
          <div
            className={isDarkMode ? styles.compatibilityInner : styles['d-compatibilityInner']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.closeCompatibilityContainer} onClick={closeWhoopsieWrapped}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.closeCompatibility}
              />
            </div>
            <div className={styles.bumpImgContainer}>
              <img src="/icon/bumpWarp.svg" alt="bump" className={styles.bumpImg} />
            </div>
            <div className={styles.compatibilityTittleContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityTittle : styles['d-compatibilityTittle']
                }
              >
                Whoopsie!
              </p>
            </div>
            <div className={styles.compatibilityContentContainer}>
              <p
                className={
                  isDarkMode ? styles.compatibilityContent : styles['d-compatibilityContent']
                }
              >
                It looks like Rahul has wrapped up their Spinbuzz session for now. Spin again to
                find new matches.
              </p>
            </div>
            <div className={styles.compatibilityBtnContainer} onClick={openSpinbuzzNew}>
              <button className={isDarkMode ? styles.spinAgain : styles['d-spinAgain']}>
                Spin Again!
              </button>
            </div>
          </div>
        </div>
      )}
      {spinbuzzmessageData
        .filter((element) => element.isOpened == true)
        .slice(-2)
        .map((modal, openPositionIndex) => {
          return (
            <SpinbuzzChat
              key={openPositionIndex}
              modal={modal}
              position={openPositionIndex}
              index={spinbuzzmessageData.indexOf(modal)}
              // closeChat={closeChat}
              // toggleChatSize={toggleChatSize}
              sendmsg={true}
            />
          );
        })}
    </>
  );
};
export default SpinbuzzProfile;
