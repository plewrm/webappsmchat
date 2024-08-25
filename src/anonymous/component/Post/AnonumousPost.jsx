import React, { useState } from 'react';
import styles from '../HomeScreen.module.css';
import AllPost from './AllPost';
import deletes from '../../../assets/icons/trash.svg';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setAnonymousPostMoreOption } from '../../../redux/slices/modalSlice';
import more from '../../../assets/icons/More.png';
import { BASE_URL, BEARER_TOKEN, DELETEMESSAGE } from '../../../api/EndPoint';
import axios from 'axios';
import { setGlobalAnonPost } from '../../../redux/slices/anonSlices';

const AnonumousPost = ({ communityMessage, timeline, admin }) => {
  const dispatch = useDispatch();
  const selectPost = useSelector((state) => state.community.selectPost);
  const anonymousPostMoreOption = useSelector((state) => state.modal.anonymousPostMoreOption);
  const globalAnonPost = useSelector((state) => state.community.globalAnonPost);
  const anonDetails = useSelector((state) => state.community.anonDetails);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const CloseMoreOption = () => {
    dispatch(setAnonymousPostMoreOption(false));
    setShowConfirm(false);
    setSelectedPost(null);
  };

  const OpenShowConfirm = () => {
    setShowConfirm(true);
  };

  const handleShowMoreOptions = (post) => {
    setSelectedPost(post);
    dispatch(setAnonymousPostMoreOption(true));
  };

  const deletePost = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(
        `${BASE_URL}${DELETEMESSAGE}${selectPost.author.id}/${selectPost.hash}`,
        { headers }
      );
      // setChange(true)
      console.log(response.data);
      dispatch(setGlobalAnonPost(!globalAnonPost));
      CloseMoreOption();
    } catch (error) {
      toast.error('you cannot delete this message');
      // console.error(error);
    }
  };

  return (
    <div>
      {communityMessage &&
        communityMessage.map((post, index) => (
          <div key={index}>
            <AllPost
              index={index}
              admin={admin}
              post={post}
              handleShowMoreOptions={handleShowMoreOptions}
            />
          </div>
        ))}
      {timeline &&
        timeline.map((post, index) => (
          <div key={index}>
            <AllPost index={index} post={post} handleShowMoreOptions={handleShowMoreOptions} />
          </div>
        ))}

      {anonymousPostMoreOption && selectedPost && (
        <div className={styles.moreOverlay} onClick={CloseMoreOption}>
          <div className={styles.moreContent} onClick={(e) => e.stopPropagation()}>
            {showConfirm ? (
              <div>
                <div className={styles.DeleteNotifyContainer}>
                  <p className={styles.deleteNotify}>Are you sure Want to delete this story?</p>
                </div>
                <div className={styles.notifyButtonContainers}>
                  <button className={styles.notifyButtonCancel} onClick={CloseMoreOption}>
                    Cancel
                  </button>
                  <button onClick={deletePost} className={styles.notifyButton}>
                    Yes
                  </button>
                </div>
              </div>
            ) : (
              <>
                {anonDetails.name === selectedPost.author.username ? (
                  <div className={styles.optionsBox} onClick={OpenShowConfirm}>
                    <div className={styles.moreIconContainer}>
                      <img src={deletes} alt="delete" className={styles.moreIcon} />
                    </div>
                    <span className={styles.deletesText}>Delete Post</span>
                  </div>
                ) : (
                  <div className={styles.optionsBox}>
                    <span className={styles.deletesText}>Report Post</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnonumousPost;
