import React, { useState, useEffect, useRef } from 'react';
import './AllMessage.css';
import { useTheme } from '../../context/ThemeContext';
import { formatTimestamp } from '../../utils/time';
import ChatModal from './ChatModal';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageMobile, setMobileChats } from '../../redux/slices/mobileActionSlices';
import { setMessageData, setConversation, appendMessageData } from '../../redux/slices/chatSlice';
import { useConversations } from '../../xmtp/hooks/useConversations';
import { useLatestMessages } from '../../xmtp/hooks/useLatestMessages';
import { startConversation } from '../../xmtp/models/conversations';
import defaultProfile from '../../assets/icons/Default_pfp.webp';
import leftArrow from '../../assets/images/arrow-left.png';
import leftBack from '../../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../../assets/icons/arrow-left-lightMode.svg';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { ContentTypeSharePost } from '../../xmtp/codecs/PostShareCodec';
import { ContentTypeRemoteAttachment } from '@xmtp/content-type-remote-attachment';
import AllMessagesSkeleton from './AllMessagesSkeleton';

const AllMessage = ({ applyClass }) => {
  const dispatch = useDispatch();
  const MessageData = useSelector((state) => state.chat.messageData);
  const { isDarkMode } = useTheme();
  const [isChatMaximized, setIsChatMaximized] = useState(true);
  const [chatModals, setChatModals] = useState(
    MessageData.map((item) => ({ ...item, isMaximized: true }))
  ); // particular modal maximize as per id
  const xmtp = useSelector((state) => state.auth.xmtp);
  var conversations = useConversations(xmtp);
  const [filterConvo, setFilterConvo] = useState([]);
  const [seacrhInput, setSearchInput] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // useEffect(()=>{
  //     if(!seacrhInput){
  //         setFilterConvo(conversations)
  //     }
  // },[filterConvo])
  const latestMessages = useLatestMessages(conversations);
  const { isMobile, mobileChats, hideAllMsg } = useSelector((state) => state.mobileActions);
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

  // const closeChat = (item, index) => {
  //   if (item.isOpened == true) {
  //     dispatch(setMessageData({ index, newData: { ...item, isOpened: false } }));
  //   }
  // };
  const closeChat = (item, index) => {
    dispatch(setMessageData({ index, newData: { ...item, isOpened: false, isMaximized: false } }));
    const openedChats = MessageData.filter((chat) => chat.isOpened);
    openedChats.forEach((chat, i) => {
      dispatch(
        setMessageData({
          index: MessageData.indexOf(chat),
          newData: { ...chat, isOpened: false, isMaximized: false }
        })
      );
    });
  };

  const toggleChatSize = (modal, index) => {
    dispatch(setMessageData({ index, newData: { ...modal, isMaximized: !modal.isMaximized } }));
  };

  const seachBy = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    setSearchInput(searchTerm);
    const filteredConvo = conversations.filter(
      (convo) =>
        convo.username.toLowerCase().includes(searchTerm) ||
        (convo.display_name && convo.display_name.toLowerCase().includes(searchTerm))
    );
    setFilterConvo(filteredConvo);
  };

  const getLatestMessage = (latestMessage) => {
    let latestMessageContent = '';
    if (ContentTypeText.sameAs(latestMessage.contentType)) {
      latestMessageContent = latestMessage.content;
    }
    if (ContentTypeSharePost.sameAs(latestMessage.contentType)) {
      if (latestMessage.sentByMe) latestMessageContent = 'You shared a post';
      else latestMessageContent = 'Shared a post';
    }
    if (ContentTypeRemoteAttachment.sameAs(latestMessage.contentType)) {
      if (latestMessage.sentByMe) latestMessageContent = 'You sent an attachment';
      else latestMessageContent = 'Sent an attachment';
    }
    return latestMessageContent;
  };

  const goToHome = () => {
    dispatch(setMessageMobile(false));
  };

  useEffect(() => {
    if (MessageData.length > 0) {
      setIsLoading(false); // Set loading to false once data is available
    }
  }, [MessageData]);

  useEffect(() => {
    if (conversations.length > 0) {
      setFilterConvo(conversations);
      setIsLoading(false);
    } else {
      setFilterConvo([]); // Ensure filterConvo is an empty array if there are no conversations
      setIsLoading(false); // Set loading to false when conversations are checked
    }
  }, [conversations]);

  // if (isLoading) {
  //   return (
  //     <div className="loaderContainer">
  //       <div className={isDarkMode ? 'loader' : 'd-loader'}></div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div>
        <div className="chat-title-container">
          {/* <p className={isDarkMode ? 'chat-title' : 'd-chat-title'}>Chats</p> */}
        </div>
        <div className="message-search-bar-containers">
          {isMobileView && (
            <img onClick={goToHome} src={isDarkMode ? leftBackLight : leftBack} alt="back" />
          )}
          <div
            className={
              isDarkMode ? 'message-search-bar-container' : 'd-message-search-bar-container'
            }
          >
            <div className="meaasge-search-icon-container">
              <img
                src={isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg'}
                alt="search"
                className="message-search-icon"
              />
            </div>
            <input
              value={seacrhInput}
              onChange={(e) => seachBy(e)}
              type="text"
              className={isDarkMode ? 'message-search-input' : 'd-message-search-input'}
              placeholder="Search conversations"
            />
          </div>
        </div>
      </div>
      {isLoading && <AllMessagesSkeleton />}
      <div
        className={
          isDarkMode
            ? applyClass
              ? 'all-message-container-component'
              : 'all-message-container'
            : applyClass
              ? 'all-message-container-component'
              : 'd-all-message-container'
        }
      >
        {filterConvo.length === 0 && (
          <div className="no-messages-container">
            <div className={isDarkMode ? 'no-message-text' : 'd-no-message-text'}>
              No Message Yet!
            </div>
          </div>
        )}
        {filterConvo &&
          filterConvo.map((item, index) => (
            <div
              className={isDarkMode ? 'all-message-box' : 'd-all-message-box'}
              key={index}
              onClick={async () => {
                const isOpen = MessageData.some(
                  (modal) => modal.soconId === item.soconId && modal.isOpened
                );
                if (!isOpen) {
                  console.log(isOpen);
                  const conversation = await startConversation(xmtp, item);
                  console.warn('hee', conversation);
                  dispatch(
                    appendMessageData({
                      // soconId: item.soconId,
                      display_name: item.display_name,
                      username: item.username,
                      timestamp: new Date().toDateString(),
                      peerAddress: item.walletAddress,
                      isMaximized: true,
                      isOpened: true,
                      pfp: item.pfp
                    })
                  );
                  dispatch(setConversation(conversation));
                }
              }}
            >
              <div className="msg-photo-container">
                <img
                  src={item.pfp ? item.pfp : defaultProfile}
                  alt="image"
                  className="msg-photo-container"
                />
              </div>

              <div className="all-message-container-2">
                <div className="all-message-container-21">
                  <div className="all-message-name-container">
                    <p className={isDarkMode ? 'all-message-name' : 'd-all-message-name'}>
                      {item.display_name ? item.display_name : '@' + item.username}
                    </p>
                  </div>
                </div>

                <div className="all-message-container-22">
                  <div className="user-message-container">
                    <p className={isDarkMode ? 'user-message' : 'd-user-message'}>
                      {/* {latestMessages[index]?.content
                        ? latestMessages[index].content
                        : 'Loading...'} */}
                      {latestMessages[index] && getLatestMessage(latestMessages[index])}
                    </p>
                  </div>

                  <div className="msg-time-container">
                    <p className={isDarkMode ? 'msg-time' : 'd-msg-time'}>
                      {formatTimestamp(item.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {MessageData.filter((element) => element.isOpened == true)
        .slice(-1)
        .map((modal, openPositionIndex) => (
          <ChatModal
            key={openPositionIndex}
            modal={modal}
            position={openPositionIndex}
            closeChat={closeChat}
            index={MessageData.indexOf(modal)}
            toggleChatSize={toggleChatSize}
            // conversation={conversation}
          />
        ))}
    </div>
  );
};

export default AllMessage;
