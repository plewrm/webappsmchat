import React, { useState, useEffect } from 'react';
import './SavedPostModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../context/ThemeContext';
import save from '../../../../assets/icons/Save.svg';
import close from '../../../../assets/icons/modal-close.svg';
import addCollection from '../../../../assets/icons/add-square.svg';
import untick from '../../../../assets/icons/add-saved.svg';
import leftArrow from '../../../../assets/images/arrow-left.png';
import more from '../../../../assets/icons/More.svg';
import tick from '../../../../assets/icons/tick-square.svg';
import voiletTick from '../../../../assets/icons/tick-square-voilet.svg';
import sqBlank from '../../../../assets/icons/tick-square-voilet-bank.svg';
import defaultImg from '../../../../assets/icons/defaultImg.svg';
import { BASE_URL, BEARER_TOKEN, GETUSERCOLLECTIONS } from '../../../../api/EndPoint.js';
import axios from 'axios';
import { getDate } from '../../../../utils/time.js';
import {
  closeSaveModal,
  setSavedMoreOption,
  setExpandPostModal,
  setsaveAddCollection,
  setSelectedPost
} from '../../../../redux/slices/modalSlice.js';
import unselect from '../../../../assets/icons/unclick-tick-circle.svg';
import select from '../../../../assets/icons/click-tick-circle.svg';
import ExpandPost from '../ExpandPost';
import { useNavigate } from 'react-router-dom';

