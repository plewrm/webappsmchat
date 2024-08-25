import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import close from '../assets/icons/modal-close.svg';
import { setDeleteCover, setEditProfile } from '../redux/slices/modalSlice';
import addPhoto from '../assets/icons/new_changeProfile.svg';
import checkUserName from '../assets/icons/checked-input.svg';
import './EditProfile.css';
import changeCover from '../assets/icons/change-cover.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  EDITPROFILE,
  UPDATECOVER,
  GETPROFILE,
  retrievedSoconId,
  DELETECOVER
} from '../api/EndPoint';
import axios from 'axios';
import checked from '../assets/icons/checked-input.svg';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setSuggestedActiveTab } from '../redux/slices/messageTabsSlices';
import unselect from '../assets/icons/story-notselected.svg';
import select from '../assets/icons/story-select.svg';
import redstar from '../assets/icons/star_name.svg';
import { setGlobalProfileState } from '../redux/slices/loaderSlice';
import Cropper from 'react-easy-crop';

const ProfileSetup = ({ details, closeSetup }) => {
  // console.log(details)
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteCover = useSelector((state) => state.modal.deleteCover);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedProfile, setCroppedProfile] = useState(null);
  const [cropProfile, setCropProfile] = useState({ x: 0, y: 0 });
  const [zoomProfile, setZoomProfile] = useState(1);
  const [croppedAreaPixelsProfile, setCroppedAreaPixelsProfile] = useState(null);
  const [showCropperProfile, setShowCropperProfile] = useState(false);

  const [showNameError, setShowNameError] = useState(false);
  useEffect(() => {
    if (name.length > 0) {
      setShowNameError(false);
    }
  }, [name]);
  const handleShowError = () => {
    setShowNameError(true);
  };

  const maxNameCharLimit = 32;
  const maxUrlCharLimit = 256;
  const maxBioCharLimit = 256;

  const handleNameChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxNameCharLimit) {
      setName(inputText);
    }
  };

  const handleUrlChange = (e) => {
    const inputText = e.target.value;
    const urlPattern = /^https:\/\/(www\.)?/;
    const isValid = urlPattern.test(inputText);
    if (inputText.length <= maxUrlCharLimit) {
      setUrl(inputText);
      setIsUrlValid(isValid);
    }
  };

  const handleBioChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxBioCharLimit) {
      setBio(inputText);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
  }, []);

  const getUserProfileDetails = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // will replace 10 with actual socon id
      const response = await axios.get(
        `${BASE_URL}${GETPROFILE}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
        { headers }
      );
      setUsername(response.data.profile.username);
    } catch (error) {
      console.error(error);
    }
  };

  const setupProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      // console.log(bio)
      // console.log(name)
      const payload = {
        bio: bio,
        display_name: name,
        url: url,
        username: username
      };
      if (bio !== '' || name !== '') {
        const response = await axios.post(`${BASE_URL}${EDITPROFILE}`, payload, { headers });
        console.log(response.data);
      }
      if (coverPic !== '') {
        const displayObj = {
          media: coverPic
        };
        const formData = new FormData();
        Object.keys(displayObj).forEach((key) => {
          const value = displayObj[key];
          formData.append(key, value);
        });
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
        };
        const response = await fetch(`${BASE_URL}${UPDATECOVER}`, {
          method: 'POST',
          headers: headers,
          body: formData
        });
        const responseData = await response.json();
        console.log(responseData);
      }
      if (profilePic !== '') {
        const displayObj = {
          media: profilePic
        };

        // Create a new FormData object
        const formData = new FormData();

        // Iterate over the keys in communityObj
        Object.keys(displayObj).forEach((key) => {
          const value = displayObj[key];
          formData.append(key, value);
        });
        const headers = {
          Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
        };
        const response = await fetch(`${BASE_URL}${EDITPROFILE}/pfp`, {
          method: 'POST',
          headers: headers,
          body: formData
        });
        const responseData = await response.json();
        closeSetup();
        dispatch(setSuggestedActiveTab(true));
        localStorage.setItem('firstLogin', false);
        dispatch(setGlobalProfileState(true));
        navigate('/notifications');
        console.log(responseData);
      } else {
        toast.error('complete your profile');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const shouldHighlightButton =
    selectedImage?.length > 0 || selectedCover?.length > 0 || bio?.length > 0 || name?.length > 0;

  const buttonStyle = shouldHighlightButton ? { backgroundColor: '#6E44FF' } : {};
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setShowCropperProfile(true);
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPic(file);
      const url = URL.createObjectURL(file);
      setSelectedCover(url);
      setShowCropper(true);
    }
  };
  const closeEditProfile = () => {
    closeSetup();
  };

  const deleteCoverImage = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`
      };

      const response = await axios.delete(`${BASE_URL}${DELETECOVER}`, { headers });
      console.log(response.data.message);
      dispatch(setDeleteCover(false));
      setSelectedCover(null);
      setCoverChange(false);
      dispatch(setGlobalProfileState((prevState) => !prevState));
    } catch (error) {
      console.error('Failed to delete cover image', error);
    }
  };

  const openDeleteCover = () => {
    dispatch(setDeleteCover(true));
  };
  const closeDeleteCover = () => {
    dispatch(setDeleteCover(false));
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // for CORS image issue
      image.src = url;
    });
  const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width: imgWidth, height: imgHeight } = image;
    const { width: cropWidth, height: cropHeight, x: cropX, y: cropY } = crop;
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };
  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(selectedCover, croppedAreaPixels);
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImage(croppedImageUrl);
      setCoverPic(croppedImageBlob); // Set coverPic to the cropped image blob
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onCropCompleteProfile = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixelsProfile(croppedAreaPixels);
  };

  const showCroppedImageProfile = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(selectedImage, croppedAreaPixelsProfile);
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedProfile(croppedImageUrl);
      setProfilePic(croppedImageBlob);
      setShowCropperProfile(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className={isDarkMode ? 'edit-modal-overlay' : 'd-edit-modal-overlay'}>
        <div className={isDarkMode ? 'edit-container' : 'd-edit-container'}>
          <div className="editProfile-header">
            <div className="editProfile-closeIcon-container" onClick={closeEditProfile}>
              <img src={close} className="editProfile-closeIcon" alt="close" />
            </div>
            <div className="editprofile-title-container">
              <p className={isDarkMode ? 'editprofile-title' : 'd-editprofile-title'}>
                Complete Your Profile
              </p>
            </div>
            {/* <div className='checkImgContainer'>
                        {shouldHighlightButton ? <img src={select} alt='check' className='checkImg' onClick={setupProfile} /> : <img src={unselect} alt='check' className='checkImg' />}
                    </div> */}
            {name?.length > 0 ? (
              <button
                onClick={setupProfile}
                className={isDarkMode ? 'editProfile-donebtn' : 'd-editProfile-donebtn'}
                style={{ backgroundColor: '#6E44FF' }}
              >
                Done
              </button>
            ) : (
              <button
                className={isDarkMode ? 'editProfile-donebtn' : 'd-editProfile-donebtn'}
                onClick={handleShowError}
              >
                Done
              </button>
            )}{' '}
          </div>
          {!selectedCover ? (
            <label htmlFor="fileInputs">
              <div className={isDarkMode ? 'change-cover-containers' : 'd-change-cover-containers'}>
                <div className="change-cover-img-container">
                  <img src="/icon/addSquarePurple.svg" alt="cover" className="change-cover-img" />
                </div>
                <p className="changeDisplayPicture">Change Cover Photo</p>
              </div>
            </label>
          ) : (
            <div className={isDarkMode ? 'change-cover-containers' : 'd-change-cover-containers'}>
              <img
                src={croppedImage || selectedCover}
                alt="coverImg"
                className="selected-Cover-img"
              />
              <div className="selectedCoverAction">
                <input
                  type="file"
                  id="fileInputs"
                  style={{ display: 'none' }}
                  onChange={handleCoverChange}
                  accept=".jpg, .jpeg, .png, .heic"
                />
                <label htmlFor="fileInputs">
                  <img src="/icon/cameraCover.svg" alt="camera" />
                </label>
                <img src="/icon/deleteCover.svg" alt="close" onClick={openDeleteCover} />
              </div>
            </div>
          )}
          <input
            type="file"
            id="fileInputs"
            style={{ display: 'none' }}
            onChange={handleCoverChange}
          />
          {/* <label htmlFor="fileInputs">
                    <div className='changeCoverImgText'>
                        <p className='changeDisplayPicture'>Add Cover image</p>
                    </div>
                </label> */}

          <div className="editProfile-addPhoto-Container">
            <div className="addProfile-addPhoto-boxs">
              {selectedImage ? (
                <img
                  src={croppedProfile || selectedImage}
                  alt="selectedImage"
                  className="addProfile-addPhoto"
                />
              ) : (
                <label htmlFor="fileInput">
                  <img
                    src={isDarkMode ? '/lightIcon/addProfile_Light.svg' : addPhoto}
                    alt="selectedImage"
                    className="addProfile-addPhoto"
                  />
                </label>
              )}
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
            <div className="changeDisplayPicture-container">
              <label htmlFor="fileInput">
                <p className="changeDisplayPicture">Add Profile Picture</p>
              </label>
            </div>
          </div>

          <div className="editProfile-NameContainer">
            <div className="editProfile-namelabelContainer">
              <p className={isDarkMode ? 'editProfile-namelabel' : 'd-editProfile-namelabel'}>
                Enter your display name*
              </p>
            </div>

            <div
              className={
                isDarkMode ? 'editProfile-NameInputContainer' : 'd-editProfile-NameInputContainer'
              }
            >
              <input
                onChange={handleNameChange}
                value={name}
                className={isDarkMode ? 'editProfile-NameInput' : 'd-editProfile-NameInput'}
                placeholder="Type here..."
              />
              <p className={isDarkMode ? 'charLimit' : 'd-charLimit'}>
                {maxNameCharLimit - name.length} character remaining
              </p>
            </div>
          </div>
          {showNameError && (
            <div className="displayNameInfoContainer">
              <img src="/icon/infoCircleYellow.svg" />
              <p className={isDarkMode ? 'displayNameInfo' : 'd-displayNameInfo'}>
                Please add display name to continue
              </p>
            </div>
          )}

          <div className="editProfile-NameContainer">
            <div className="editProfile-namelabelContainer">
              <p className={isDarkMode ? 'editProfile-namelabel' : 'd-editProfile-namelabel'}>
                Enter your username
              </p>
            </div>
            <div
              className={
                isDarkMode ? 'editProfile-NameInputContainer' : 'd-editProfile-NameInputContainer'
              }
            >
              <input
                value={username}
                className={isDarkMode ? 'editProfile-NameInput' : 'd-editProfile-NameInput'}
                placeholder="Type here..."
                disabled={true}
                style={{
                  color: isDarkMode ? '#363636' : '#FCFCFC',
                  cursor: 'not-allowed',
                  fontWeight: '0'
                }}
              />
              <div className="usernameInfoContainer">
                <p className={isDarkMode ? 'usernameInfo' : 'd-usernameInfo'}>
                  You cannot change this.
                </p>
                <div className="checkedUsernameContainer">
                  <img src={checked} className="checkedUsername" />
                </div>
              </div>
            </div>
          </div>

          <div className="editProfile-bioContainer-outer">
            <div className="editProfile-namelabelContainer">
              <p className={isDarkMode ? 'editProfile-namelabel' : 'd-editProfile-namelabel'}>
                Bio
              </p>
            </div>

            <div className={isDarkMode ? 'editProfile-bioContainer' : 'd-editProfile-bioContainer'}>
              <textarea
                onChange={handleBioChange}
                value={bio}
                className={isDarkMode ? 'editProfile-bio' : 'd-editProfile-bio'}
                placeholder="I am Cool..!"
              />
              <p className={isDarkMode ? 'charLimitbio' : 'd-charLimitbio'}>
                {maxBioCharLimit - bio.length} characters remaining
              </p>
            </div>
          </div>

          <div className="editProfile-NameContainer">
            <div className="editProfile-namelabelContainer">
              <p className={isDarkMode ? 'editProfile-namelabel' : 'd-editProfile-namelabel'}>
                Add link
              </p>
            </div>

            <div
              className={
                isDarkMode ? 'editProfile-NameInputContainer' : 'd-editProfile-NameInputContainer'
              }
            >
              <input
                onChange={handleUrlChange}
                value={url}
                className={isDarkMode ? 'editProfile-NameInput' : 'd-editProfile-NameInput'}
                placeholder="www.leafylovers.com/greenthumb101"
                style={{ color: isDarkMode ? '#0165C2' : '#388EF1' }}
              />

              <p className={isDarkMode ? 'charLimit' : 'd-charLimit'}>
                {maxUrlCharLimit - url.length} characters remaining
              </p>
            </div>
            {!isUrlValid && (
              <div className="displayNameInfoContainer" style={{ paddingBottom: '16px' }}>
                <img src="/icon/infoCircleYellow.svg" />
                <p className={isDarkMode ? 'displayNameInfo' : 'd-displayNameInfo'}>
                  URL must start with "https://" or "https://www."
                </p>{' '}
              </div>
            )}
          </div>
        </div>
      </div>
      {deleteCover && (
        <div
          className={isDarkMode ? 'confirmationModalOverlay' : 'd-confirmationModalOverlay'}
          onClick={closeDeleteCover}
        >
          <div
            className={isDarkMode ? 'confirmationModalContainer' : 'd-confirmationModalContainer'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmationTextContainer">
              <p className={isDarkMode ? 'confirmationText' : 'd-confirmationText'}>
                Are you sure you want to delete your Cover Photo?
              </p>
            </div>
            <div className="confirmationsButtonCOntainer">
              <button
                className={isDarkMode ? 'cancelConfirmationButton' : 'd-cancelConfirmationButton'}
                onClick={closeDeleteCover}
              >
                Cancel
              </button>
              <button
                className={isDarkMode ? 'confirmConfirmationButton' : 'd-confirmConfirmationButton'}
                onClick={deleteCoverImage}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showCropper && (
        <div className={isDarkMode ? 'edit-modal-overlay' : 'd-edit-modal-overlay'}>
          <div className={isDarkMode ? 'edit-container' : 'd-edit-container'}>
            <Cropper
              image={selectedCover}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              style={{
                containerStyle: {},
                mediaStyle: {},
                cropAreaStyle: {
                  border: '2px dashed #6E44FF',
                  aspectRatio: '16/9'
                }
              }}
            />
            <button
              onClick={showCroppedImage}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              Crop
            </button>
          </div>
        </div>
      )}

      {showCropperProfile && (
        <div className={isDarkMode ? 'edit-modal-overlay' : 'd-edit-modal-overlay'}>
          <div className={isDarkMode ? 'edit-container' : 'd-edit-container'}>
            <Cropper
              image={selectedImage}
              crop={cropProfile}
              zoom={zoomProfile}
              aspect={1 / 1}
              onCropChange={setCropProfile}
              onCropComplete={onCropCompleteProfile}
              onZoomChange={setZoomProfile}
              style={{
                containerStyle: {},
                mediaStyle: {},
                cropAreaStyle: {
                  border: '2px dashed #6E44FF',
                  borderRadius: '50%',
                  height: '150px',
                  width: '150px',
                  aspectRatio: '1/1'
                }
              }}
            />
            <button
              onClick={showCroppedImageProfile}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              Crop
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSetup;
