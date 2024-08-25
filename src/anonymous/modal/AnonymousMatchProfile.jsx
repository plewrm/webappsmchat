import React, { useEffect, useState } from 'react';
import styles from '../../modals/spinbuzzNew/SpinbuzzV2.module.css';
import { useTheme } from '../../context/ThemeContext';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import defaultCover from '../../assets/images/plain-cover.png';
import { useDispatch, useSelector } from 'react-redux';
import { setAnonymousspinBuzz } from '../../redux/slices/modalSlice';
import { resetTimer, setSpinMatchModal, decrementTimer } from '../../redux/slices/spinbuzzSlices';
import { BASE_URL, SENDGETMESSAGETOMATCH, BEARER_TOKEN } from '../../api/EndPoint';
import { setGlobalSpinBuzzState } from '../../redux/slices/anonSlices';
import axios from 'axios';
import SpinbuzzMessage from '../../modals/SpinbuzzMessage';
const AnonymousMatchProfile = () => {
  const { isDarkMode } = '';
  const dispatch = useDispatch();
  const spinBuzzUserAnon = useSelector((state) => state.spinbuzz.spinBuzzUserAnon);
  const globalSpinBuzzState = useSelector((state) => state.community.globalSpinBuzzState);
  const [sendingMessage, setSendingMessage] = useState(false); // State to manage loading state of sending message

  const timer = useSelector((state) => state.spinbuzz.timer);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);
    return () => {
      clearInterval(timerInterval);
      dispatch(resetTimer());
    };
  }, [dispatch]);

  useEffect(() => {
    if (timer === 0) {
      dispatch(setSpinMatchModal(false));
    }
  }, [timer, dispatch]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const strokeWidth = 8; // Set the width of the progress bar
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = ((10 * 60 - timer) / (10 * 60)) * circumference;

  const handleSpinAgain = () => {
    dispatch(setSpinMatchModal(false));
    dispatch(setAnonymousspinBuzz(true));
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

  // const sendMessage = async (username) => {
  //   try {
  //     setSendingMessage(true); // Set loading state
  //     const headers = {
  //       Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     };
  //     const response = await axios.post(
  //       `${BASE_URL}${SENDGETMESSAGETOMATCH}${username}`,
  //       { text: 'Hi...' },
  //       { headers }
  //     );
  //     console.log(response.data);
  //     dispatch(setGlobalSpinBuzzState(!globalSpinBuzzState));
  //     dispatch(setSpinMatchModal(false));
  //     dispatch(setAnonymousspinBuzz(false));
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setSendingMessage(false); // Reset loading state regardless of success or failure
  //   }
  // };

  const [anonChat, setAnonChat] = useState(null);

  const handleClick = async (spinBuzzUserAnon) => {
    try {
      setAnonChat(spinBuzzUserAnon);
      setSendingMessage(true);
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${SENDGETMESSAGETOMATCH}${spinBuzzUserAnon.username}`,
        { text: 'Hi...' },
        { headers }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setSendingMessage(false);
    }
  };

  // const handleClick = (spinBuzzUserAnon) => {
  //   setAnonChat(spinBuzzUserAnon); // Set anonChat to username when clicked
  // };

  const handleClose = () => {
    setAnonChat(null); // Reset anonChat when SpinbuzzMessage requests to close
    dispatch(setSpinMatchModal(false)); // Close the modal
    // dispatch(setAnonymousspinBuzz(false)); // Handle other close actions
  };

  return (
    <>
      <div
        className={isDarkMode ? styles.profileOuterContainer : styles['d-profileOuterContainer']}
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
          <div
            className={isDarkMode ? styles.profileBox3 : styles['d-profileBox3']}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '920px' }}
          >
            <div className={styles.coverImgContainer}>
              <img src={defaultCover} className={styles.coverImg} />
              <div className={styles.moreIconContainer}>
                <img src="/darkIcon/moreVerticalDark.svg" className={styles.moreIcon} />
              </div>
            </div>
            <div className={isDarkMode ? styles.profileContainer : styles['d-profileContainer']}>
              <img
                src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${spinBuzzUserAnon.avatar}.png`}
                className={styles.profile}
              />
            </div>
            <div className={styles.nameBoxContainer}>
              <div className={styles.nameContainer}>
                <p className={isDarkMode ? styles.name : styles['d-name']}>
                  @{spinBuzzUserAnon.username || 'no username'}
                </p>
              </div>
              <div className={styles.batchIconContainer}>
                <img src="/icon/bronze.svg" alt="batch" className={styles.batchIcon} />
              </div>
            </div>
            <div className={styles.ageContainer}>
              <div className={styles.ageImgContainer}>
                <img src="/Images/profileSpinbuzz.svg" className={styles.ageImg} alt="age" />
              </div>
              <span className={styles.colon}>:</span>
              <div className={styles.ageTextContainer}>
                <p className={styles.ageText}>{checkAge(spinBuzzUserAnon.ageRange)}</p>
              </div>
            </div>

            <div className={styles.locationContainer}>
              <div className={styles.locationImgContainer}>
                <img src="/icon/location.svg" className={styles.locationImg} alt="age" />
              </div>
              <span className={styles.colon}>:</span>
              <div className={styles.locationTextContainer}>
                <p className={styles.locationText}>Pune</p>
              </div>
            </div>

            <div className={styles.languageContainer}>
              <div className={styles.languageImgContainer}>
                <img src="/icon/languageSquare.svg" className={styles.languageImg} alt="language" />
              </div>
              <span className={styles.colon}>:</span>
              {spinBuzzUserAnon.languages.map((language, index) => (
                <div key={index} className={styles.languagesRow}>
                  <div className={styles.languageTextContainer}>
                    <p className={styles.languageText}>{language}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.languageContainer}>
              <div className={styles.languageImgContainer}>
                <img src="/icon/hobby.svg" className={styles.languageImg} alt="language" />
              </div>
              <span className={styles.colon}>:</span>
              {spinBuzzUserAnon.hobbies.map((interest, index) => (
                <div key={index} className={styles.languagesRow}>
                  <div className={styles.languageTextContainer}>
                    <p className={styles.languageText}>{interest}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={isDarkMode ? styles.bioBox : styles['d-bioBox']}>
              <p className={isDarkMode ? styles.bio : styles['d-bio']}>
                {spinBuzzUserAnon.bio || 'no bio provided'}
              </p>
            </div>

            <div className={styles.buttonsContainer}>
              <button
                className={isDarkMode ? styles.spinButton : styles['d-spinButton']}
                onClick={handleSpinAgain}
              >
                Spin Again
              </button>
              <button
                className={isDarkMode ? styles.sendHiButton : styles['d-sendHiButton']}
                // onClick={() => sendMessage(spinBuzzUserAnon.username)}
                onClick={() => handleClick(spinBuzzUserAnon)}
              >
                <img src="/icon/sendHi.svg" alt="Greet Icon" className={styles.hiIcon} />
                {sendingMessage ? 'Sending...' : 'Send Hi!'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {anonChat && <SpinbuzzMessage profile={anonChat} handleClose={handleClose} />}
    </>
  );
};
export default AnonymousMatchProfile;
