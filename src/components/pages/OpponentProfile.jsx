import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import cover from '../../assets/images/profile-cover.png';
import verify from '../../assets/icons/verify.svg';
import more from '../../assets/icons/dark-more-vertical.svg';
import profile from '../../assets/images/message-user (3).png';
import highlightImg from '../../assets/images/message-user (1).png';
import grid1 from '../../assets/icons/grid1.svg';
import grid2 from '../../assets/icons/grid2.svg';
import grid3 from '../../assets/icons/grid3.svg';
import grid4 from '../../assets/icons/grid4.svg';
import lightGrid1 from '../../assets/icons/light-grid1.svg';
import { useDispatch, useSelector } from 'react-redux';
import StoryHighLight from '../../modals/StoryHighLight';
import greetMsg from '../../assets/icons/greet-msg.svg';
import Posts from './userpost/Posts';
const OpponentProfile = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [activeGridTab, setActiveGridTab] = useState(1); // State to track active tab
  const openAddHighLightModal = useSelector((state) => state.modal.openAddHighLightModal);

  const profileInfo = useSelector((state) => state.modal.selectnearByProfile);
  console.log(profileInfo);
  const highlightData = [
    { id: 1, img: profile, name: 'Highlight' },
    { id: 2, img: highlightImg, name: 'Pune' }
  ];
  const handleTabClick = (tabNumber) => {
    setActiveGridTab(tabNumber);
  };
  return (
    <>
      <div className={isDarkMode ? 'userprofile-container' : 'd-userprofile-container'}>
        <div>
          <div className="user-cover-container">
            <img src={profileInfo.cover_photo} alt="cover" className="user-cover" />
          </div>
          <div className="user-profile-count-container">
            <div className="user-profile-container">
              <img
                src={profileInfo.url}
                alt="profile"
                className={isDarkMode ? 'user-profile' : 'd-user-profile'}
              />
            </div>
            <div className={isDarkMode ? 'revealp-count-box' : 'd-revealp-count-box'}>
              <div className="revealp-count-innerbox">
                <div className="revealp-count-column">
                  <div className="revealp-counts-container">
                    <p className={isDarkMode ? 'revealp-counts' : 'd-revealp-counts'}>
                      {profileInfo.followers}
                    </p>
                  </div>
                  <div className="revealp-count-name-container">
                    <p className={isDarkMode ? 'revealp-count-name' : 'd-revealp-count-name'}>
                      Followers
                    </p>
                  </div>
                </div>
                <div className="revealp-count-column">
                  <div className="revealp-counts-container">
                    <p className={isDarkMode ? 'revealp-counts' : 'd-revealp-counts'}>
                      {profileInfo.friends}
                    </p>
                  </div>
                  <div className="revealp-count-name-container">
                    <p className={isDarkMode ? 'revealp-count-name' : 'd-revealp-count-name'}>
                      Friends
                    </p>
                  </div>
                </div>
                <div className="revealp-count-column">
                  <div className="revealp-counts-container">
                    <p className={isDarkMode ? 'revealp-counts' : 'd-revealp-counts'}>
                      {profileInfo.following}
                    </p>
                  </div>
                  <div className="revealp-count-name-container">
                    <p className={isDarkMode ? 'revealp-count-name' : 'd-revealp-count-name'}>
                      Following
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="user-box1-outer">
            <div className="user-box1 ">
              <div className="user-name-container">
                <p className={isDarkMode ? 'user-name' : 'd-user-name'}>
                  {profileInfo.display_name}
                </p>
              </div>
              <div className="user-verify-container">
                <img src={verify} alt="verify" className="user-verify" />
              </div>
              <div className="user-more-container">
                <img src={more} alt="more" className="user-more" />
              </div>
            </div>
            <div className="user-id-container">
              <p className={isDarkMode ? 'user-id' : 'd-user-id'}>{profileInfo.username}</p>
            </div>
            <div className="user-bio-container">
              <p className={isDarkMode ? 'user-bio' : 'd-user-bio'}>{profileInfo.bio}</p>
            </div>
          </div>
          <div className="user-button-container">
            <button className={isDarkMode ? 'opponent-follow-button' : 'd-opponent-follow-button'}>
              Follow
            </button>
            <button className={isDarkMode ? 'user-edit-profile' : 'd-user-edit-profile'}>
              Add Friend
            </button>
            <button className={isDarkMode ? 'opponent-greet-button' : 'd-opponent-greet-button'}>
              <img src={greetMsg} alt="Greet Icon" className="opponent-greet-icon" />
              Greet
            </button>
          </div>
          <div className="user-highlight-container">
            {highlightData.map((item) => (
              <div key={item.id} className="highlight-box">
                <div className="highlight-image-container">
                  <img src={item.img} alt={item.name} className="highlight-image" />
                </div>
                <div className="hightlight-text-container">
                  <p className={isDarkMode ? 'highlight-text' : 'd-highlight-text'}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="user-grid-tab-container">
            <div
              className={
                isDarkMode
                  ? `user-tabs-container ${activeGridTab === 1 ? 'active' : ''}`
                  : `d-user-tabs-container ${activeGridTab === 1 ? 'active' : ''}`
              }
              onClick={() => handleTabClick(1)}
            >
              {isDarkMode ? (
                <img src={lightGrid1} alt="grid" className="user-tabs" />
              ) : (
                <img src={grid1} alt="grid" className="user-tabs" />
              )}
            </div>
            <div
              className={
                isDarkMode
                  ? `user-tabs-container ${activeGridTab === 2 ? 'active' : ''}`
                  : `d-user-tabs-container ${activeGridTab === 2 ? 'active' : ''}`
              }
              onClick={() => handleTabClick(2)}
            >
              <img src={grid2} alt="grid" className="user-tabs" />
            </div>
            <div
              className={
                isDarkMode
                  ? `user-tabs-container ${activeGridTab === 3 ? 'active' : ''}`
                  : `d-user-tabs-container ${activeGridTab === 3 ? 'active' : ''}`
              }
              onClick={() => handleTabClick(3)}
            >
              <img src={grid3} alt="grid" className="user-tabs" />
            </div>
            <div
              className={
                isDarkMode
                  ? `user-tabs-container ${activeGridTab === 4 ? 'active' : ''}`
                  : `d-user-tabs-container ${activeGridTab === 4 ? 'active' : ''}`
              }
              onClick={() => handleTabClick(4)}
            >
              <img src={grid4} alt="grid" className="user-tabs" />
            </div>
          </div>
          {/* <div className='user-tab-content-container'>
                {activeGridTab === 1 && (
                    <div>
                      <Posts/>
                    </div>
                )}
                {activeGridTab === 2 && (
                    <div>
                        <p style={{ color: 'white' }}>Tab2</p>
                    </div>
                )}
                {activeGridTab === 3 && (
                    <div>
                        <p style={{ color: 'white' }}>Tab3</p>
                    </div>
                )}
                {activeGridTab === 4 && (
                    <div>
                        <p style={{ color: 'white' }}>Tab4</p>
                    </div>
                )}
            </div> */}
        </div>
      </div>
      {openAddHighLightModal && <StoryHighLight />}
    </>
  );
};
export default OpponentProfile;
