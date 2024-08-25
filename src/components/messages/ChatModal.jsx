import React, { useEffect, useState, createRef, useRef } from 'react';
import './AllMessage.css';
import ChatMessageBox from './ChatMessageBox';
import { BASE_URL, BEARER_TOKEN, GETPROFILE } from '../../api/EndPoint';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile, setXmtp, setPrivateKey } from '../../redux/slices/authSlice';
import { ethers } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import { saveConversation } from '../../xmtp/models/conversations';
import { useLiveConversation } from '../../xmtp/hooks/useLiveConversation';
import { useMessages } from '../../xmtp/hooks/useMessages';
import { ContentTypeAttachment } from '@xmtp/content-type-remote-attachment';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { sendMessage } from '../../xmtp/models/messages';
import AttachmentPreviewView from './AttachmentPreview';
import { useTheme } from '../../context/ThemeContext';
import send from '../../assets/icons/selected-share.svg';
import unsend from '../../assets/icons/route-square.svg';
import leftArrow from '../../assets/images/arrow-left.png';
import defaultPfp from '../../assets/icons/Default_pfp.webp';
import { setAudioCall, setVideoCall } from '../../redux/slices/phoneCallSlice';
import { useNavigate } from 'react-router-dom';
import getRoomId from '../calling/getRoomId';
import { ContentTypeSharePost } from '../../xmtp/codecs/PostShareCodec';
import PostShareCard from './PostShareCard';

