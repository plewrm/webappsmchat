import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedMedia,
  closeCreatePostModal,
  resetActiveTab,
  setActiveTab,
  setSelectedMedia
} from '../redux/slices/modalSlice';
import { useTheme } from '../context/ThemeContext';
import addPhoto from '../assets/icons/add-photo.svg';
import video from '../assets/icons/video.svg';
import arrowright from '../assets/icons/arrow-right-post.svg';
import cancel from '../assets/anonymous/icon/image-close.svg';
import CreateStory from './CreateStory';
import { Switch } from 'antd';
import axios from 'axios';
import styles from './CreatePost.module.css';
import {
  BASE_URL,
  BEARER_TOKEN,
  CREATEPOST,
  GETUSERPROFILE,
  retrievedSoconId
} from '../api/EndPoint';
import { setPostLoader, setGlobalPostState } from '../redux/slices/loaderSlice';
import defaultPfp from '../assets/icons/Default_pfp.webp';
import toast from 'react-hot-toast';
import '../components/HomePage.css';
const CreatePost = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [showSecondaryContent, setSHowSecondaryContent] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [showPrimaryContent, setShowPrimaryContent] = useState(false);
  const [isCaptionSingle, setIsCaptionSingle] = useState(true);
  const [captionsArray, setCaptionsArray] = useState([]);
  const [loading, setLoading] = useState(null);
  const [stream, setStream] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const activeTab = useSelector((state) => state.modal.activeTab); // Get activeTab from Redux state
  const globalPostState = useSelector((state) => state.loader.globalPostState);
  const selectedMedia = useSelector((state) => state.modal.selectedMedia);
  const handleSwitchChange = (checked) => {
    setIsCaptionSingle(checked);
  };
  const closeCreatePostModalHandler = () => {
    dispatch(resetActiveTab()); // Reset active tab when closing the modal
    dispatch(closeCreatePostModal());
    dispatch(clearSelectedMedia());
  };
  const handleArrowRightClick = () => {
    setShowPrimaryContent(true);
  };

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      dispatch(setActiveTab(tab)); // Dispatch action to set active tab in Redux state only if it's different
    }
  };
  const handleBackClick = () => {
    dispatch(setSelectedMedia([]));
    setSHowSecondaryContent(true);
    setSelectedFilter({});
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

  const [compress, setCompress] = useState(false);
  //previous code for some selected images are not show

  // const handleGalleryClick = async () => {
  //   const fileInput = document.createElement('input');
  //   fileInput.type = 'file';
  //   fileInput.accept = 'image/*,video/*,.heic';
  //   fileInput.multiple = true;
  //   fileInput.addEventListener('change', async (event) => {
  //     const files = event.target.files;
  //     const newMedia = [];
  //     const options = {
  //       maxSizeMB: 1
  //       // maxWidthOrHeight: number,
  //     };
  //     for (let i = 0; i < files.length; i++) {
  //       try {
  //         setCompress(true);
  //         console.log(files[i]);
  //         if (files[i].type.startsWith('image/')) {
  //           const url = URL.createObjectURL(files[i]);
  //           const isSelected = i === 0 && selectedMedia.length === 0;
  //           newMedia.push({ file: files[i], url, isVideo: false, isSelected });
  //         } else if (files[i].type.startsWith('video/')) {
  //           const url = URL.createObjectURL(files[i]);
  //           const isSelected = i === 0 && selectedMedia.length === 0;
  //           newMedia.push({ file: files[i], url, isVideo: true, isSelected });
  //         }
  //       } catch (error) {
  //         console.log('Compression error:', error.message);
  //       } finally {
  //         setCompress(false);
  //       }
  //     }
  //     const totalMedia = selectedMedia.length + newMedia.length;
  //     if (totalMedia <= 10) {
  //       dispatch(setSelectedMedia([...selectedMedia, ...newMedia]));
  //       setSHowSecondaryContent(false);
  //     } else {
  //       alert('You can only import up to 10 images or videos.');
  //     }
  //   });

  //   fileInput.click();
  // };

  //new code for selected images show

  const handleGalleryClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,.heic';
    fileInput.multiple = true;

    fileInput.addEventListener('change', async (event) => {
      const files = event.target.files;
      const newMedia = [];
      const maxWidth = 1000; // Set the maximum width of the resized image

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          setCompress(true);
          const url = URL.createObjectURL(file);

          if (file.type.startsWith('image/')) {
            const resizedFile = await resizeImage(file, maxWidth);
            const isSelected = i === 0 && selectedMedia.length === 0;
            newMedia.push({ file: resizedFile, url, isVideo: false, isSelected });
          } else if (file.type.startsWith('video/')) {
            const isSelected = i === 0 && selectedMedia.length === 0;
            newMedia.push({ file, url, isVideo: true, isSelected });
          }
        } catch (error) {
          console.log('Error processing file:', error.message);
        } finally {
          setCompress(false);
        }
      }

      const totalMedia = selectedMedia.length + newMedia.length;
      if (totalMedia <= 10) {
        dispatch(setSelectedMedia([...selectedMedia, ...newMedia]));
        setSHowSecondaryContent(false);
      } else {
        alert('You can only import up to 10 images or videos.');
      }
    });

    fileInput.click();
  };

  const resizeImage = (file, maxWidth) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = Math.min(maxWidth, img.width);
        const height = (img.height * width) / img.width;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleCancelClick = (index) => {
    const updatedMedia = [...selectedMedia];
    const wasDefaultSelected = updatedMedia[index].isSelected;

    updatedMedia.splice(index, 1);

    const updatedFilter = { ...selectedFilter };
    delete updatedFilter[index];

    // Update the indices of remaining filters greater than the canceled index
    Object.keys(updatedFilter).forEach((key) => {
      const filterIndex = parseInt(key, 10);
      if (filterIndex > index) {
        updatedFilter[filterIndex - 1] = updatedFilter[key];
        delete updatedFilter[key];
      }
    });

    // If the canceled image was default selected, make the next one default selected
    if (wasDefaultSelected && updatedMedia.length > 0) {
      const nextDefaultSelectedIndex = index === 0 ? 0 : index - 1;
      updatedMedia[nextDefaultSelectedIndex].isSelected = true;
    }
    dispatch(setSelectedMedia(updatedMedia));
    setSelectedFilter(updatedFilter);
  };

  const handleMediaClick = (index) => {
    const updatedMedia = selectedMedia.map((media, i) => ({
      ...media,
      isSelected: i === index ? !media.isSelected : false
    }));
    dispatch(setSelectedMedia(updatedMedia));
  };

  const handleFilterClick = (filter) => {
    const updatedFilter = {};
    selectedMedia.forEach((media, index) => {
      if (media.isSelected) {
        updatedFilter[index] = filter;
      }
    });
    setSelectedFilter((prevFilter) => ({ ...prevFilter, ...updatedFilter }));
  };

  const getFilterStyle = (index) => {
    const filter = selectedFilter[index];
    switch (filter) {
      case 'invert':
        return 'invert(100%)';
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'duotone':
        return 'brightness(1.4) contrast(1.2) grayscale(100%) sepia(100%) hue-rotate(30deg) saturate(200%)';
      case 'blur':
        return 'blur(5px)';
      case 'brightness':
        return 'brightness(150%)';
      case 'contrast':
        return 'contrast(150%)';
      case 'hue-rotate':
        return 'hue-rotate(90deg)';
      case 'saturate':
        return 'saturate(200%)';
      default:
        return 'none';
    }
  };

  const getPreviewStyle = (filter) => {
    switch (filter) {
      case 'invert':
        return { filter: 'invert(100%)' };
      case 'grayscale':
        return { filter: 'grayscale(100%)' };
      case 'sepia':
        return { filter: 'sepia(100%)' };
      case 'duotone':
        return {
          filter:
            'brightness(1.4) contrast(1.2) grayscale(100%) sepia(100%) hue-rotate(30deg) saturate(200%)'
        };
      case 'blur':
        return { filter: 'blur(5px)' };
      case 'brightness':
        return { filter: 'brightness(150%)' };
      case 'contrast':
        return { filter: 'contrast(150%)' };
      case 'hue-rotate':
        return { filter: 'hue-rotate(90deg)' };
      case 'saturate':
        return { filter: 'saturate(200%)' };
      default:
        return {};
    }
  };

  const maxCaptionCharLimit = 512;

  const handleTextInput = (event, index) => {
    const value = event.target.value;
    if (value.length <= maxCaptionCharLimit) {
      // Assuming you have a state variable for captions, like captionsArray
      // Make a copy of the current captionsArray
      const updatedCaptionsArray = [...captionsArray];
      // Update the caption at the specified index
      updatedCaptionsArray[index] = value;
      // Set the updated captionsArray in your state
      setCaptionsArray(updatedCaptionsArray);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    dispatch(setPostLoader(true));
    const updatedCaptionsArray = [...captionsArray];
    if (selectedMedia.length > updatedCaptionsArray.length) {
      const emptyStringsToAdd = selectedMedia.length - updatedCaptionsArray.length;
      for (let i = 0; i < emptyStringsToAdd; i++) {
        updatedCaptionsArray.push('');
      }
    }
    try {
      // Construct the post object
      const postObj = {
        description: selectedMedia.length === 0 ? captionsArray[0] : '',
        type: selectedMedia.length === 0 ? '2' : selectedMedia.length === 1 ? '0' : '1',
        isPrivate: false,
        captions: selectedMedia.length !== 0 ? updatedCaptionsArray : []
      };
      if (imageSrc) {
        (postObj.description = null),
          (postObj.type = '0'),
          (postObj.captions = updatedCaptionsArray.length == 0 ? [''] : updatedCaptionsArray);
      }

      const formData = new FormData();
      Object.keys(postObj).forEach((key) => {
        const value = postObj[key];
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      // Append the media files to the form data
      for (let i = 0; i < selectedMedia.length; i++) {
        const media = selectedMedia[i];
        if (media.isVideo) {
          // If it's a video, directly append it
          formData.append('media', media.file);
        } else {
          // If it's an image, apply filter and append the filtered image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.src = media.url;
          await new Promise((resolve) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              // Apply the filter if needed
              ctx.filter = getFilterStyle(i); // Get filter style for this image
              ctx.drawImage(img, 0, 0, img.width, img.height);
              canvas.toBlob((blob) => {
                formData.append('media', blob, `media${i}.png`);
                resolve();
              }, 'image/png');
            };
          });
        }
      }
      // Append the captured image if it exists
      if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob((blob) => {
              console.log('display here the blob', blob);
              formData.append('media', blob, `capturedImage.png`);
              resolve();
            }, 'image/png');
          };
        });
      }

      console.log(updatedCaptionsArray);
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
      };
      dispatch(closeCreatePostModal());
      console.log('Display form data', formData);
      const response = await axios.post(`${BASE_URL}${CREATEPOST}`, formData, { headers });
      dispatch(setGlobalPostState(!globalPostState));
      toast.success('Post created successfully!');
      console.log(response.data);
      dispatch(clearSelectedMedia());
    } catch (error) {
      console.error(error);
      toast.error('Failed to create post. Please try again later.');
    } finally {
      setLoading(false);
      dispatch(setPostLoader(false));
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Provide user feedback about the error
      // alert(
      //   'Error accessing camera: Camera not found or access denied. Please check your camera connections and ensure that you have granted permission to access the camera.'
      // );
      toast.custom((t) => (
        <div className={`custom-toast-container ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <div className="custom-toast-content">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="custom-toast-message">
                  Error accessing camera: Camera not found or access denied. Please check your
                  camera connections and ensure that you have granted permission to access the
                  camera.
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="custom-toast-close-button">
            Ok
          </button>
        </div>
      ));
    }
  };

  // const captureImage = () => {
  //     const video = document.createElement('video');
  //     video.srcObject = stream;
  //     video.onloadedmetadata = () => {
  //         video.play();
  //         const canvas = document.createElement('canvas');
  //         canvas.width = video.videoWidth;
  //         canvas.height = video.videoHeight;
  //         canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  //         const imageDataURL = canvas.toDataURL('image/png');
  //         setImageSrc(imageDataURL);
  //         video.srcObject = null; // Stop video stream
  //         stream.getTracks().forEach(track => track.stop()); // Stop camera stream
  //     };
  // };

  const captureImage = () => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL('image/png');
      const newMedia = {
        file: dataURLToBlob(imageDataURL),
        url: imageDataURL,
        isVideo: false,
        isSelected: true
      };
      dispatch(setSelectedMedia([...selectedMedia, newMedia]));
      setImageSrc('');
      video.srcObject = null; // Stop video stream
      stream.getTracks().forEach((track) => track.stop()); // Stop camera stream
    };
    setStream(null);
  };

  function dataURLToBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  return (
    <div
      className={isDarkMode ? styles.container : styles['d-container']}
      onClick={closeCreatePostModalHandler}
    >
      <div
        className={isDarkMode ? styles.containerInner : styles['d-containerInner']}
        onClick={(e) => e.stopPropagation()}
        style={{ padding: stream ? '0%' : '1% 1% 0% 1%' }}
      >
        {stream ? (
          <>
            <div
              style={{ height: '100%', width: '100%', borderRadius: '20px', overflowY: 'hidden' }}
            >
              <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <video
                  autoPlay
                  playsInline
                  muted
                  ref={(video) => video && (video.srcObject = stream)}
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
                <img
                  src="/icon/camera_Icon.png"
                  onClick={captureImage}
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {activeTab === 1 && (
              <>
                {!isMobileView ? (
                  <div className={styles.header}>
                    <div className={styles.IconContainer} onClick={closeCreatePostModalHandler}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/closeModalLight.svg'
                            : '/darkIcon/closeModalDark.svg'
                        }
                        alt="close"
                        className={styles.Icon}
                      />
                    </div>
                    <span className={isDarkMode ? styles.tittle : styles['d-tittle']}>
                      Create Post
                    </span>

                    <div className={styles.postButtonBox}>
                      {loading ? (
                        <button className={styles.postBtn} style={{ background: '#6E44FF' }}>
                          {' '}
                          Loading..{' '}
                        </button>
                      ) : (
                        <>
                          {selectedMedia.length > 0 ||
                          captionsArray.some(
                            (caption) => caption.trim().length > 0 || imageSrc.length > 0
                          ) ? (
                            <button
                              className={styles.postBtn}
                              style={{ background: '#6E44FF' }}
                              onClick={handlePost}
                            >
                              Share
                            </button>
                          ) : (
                            <button
                              className={styles.postBtn}
                              style={{ background: '#6D5FA0', cursor: 'not-allowed' }}
                            >
                              Share
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={isDarkMode ? styles.header_mobile : styles['d-header_mobile']}>
                    <div className={styles.IconContainer} onClick={closeCreatePostModalHandler}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/closeModalLight.svg'
                            : '/darkIcon/closeModalDark.svg'
                        }
                        alt="close"
                        className={styles.Icon}
                      />
                    </div>
                    <span className={isDarkMode ? styles.tittle : styles['d-tittle']}>
                      Create Post
                    </span>
                    <div className={styles.postButtonBox_mobile}>
                      {loading ? (
                        <button className={styles.postBtn} style={{ background: '#6E44FF' }}>
                          loading..
                        </button>
                      ) : (
                        <>
                          {selectedMedia.length > 0 ||
                          captionsArray.some((caption) => caption.trim().length > 0) ? (
                            <button
                              className={styles.postBtn}
                              style={{ background: '#6E44FF' }}
                              onClick={handlePost}
                            >
                              {' '}
                              Post
                            </button>
                          ) : (
                            <button
                              className={styles.postBtn}
                              style={{ background: '#6D5FA0', cursor: 'not-allowed' }}
                            >
                              {' '}
                              Post
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div
                  className="primaryContent"
                  style={{
                    display: showPrimaryContent || selectedMedia.length === 0 ? 'block' : 'none'
                  }}
                >
                  <div
                    className={
                      isDarkMode ? styles.multiInputContainer : styles['d-multiInputContainer']
                    }
                  >
                    {isCaptionSingle ? (
                      <div
                        className={
                          isDarkMode ? styles.inputContainerOuter : styles['d-inputContainerOuter']
                        }
                      >
                        <div
                          className={
                            isDarkMode ? styles.inputContainer : styles['d-inputContainer']
                          }
                        >
                          <div className={styles.profileContainer}>
                            {userProfile && (
                              <img
                                src={userProfile.pfp ? userProfile.pfp : defaultPfp}
                                className={styles.profile}
                                alt="profile"
                              />
                            )}
                          </div>
                          <textarea
                            value={captionsArray[0]}
                            onChange={(event) => handleTextInput(event, 0)}
                            className={isDarkMode ? styles.inputBox : styles['d-inputBox']}
                            placeholder="say something..."
                          ></textarea>
                        </div>
                        <div className={styles.charLimitTextContainer}>
                          <p
                            className={
                              isDarkMode ? styles.chatLimitText : styles['d-chatLimitText']
                            }
                          >
                            {' '}
                            {maxCaptionCharLimit -
                              (captionsArray[0] ? captionsArray[0].length : 0)}{' '}
                            char remaining
                          </p>
                        </div>
                      </div>
                    ) : (
                      selectedMedia.map((media, index) => (
                        <div
                          className={
                            isDarkMode
                              ? styles.inputContainer_multi
                              : styles['d-inputContainer_multi']
                          }
                          key={index}
                        >
                          <textarea
                            value={captionsArray[index]}
                            onChange={(event) => handleTextInput(event, index)}
                            className={isDarkMode ? styles.inputBox : styles['d-inputBox']}
                            placeholder={`say something about ${media.isVideo ? 'video' : 'image'} ${index + 1}`}
                          ></textarea>
                          <div className={styles.charLimitTextContainer}>
                            <p
                              className={
                                isDarkMode ? styles.chatLimitText : styles['d-chatLimitText']
                              }
                            >
                              {maxCaptionCharLimit -
                                (captionsArray[index] ? captionsArray[index].length : 0)}{' '}
                              char remaining
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* {imageSrc && <img src={imageSrc} alt="Captured"  style={{height:'100px'}}/>} */}

                  <div className={styles.editedImgContainer}>
                    {showPrimaryContent && (
                      <>
                        {selectedMedia.length > 0 && (
                          <div
                            className={
                              isDarkMode ? styles.editredImgDiv : styles['d-editredImgDiv']
                            }
                          >
                            {selectedMedia.map((media, index) => (
                              <div key={index} className={styles.editredImgDivInner}>
                                {media.isVideo ? (
                                  <>
                                    <video
                                      controls
                                      width="100%"
                                      height="100%"
                                      className={styles.uploadedVideo}
                                      onClick={() => handleMediaClick(index)}
                                    >
                                      <source src={media.url} type="video/mp4" />
                                    </video>
                                    <div className={styles.videoIcon}>
                                      <img src={video} className={styles.Info} alt="video" />
                                    </div>

                                    <div className={styles.cancelIcon}>
                                      <img
                                        src={cancel}
                                        className={styles.Info}
                                        alt="cancel"
                                        onClick={() => handleCancelClick(index)}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src={media.url}
                                      alt="image"
                                      className={`${styles.uploadedVideo} ${media.isSelected ? styles.selected : ''}`}
                                      style={{ filter: getFilterStyle(index) }}
                                      onClick={() => handleMediaClick(index)}
                                    />

                                    <div className={styles.cancelIcon}>
                                      <img
                                        src={cancel}
                                        className={styles.Info}
                                        alt="cancel"
                                        onClick={() => handleCancelClick(index)}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className={styles.toggleContainer}>
                    {showPrimaryContent && selectedMedia.length > 1 && (
                      <>
                        {' '}
                        <p
                          className={
                            isDarkMode ? styles.captionToggleText : styles['d-caption-toggle-text']
                          }
                        >
                          Keep Single Caption for all
                        </p>
                        <Switch defaultChecked={isCaptionSingle} onChange={handleSwitchChange} />
                      </>
                    )}
                  </div>

                  <div className={styles.bottomPosition}>
                    <div
                      className={
                        isDarkMode ? styles.cpIconsContainer : styles['d-cpIconsContainer']
                      }
                    >
                      <div
                        className={isDarkMode ? styles.cpIconBox : styles['d-cpIconBox']}
                        onClick={startCamera}
                      >
                        <div className={styles.cpIcons}>
                          <img
                            src={
                              isDarkMode ? '/lightIcon/cameraLight.svg' : '/darkIcon/cameraDark.svg'
                            }
                            alt="gallery"
                            className={styles.Info}
                          />
                        </div>
                        <div className={styles.cpIconTextContainer}>
                          <p className={isDarkMode ? styles.cpIconText : styles['d-cpIconText']}>
                            Camera
                          </p>
                        </div>
                      </div>

                      <div
                        className={isDarkMode ? styles.cpIconBox : styles['d-cpIconBox']}
                        onClick={handleGalleryClick}
                      >
                        <div className={styles.cpIcons}>
                          <img
                            src={
                              isDarkMode
                                ? '/lightIcon/galleryLight.svg'
                                : '/darkIcon/galleryDark.svg'
                            }
                            alt="gallery"
                            className={styles.Info}
                          />
                        </div>
                        <div className={styles.cpIconTextContainer}>
                          <p className={isDarkMode ? styles.cpIconText : styles['d-cpIconText']}>
                            Gallery
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        isDarkMode ? styles.cpToggleContainer : styles['d-cpToggleContainer']
                      }
                    >
                      <p
                        className={
                          activeTab === 1 ? styles.toggleActive : styles['toggleNotActive']
                        }
                        onClick={() => handleTabClick(1)}
                      >
                        {' '}
                        Post
                      </p>
                      <p
                        className={
                          activeTab === 2 ? styles.toggleActive : styles['toggleNotActive']
                        }
                        onClick={() => handleTabClick(2)}
                      >
                        {' '}
                        Story
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="secondaryContent"
                  style={{
                    display: !showPrimaryContent && selectedMedia.length > 0 ? 'block' : 'none'
                  }}
                >
                  <div className={styles.filterHeader}>
                    <div className={styles.IconContainer} onClick={handleBackClick}>
                      <img
                        src={
                          isDarkMode
                            ? '/lightIcon/arrowLeftLight.svg'
                            : '/darkIcon/arrowLeftDark.svg'
                        }
                        alt="back"
                        className={styles.Icon}
                      />
                    </div>
                    <div className={styles.filterTitleContainer}>
                      <p className={isDarkMode ? styles.filterTittle : styles['d-filterTittle']}>
                        Filter
                      </p>
                    </div>
                  </div>

                  <div
                    className={
                      isDarkMode ? styles.uploadImageContainer : styles['d-uploadImageContainer']
                    }
                  >
                    {selectedMedia.map((media, index) => (
                      <div
                        key={index}
                        className={`${styles.uploadImageDiv} ${media.isSelected ? styles.selected : ''}`}
                      >
                        {media.isVideo ? (
                          <>
                            <video
                              controls
                              width="100%"
                              height="100%"
                              className={styles.uploadedVideo}
                              onClick={() => handleMediaClick(index)}
                            >
                              <source src={media.url} type="video/mp4" />
                            </video>
                            <div className={styles.videoIcon}>
                              <img src={video} className={styles.Icon} alt="video" />
                            </div>

                            <div className={styles.cancelIcon}>
                              <img
                                src={cancel}
                                className={styles.Icon}
                                alt="cancel"
                                onClick={() => handleCancelClick(index)}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={media.url}
                              alt="image"
                              className={styles.uploadedImage}
                              style={{ filter: getFilterStyle(index) }}
                              onClick={() => handleMediaClick(index)}
                            />

                            <div className={styles.cancelIcon}>
                              <img
                                src={cancel}
                                className={styles.Info}
                                alt="cancel"
                                onClick={() => handleCancelClick(index)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {selectedMedia.length < 10 && (
                      <div className={styles.addIcon} onClick={handleGalleryClick}>
                        <img src={addPhoto} alt="addphoto" className={styles.Info} />
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      isDarkMode ? styles.imgPreviewContainer : styles['d-imgPreviewContainer']
                    }
                    style={{
                      visibility: selectedMedia.every((media) => !media.isSelected || media.isVideo)
                        ? 'hidden'
                        : ''
                    }}
                  >
                    {[
                      'none',
                      'invert',
                      'grayscale',
                      'sepia',
                      'duotone',
                      'blur',
                      'brightness',
                      'contrast',
                      'hue-rotate',
                      'saturate'
                    ].map((filter) => (
                      <div
                        key={filter}
                        className={styles.imgPreviewDiv}
                        onClick={() => handleFilterClick(filter)}
                      >
                        <div className={styles.imgFilterTextContainer}>
                          <p
                            className={
                              isDarkMode ? styles.imgFilterText : styles['d-imgFilterText']
                            }
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </p>
                        </div>
                        <div className={styles.filterImgContainer}>
                          {selectedMedia.map(
                            (media, index) =>
                              media.isSelected && (
                                <img
                                  key={index}
                                  src={media.url}
                                  alt="filter-image"
                                  className={styles.filterImg}
                                  style={getPreviewStyle(filter)}
                                />
                              )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.ImgPreviewContainerBottom}>
                    {selectedMedia.map((media, index) => (
                      <div
                        key={index}
                        className={`${styles.imgFilterPreviewDiv} ${media.isSelected ? styles.selected : ''}`}
                      >
                        {media.isVideo ? (
                          <>
                            <video
                              controls
                              width="100%"
                              height="100%"
                              className={`${styles.filterPreviewImg} ${media.isSelected ? styles.selected : ''}`}
                              onClick={() => handleMediaClick(index)}
                            >
                              <source src={media.url} type="video/mp4" />
                            </video>
                          </>
                        ) : (
                          <>
                            <img
                              src={media.url}
                              alt="image"
                              className={`${styles.filterPreviewImg} ${media.isSelected ? styles.selected : ''}`}
                              onClick={() => handleMediaClick(index)}
                            />
                          </>
                        )}
                      </div>
                    ))}
                    <div className={styles.arrowRight} onClick={handleArrowRightClick}>
                      <img
                        src={isDarkMode ? '/lightIcon/arrowrightsLight.svg' : arrowright}
                        alt="arrowright"
                        className={styles.info}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {activeTab === 2 && <CreateStory />}
      </div>
    </div>
  );
};

export default CreatePost;
