import React, { useEffect, useState } from 'react';
import './Post.css';
import { useDispatch, useSelector } from 'react-redux';
import { closeRepostModal } from '../../../redux/slices/modalSlice';
import { useTheme } from '../../../context/ThemeContext';
import close from '../../../assets/icons/modal-close.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  REPOST,
  LIKE_UNLIKE_POST,
  ADDCOMMENT
} from '../../../api/EndPoint';
import axios from 'axios';
import {
  openMoreModal,
  setViewRepost,
  setSelectedPost,
  setUserRepostListModal
} from '../../../redux/slices/modalSlice';
import Posts from './Posts';
import { useNavigate } from 'react-router-dom';

const Repost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const selectedPost = useSelector((state) => state.modal.selectedPost);
  const handleCloseModal = () => {
    dispatch(closeRepostModal());
  };

  const handleMoreClick = () => {
    dispatch(openMoreModal());
  };

  const [captionIndexMap, setCaptionIndexMap] = useState(new Map());
  const updateIndex = (index, setCaptionIndex) => {
    const captionTempMap = new Map(captionIndexMap);
    captionTempMap.set(index, setCaptionIndex);
    setCaptionIndexMap(captionTempMap);
  };

  const [resposts, setReposts] = useState(null);
  const fetchAllRepost = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(
        `${BASE_URL}${REPOST}${selectedPost.author.soconId}/${selectedPost.hash}`,
        { headers }
      );
      console.log(response.data);
      setReposts(response.data.reposts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllRepost();
  }, []);

  const closeRepost = () => {
    dispatch(setViewRepost(false));
    navigate('/homepage');
  };

  const getAllRepost = () => {
    dispatch(setUserRepostListModal(true));
    dispatch(setViewRepost(false));
  };
  // console.log(selectedPost)

  return (
    <div
      style={{
        width: '100%0',
        borderRadius: '16px',
        minHeight: '90vh',
        background: isDarkMode ? '#FCFCFC' : '#110E18'
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        className="header-container"
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            color: 'rgba(252, 252, 252, 1)',
            padding: '20px 0px 0px 20px'
          }}
        >
          <img
            src={isDarkMode ? '/lightIcon/repostLight.svg' : './darkIcon/repostDark.svg'}
            alt="repost-icon"
          ></img>
          <p style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}>Reposts</p>
        </div>
        <div onClick={closeRepost} style={{ cursor: 'pointer', paddingRight: '20px' }}>
          <img src={close} alt="close-icon"></img>
        </div>
      </div>
      <div onClick={getAllRepost} style={{ color: 'rgba(252, 252, 252, 1)', paddingLeft: '20px' }}>
        {resposts && <p>Reposted by {resposts.length}</p>}
      </div>

      <Posts isReposts={true} />
      {/* {resposts && resposts.map((post, postIndex) => (

        <div key={postIndex} className={isDarkMode ? 'post-boxes' : 'd-post-boxes'}>
          <>
            <div className='post-header-container'>
              <div className='post-profile-container' >
                <img src={post.author.pfp} className='post-profile' alt='profile-pic' />
              </div>

              <div className='post-name-container'>
                <p className={isDarkMode ? 'post-name' : 'd-post-name'}>{post.author.display_name}</p>
              </div>

              <div className='post-id-container'>
                <p className={isDarkMode ? 'post-id' : 'd-post-id'}>{"@" + post.author.username}</p>
              </div>

              <div className='isrepost-container'>
                <div className='isrepost-logo-container' >
                  <img src={repost} alt="repost" className='isrepost-logo' />
                </div>

                <div className='isrepost-text-container'>
                  <p className='isrepost-text'>reposted</p>
                </div>
              </div>

              <div className='post-time-container'>
                <p className={isDarkMode ? 'post-time' : 'd-post-time'}>{getDate(post.timestamp)}</p>
              </div>

              <div className='more-container' onClick={handleMoreClick}>
                <img src={more} className='more-icon' alt='more' />
              </div>
            </div>
            <div className='post-captions-container'>
              <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>{post.description}</p>
            </div>
            <div className='original-post-container'>
              <div className='post-header-container'>

                <div className='post-profile-container' >
                  <img src={selectedPost.author.pfp} className='post-profile' alt='profile-pic' />
                </div>

                <div className='post-name-container'>
                  <p className={isDarkMode ? 'post-name' : 'd-post-name'}>{selectedPost.author.display_name}</p>
                </div>

                <div className='post-id-container'>
                  <p className={isDarkMode ? 'post-id' : 'd-post-id'}>{"@" + selectedPost.author.username}</p>
                </div>

                <div className='post-time-container'>
                  <p className={isDarkMode ? 'post-time' : 'd-post-time'}>{getDate(selectedPost.createdAt)}</p>
                </div>
              </div>

              <div className='post-captions-container'>
                <p className={isDarkMode ? 'post-captions' : 'd-post-captions'}>{selectedPost.type === 2 ? selectedPost.description : selectedPost.images[captionIndexMap.get(postIndex) || 0].caption}</p>
              </div>

              {selectedPost.type !== 2 && (
                <div className='post-photo-containers'>
                  <ImageCarousel
                    images={selectedPost.images.map(element => element.url)}
                    types={selectedPost.images.map(element => element.type)}
                    isLiked={selectedPost.isLiked}
                    handleLike={null}
                    arrowClick={updateIndex}
                    index={postIndex}
                  />
                </div>
              )}
            </div>
          </>
        </div>
      ))} */}
    </div>
  );
};

export default Repost;
