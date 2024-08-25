import React, { useEffect, useRef, useState } from 'react';
import styles from './SaveCollection.module.css';
import { useTheme } from '../../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { setAddCollectionModal, setCollectionData } from '../../../../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  BASE_URL,
  BEARER_TOKEN,
  DELETEALLCOLLECTION,
  GETPOSTCOLLECTION
} from '../../../../api/EndPoint';
import axios from 'axios';

const SaveCollection = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const [showSelectOption, setShowSelectOption] = useState(false);
  const [selectCollection, setSelectCollection] = useState([]);
  const [showSelectIcon, setShowSelectIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUndoOption, setShowUndoOption] = useState(false);
  const collectionData = useSelector((state) => state.modal.collectionData);

  const handleToggle = () => {
    setShowSelectOption(true);
  };
  const handleOpenAddCollection = () => {
    dispatch(setAddCollectionModal(true));
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setShowSelectOption(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShowSelectIcon = () => {
    setShowSelectIcon(true);
  };
  const handleHideSelecticon = () => {
    setShowSelectIcon(false);
  };
  const handleShowDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };
  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };
  const handleShowUndoOption = () => {
    setShowDeleteConfirmation(false);
    setShowUndoOption(true);
  };
  const handleCloseUndoOption = () => {
    setShowUndoOption(false);
  };

  const handleSelectCollection = (event, hash) => {
    event.stopPropagation();
    setSelectCollection([...selectCollection, hash]);
  };

  const handleUnSelectCollection = (event, hash) => {
    event.stopPropagation();
    setSelectCollection(selectCollection.filter((id) => id !== hash));
  };

  const handleOpenCollection = (collectionName) => {
    navigate('/saved/posts', { state: { collectionName } });
  };

  const fetchCollections = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const url = `${BASE_URL}${GETPOSTCOLLECTION}`;
      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        const data = response.data;
        if (data && data.data && data.data.collections) {
          dispatch(setCollectionData(data.data.collections.reverse()));
        } else {
          console.error('Unexpected response structure:', data);
          dispatch(setCollectionData([]));
        }
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);
  useEffect(() => {}, [collectionData]);

  const handleDeleteCollections = async () => {
    const collectionsToDelete = collectionData.filter((item) =>
      selectCollection.includes(item.hash)
    );
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN || sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      for (const collection of collectionsToDelete) {
        const url = `${BASE_URL}${DELETEALLCOLLECTION.replace(':collectionName', collection.name)}`;
        const response = await axios.delete(url, { headers });
        console.log(`Response for deleting ${collection.name}:`, response.status); // Log response status
      }

      dispatch(
        setCollectionData(collectionData.filter((item) => !selectCollection.includes(item.hash)))
      );
      setSelectCollection([]);
      setShowDeleteConfirmation(false);
      setShowUndoOption(true);
    } catch (error) {
      console.error('Error deleting collections:', error);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={isDarkMode ? styles.savedContainer : styles['d-savedContainer']}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconContainer_arrow}>
            {showSelectIcon ? (
              <img
                src={isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'}
                className={styles.icon}
                onClick={handleHideSelecticon}
              />
            ) : (
              <img
                src={isDarkMode ? '/lightIcon/arrowBackLight.svg' : '/darkIcon/arrowBackDark.svg'}
                className={styles.icon}
                onClick={handleBack}
              />
            )}
          </div>
          <div className={styles.headerLeftInner}>
            <div className={styles.iconContainer_save}>
              <img
                src={isDarkMode ? '/lightIcon/saveLight.svg' : '/darkIcon/saveDark.svg'}
                className={styles.icon}
              />
            </div>
            <div className={styles.headerTittleContainer}>
              <p className={isDarkMode ? styles.tittle : styles['d-tittle']}>Saved</p>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {showSelectIcon ? (
            <>
              {selectCollection.length > 0 && (
                <div className={styles.iconContainer_arrow} onClick={handleShowDeleteConfirmation}>
                  <img src="/icon/trash.svg" className={styles.icon} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.iconContainer_add} onClick={handleOpenAddCollection}>
                <img src="/icon/addSquare_save.svg" className={styles.icon} />
              </div>
              <div
                ref={popoverRef}
                className={`${styles.popoverContainer} ${showSelectOption ? styles.active : ''}`}
              >
                <div className={styles.iconContainer_add} onClick={handleToggle}>
                  <img
                    src={isDarkMode ? '/lightIcon/more_h_Light.svg' : '/darkIcon/more_h_Dark.svg'}
                    className={styles.icon}
                  />
                  {showSelectOption && (
                    <div
                      className={isDarkMode ? styles.popoverContent : styles['d-popoverContent']}
                      onClick={handleShowSelectIcon}
                    >
                      <p
                        className={
                          isDarkMode ? styles.selectOptionText : styles['d-selectOptionText']
                        }
                      >
                        Select Collections
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.containerMain}>
        <div className={styles.container}>
          {collectionData.map((item) => (
            <div
              className={styles.box}
              key={item.hash}
              style={{ opacity: showSelectIcon ? '0.6' : '' }}
              onClick={() => handleOpenCollection(item.name)}
            >
              {item.name === 'All' ? (
                <>
                  <div className={styles.container2}>
                    {item.coverPhotos.slice(0, 4).map((photo, index) => (
                      <div className={styles.box2} key={index}>
                        <div
                          className={styles.boxImgContainer}
                          style={{
                            borderRadius:
                              index === 0
                                ? '8px 0px 0px 0px'
                                : index === 1
                                  ? '0px 8px 0px 0px'
                                  : index === 2
                                    ? '0px 0px 0px 8px'
                                    : index === 3
                                      ? '0px 0px 8px 0px'
                                      : ''
                          }}
                        >
                          <img
                            src={photo}
                            className={styles.boxImg}
                            style={{
                              borderRadius:
                                index === 0
                                  ? '8px 0px 0px 0px'
                                  : index === 1
                                    ? '0px 8px 0px 0px'
                                    : index === 2
                                      ? '0px 0px 0px 8px'
                                      : index === 3
                                        ? '0px 0px 8px 0px'
                                        : ''
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {item.coverPhotos.length > 0 ? (
                    <div className={styles.boxImgContainer}>
                      <img src={item.coverPhotos[0]} className={styles.boxImg} />
                    </div>
                  ) : (
                    <div className={styles.boxImgContainer}>
                      <img src="/Images/emptyCollection.svg" className={styles.boxImg} />
                    </div>
                  )}
                </>
              )}

              <div className={styles.boxInfoContainer}>
                <div className={styles.boxInfoTextContainer}>
                  <p className={isDarkMode ? styles.boxInfo : styles['d-boxInfo']}>{item.name}</p>
                </div>
                <div className={styles.boxInfoCountContainer}>
                  <p className={isDarkMode ? styles.boxInfoCount : styles['d-boxInfoCount']}>
                    ({item.postCount})
                  </p>
                </div>
              </div>
              {showSelectIcon && item.name !== 'All' && (
                <div className={styles.selectBoxIcon}>
                  {selectCollection.includes(item.hash) ? (
                    <img
                      src="/icon/tick-Square.svg"
                      className={styles.selectIcon}
                      onClick={(event) => handleUnSelectCollection(event, item.hash)}
                    />
                  ) : (
                    <img
                      src="/icon/untick_Square.svg"
                      className={styles.selectIcon}
                      onClick={(event) => handleSelectCollection(event, item.hash)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showDeleteConfirmation && (
        <div
          className={isDarkMode ? styles.modalOverlay : styles['d-modalOverlay']}
          onClick={handleCloseDeleteConfirmation}
        >
          <div
            className={isDarkMode ? styles.modalContainer : styles['d-modalContainer']}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmationTittle}>
              <p className={isDarkMode ? styles.confirmationText : styles['d-confirmationText']}>
                Are you sure you want to delete collections?
              </p>
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.cancelButton} onClick={handleCloseDeleteConfirmation}>
                Cancel
              </button>
              <button
                className={isDarkMode ? styles.sureButton : styles['d-sureButton']}
                onClick={handleDeleteCollections}
              >
                Yes, Sure
              </button>
            </div>
          </div>
        </div>
      )}

      {showUndoOption && (
        <div
          className={isDarkMode ? styles.modalOverlay_undo : styles['d-modalOverlay_undo']}
          onClick={handleCloseUndoOption}
        >
          <div className={styles.undoBox}>
            <div
              className={isDarkMode ? styles.modalContainer_undo : styles['d-modalContainer_undo']}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.undoContainer}>
                <div className={styles.undoTextContainer}>
                  <p className={isDarkMode ? styles.undoText : styles['d-undoText']}>
                    Saved Collections Deleted!
                  </p>
                </div>
                <button
                  className={isDarkMode ? styles.undoButton : styles['d-undoButton']}
                  onClick={handleCloseUndoOption}
                >
                  Undo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveCollection;
