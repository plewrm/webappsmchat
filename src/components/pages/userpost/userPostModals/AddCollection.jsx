import React, { useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import close from '../../../../assets/icons/modal-close.svg';
import './AddCollection.css';
import unselect from '../../../../assets/icons/story-notselected.svg';
import select from '../../../../assets/icons/story-select.svg';
import { useDispatch } from 'react-redux';
import { setsaveAddCollection, openSaveModal } from '../../../../redux/slices/modalSlice';
import { BASE_URL, BEARER_TOKEN, CREATECOLLECTIONS } from '../../../../api/EndPoint';
import axios from 'axios';

const AddCollection = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();

  const closeAddCollection = () => {
    dispatch(setsaveAddCollection(false));
    dispatch(openSaveModal());
  };

  const createCollection = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${BASE_URL}${CREATECOLLECTIONS}`,
        { name: collectionName },
        { headers }
      );
      dispatch(setsaveAddCollection(false));
      dispatch(openSaveModal());
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [collectionName, setCollectionName] = useState(null);
  return (
    <div className={isDarkMode ? 'addCollection-modal-overlay' : 'd-addCollection-modal-overlay'}>
      <div className={isDarkMode ? 'addCollection-container' : 'd-addCollection-container'}>
        <div className="add-collection-header">
          <div className="addCollection-title-container">
            <p className={isDarkMode ? 'addCollection-title' : 'd-addCollection-title'}>
              New Collection
            </p>
          </div>
          <div className="addCollection-close-Container" onClick={closeAddCollection}>
            <img src={close} alt="close" className="addCollection-close" />
          </div>
        </div>

        <div className="add-collection-box2">
          <input
            onChange={(e) => setCollectionName(e.target.value)}
            value={collectionName}
            className={isDarkMode ? 'add-collectionInput' : 'd-add-collectionInput'}
            placeholder="Add name"
            style={{
              background: isDarkMode ? '#F2F2F2' : '#1A1623',
              border: isDarkMode ? '1px solid #DCDCDC' : '1px solid #333337'
            }}
          />

          <div onClick={createCollection} className="add-collection-checkd-container">
            <img
              src={collectionName ? select : unselect}
              className="add-collection-checkd"
              alt="unchecked"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCollection;
