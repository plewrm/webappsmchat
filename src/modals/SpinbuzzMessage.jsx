import React, { useState, useEffect } from 'react';
import './SpinBuzzMessage.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeRevealProfileModal,
  closeSpinChatMoreModal,
  closeSpinbuzzMessageModal,
  openRevealProfileModal,
  openSpinChatMoreModal,
  openRevealProfile,
  closeRevealProfile
} from '../redux/slices/modalSlice';
import { useTheme } from '../context/ThemeContext';
import cancel from '../assets/icons/modal-close.svg';
import more from '../assets/icons/dark-more-vertical.svg';
import verify from '../assets/icons/verify.svg';
import msgDp from '../assets/images/message-user (2).png';
import camera from '../assets/icons/chat-camera.svg';
import microphone from '../assets/icons/chat-microphone.svg';
import attatchSquare from '../assets/icons/chat-attach-square.svg';
import gif from '../assets/icons/emoji-happy.svg';
import { BASE_URL, BEARER_TOKEN, SENDGETMESSAGETOMATCH } from '../api/EndPoint';
import axios from 'axios';
import { getDateForNoti } from '../utils/time';
import { useNavigate } from 'react-router-dom';
import AnonymousSpinbuzz from '../anonymous/modal/AnonymousSpinbuzz';
import styles from '../modals/spinbuzzNew/SpinbuzzChat.module.css';
const SpinbuzzMessage = ({ profile, handleClose }) => {
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = '';
  const spinChatMoreModalOpen = useSelector((state) => state.modal.spinChatMoreModalOpen);
  const isRevealProfile = useSelector((state) => state.modal.isRevealProfile);
  const revealProfile = useSelector((state) => state.modal.revealProfile);
  const [hideRevealButon, setHideRevealButton] = useState(true);
  const [messages, setMessages] = useState([]);
  const [update, setUpdate] = useState(false);

  const openSpinMoreModal = () => {
    dispatch(openSpinChatMoreModal());
  };

  const closeSpinMoreModal = () => {
    dispatch(closeSpinChatMoreModal());
  };

  const openRevealModal = () => {
    dispatch(openRevealProfileModal());
  };

  const closeRevealModal = () => {
    dispatch(closeRevealProfileModal());
  };

  const handleClickRevealButton = () => {
    close();
    navigate(`/anon/${profile.username}`);
  };

  const handleopenRevealProfile = () => {
    dispatch(openRevealProfile());
  };

  const handlecloseRevealProfile = () => {
    dispatch(closeRevealProfile());
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        };
        const response = await axios.get(`${BASE_URL}${SENDGETMESSAGETOMATCH}${profile.username}`, {
          headers
        });
        console.log(response.data);
        setMessages(response.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    getAllMessages();
  }, [update]);

  const [message, setMessage] = useState('');

  const sendAnonMessage = async () => {
    if (!message || message.trim() === '') {
      return;
    }
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(
        `${BASE_URL}${SENDGETMESSAGETOMATCH}${profile.username}`,
        { text: message },
        { headers }
      );
      console.log(response.data);
      setMessage('');
      setUpdate(!update);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {/* <div className="spin-message-modal-overlay">
        <div
          className={
            isDarkMode ? 'light-spin-message-modal-content' : 'dark-spin-message-modal-content'
          }
        >
          <div className="spinbuzz-message-header">
            <div className="spin-headers-box">
              <div className="spin-profiles-box">
                <div className="spin-msg-profile-container">
                  <img
                    src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${profile.avatar}.png`}
                    alt="profile"
                    className="spin-msg-profile"
                  />
                </div>
              </div>

              <div className="spin-msg-username-container">
                <p className={isDarkMode ? 'spin-msg-username' : 'd-spin-msg-username'}>
                  @{profile.username}
                </p>
              </div>
            </div>

            <div className="spin-msg-close-actions">
              <div className="spin-msg-more-container" onClick={openSpinMoreModal}>
                <img src={more} alt="more" className="spin-msg-more" />
              </div>
              <div onClick={closeSpinbuzzSecondModalHandler} className="spin-msg-close-container">
                <img src={cancel} alt="cancel" className="spin-msg-close" />
              </div>
            </div>
          </div>

          <div className={isDarkMode ? 'spin-msg-chat-container' : 'd-spin-msg-chat-container'}>
            <div className="spin-chat-buttons-container">
              <button
                className={isDarkMode ? 'spin-chat-buttons' : 'd-spin-chat-buttons'}
                onClick={handleopenRevealProfile}
              >
                Spin Again!
              </button>
              {hideRevealButon && (
                <button
                  className={isDarkMode ? 'spin-chat-buttons' : 'd-spin-chat-buttons'}
                  onClick={openRevealModal}
                >
                  View Profile
                </button>
              )}
            </div>

            <div className="d-chat-container">
              {messages &&
                messages.map((chat, index) => (
                  <ul key={index} className="chat">
                    {chat.sentByMe ? (
                      <li className="end2_spinbuzz">
                        <div
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}
                        >
                          <div className="message right">
                            <p>{chat.content}</p>
                          </div>
                          <span className="message-time">{getDateForNoti(chat.sentAt)}</span>
                          <div className="message-profile-contianer">
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'end',
                            gap: '8px',
                            marginBottom: '0px'
                          }}
                        >
                          <div className="message-profile-contianer">
                            <img
                              src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${profile.avatar}.png`}
                              alt="image"
                              className="message-profile"
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'start'
                            }}
                          >
                            <div className="message left">
                              <p>{chat.content}</p>
                            </div>
                            <span className="message-time">{getDateForNoti(chat.sentAt)}</span>
                          </div>
                        </div>
                      </li>
                    )}

            
                  </ul>
                ))}
            </div>

            <div
              className={isDarkMode ? 'chat-box-footer1' : 'd-chat-box-footer1'}
              style={{ padding: '1% 2% 0% 2%', gap: '.0.8vw' }}
            >


              <div className="chat-bottom-input-container">
                <input
                  type="text"
                  className={isDarkMode ? 'chat-bottom-input1' : 'd-chat-bottom-input1'}
                  placeholder="Type here..."
                  style={{ fontSize: '0.938rem' }}
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>


              <div onClick={() => sendAnonMessage()} className="chat-bottom-icons-container">
                <img src={gif} alt="gif" className="chat-bottom-icons" />
              </div>
            </div>
          </div>
        </div>

        {isRevealProfile && (
          <div className="spinMore" onClick={closeRevealModal}>
            <div className={isDarkMode ? 'spin-more-box' : 'd-spin-more-box'}>
              <div className="reveal-profile-confirmation">
                <p className={isDarkMode ? 'reveal-confirmation' : 'd-reveal-confirmation'}>
                  Are you sure you want to reveal your profile ?
                </p>
              </div>

              <div className="reveal-confirmation-btns">
                <button className={isDarkMode ? 'confirmation-btn1' : 'd-confirmation-btn1'}>
                  Not Now!
                </button>
                <button
                  className={isDarkMode ? 'confirmation-btn2' : 'd-confirmation-btn2'}
                  onClick={handleClickRevealButton}
                >
                  Yes Sure!
                </button>
              </div>
            </div>
          </div>
        )}

        {revealProfile && <AnonymousSpinbuzz />}
      </div> */}

      <div className={isDarkMode ? styles.chatOuterContainer : styles['d-chatOuterContainer']}>
        <div className={isDarkMode ? styles.chatBox : styles['d-chatBox']}>
          <div className={isDarkMode ? styles.innerChat : styles['d-innerChat']}>
            <div className={styles.chatHeader}>
              <div className={styles.chatCloseImgContainer} onClick={handleClose}>
                <img
                  src={
                    isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'
                  }
                  alt="close"
                  className={styles.chatCloseImg}
                />
              </div>
              <div className={styles.chaHeaderProfileContainer}>
                <img
                  src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${profile.avatar}.png`}
                  className={styles.chaHeaderProfile}
                  alt="profile"
                />
              </div>
              <div className={styles.chatNameContainer}>
                <p className={isDarkMode ? styles.chatName : styles['d-chatName']}>
                  @{profile.username}
                </p>
              </div>
              <div className={styles.moreIconContainer}>
                <img
                  src={
                    isDarkMode
                      ? '/lightIcon/moreVerticalLight.svg'
                      : '/darkIcon/moreVerticalDark.svg'
                  }
                  className={styles.moreIcon}
                />
              </div>
            </div>

            <div className="d-chat-container">
              {messages &&
                messages.map((chat, index) => (
                  <ul key={index} className="chat">
                    {chat.sentByMe ? (
                      <li className="end2_spinbuzz">
                        <div
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}
                        >
                          <div className="message right">
                            <p>{chat.content}</p>
                          </div>
                          <span className="message-time">{getDateForNoti(chat.sentAt)}</span>
                          <div className="message-profile-contianer"></div>
                        </div>
                      </li>
                    ) : (
                      <li>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'end',
                            gap: '8px',
                            marginBottom: '0px'
                          }}
                        >
                          <div className="message-profile-contianer">
                            <img
                              src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${profile.avatar}.png`}
                              alt="image"
                              className="message-profile"
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'start'
                            }}
                          >
                            <div className="message left">
                              <p>{chat.content}</p>
                            </div>
                            <span className="message-time">{getDateForNoti(chat.sentAt)}</span>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                ))}
            </div>

            <div className={isDarkMode ? styles.footer : styles['d-footer']}>
              <input
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className={isDarkMode ? styles.chatInput : styles['d-chatInput']}
                placeholder="Send message"
              />

              <div className={styles.chatSendIconContainer}>
                {message.trim() === '' ? (
                  <img
                    src={isDarkMode ? '/lightIcon/unsendLight.svg' : '/darkIcon/msgUnsendDark.svg'}
                    alt="send"
                    className={styles.chatSendIcon}
                    onClick={() => sendAnonMessage()}
                  />
                ) : (
                  <img
                    src="/darkIcon/sendMsgDark.svg"
                    alt="send"
                    className={styles.chatSendIcon}
                    onClick={() => sendAnonMessage()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinbuzzMessage;
