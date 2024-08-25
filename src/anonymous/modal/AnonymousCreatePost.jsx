import React, { useEffect, useState } from 'react';
import styles from '../modal/AnonymousCreatePost.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearMediaFiles,
  setAnonymousCreateProfile,
  setMediaFiles,
  setShowPollInputs
} from '../../redux/slices/modalSlice';
import close from '../../assets/icons/modal-close.svg';
import gallery from '../../assets/icons/gallery.svg';
import poll from '../../assets/anonymous/icon/poll2.svg';
import profilePic from '../../assets/anonymous/image/card-profile.svg';
import addPoll from '../../assets/anonymous/icon/add-poll.svg';
import addPhoto from '../../assets/icons/add-photo.svg';
import cancel from '../../assets/anonymous/icon/image-close.svg';
import information from '../../assets/anonymous/icon/information.svg';
import dissabledAdd from '../../assets/anonymous/icon/add-square-dissabled.svg';
import axios from 'axios';
import selectCommunties from '../../assets/anonymous/icon/select-community.svg';
import { BASE_URL, BEARER_TOKEN, GETALLCOMMUNITIES } from '../../api/EndPoint';
import toast from 'react-hot-toast';
import { setGlobalAnonPost } from '../../redux/slices/anonSlices';
import activePoll from '../../assets/anonymous/icon/poll.svg';
import { Col, Row } from 'antd';

