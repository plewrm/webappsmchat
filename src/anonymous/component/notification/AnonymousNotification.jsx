import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { setAnonymousNotification, setNotificationModal } from '../../../redux/slices/modalSlice';
import darkBack from '../../../assets/icons/dark_mode_arrow_left.svg';
import lightBack from '../../../assets/icons/light_mode_arrow_left.svg';
import profile from '../../../assets/images/message-user (2).png';
import request from '../../../assets/icons/request-icon.svg';
import arrowRight from '../../../assets/icons/arrow-right-request.svg';
import { NotificationsData, PreviousNotification, requestData } from '../../../data/DummyData';
import picture from '../../../assets/images/profile-pic.png';
const AnonymousNotification = () => {
  const { isDarkMode } = '';
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();

  const handlePage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };
  const closeNotificaton = () => {
    dispatch(setAnonymousNotification(false));
  };
  return (
    <div className={isDarkMode ? 'notification-container' : 'd-notification-container'}>
      {currentPage === 0 && (
        <>
          <div className="notification-header-outer">
            <div className="notification-header">
              <div className="notification-back-container" onClick={closeNotificaton}>
                {isDarkMode ? (
                  <img src={lightBack} alt="back" className="notification-back" />
                ) : (
                  <img src={darkBack} alt="back" className="notification-back" />
                )}
              </div>
              <div className="notification-title-container">
                <p className={isDarkMode ? 'notification-title' : 'd-notification-title'}>
                  Notification
                </p>
              </div>
            </div>
          </div>

          <div className="notification-follow-request-container" onClick={() => handlePage(1)}>
            <div className="left-request-container">
              <div className="request-photo-container-outer">
                <div className="request-photo-container">
                  <img src={profile} alt="profile1" className="request-photo" />
                </div>
                <div className="request-photo-container2">
                  <img
                    src={`https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
                    alt="profile2"
                    className="request-photo"
                  />
                </div>
                <div className="request-photo-container3">
                  <img src={profile} alt="profile3" className="request-photo" />
                </div>
              </div>

              <div className="follow-requests-text-container">
                <p className={isDarkMode ? 'follow-requests-text' : 'd-follow-requests-text'}>
                  Commmunity requests
                </p>
              </div>
            </div>

            <div className="right-request-container">
              <div className="request-box">
                <div className="request-icons-container">
                  <img src={request} alt="request" className="request-icons" />
                </div>
                <div className="request-count-container">
                  <p className={isDarkMode ? 'request-count' : 'd-request-count'}>+112</p>
                </div>
              </div>

              <div className="right-arrow-notification-container">
                <img src={arrowRight} alt="right" className="right-arrow-notification" />
              </div>
            </div>
          </div>

          <div className="incoming-notification-container">
            <div className="notification-day-container">
              <p
                className={
                  isDarkMode ? 'notification-day-container' : 'd-notification-day-container'
                }
              >
                New
              </p>
            </div>

            <div className="outsidebox-Nf">
              {NotificationsData.map((item) => (
                <div className="nf-outer-box" key={item.id}>
                  {/* <div className='grp-nf-container'>
                    <div className='nf-profile-pic-container'>
                      <img src={picture} alt='picture' className='nf-profile-pic' />
                    </div>
                    <div className='nf-profile-pic-container01'>
                      <img src={picture} alt='picture' className='nf-profile-pic' />
                    </div>
                  </div> */}
                  <div className="nf-profile-pic-container">
                    <img src={item.pfp} alt="picture" className="nf-profile-pic" />
                  </div>

                  <div className="nf-alltext-container">
                    <span className={isDarkMode ? 'username-nf' : 'd-username-nf'}>
                      {item.name}
                    </span>
                    <span className={isDarkMode ? 'mentioned-nf' : 'd-mentioned-nf'}>
                      {item.text}
                    </span>
                    <span className={isDarkMode ? 'opp-username-nf' : 'd-opp-username-nf'}>
                      {item.mention}
                    </span>
                    <span className={isDarkMode ? 'opp-reply-nf' : 'd-opp-reply-nf'}>
                      {item.comment}
                    </span>
                    <span className={isDarkMode ? 'time-nf' : 'd-time-nf'}>5h</span>
                  </div>
                  <div className="nf-right-box">
                    {item.type === 'mention' && (
                      <div className="nf-right-img-container">
                        <img src={item.imgUrl} className="nf-right-img" alt="image" />
                      </div>
                    )}
                    {/* <div className='buttons-container-nf'>
                      <button className={isDarkMode ? 'confirm-nf' : 'd-confirm-nf'}>Accept</button>
                      <button className={isDarkMode ? 'remove-nf' : 'd-remove-nf'}>Decline</button>
                    </div> */}
                    {/* <div className='buttons-container-nf'>
                      <button className={isDarkMode ? 'confirm-nf' : 'd-confirm-nf'}>Invite</button>
                      <button className={isDarkMode ? 'remove-nf' : 'd-remove-nf'}>Remove</button>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>

            <div className="outsidebox-Nf">
              {PreviousNotification.map((item) => (
                <div className="nf-outer-box" key={item.id}>
                  {/* <div className='grp-nf-container'>
                    <div className='nf-profile-pic-container'>
                      <img src={picture} alt='picture' className='nf-profile-pic' />
                    </div>
                    <div className='nf-profile-pic-container01'>
                      <img src={picture} alt='picture' className='nf-profile-pic' />
                    </div>
                  </div> */}
                  <div className="nf-profile-pic-container">
                    <img src={item.pfp} alt="picture" className="nf-profile-pic" />
                  </div>

                  <div className="nf-alltext-container">
                    <span className={isDarkMode ? 'username-nf' : 'd-username-nf'}>
                      {item.name}
                    </span>
                    <span className={isDarkMode ? 'mentioned-nf' : 'd-mentioned-nf'}>
                      {item.text}
                    </span>
                    <span className={isDarkMode ? 'opp-username-nf' : 'd-opp-username-nf'}>
                      {item.mention}
                    </span>
                    <span className={isDarkMode ? 'opp-reply-nf' : 'd-opp-reply-nf'}>
                      {item.comment}
                    </span>
                    <span className={isDarkMode ? 'time-nf' : 'd-time-nf'}>12h</span>
                  </div>
                  <div className="nf-right-box">
                    {item.type === 'mention' && (
                      <div className="nf-right-img-container">
                        <img src={item.imgUrl} className="nf-right-img" alt="image" />
                      </div>
                    )}
                    {item.type === 'tag' && (
                      <div className="nf-right-img-container">
                        <img src={item.imgUrl} className="nf-right-img" alt="image" />
                      </div>
                    )}
                    {item.type === 'request' && (
                      <div className="buttons-container-nf">
                        <button className={isDarkMode ? 'confirm-nf' : 'd-confirm-nf'}>
                          Confirm
                        </button>
                        <button className={isDarkMode ? 'remove-nf' : 'd-remove-nf'}>Remove</button>
                      </div>
                    )}
                    {item.type === 'following' && (
                      <button className={isDarkMode ? 'following-nf' : 'd-following-nf'}>
                        Following
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {currentPage === 1 && (
        <>
          <div className="notification-header-outer">
            <div className="notification-header">
              <div className="notification-back-container" onClick={() => handlePage(0)}>
                {isDarkMode ? (
                  <img src={lightBack} alt="back" className="notification-back" />
                ) : (
                  <img src={darkBack} alt="back" className="notification-back" />
                )}
              </div>
              <div className="notification-title-container">
                <p className={isDarkMode ? 'notification-title' : 'd-notification-title'}>
                  Commmunity Requests
                </p>
              </div>
            </div>
          </div>

          <div className="incoming-request-all-container">
            {requestData.map((item) => (
              <div className="all-request-box" key={item.id}>
                <div className="requested-profile-container">
                  <img src={item.img} alt="profile" className="requested-profile" />
                </div>

                <div className="requested-middle-box">
                  <div className="requested-name-container">
                    <p className={isDarkMode ? 'requested-name' : 'd-requested-name'}>
                      {item.username}
                    </p>
                  </div>
                  <div className="requested-username-container">
                    <p className={isDarkMode ? 'requested-username' : 'd-requested-username'}>
                      {item.name}
                    </p>
                  </div>
                </div>

                <div className="requested-btn-box">
                  <button
                    className={isDarkMode ? 'requested-confirm-btn' : 'd-requested-confirm-btn'}
                  >
                    Accept
                  </button>
                  <button
                    className={isDarkMode ? 'requested-remove-btn' : 'd-requested-remove-btn'}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rquested-suggestion-box">
            <div className="suggestions-name-container">
              <p className={isDarkMode ? 'suggestions-name' : 'd-suggestions-name'}>
                Suggestions for you
              </p>
            </div>
            <div className="seaAll-name-container">
              <p className={isDarkMode ? 'seaAll-name' : 'd-seaAll-name'}>Sell all</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnonymousNotification;
