import React, { useState, useEffect } from 'react';
import styles from './RepostModal.module.css';
import close from '../../../../assets/icons/modal-close.svg';
import { useDispatch, useSelector } from 'react-redux';
import { closeRepostModal } from '../../../../redux/slices/modalSlice';
import arrowUpIcon from '../../../../assets/icons/arrow-up.svg';
import { useTheme } from '../../../../context/ThemeContext';
import ImageCarousel from '../ImageCarousel';
import { REPOST, BEARER_TOKEN, BASE_URL, retrievedSoconId } from '../../../../api/EndPoint';
import axios from 'axios';
import { getDate } from '../../../../utils/time';
import { setGlobalPostState, setPostLoader } from '../../../../redux/slices/loaderSlice';
import defaultProfile from '../../../../assets/icons/Default_pfp.webp';

export default function RepostModal() {
  const { isDarkMode } = useTheme();
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const userProfile = useSelector((state) => state.auth.userProfile);
  // console.log(selectedPost)
  const dispatch = useDispatch();
  const closeModel = () => {
    dispatch(closeRepostModal());
  };
  const [captionIndexMap, setCaptionIndexMap] = useState(new Map());
  const updateIndex = (index, setCaptionIndex) => {
    const captionTempMap = new Map(captionIndexMap);
    captionTempMap.set(index, setCaptionIndex);
    setCaptionIndexMap(captionTempMap);
  };

  const [caption, setCaption] = useState(null);
  const repostApost = async () => {
    dispatch(setPostLoader(true));
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      dispatch(closeRepostModal());
      const response = await axios.post(
        `${BASE_URL}${REPOST}${selectedPost.author.soconId}/${selectedPost.hash}`,
        { caption: caption },
        { headers }
      );
      console.log(response.data);
      dispatch(setGlobalPostState(true));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setPostLoader(false));
    }
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
    <div className={styles.RepostModalOverlay} onClick={closeModel}>
      <div
        className={
          !isMobileView
            ? isDarkMode
              ? styles.repostContainer
              : styles['d-repostContainer']
            : isDarkMode
              ? styles.container_mobile
              : styles['d-container_mobile']
        }
        onClick={(e) => e.stopPropagation()}
      >
        {!isMobileView ? (
          <>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <img
                  src={isDarkMode ? '/lightIcon/repostLight.svg' : './darkIcon/repostDark.svg'}
                  className={styles.repostIcon}
                  alt="repost"
                />
                <span className={isDarkMode ? styles.repost : styles['d-repost']}>Repost</span>
              </div>
              <div className={styles.headerRight}>
                <img
                  src={
                    isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'
                  }
                  className={styles.closeIcon}
                  alt="close"
                  onClick={closeModel}
                />
              </div>
            </div>

            <div className={styles.InputContainerOuter}>
              <div className={isDarkMode ? styles.inputContainer : styles['d-inputContainer']}>
                <div className={styles.inputImgContainer}>
                  <img
                    src={userProfile.pfp || defaultProfile}
                    alt="image"
                    className={styles.inputImg}
                  />
                </div>

                <input
                  className={isDarkMode ? styles.inputBox : styles['d-inputBox']}
                  placeholder="Type here"
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className={styles.arrowIconContainer} onClick={repostApost}>
                <img src={arrowUpIcon} alt="arrow" className={styles.arrowDown} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.header_mobile}>
              <div className={styles.close_mobileContainer} onClick={closeModel}>
                <img src={close} alt="close" className={styles.close_mobile} />
              </div>
              <div className={styles.repostTextContainner_mobile}>
                <p
                  className={isDarkMode ? styles.repostText_mobile : styles['d-repostText_mobile']}
                >
                  Repost
                </p>
              </div>
              <button className={styles.repostButton_mobile}>Post</button>
            </div>

            <div className={styles.header2_mobile}>
              <div className={styles.profileContainer_mobile}>
                <img
                  alt="profile"
                  className={styles.profile_mobile}
                  src={selectedPost.author.pfp || defaultProfile}
                />
              </div>
            </div>

            <div
              className={
                isDarkMode
                  ? styles.inputFieldContainer_mobile
                  : styles['d-inputFieldContainer_mobile']
              }
            >
              <textarea
                className={isDarkMode ? styles.inputField_mobile : styles['d-inputField_mobile']}
                placeholder="say something..."
              />
              <div className={styles.chatLimitContainer_mobile}>
                <p className={isDarkMode ? styles.charLimit_mobile : styles['d-charLimit_mobile']}>
                  200 character limit
                </p>
              </div>
            </div>
          </>
        )}

        <div className={isDarkMode ? styles.postOuters : styles['d-postOuters']}>
          <div className={styles.profileHeader}>
            <div className={styles.profileContainer}>
              <img
                src={selectedPost.author.pfp || defaultProfile}
                alt="profile"
                className={styles.profile}
              />
            </div>

            <div className={styles.allName}>
              <div className={styles.nameContainer}>
                <p className={isDarkMode ? styles.name : styles['d-name']}>
                  {selectedPost.author.display_name}
                </p>
              </div>
              <div className={styles.userName}>
                <p className={isDarkMode ? styles.userName : styles['d-userName']}>
                  {selectedPost.author.username}
                </p>
              </div>
            </div>
            <div className={styles.timeContainer}>
              <p className={isDarkMode ? styles.time : styles['d-time']}>
                {getDate(selectedPost.createdAt)}
              </p>
            </div>
          </div>

          <div className={styles.captionContainer}>
            <p className={isDarkMode ? styles.caption : styles['d-caption']}>
              {selectedPost.type === 2
                ? selectedPost.text
                : selectedPost.images[captionIndexMap.get(0) || 0].caption}
            </p>
          </div>

          {selectedPost.type !== 2 && (
            <div className={styles.imgContainers}>
              <ImageCarousel
                images={selectedPost.images.map((element) => element.url)}
                types={selectedPost.images.map((element) => element.type)}
                isLiked={selectedPost.isLiked}
                handleLike={null}
                arrowClick={updateIndex}
                index={0}
                isRepost={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
