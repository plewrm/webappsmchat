import React, { useState } from 'react';
import styles from '../discover/CreateCommunity.module.css';
import close from '../../../assets/icons/modal-close.svg';
import addPhoto from '../../../assets/icons/add-group-photo.svg';
import rightIcon from '../../../assets/anonymous/icon/arrow-square-right.svg';
import arrowLeft from '../../../assets/anonymous/icon/arrow-left.svg';
import unselect from '../../../assets/anonymous/icon/unselect-catagory.svg';
import unselectCircle from '../../../assets/anonymous/icon/uselect-circle.svg';
import selectCircle from '../../../assets/anonymous/icon/select-Circle.svg';
import { communityCatagoryData } from '../../../data/DummyData';
import axios from 'axios';
import {
  CREATECOMMUNITIES,
  BASE_URL,
  BEARER_TOKEN,
  GETCOMMUNITIESMEMBERS,
  DELETECOMMUNITY
} from '../../../api/EndPoint';
import profileicon from '../../../assets/anonymous/icon/user-profile.svg';
import profile from '../../../assets/anonymous/image/card-profile.svg';
import more from '../../../assets/icons/More.png';
import camera from '../../../assets/icons/camera_dark.svg';
import gallery from '../../../assets/icons/gallery_dark.svg';
import back from '../../../assets/anonymous/icon/arrow-left.svg';
import AnonumousPost from '../Post/AnonumousPost';
import select from '../../../assets/anonymous/icon/select-catagory.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setAnonymousCommunityMore } from '../../../redux/slices/modalSlice';
import info from '../../../assets/anonymous/icon/information (1).svg';
import leftBack from '../../../assets/icons/dark_mode_arrow_left.svg';
import { useNavigate } from 'react-router-dom';
import AnonymousAddPost from '../AddPost/AnonymousAddPost';
import Cropper from 'react-easy-crop';

