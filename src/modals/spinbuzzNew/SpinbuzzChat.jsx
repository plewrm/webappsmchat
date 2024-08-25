import React, { useEffect, useState } from 'react';
import styles from './SpinbuzzChat.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSpinbuzzChat, setShowSpinbuzzChatMsg } from '../../redux/slices/spinbuzzSlices';
import defaultPfp from '../../assets/icons/Default_pfp.webp';
import { useMessages } from '../../xmtp/hooks/useMessages';
import ChatMessageBox from '../../components/messages/ChatMessageBox';
import { ContentTypeText } from '@xmtp/xmtp-js';
import { sendMessage } from '../../xmtp/models/messages';
import { ContentTypeAttachment } from '@xmtp/content-type-remote-attachment';
import { setSpinbuzzMessageData } from '../../redux/slices/spinbuzzSlices';
const SpinbuzzChat = ({
  modal,
  position,
  index,
  sendmsg
  // closeChat,
  // toggleChatSize,
}) => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const spinBuzzUser = useSelector((state) => state.spinbuzz.spinBuzzUser);
  // const closeSpinbuzzChat = () => { dispatch(setShowSpinbuzzChat(false)) }
  const xmtp = useSelector((state) => state.auth.xmtp);
  const postLink = useSelector((state) => state.chat.postLink);
  const [chatInputField, setChatInputField] = useState('');
  const [attachment, setAttachment] = useState();
  const conversation = useSelector((state) => state.chat.conversation);
  const conversationMessages = useMessages(conversation);
  const showSpinbuzzChatmsg = useSelector((state) => state.spinbuzz.showSpinbuzzChatmsg);

  const handleChatSendButton = (e) => {
    const { value } = e.target;
    setChatInputField(value);
  };

  const closeChat = () => {
    // if (item.isOpened == true) {
    console.log('index:', index);
    dispatch(setSpinbuzzMessageData({ index, newData: { ...modal, isOpened: false } }));
    // }
  };

  const sendMessageToUser = async () => {
    if (chatInputField || attachment) {
      const finalContent = chatInputField || attachment;
      const finalContentType = chatInputField ? ContentTypeText : ContentTypeAttachment;
      // send regular message
      if (!xmtp) return;
      await sendMessage(xmtp, conversation, finalContent, finalContentType, modal);
    }
    setChatInputField('');
  };

  const isInputNotEmpty = chatInputField.trim() !== '';

  return (
    <div className={isDarkMode ? styles.chatOuterContainer : styles['d-chatOuterContainer']}>
      <div className={isDarkMode ? styles.chatBox : styles['d-chatBox']}>
        <div className={isDarkMode ? styles.innerChat : styles['d-innerChat']}>
          <div className={styles.chatHeader}>
            <div className={styles.chatCloseImgContainer} onClick={closeChat}>
              <img
                src={isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'}
                alt="close"
                className={styles.chatCloseImg}
              />
            </div>
            <div className={styles.chaHeaderProfileContainer}>
              <img
                src={spinBuzzUser.pfp ? spinBuzzUser.pfp : defaultPfp}
                className={styles.chaHeaderProfile}
                alt="profile"
              />
            </div>
            <div className={styles.chatNameContainer}>
              <p className={isDarkMode ? styles.chatName : styles['d-chatName']}>
                {spinBuzzUser.display_name
                  ? spinBuzzUser.display_name
                  : '@' + spinBuzzUser.username}
              </p>
            </div>
            <div className={styles.moreIconContainer}>
              <img
                src={
                  isDarkMode ? '/lightIcon/moreVerticalLight.svg' : '/darkIcon/moreVerticalDark.svg'
                }
                className={styles.moreIcon}
              />
            </div>
          </div>

          <div className={isDarkMode ? styles.chatContent : styles['d-chatContent']}>
            <ul className="chat">
              {conversationMessages &&
                conversationMessages.map((element, index) => {
                  return (
                    <ChatMessageBox
                      key={element.id}
                      msg={element.content}
                      type={element.sentByMe ? 'right' : 'left'}
                      time={element.sentAt}
                      imgSrc={modal.pfp}
                    />
                  );
                })}
            </ul>

            {/* <div className={styles.reciver}>
                            <div className={styles.reciverBox}>
                                <div className={styles.chatProfileContainer}>
                                    <img src='/Images/avatar.png' alt='avatar' className={styles.chatProfile} />
                                </div>
                                <div className={styles.chatLeftInfoContainer}>
                                    <div className={isDarkMode ? styles.leftChatContainer : styles['d-leftChatContainer']}>
                                        <p className={isDarkMode ? styles.leftChat : styles['d-leftChat']}>Hi!</p>
                                    </div>
                                    <div className={styles.leftTimeContainer}>
                                        <p className={isDarkMode ? styles.leftTimeText : styles['d-leftTimeText']}>8.55 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sender}>
                            <div className={styles.senderBox}>
                                <div className={styles.chatRightInfoContainer}>
                                    <div className={isDarkMode ? styles.rightChatContainer : styles['d-rightChatContainer']}>
                                        <p className={isDarkMode ? styles.rightChat : styles['d-rightChat']}>Hey</p>
                                    </div>
                                    <div className={styles.leftTimeContainer}>
                                        <p className={isDarkMode ? styles.leftTimeText : styles['d-leftTimeText']}>8.55 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
          </div>

          <div className={isDarkMode ? styles.footer : styles['d-footer']}>
            <input
              type="text"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessageToUser();
                }
              }}
              className={isDarkMode ? styles.chatInput : styles['d-chatInput']}
              placeholder="Send message"
              value={chatInputField}
              onChange={handleChatSendButton}
            />
            {/* <input
                            type="text"
                            onChange={(event) => setChatInputField(event.target.value)}
                            value={chatInputField}
                            className={modal?.isMaximized ? (isDarkMode ? "chat-bottom-input" : "d-chat-bottom-input") :
                                (isDarkMode ? "chat-bottom-input-large" : "d-chat-bottom-input-large")}
                            placeholder={attachment ? "Press Send to send attachment" : "Type a message"}
                            disabled={!!attachment}
                        /> */}
            <div className={styles.chatSendIconContainer}>
              {isInputNotEmpty ? (
                <img
                  src="/darkIcon/sendMsgDark.svg"
                  alt="send"
                  className={styles.chatSendIcon}
                  onClick={sendMessageToUser}
                />
              ) : (
                <img
                  src={isDarkMode ? '/lightIcon/unsendLight.svg' : '/darkIcon/msgUnsendDark.svg'}
                  className={styles.chatSendIcon}
                  alt="unsend"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinbuzzChat;
