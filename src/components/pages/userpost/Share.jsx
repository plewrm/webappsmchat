import React, { useEffect, useState } from 'react';
import './PostModal.css';
import { closeShareModal } from '../../../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import selectedShare from '../../../assets/icons/selected-share.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  FOLLOWING,
  retrievedSoconId,
  SHAREPOST
} from '../../../api/EndPoint';
import { setConversation } from '../../../redux/slices/chatSlice';
import { isPeerOnXmtpNetwork, startConversation } from '../../../xmtp/models/conversations';
import toast from 'react-hot-toast';
import axios from 'axios';
import { sendMessage } from '../../../xmtp/models/messages';
import defaultProfile from '../../../assets/icons/Default_pfp.webp';
import { ContentTypeSharePost, SharePost } from '../../../xmtp/codecs/PostShareCodec';

const Share = ({ link }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const xmtp = useSelector((state) => state.auth.xmtp);
  const messageData = useSelector((state) => state.chat.messageData);
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const [selectedShares, setSelectedShares] = useState([]);
  const [addMsg, setAddMsg] = useState('');
  const [shares, setShares] = useState(null);

  useEffect(() => {
    fetchAllShares();
  }, []);

  const handleCloseModal = () => {
    dispatch(closeShareModal());
  };

  const sharePostApi = async (soconId, hash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // need to change later
      const response = await axios.post(
        `${BASE_URL}${SHAREPOST}${soconId}/${hash}`,
        {},
        { headers }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllShares = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // need to change later
      const response = await axios.get(
        `${BASE_URL}${FOLLOWING}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      // console.log(response.data.following)
      setShares(response.data.following.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleSelect = (share) => {
    const isSelected = selectedShares.some(
      (selectedShare) => selectedShare.soconId === share.soconId
    );
    if (isSelected) {
      const updatedShares = selectedShares.filter(
        (selectedShare) => selectedShare.soconId !== share.soconId
      );
      setSelectedShares(updatedShares);
    } else {
      const updatedShares = [...selectedShares, share];
      setSelectedShares(updatedShares);
    }
  };

  const sendLink = async () => {
    let caption = '';
    let image = null;
    let type = selectedPost.type;
    if (type === 2) caption = selectedPost.text;
    else {
      image = selectedPost.images[0].url;
      caption = selectedPost.images[0].caption;
    }
    const sharePostObj = new SharePost(
      selectedPost.author.soconId,
      selectedPost.author.username,
      selectedPost.hash,
      caption,
      image,
      type
    );
    const canMessage = await isPeerOnXmtpNetwork(xmtp, selectedShares[0].walletAddress);
    if (!canMessage) {
      toast.error('cannot message this user, try later!');
      return;
    }
    const conversation = await startConversation(xmtp, selectedShares[0]);
    // dispatch(setConversation(conversation));
    if (!xmtp) return;
    try {
      await sendMessage(xmtp, conversation, sharePostObj, ContentTypeSharePost, selectedShare[0]);
      sharePostApi(selectedPost.author.soconId, selectedPost.hash);
      toast.success('Post shared successfully!');
      handleCloseModal(); // Close the modal on successful message send
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message. Please try again later.');
    }
    // const finalContentType = ContentTypeSharePost;

    // let textInput = '';
    // if (link) {
    //   textInput = `${link} ${addMsg}`;
    // } else {
    //   textInput = `https://app.socialcontinent.xyz/homepage/post/${selectedPost.hash}/${selectedPost.author.soconId} ${addMsg}`;
    //   sharePostApi(selectedPost.author.soconId, selectedPost.hash);
    // }
    // // console.log(textInput)
    // const attachment = null;
    // if (textInput || attachment) {
    //   const finalContent = textInput || attachment;
    //   const finalContentType = textInput ? ContentTypeText : ContentTypeAttachment;
    //   // send regular message
    //   if (!xmtp) return;
    //   console.log('xmtp sendng msg', xmtp);
    //   try {
    //     await sendMessage(xmtp, conversation, finalContent, finalContentType, selectedShare[0]);
    //     toast.success('Message sent successfully!');
    //     handleCloseModal(); // Close the modal on successful message send
    //   } catch (error) {
    //     console.error(error);
    //     toast.error('Failed to send message. Please try again later.');
    //   }
    // }
  };

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

  return (
    <div
      className={isDarkMode ? 'post-modal-overlay' : 'd-post-modal-overlay'}
      onClick={handleCloseModal}
    >
      <div
        className={isDarkMode ? 'post-modals-container' : 'd-post-modals-container'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="share-modal-outer-container">
          <div className="share-modal-header">
            <div className="share-modal-icon-container">
              <img
                src={isDarkMode ? '/lightIcon/sendLight.svg' : '/darkIcon/sendDark.svg'}
                alt="share"
                className="share-modal-iocn"
              />
            </div>
            <div className="share-modal-title-container">
              <p className={isDarkMode ? 'share-modal-title' : 'd-share-modal-title'}>Share</p>
            </div>
            {isMobileView && (
              <div className="close-post-modal-container" onClick={handleCloseModal}>
                <img
                  src={
                    isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'
                  }
                  alt="close"
                  className="close-post-modal"
                />
              </div>
            )}
          </div>

          <div className={isDarkMode ? 'share-input-container' : 'd-share-input-container'}>
            <div className="share-search-icon-container">
              <img
                src={isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg'}
                alt="search"
                className="share-search-icon"
              />
            </div>
            <input
              placeholder="Search people groups..."
              className={isDarkMode ? 'share-input' : 'd-share-input'}
            />
          </div>

          <div className={isDarkMode ? 'share-people-container' : 'd-share-people-container'}>
            {shares &&
              shares.map((item, index) => (
                <div
                  className="share-people-containers"
                  key={index}
                  onClick={() => handleToggleSelect(item)}
                >
                  <div className="share-people-profile-container">
                    <img
                      src={item.pfp ? item.pfp : defaultProfile}
                      className="share-people-profile"
                      alt="people"
                    />
                  </div>
                  <div className="share-people-name-container">
                    <p className={isDarkMode ? 'share-people-name' : 'd-share-people-name'}>
                      {item.display_name ? item.display_name : 'User'}
                    </p>
                  </div>

                  <div className="share-select-box-container">
                    {selectedShares.some(
                      (selectedShare) => selectedShare.soconId === item.soconId
                    ) ? (
                      <img src="/icon/suqareMark.svg" alt="Selected" />
                    ) : (
                      <img src="/icon/suqareUnmark.svg" alt="Not Selected" />
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div
            className={
              isDarkMode ? 'share-bottom-outer-container' : 'd-share-bottom-outer-container'
            }
          >
            <div className="share-bottom-inner-container">
              <div
                className={isDarkMode ? 'share-input-msg-container' : 'd-share-input-msg-container'}
              >
                <div className="share-search-profile-container">
                  <img
                    src={userProfile && userProfile.pfp ? userProfile.pfp : defaultProfile}
                    alt="image"
                    className="share-search-profile"
                  />
                </div>
                <input
                  placeholder="Add a message..."
                  onChange={(e) => setAddMsg(e.target.value)}
                  className={isDarkMode ? 'share-msg-input' : 'd-share-msg-input'}
                />
              </div>

              <div className="share-modal-bottom-icon-container">
                {selectedShares && selectedShares.length > 0 ? (
                  <img
                    src={selectedShare}
                    alt="share"
                    className="share-modal-bottom-iocn"
                    onClick={sendLink}
                  />
                ) : (
                  <img
                    src={isDarkMode ? '/lightIcon/unsendLight.svg' : '/darkIcon/msgUnsendDark.svg'}
                    alt="share"
                    className="share-modal-bottom-iocn"
                  />
                )}{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