export default function SavedPostModal() {
  const navigate = useNavigate();
  const [selectImage, setSelectImage] = useState(false);
  const savedMoreOption = useSelector((state) => state.modal.savedMoreOption);
  const [selectedImages, setSelectedImages] = useState([]); // State to keep track of selected images
  const handleOpenMore = () => {
    dispatch(setSavedMoreOption(true));
  };
  const handleCloseMore = () => {
    dispatch(setSavedMoreOption(false));
  };
  const handleOpenSelectImage = () => {
    dispatch(setSavedMoreOption(false));
    setSelectImage(true);
  };

  const handleCloseSelectImage = () => {
    setSelectImage(false);
  };

  const toggleSelection = (index, hash, id) => {
    const newSelectedImages = [...selectedImages];
    const isSelected = newSelectedImages.some(
      (item) => item.index === index && item.hash === hash && item.id === id
    );

    if (isSelected) {
      // If already selected, remove it
      const updatedSelectedImages = newSelectedImages.filter(
        (item) => !(item.index === index && item.hash === hash && item.id === id)
      );
      setSelectedImages(updatedSelectedImages);
    } else {
      // If not selected, add it
      const newImage = { index, hash, id };
      const updatedSelectedImages = [...newSelectedImages, newImage];
      setSelectedImages(updatedSelectedImages);
    }
  };

  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // console.log(isMobile)
  const { isDarkMode } = useTheme();
  const handleCloseModal = () => {
    dispatch(closeSaveModal());
  };

  const [tickeditmes, setTickedItems] = useState([]);
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  // console.log(selectedPost)
  const addSelectCat = async (name) => {
    if (tickeditmes.includes(name)) {
      setTickedItems(tickeditmes.filter((item) => item !== name));
      console.log(name);
      await unsavedColl(name);
    } else {
      setTickedItems([...tickeditmes, name]);
      await savedColl(name);
    }
    // console.log(selectedPost)
  };
  const savedColl = async (name) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const savedObj = {
        postHash: selectedPost.hash,
        postOwner: selectedPost.author.soconId
      };
      console.log(savedObj);
      const response = await axios.post(`${BASE_URL}/collections/${name}/add`, savedObj, {
        headers
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const unsavedColl = async (name) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const savedObj = {
        postHash: selectedPost.hash,
        postOwner: selectedPost.author.soconId
      };
      console.log(savedObj);
      const response = await axios.delete(`${BASE_URL}/collections/${name}/posts`, {
        headers,
        data: savedObj
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteThisColl = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${BASE_URL}/collections/${categoryName}`, { headers });
      dispatch(closeSaveModal());
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromColl = async (id, hash) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const savedObj = {
        postHash: hash,
        postOwner: id
      };
      console.log(savedObj);
      const response = await axios.delete(`${BASE_URL}/collections/${categoryName}/posts`, {
        headers,
        data: savedObj
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const removeSavedPost = () => {
    console.log(selectedImages);
    selectedImages.map((post, index) => {
      removeFromColl(post.id, post.hash);
    });
  };

  const [showAll, setShowAll] = useState(false);
  const showAllCategories = () => {
    setShowAll(true);
  };

  const [showOne, setShowOne] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const displayItemPosts = (category) => {
    setShowOne(true);
    setCategoryName(category);
    getAllSavedPosts(category);
  };

  const [savedPost, setSavedPost] = useState(null);
  const getAllSavedPosts = async (category) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}/collections/${category}`, { headers });
      console.log(response.data);
      setSavedPost(response.data.collectionPosts);
    } catch (error) {
      console.error(error);
    }
  };

  const [collections, setCollections] = useState(null);

  const getTimeline = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${GETUSERCOLLECTIONS}`, { headers });
      console.log(response.data);
      setCollections(response.data.data.collections);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getTimeline();
  }, []);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (collections && collections.createdAt) {
      // Assume getDate is a function that formats the date
      const updatedTime = getDate(collections.createdAt);
      setTime(updatedTime);
    }
  }, [collections]);
  const openNewCollectionModal = () => {
    dispatch(closeSaveModal());
    dispatch(setsaveAddCollection(true));
  };

  const [showPost, setShowPost] = useState(false);

  const goToPost = (post) => {
    // setShowPost(true)
    dispatch(closeSaveModal());
    // dispatch(setExpandPostModal(true))
    dispatch(setSelectedPost(post));
    // getPostByHash(post.hash, post.author.soconId)
    navigate(`/homepage/post/${post.hash}/${post.author.soconId}`);
    // console.log(post)
  };

  const getRandomColor = () => {
    var trans = '0.2'; // 50% transparency
    var color = 'rgba(';
    for (var i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 255) + ',';
    }
    color += trans + ')'; // add the transparency
    if (color == 'rgb(255,255,255, 1.3)') {
      getRandomColor();
    }
    return color;
  };
  return (
    <>
      {showPost ? (
        <ExpandPost />
      ) : (
        <div>
          <div className={isDarkMode ? 'saved-modal-overlay' : 'd-saved-modal-overlay'}>
            <div
              className={
                (showAll ? 'sellAllModalBox ' : '') +
                (isDarkMode ? 'light-saved-modal-content' : 'dark-saved-modal-content')
              }
            >
              <>
                <div
                  style={showAll ? { display: 'none' } : { display: 'block' }}
                  className="inner-saved-modal-content"
                >
                  <div
                    className={
                      isDarkMode
                        ? 'light-saved-modal-content-header'
                        : 'dark-saved-modal-content-header'
                    }
                  >
                    <div className="saved-modal-content-header-left">
                      <img
                        className="saved-modal-content-header-savedIcon"
                        src={isDarkMode ? '/lightIcon/saveLight.svg' : '/darkIcon/saveDark.svg'}
                      ></img>
                      <span
                        className="saved-modal-content-header-name"
                        style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                      >
                        Saved
                      </span>
                    </div>
                    <div className="saved-modal-content-header-right">
                      <img
                        className="saved-modal-content-header-closeIcon"
                        onClick={handleCloseModal}
                        src={
                          isDarkMode
                            ? '/lightIcon/closeModalLight.svg'
                            : '/darkIcon/closeModalDark.svg'
                        }
                      ></img>
                    </div>
                  </div>
                  <div onClick={openNewCollectionModal} className="newCollection">
                    <span>New Collection</span>
                    <img src={addCollection} alt="add-collection"></img>
                  </div>
                  <div
                    className={
                      isDarkMode
                        ? 'light-saved-modal-content-body'
                        : 'dark-saved-modal-content-body'
                    }
                  >
                    <div className="global-saved-category">
                      {collections &&
                        collections.map((item, index) => (
                          <div
                            style={
                              tickeditmes.includes(item.name)
                                ? { backgroundColor: isDarkMode ? '#EFEDF8' : '#1C1434' }
                                : {}
                            }
                            key={index}
                            className="each-saved-category"
                          >
                            <div className="each-saved-category-left">
                              {/* need to add a dummy photo */}
                              <div className="saved-collection-item-container">
                                <img className="saved-collection-item" src={defaultImg} />
                              </div>
                              <div className="each-saved-collection-name-containers">
                                <p
                                  className="each-saved-collection-name"
                                  style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                                >
                                  {item.name}
                                </p>
                              </div>
                            </div>
                            <div className="addUnselectCollectionContainer">
                              <img
                                onClick={() => addSelectCat(item.name)}
                                className="addUnselectCollection"
                                src={tickeditmes.includes(item.name) ? tick : untick}
                                alt="add-to-collection"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="seeAll-Savedcollection-container">
                      <span onClick={showAllCategories} className="seeAll-Savedcollection">
                        See All
                      </span>
                    </div>
                  </div>
                </div>
                {/*  */}
                <div
                  style={showAll ? { display: 'block' } : { display: 'none' }}
                  className="inner-saved-modal-content"
                >
                  <div
                    className={
                      isDarkMode
                        ? 'light-saved-modal-content-header'
                        : 'dark-saved-modal-content-header'
                    }
                  >
                    <div className="saved-modal-content-header-left">
                      {/* <img className='saved-modal-content-header-savedIcon' src={save}></img> */}
                      <span
                        className="saved-modal-content-header-name"
                        style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                      >
                        Saved
                      </span>
                    </div>
                    <div className="saved-modal-content-header-right">
                      <img
                        className="saved-modal-content-header-closeIcon"
                        onClick={handleCloseModal}
                        src={
                          isDarkMode
                            ? '/lightIcon/closeModalLight.svg'
                            : '/darkIcon/closeModalDark.svg'
                        }
                      ></img>
                    </div>
                  </div>
                  <div style={showOne ? { display: 'none' } : { display: 'block' }}>
                    <div onClick={openNewCollectionModal} className="newCollection">
                      <span>New Collection</span>
                      <img src={addCollection} alt="add-collection"></img>
                    </div>
                    <div
                      className={
                        isDarkMode
                          ? 'light-saved-modal-content-body'
                          : 'dark-saved-modal-content-body'
                      }
                    >
                      <div className="seeAll-global-saved-category">
                        {collections &&
                          collections.map((item, index) => (
                            <div className="seeAll-each-saved-category">
                              <div className="seeAll-each-saved-category-left">
                                {/* need to add default cover for no posts */}
                                <div
                                  className="seeAll-saved-collection-item-container"
                                  onClick={() => displayItemPosts(item.name)}
                                >
                                  <img
                                    className="seeAll-saved-collection-item"
                                    src={item.coverPhotos[0] ? item.coverPhotos[0] : defaultImg}
                                  />
                                </div>
                                <div className="seeAll-each-saved-collection-name-container">
                                  <p className="seeAll-each-saved-collection-name">{item.name}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div style={showOne ? { display: 'block' } : { display: 'none' }}>
                    <div className="seeAll-saved-modal-content-header">
                      <div className="seeAll-saved-modal-content-header-left">
                        <img
                          onClick={() => setShowOne(false)}
                          className="saved-modal-content-header-savedIcon"
                          src={
                            isDarkMode
                              ? '/lightIcon/arrowBackLight.svg'
                              : '/darkIcon/arrowBackDark.svg'
                          }
                        ></img>
                        <span
                          className="seeAll-posts-categoryName"
                          style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                        >
                          {categoryName}
                        </span>
                        <span
                          className="seeAll-posts-text"
                          style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}
                        >
                          {savedPost && savedPost.posts && savedPost.posts.length} saved posts
                        </span>
                      </div>
                      <div
                        onClick={handleOpenMore}
                        className="seeAll-saved-modal-content-header-right"
                      >
                        <img
                          className="saved-modal-content-header-savedIcon"
                          src={
                            isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'
                          }
                        ></img>
                      </div>
                    </div>
                    <div>
                      {collections &&
                        collections.map((item, index) => {
                          if (item.name === categoryName) {
                            return (
                              <div className="seeAll-global-select-category" key={index}>
                                {savedPost &&
                                  savedPost.posts.map((innerItem, innerIndex) => (
                                    <div key={innerIndex} className="each-saved-post-container">
                                      {innerItem && (
                                        <>
                                          {innerItem.images.length !== 0 &&
                                            innerItem.images[0].type === 0 && (
                                              <img
                                                onClick={() => goToPost(innerItem)}
                                                className="each-saved-post"
                                                src={innerItem.images[0].url}
                                                alt="each-post"
                                              />
                                            )}
                                          {innerItem.images.length !== 0 &&
                                            innerItem.images[0].type === 1 && (
                                              <video
                                                className="each-saved-post"
                                                autoPlay
                                                muted
                                                onClick={() => goToPost(innerItem)}
                                              >
                                                <source
                                                  src={innerItem.images[0].url}
                                                  type="video/mp4"
                                                />
                                              </video>
                                            )}
                                          {innerItem.images.length === 0 && (
                                            <div
                                              style={{
                                                background: getRandomColor(),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: '0.9',
                                                color: 'grey'
                                              }}
                                              className="each-saved-post"
                                              onClick={() => goToPost(innerItem)}
                                            >
                                              <span>{innerItem.description}</span>
                                            </div>
                                          )}
                                        </>
                                      )}
                                      {selectImage && (
                                        // Conditionally render the selection toggle only if selectImage is true
                                        <div
                                          className="select-saved-post-container"
                                          onClick={() =>
                                            toggleSelection(
                                              innerIndex,
                                              innerItem.hash,
                                              innerItem.author.soconId
                                            )
                                          }
                                        >
                                          {selectedImages.some(
                                            (item) =>
                                              item.index === innerIndex &&
                                              item.hash === innerItem.hash &&
                                              item.id === innerItem.author.soconId
                                          ) ? (
                                            <img
                                              src={select}
                                              className="select-saved-post"
                                              alt="select"
                                            />
                                          ) : (
                                            <img
                                              src={unselect}
                                              className="select-saved-post"
                                              alt="unselect"
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            );
                          }
                          return null; // If the condition is not met, return null or an alternative content
                        })}
                    </div>
                  </div>
                  {selectImage && (
                    <>
                      <div
                        className={
                          isDarkMode ? 'select-more-modal-overlay' : 'd-select-more-modal-overlay'
                        }
                      >
                        <div
                          className={
                            isDarkMode ? 'select-more-container' : 'd-select-more-container'
                          }
                        >
                          <div
                            className={
                              isDarkMode
                                ? 'save-more-options-container'
                                : 'd-save-more-options-container'
                            }
                          >
                            <p
                              onClick={removeSavedPost}
                              className={
                                isDarkMode
                                  ? 'save-more-options-cancel'
                                  : 'd-save-more-options-cancel'
                              }
                            >
                              Remove
                            </p>
                          </div>
                          <div
                            className={
                              isDarkMode
                                ? 'save-more-options-container'
                                : 'd-save-more-options-container'
                            }
                          >
                            <p
                              className={
                                isDarkMode
                                  ? 'save-more-options-cancel'
                                  : 'd-save-more-options-cancel'
                              }
                            >
                              Move to Board
                            </p>
                          </div>
                          <div
                            className={
                              isDarkMode
                                ? 'save-more-options-container'
                                : 'd-save-more-options-container'
                            }
                            onClick={handleCloseSelectImage}
                          >
                            <p
                              className={
                                isDarkMode
                                  ? 'save-more-options-cancel'
                                  : 'd-save-more-options-cancel'
                              }
                            >
                              Cancel
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            </div>
          </div>
          {savedMoreOption && (
            <>
              <div
                className={isDarkMode ? 'save-more-modal-overlay' : 'd-save-more-modal-overlay'}
                onClick={handleCloseMore}
              >
                <div
                  className={isDarkMode ? 'save-more-container' : 'd-save-more-container'}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={
                      isDarkMode ? 'save-more-options-container' : 'd-save-more-options-container'
                    }
                  >
                    <p
                      onClick={deleteThisColl}
                      className={isDarkMode ? 'save-more-options' : 'd-save-more-options'}
                    >
                      Delete This Board
                    </p>
                  </div>
                  <div
                    className={
                      isDarkMode ? 'save-more-options-container' : 'd-save-more-options-container'
                    }
                  >
                    <p
                      className={isDarkMode ? 'save-more-options-edit' : 'd-save-more-options-edit'}
                    >
                      Edit Board
                    </p>
                  </div>
                  <div
                    className={
                      isDarkMode ? 'save-more-options-container' : 'd-save-more-options-container'
                    }
                    onClick={handleOpenSelectImage}
                  >
                    <p
                      className={isDarkMode ? 'save-more-options-edit' : 'd-save-more-options-edit'}
                    >
                      Select
                    </p>
                  </div>
                  <div
                    className={
                      isDarkMode ? 'save-more-options-container' : 'd-save-more-options-container'
                    }
                    onClick={handleCloseMore}
                  >
                    <p
                      className={
                        isDarkMode ? 'save-more-options-cancel' : 'd-save-more-options-cancel'
                      }
                    >
                      Cancel
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