const ChatModal = ({ modal, position, closeChat, index, toggleChatSize }) => {
  const dispatch = useDispatch();
  const [roomid, setRoomId] = useState(null);
  const address = useSelector((state) => state.wallet.address);
  const navigate = useNavigate();
  // const openVideoCall = () => {
  //   navigate(`/videocall/${roomid}`)
  //  }
  useEffect(() => {
    const showroomId = async () => {
      const room = await getRoomId([address]);
      console.log('navigate room id', room);
      setRoomId(room);
    };
    showroomId();
  }, []);

  const openVideoCall = () => {
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const videoCallUrl = `/videocall/${roomid}`;
    const newWindow = window.open(
      videoCallUrl,
      '_blank',
      `width=${width}, height=${height}, left=${left}, top=${top}`
    );

    if (newWindow) {
      newWindow.focus();
    } else {
      window.open(`/videocall/${roomid}`, '_blank');
    }
  };

  const openAudioCall = () => {
    dispatch(setAudioCall(true));
  };

  const loggedInUserProfile = useSelector((state) => state.auth.userProfile);
  const xmtp = useSelector((state) => state.auth.xmtp);
  const conversation = useSelector((state) => state.chat.conversation);
  const postLink = useSelector((state) => state.chat.postLink);
  const [attachment, setAttachment] = useState();
  const [textInput, setTextInput] = useState(postLink);
  const { isDarkMode } = useTheme();
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

  const fileField = createRef();

  const liveConversation = useLiveConversation(conversation);
  // console.warn('ff', conversation);
  const conversationMessages = useMessages(conversation);
  // console.log('hhhhhhhh', conversationMessages);

  const sendMessageToUser = async () => {
    if (textInput || attachment) {
      const finalContent = textInput || attachment;
      const finalContentType = textInput ? ContentTypeText : ContentTypeAttachment;
      // send regular message
      if (!xmtp) return;
      await sendMessage(xmtp, conversation, finalContent, finalContentType, modal);
    }
    // const message = await conversation.send(inputMessage);
    setTextInput('');
    // setConversation([...conversationMessages, message]);
  };

  async function onChange(e) {
    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    setAttachment({
      filename: file.name,
      mimeType: file.type,
      data: new Uint8Array(arrayBuffer)
    });

    window.scroll({ top: 10000, behavior: 'smooth' });
  }

  const goToProfile = () => {
    navigate(`/profile/${modal.username}/${modal.soconId}`, { state: { soconId: modal.soconId } });
  };

  const divRef = useRef(null);
  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    const scrollToBottom = () => {
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }
    };

    // Scroll to the bottom when the component mounts and when conversationMessages changes
    scrollToBottom();
  }, [conversationMessages]);

  return (
    <div
      className="chat-modal"
      style={
        !isMobileView
          ? { right: `${42 + position * 0}%`, bottom: '0px' }
          : { left: '0%', bottom: '0%' }
      }
      onClick={() => closeChat(modal, index)}
    >
      <div
        className={
          modal?.isMaximized
            ? isDarkMode
              ? 'chat-modal-content'
              : 'd-chat-modal-content'
            : isDarkMode
              ? 'chat-modal-content-large'
              : 'd-chat-modal-content-large'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className={modal?.isMaximized ? 'chat-box-header' : 'chat-box-header-large'}>
          <div className="leftArrowMobileContainer" onClick={() => closeChat(modal, index)}>
            <img src={leftArrow} alt="back" className="leftArrowMobile" />{' '}
            {/* for mobile view only */}
          </div>
          <div
            className={
              modal?.isMaximized ? 'chat-profile-container' : 'chat-profile-container-large'
            }
            onClick={goToProfile}
          >
            <img src={modal.pfp ? modal.pfp : defaultPfp} alt="User" className="chat-profile" />
          </div>
          <div className="chat-name-container" onClick={goToProfile}>
            <p
              className={
                modal?.isMaximized
                  ? isDarkMode
                    ? 'chat-name'
                    : 'd-chat-name'
                  : isDarkMode
                    ? 'chat-name-large'
                    : 'd-chat-name-large'
              }
            >
              {modal.display_name ? modal.display_name : '@' + modal.username}
            </p>
          </div>
          <div
            className={
              modal?.isMaximized ? 'chat-actions-container' : 'chat-actions-container-large'
            }
          >
            <div
              className="chat-more-container"
              style={{ display: isMobileView ? 'none' : 'block' }}
            >
              {modal?.isMaximized ? (
                <div className="chat-more-container" onClick={() => toggleChatSize(modal, index)}>
                  <img
                    src={isDarkMode ? '/lightIcon/maximizeLight.svg' : '/darkIcon/maximizeDark.svg'}
                    alt="minimize"
                    className="chat-more"
                  />
                </div>
              ) : (
                <div className="chat-more-container" onClick={() => toggleChatSize(modal, index)}>
                  <img
                    src={isDarkMode ? '/lightIcon/minimizeLight.svg' : '/darkIcon/minimizeDark.svg'}
                    className="chat-more"
                    alt="maximize"
                  />
                </div>
              )}
            </div>
            <div
              className="chat-more-container"
              style={{ display: isMobileView ? 'none' : 'block' }}
            >
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className="chat-more"
                onClick={() => closeChat(modal, index)}
              />
            </div>
          </div>
        </div>

        <div
          ref={divRef}
          className={
            modal?.isMaximized
              ? isDarkMode
                ? 'chat-container'
                : 'd-chat-container'
              : isDarkMode
                ? 'chat-container-large'
                : 'd-chat-container-large'
          }
        >
          <ul className="chat">
            {conversationMessages &&
              conversationMessages.map((element, index) => {
                if (!element.content) return <></>;
                if (ContentTypeSharePost.sameAs(element.contentType)) {
                  return (
                    <PostShareCard
                      key={element.id}
                      postDetails={element.content}
                      type={element.sentByMe ? 'right' : 'left'}
                      time={element.sentAt}
                      imgSrc={modal.pfp}
                    />
                  );
                } else if (ContentTypeText.sameAs(element.contentType)) {
                  // console.log('text msg', element.content);
                  return (
                    <ChatMessageBox
                      key={element.id}
                      msg={element.content}
                      type={element.sentByMe ? 'right' : 'left'}
                      time={element.sentAt}
                      imgSrc={modal.pfp}
                    />
                  );
                } else {
                  return (
                    <ChatMessageBox
                      key={element.id}
                      msg="Unsupported message type"
                      type={element.sentByMe ? 'right' : 'left'}
                      time={element.sentAt}
                      imgSrc={modal.pfp}
                    />
                  );
                }
              })}
          </ul>
        </div>

        <div
          className={
            modal?.isMaximized
              ? isDarkMode
                ? 'chat-box-footer'
                : 'd-chat-box-footer'
              : isDarkMode
                ? 'chat-box-footer-large'
                : 'd-chat-box-footer-large'
          }
        >
          {/* <div
            className={modal?.isMaximized ? 'chat-bottom-camera-container' : 'chat-bottom-camera-container-large'}
            onClick={() => fileField.current?.click()}
          >
            <img src={camera} alt="camera" className="chat-bottom-camera" />
          </div> */}

          <div className="chat-bottom-input-container">
            <input
              type="text"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessageToUser();
                }
              }}
              onChange={(event) => setTextInput(event.target.value)}
              value={textInput}
              className={
                modal?.isMaximized
                  ? isDarkMode
                    ? 'chat-bottom-input'
                    : 'd-chat-bottom-input'
                  : isDarkMode
                    ? 'chat-bottom-input-large'
                    : 'd-chat-bottom-input-large'
              }
              placeholder={attachment ? 'Press Send to send attachment' : 'Type a message'}
              disabled={!!attachment}
            />
          </div>

          <div
            className={
              modal?.isMaximized
                ? 'chat-bottom-icons-container'
                : 'chat-bottom-icons-container-large'
            }
          >
            {textInput ? (
              <img
                src="/darkIcon/sendMsgDark.svg"
                alt="send"
                className="chat-bottom-icons"
                onClick={sendMessageToUser}
              />
            ) : (
              <img
                src={isDarkMode ? '/lightIcon/unsendLight.svg' : '/darkIcon/msgUnsendDark.svg'}
                alt="unsend"
                className="chat-bottom-icons"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