const AnonymousCreatePost = () => {
  const dispatch = useDispatch();
  const [pollInputs, setPollInputs] = useState(['', '']); // Initialize with two empty strings
  const [mediaFilesUploaded, setMediaFilesUploaded] = useState(false);
  const [chooseCommunity, setChooseCommunity] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const anonDetails = useSelector((state) => state.community.anonDetails);
  const maxCharLimit = 200;
  const mediaFiles = useSelector((state) => state.modal.mediaFiles);
  const showPollInputs = useSelector((state) => state.modal.showPollInputs);
  useEffect(() => {}, [anonDetails]);

  const handleCommunityNameChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxCharLimit) {
      setText(inputText);
    }
  };

  const closeAnonymousCreatePost = () => {
    dispatch(setAnonymousCreateProfile(false));
    dispatch(clearMediaFiles());
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      dispatch(setShowPollInputs(false));
      dispatch(setMediaFiles([...mediaFiles, ...files]));
      setMediaFilesUploaded(true);
    }
  };

  const handleCancel = (index) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    dispatch(setMediaFiles(updatedFiles));
  };

  const openFileInput = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*';
    fileInput.multiple = true;
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();
  };

  const handleAddPollInput = () => {
    if (pollInputs.length < 5) {
      setPollInputs([...pollInputs, '']);
    }
  };

  const handlePollInputChange = (index, event) => {
    const newInputs = [...pollInputs];
    newInputs[index] = event.target.value;
    setPollInputs(newInputs);
  };

  const handleCancelPollInput = (index) => {
    const updatedInputs = [...pollInputs];
    updatedInputs.splice(index, 1);
    setPollInputs(updatedInputs);
    if (updatedInputs.length === 0) {
      dispatch(setShowPollInputs(false));
    }
  };

  const [joinedCommunities, setJoinedCommunities] = useState([]);

  const getJoinedCommunities = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETALLCOMMUNITIES}`, { headers });

      // Filter communities where isMember is true
      const filteredCommunities = response.data.communities.filter(
        (community) => community.isMember
      );

      setJoinedCommunities(filteredCommunities);
      if (filteredCommunities.length === 0) {
        toast.error('Joined atleast one Community to post!');
        closeAnonymousCreatePost();
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getJoinedCommunities();
  }, []);

  const post = async () => {
    if (showPollInputs) {
      const hasEmptyPollOption = pollInputs.some((input) => input.trim() === '');
      if (hasEmptyPollOption) {
        toast.error('Please fill all poll options.');
        setLoading(false);
        return;
      }
      if (pollInputs.length < 2) {
        toast.error('Please add at least two poll options.');
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    if (!chooseCommunity) {
      toast.error('Please select a community to post!');
      return;
    }

    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    };
    if (showPollInputs) {
      try {
        const formData = new FormData();
        formData.append('description', text);
        formData.append('type', 3);
        formData.append('options', JSON.stringify(pollInputs));
        const response = await fetch(
          `${BASE_URL}${GETALLCOMMUNITIES}/${chooseCommunity}/messages`,
          {
            method: 'POST',
            headers: headers,
            body: formData
          }
        );
        dispatch(setGlobalAnonPost(!globalAnonPost));
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const mediaChoosen = mediaFiles.length;
        let anaonObj = {};

        if (mediaChoosen === 0) {
          anaonObj = {
            description: text,
            type: 2
          };
        } else if (mediaChoosen === 1) {
          anaonObj = {
            description: text,
            type: 0,
            media: mediaFiles[0]
          };
          console.log('single', mediaFiles);
        } else if (mediaChoosen > 1) {
          anaonObj = {
            description: text,
            type: 1,
            media: mediaFiles
          };
          console.log('multiple', mediaFiles);
        }

        const formData = new FormData();

        if (mediaChoosen > 0) {
          if (mediaChoosen === 1) {
            formData.append('type', 0);
            formData.append('description', text);
            mediaFiles.map((item) => {
              formData.append('media', item);
            });
          } else {
            formData.append('type', 1);
            formData.append('description', text);
            mediaFiles.map((item) => {
              formData.append('media', item);
            });
          }
          const response = await fetch(
            `${BASE_URL}${GETALLCOMMUNITIES}/${chooseCommunity}/messages`,
            {
              method: 'POST',
              headers: headers,
              body: formData
            }
          );
          dispatch(setGlobalAnonPost(!globalAnonPost));
          console.log(response);
        } else {
          const response = await axios.post(
            `${BASE_URL}${GETALLCOMMUNITIES}/${chooseCommunity}/messages`,
            anaonObj,
            { headers }
          );
          dispatch(setGlobalAnonPost(!globalAnonPost));
          dispatch(clearMediaFiles());
        }
      } catch (error) {
        console.error('print error', error);
      }
    }
    setLoading(false);
    dispatch(setAnonymousCreateProfile(false));
  };
  const selectCommunity = (name) => {
    setChooseCommunity(name);
  };

  const [startIndex, setStartIndex] = useState(0);
  const visibleItemsCount = 4;

  const handleRightClick = () => {
    if (startIndex + visibleItemsCount) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleLeftClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className={styles.anoModalOverLay} onClick={closeAnonymousCreatePost}>
      <div className={styles.anoModalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.headerContainer}>
          <div className={styles.IconContainer} onClick={closeAnonymousCreatePost}>
            <img src="/darkIcon/closeModalDark.svg" alt="close" className={styles.Icon} />
          </div>
          <span className={styles.tittle}>Create Post</span>
          {mediaFiles.length > 0 || text.trim().length > 0 ? (
            <button
              className={styles.postButton}
              onClick={post}
              style={{ background: '#6E44FF', cursor: 'pointer' }}
            >
              Post
            </button>
          ) : (
            <button
              className={styles.postButton}
              style={{ background: '#6D5FA0', cursor: 'no-drop' }}
            >
              Post
            </button>
          )}
        </div>

        <div className={styles.t1}>
          <div className={styles.t1_Inner}>
            <div className={styles.profileImgContainer}>
              {anonDetails.avatar ? (
                <img
                  className={styles.profileImg}
                  src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${anonDetails.avatar}.png`}
                ></img>
              ) : (
                <img className={styles.profileImg} src={profilePic} alt="Profile" />
              )}
            </div>
            <textarea
              onChange={handleCommunityNameChange}
              value={text}
              className={styles.textareaNew}
              placeholder="Say something..."
            />
          </div>

          <div className={styles.charLimitContaniner}>
            <p className={styles.charLimit}>{maxCharLimit - text.length} characters remaining</p>
          </div>
        </div>

        {mediaFiles.length < 1 && (
          <div className={styles.box}>
            {mediaFiles.length < 1 && (
              <>
                {showPollInputs && (
                  <div className={styles.pollInputsContainerOuter}>
                    {pollInputs.map((input, index) => (
                      <div className={styles.pollInputContainer}>
                        <input
                          key={index}
                          value={input}
                          onChange={(e) => handlePollInputChange(index, e)}
                          placeholder={`Option ${index + 1}`}
                          className={styles.pollInputfield}
                        />
                        <div
                          className={styles.cancelPollContainer}
                          onClick={() => handleCancelPollInput(index)}
                        >
                          <img src={close} alt="cancel" className={styles.cancelPoll} />
                        </div>
                      </div>
                    ))}
                    <div className={styles.pollNotifyBox}>
                      {pollInputs.length >= 5 && (
                        <div className={styles.infoImgBox}>
                          <div className={styles.infoImgContainer}>
                            <img src={information} alt="info" className={styles.infoImg} />
                          </div>
                          <span className={styles.pollNotify}>Max 5 options can be created</span>
                        </div>
                      )}
                      <div
                        className={`${styles.addPollBox} ${pollInputs.length >= 5 ? styles.changeBackground : ''}`}
                        onClick={handleAddPollInput}
                      >
                        <div className={styles.addpollIconContainer}>
                          {pollInputs.length >= 5 ? (
                            <img src={dissabledAdd} alt="addpoll" className={styles.addpollIcon} />
                          ) : (
                            <img src={addPoll} alt="addpoll" className={styles.addpollIcon} />
                          )}
                        </div>
                        <span
                          className={`${styles.add} ${pollInputs.length >= 5 ? styles.changeColor : ''}`}
                        >
                          Add
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {mediaFiles.length > 0 && (
          <div className={styles.box2}>
            <div className={styles.imgContainer}>
              {mediaFiles.length > 0 && (
                <>
                  {mediaFiles.map((file, index) => (
                    <div className={styles.imgBox} key={index}>
                      {file.type.includes('video') ? (
                        <video controls width="100%" height="100%" className={styles.selectedfile}>
                          <source src={URL.createObjectURL(file)} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="image"
                          className={styles.selectedfile}
                        />
                      )}
                      <div className={styles.cancelIcon}>
                        <img
                          src={cancel}
                          className={styles.Icon}
                          alt="cancel"
                          onClick={() => handleCancel(index)}
                        />
                      </div>
                    </div>
                  ))}
                  {mediaFiles.length < 10 && (
                    <div className={styles.addMorePhoto} onClick={openFileInput}>
                      <img src={addPhoto} alt="addphoto" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div className={styles.bottomPositions}>
          <div className={styles.iconBar}>
            <div className={styles.iconBarContainer}>
              <div className={styles.barIcon} onClick={openFileInput}>
                <img src={gallery} alt="gallery" className={styles.Icon} />
              </div>
              <div
                className={styles.barIcon}
                onClick={() => {
                  dispatch(setShowPollInputs(true));
                  mediaFiles.length > 0 ? (
                    toast.error('Please remove all images before adding a poll')
                  ) : (
                    <></>
                  );
                }}
              >
                <img src={showPollInputs ? activePoll : poll} alt="poll" className={styles.Icon} />
              </div>
            </div>
          </div>

          <div className={styles.selectCommuntiesContainer}>
            <span className={styles.communitiesTittle}>Select Communities to post on:</span>
            <div className={styles.createPostRight}>
              {startIndex > 0 ? (
                <img
                  src="/icon/leftActive.svg"
                  onClick={handleLeftClick}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <img src="/icon/leftCarousel.svg" />
              )}
              {startIndex + visibleItemsCount < joinedCommunities.length ? (
                <img
                  src="/icon/rightCarousel.svg"
                  onClick={handleRightClick}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <img src="/icon/RightInactive.svg" />
              )}
            </div>
          </div>

          <Row gutter={16}>
            {joinedCommunities &&
              joinedCommunities
                .slice(startIndex, startIndex + visibleItemsCount)
                .map((item, index) => (
                  <Col
                    key={index}
                    span={6}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onClick={() => selectCommunity(item.name)}
                  >
                    <div className="connumitiesImagesContainer">
                      <img
                        src={item.displayPicture}
                        className={`${styles.selectCommunitiesImage} ${chooseCommunity === item.name ? styles.selectedCommunity : ''}`}
                      />
                      {chooseCommunity === item.name && (
                        <img src="/icon/tickCircle.svg" className="selectCommunitiesTick" />
                      )}
                    </div>
                    <div className="communitiesNameContainer">
                      <p className="communitiesName">{item.name}</p>
                    </div>
                  </Col>
                ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AnonymousCreatePost;