const CreateCommunity = ({ handleClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const anonymousCommunityMore = useSelector((state) => state.modal.anonymousCommunityMore);
  const [showCateagory, setShowCatagory] = useState(false);
  const [showCatagoryDetails, setShowCatagoryDetails] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [isSelected, setIsSelected] = useState(false); // For the select/unselect image
  const [isSubCategorySelected, setIsSubCategorySelected] = useState(false); // For the unselectCircle/selectCircle image
  const [showProfiles, setShowProfiles] = useState(false);
  const openMoreOption = () => {
    dispatch(setAnonymousCommunityMore(true));
  };
  const closeMoreOption = () => {
    dispatch(setAnonymousCommunityMore(false));
  };

  const OpenShowCatagory = () => {
    setShowCatagory(true);
  };
  const CloseShowCatagory = () => {
    setShowCatagory(false);
  };
  const openCatagoryDetails = (index, category) => {
    setSelectedCategoryIndex(index); // You need to define setSelectedCategoryIndex useState
    setShowCatagoryDetails(true);
    setCategory(category);
  };
  const closeCatagoryDetails = () => {
    setShowCatagoryDetails(false);
  };

  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [CommunityImgFile, setCommunityImgFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const maxCharLimit = 200;
  const maxCharLimitDescription = 1000;

  const handleCommunityNameChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxCharLimit) {
      setCommunityName(inputText);
    }
  };

  const handleDescriptionChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxCharLimitDescription) {
      setDescription(inputText);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCommunityImgFile(file);
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setShowCropper(true);
    }
  };
  const saveCommunity = () => {
    setShowCatagory(false);
    setShowCatagoryDetails(false);
  };
  const [members, setMembers] = useState([]);
  const createCommunity = async () => {
    const communityObj = {
      description: description,
      privacyType: '4',
      tags: [category, subCategory],
      name: communityName.trim(),
      media: CommunityImgFile
    };
    console.log(communityObj);
    const formData = new FormData();

    Object.keys(communityObj).forEach((key) => {
      const value = communityObj[key];
      if (Array.isArray(value)) {
        // Convert array to a JSON string and append it
        formData.append(key, JSON.stringify(value));
      } else {
        // Append the value directly
        formData.append(key, value);
      }
    });
    // console.log(formData)

    // Now `formData` contains the data in the required format for `form-data`.

    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    };

    try {
      const response = await fetch(`${BASE_URL}${CREATECOMMUNITIES}`, {
        method: 'POST',
        headers: headers,
        body: formData
      });
      const res = await axios.get(`${BASE_URL}${GETCOMMUNITIESMEMBERS}${communityName}/members`, {
        headers
      });
      console.log(res.data);
      setMembers(res.data.members.users);
      setShowProfiles(true);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error creating community:', error.message);
    }
  };

  const [perview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('About');
  const showPreview = () => {
    if (
      communityName === '' ||
      description === '' ||
      selectedImage === null ||
      category === null ||
      subCategory === null
    ) {
      setPreview(false);
    } else {
      setPreview(true);
    }
  };

  const deleteCommunity = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.delete(`${BASE_URL}${DELETECOMMUNITY}${communityName}`, {
        headers
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
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
      const croppedImageBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImage(croppedImageUrl);
      setSelectedImage(croppedImageBlob); // Set coverPic to the cropped image blob
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className={styles.createCommunityContainer}>
        {perview ? (
          <div>
            <div className={styles.profileContainer}>
              <div className={styles.profileHeader}>
                <div className={styles.profileBackIconContainer}>
                  {showProfiles ? (
                    <img
                      src={leftBack}
                      onClick={handleClose}
                      alt="back"
                      className={styles.profileBackIcon}
                    />
                  ) : (
                    <img
                      onClick={() => setPreview(false)}
                      src={close}
                      alt="back"
                      className={styles.profileBackIcon}
                    />
                  )}
                </div>
                {!showProfiles && (
                  <div className={styles.profileTitleContainer}>
                    <p className={styles.profileTitle}>Create Community</p>
                  </div>
                )}

                <div className={styles.profileMoreIconContainer}>
                  {showProfiles ? (
                    <img src={more} alt="more" onClick={openMoreOption} />
                  ) : (
                    <button onClick={createCommunity} className={styles.createButton}>
                      Create
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.profileInfoContainer}>
                <div className={styles.profilePicContainer}>
                  <img src={selectedImage} alt="profile" className={styles.profilePic} />
                </div>

                <div className={styles.profileNameContainer}>
                  <p className={styles.profileName}>{communityName}</p>
                </div>

                <div className={styles.profileclgContainer}>
                  <p className={styles.profileclg}>
                    {category}/ {subCategory}
                  </p>
                </div>

                <div className={styles.profileMemberBox}>
                  <div className={styles.profileFriendIconContainer}>
                    <img src={profileicon} alt="profileIcon" className={styles.profileFriendIcon} />
                  </div>
                  <div className={styles.profileMemberCountContainer}>
                    {/* count to be added */}
                    <p className={styles.profileMemberCount}>{}</p>
                  </div>
                </div>
                {members.length === 1 ? (
                  <button className={styles.profileJoinButton}>Joined</button>
                ) : (
                  <button className={styles.profileJoinButton}>Join now</button>
                )}
              </div>

              <div className={styles.profileTabContainer}>
                <button
                  className={activeTab === 'Posts' ? styles.activeTabButton : styles.tabButton}
                  onClick={() => setActiveTab('Posts')}
                >
                  Posts
                </button>
                <button
                  className={activeTab === 'About' ? styles.activeTabButton : styles.tabButton}
                  onClick={() => setActiveTab('About')}
                >
                  About
                </button>
              </div>

              {activeTab === 'About' && (
                <>
                  <div className={styles.descriptionContainer}>
                    <div className={styles.descriptionTitleContainer}>
                      <p className={styles.descriptionTitle}>Description</p>
                    </div>
                    <div className={styles.descriptionContentContainer}>
                      <p className={styles.descriptionContent}>{description}</p>
                    </div>
                  </div>

                  <div className={styles.profileAboutMemberBox}>
                    <div className={styles.aboutMemberTitleContainer}>
                      <p className={styles.aboutMemberTitle}>Members</p>
                    </div>

                    <div className={styles.aboutMemberProfilesContainer}>
                      {members &&
                        members.map((member, index) => (
                          <div className={styles.AboutMemberBox}>
                            <div className={styles.memberProfilePicContainer}>
                              {/* according to avater pfp will be their */}
                              <img
                                src={member.avatar}
                                alt="profile"
                                className={styles.memberProfilePic}
                              />
                            </div>
                            <div className={styles.aboutMemberNameContainer}>
                              <p className={styles.aboutMemberName}>{member.username}</p>
                            </div>
                            <div className={styles.aboutMembersButtonContainer}>
                              <button className={styles.aboutMembersButton}>View Profile</button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Posts' && (
                <>
                  <div className={styles.previewBoxs01}>
                    <div className={styles.previewBoxs1}>
                      <div className={styles.previewDPContainer}>
                        <img className={styles.previewDP} alt="image" src="" />
                      </div>
                      <input className={styles.previewInput} placeholder="Post Something here..." />
                    </div>
                    <div className={styles.previewBoxs2}>
                      <div className={styles.previewIconContainer}>
                        <img className={styles.previewIcon} alt="icon" src={camera} />
                      </div>
                      <div className={styles.previewIconContainer}>
                        <img className={styles.previewIcon} alt="icon" src={gallery} />
                      </div>
                    </div>
                  </div>

                  <AnonumousPost />
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {!showCateagory && (
              <>
                <div className={styles.ccHeader}>
                  <div className={styles.ccClsoeIconContainer} onClick={handleClose}>
                    <img src={close} alt="close" className={styles.cccloseIcon} />
                  </div>

                  <div className={styles.ccTitleContainer}>
                    <p className={styles.ccTitle}>Create Community</p>
                  </div>

                  <div onClick={showPreview} className={styles.previewNameContiner}>
                    {communityName === '' ||
                    description === '' ||
                    selectedImage === null ||
                    category === null ||
                    subCategory === null ? (
                      <p className={styles.previewName}>Preview</p>
                    ) : (
                      <p style={{ color: '#6E44FF' }} className={styles.previewName}>
                        Preview
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.ccAddiconContainer}>
                  <div className={styles.addPhotoContainer}>
                    {selectedImage ? (
                      <img
                        src={croppedImage || selectedImage}
                        alt="selectedImage"
                        className={styles.addPhotoIcon}
                      />
                    ) : (
                      <label htmlFor="fileInput">
                        <img src={addPhoto} alt="addPhoto" className={styles.addPhotoIcon} />
                      </label>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                  <div className={styles.addIconTextContainer}>
                    <label htmlFor="fileInput">
                      <p className={styles.addIconText}>
                        Add Icon <span style={{ color: 'red' }}>*</span>
                      </p>
                    </label>
                  </div>
                </div>
                <div className={styles.communityNameContainer}>
                  <div className={styles.communityNameTextContainer}>
                    <p className={styles.communityName}>
                      Community Name <span style={{ color: 'red' }}>*</span>
                    </p>
                  </div>
                  <div className={styles.communityNameInputContainer}>
                    <input
                      value={communityName}
                      onChange={handleCommunityNameChange}
                      maxLength={maxCharLimit}
                      className={styles.communityNameInput}
                      placeholder="Type Here..."
                    />
                    <div className={styles.charLimitContainer}>
                      <p className={styles.charLimit}>
                        {maxCharLimit - communityName.length} characters remaining
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.descriptionNameContainer}>
                  <div className={styles.communityNameTextContainer}>
                    <p className={styles.communityName}>
                      Description here..<span style={{ color: 'red' }}>*</span>
                    </p>
                  </div>
                  <div className={styles.descriptionNameInputContainer}>
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      className={styles.descriptionNameInput}
                      placeholder="Type Here..."
                    />
                    <div className={styles.charLimitdescriptionContainer}>
                      <p className={styles.chardescriptionLimit}>
                        {maxCharLimitDescription - description.length} characters remaining
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.categotyBox} onClick={OpenShowCatagory}>
                  <div className={styles.categotyContainer}>
                    <p className={styles.categoty}>
                      Select Catagory<span style={{ color: 'red' }}>*</span>
                    </p>
                  </div>
                  <div className={styles.rightbox}>
                    <div className={styles.selectedCategoryContainer}>
                      <p className={styles.selectedCategory}>
                        {category} &nbsp; {subCategory}
                      </p>
                    </div>
                    <div className={styles.rightIconContainer}>
                      <img src={rightIcon} alt="rightIcon" className={styles.rightIcon} />
                    </div>
                  </div>
                </div>

                <div className={styles.infoContainer}>
                  <div className={styles.infoIconContainer}>
                    <img src={info} alt="info" className={styles.infoIcon} />
                  </div>
                  <span className={styles.infoText}>This community will be public</span>
                </div>
              </>
            )}

            {showCateagory && (
              <>
                <div className={styles.ccHeader}>
                  <div className={styles.ccClsoeIconContainer} onClick={CloseShowCatagory}>
                    <img src={arrowLeft} alt="back" className={styles.cccloseIcon} />
                  </div>

                  <div className={styles.ccTitleContainer}>
                    <p className={styles.ccTitle}>Select Catagory</p>
                  </div>

                  <div className={styles.previewNameContiner}>
                    <div className={styles.ccClsoeIconContainer}>
                      <img
                        onClick={saveCommunity}
                        src={isSubCategorySelected ? select : unselect}
                        alt="unselct"
                        className={styles.cccloseIcon}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.catagoryTitleContainer}>
                  <p className={styles.catagoryTitle}>
                    Select a suitable category for your community.
                  </p>
                </div>
                {!showCatagoryDetails && (
                  <div className={styles.catagoryBoxOuter}>
                    {communityCatagoryData.map((item, index) => (
                      <div
                        className={styles.catagoryBox}
                        onClick={() => openCatagoryDetails(index, item.catagory)}
                        key={item.id}
                      >
                        <div className={styles.categotyNameContainer}>
                          <p className={styles.categotyName}>{item.catagory}</p>
                        </div>
                        <div className={styles.rightIconContainer}>
                          <img src={rightIcon} alt="rightIcon" className={styles.rightIcon} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showCatagoryDetails && (
                  <div>
                    <div className={styles.catagoryDetailHeader}>
                      <div className={styles.detailBack} onClick={closeCatagoryDetails}>
                        <img src={arrowLeft} alt="left" className={styles.cccloseIcon} />
                      </div>
                      <div className={styles.catagoryDetailTextConatainer}>
                        <p className={styles.catagoryDetailText}>
                          {communityCatagoryData[selectedCategoryIndex].catagory}
                        </p>
                      </div>
                    </div>

                    <div className={styles.catagoryBoxOuter}>
                      {communityCatagoryData[selectedCategoryIndex].catagoryDetail.map((detail) => (
                        <div
                          className={styles.subCatagoryBox}
                          onClick={() => {
                            setSubCategory(detail.detailCatagory);
                            setIsSubCategorySelected(
                              detail.detailCatagory === subCategory ? !isSubCategorySelected : true
                            );
                          }}
                          key={detail.id}
                        >
                          <div className={styles.categotyNameContainer}>
                            <p className={styles.categotyName}>{detail.detailCatagory}</p>
                          </div>
                          <div className={styles.rightIconContainer}>
                            <img
                              src={
                                detail.detailCatagory === subCategory
                                  ? isSubCategorySelected
                                    ? selectCircle
                                    : unselectCircle
                                  : unselectCircle
                              }
                              alt="rightIcon"
                              className={styles.rightIcon}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {anonymousCommunityMore && (
        <div className={styles.moreOptionOverlay} onClick={closeMoreOption}>
          <div onClick={(e) => e.stopPropagation()} className={styles.moreOptionContainer}>
            <div onClick={deleteCommunity} className={styles.moreOptionBox}>
              <p className={styles.moreDelete}>Delete Your Community</p>
            </div>
            <div className={styles.moreOptionBox_cancel} onClick={closeMoreOption}>
              <p className={styles.moreEdit}>Cancel</p>
            </div>
          </div>
        </div>
      )}
      {showCropper && (
        <div className={'d-edit-modal-overlay'}>
          <div className={'d-edit-container'}>
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
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
              onClick={showCroppedImage}
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

export default CreateCommunity;
