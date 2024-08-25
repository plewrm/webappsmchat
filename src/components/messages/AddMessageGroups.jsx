import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import darkBack from '../../assets/icons/dark_mode_arrow_left.svg';
import lightBack from '../../assets/icons/light_mode_arrow_left.svg';
import mark from '../../assets/icons/dark-tick.svg';
import unmark from '../../assets/icons/dark-unticked.svg';
import search from '../../assets/icons/search.svg';
import { GroupData } from '../../data/DummyData';
import { useDispatch, useSelector } from 'react-redux';
import { setMessageAddGroup } from '../../redux/slices/modalSlice';
import addGroup from '../../assets/icons/add-group-photo.svg';
import close from '../../assets/icons/modal-close.svg';
import unselect from '../../assets/icons/story-notselected.svg';
import select from '../../assets/icons/story-select.svg';
import remove from '../../assets/icons/remove-people.svg';
import './Message.css';
import { Switch } from 'antd';

const AddMessageGroups = ({ handleBackClick }) => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupIcon, setGroupIcon] = useState(null); // State to store selected group icon
  const [groupName, setGroupName] = useState(''); // State to store group name
  const [showGroupPermissions, setShowGroupPermissions] = useState(false);
  const messageAddGroup = useSelector((state) => state.modal.messageAddGroup);

  const toggleSelection = (id) => {
    const index = selectedMembers.indexOf(id);
    if (index === -1) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    }
  };

  const openCreateGroupModal = () => {
    dispatch(setMessageAddGroup(true));
  };
  const closeCreateGroupModal = () => {
    dispatch(setMessageAddGroup(false));
  };
  const handleOpenGroupPermissions = () => {
    setShowGroupPermissions(true);
  };
  const handleCloseGroupPermissions = () => {
    setShowGroupPermissions(false);
  };
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const removeSelectedMember = (id) => {
    setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
  };

  const handleGroupIconClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none'; // Hide the input element

    fileInput.addEventListener('change', (event) => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        setGroupIcon(URL.createObjectURL(file)); // Set the selected file as the group icon
      }
    });

    // Trigger the file input
    fileInput.click();
  };

  const handleInputChange = (event) => {
    setGroupName(event.target.value);
  };

  return (
    <div>
      <div className="add-grps-box">
        <div className="add-grp-header-container">
          <div onClick={handleBackClick} className="back-btn-container">
            {isDarkMode ? (
              <img src={lightBack} alt="back" className="message-back-icon" />
            ) : (
              <img src={darkBack} alt="back" className="message-back-icon" />
            )}
          </div>
          <div className="grp-header-container">
            <p className={isDarkMode ? 'grp-header-title' : 'd-grp-header-title'}>Add New Group</p>
          </div>
        </div>

        <div className="message-search-bar-containers">
          <div
            className={
              isDarkMode ? 'message-search-bar-container' : 'd-message-search-bar-container'
            }
          >
            <div className="meaasge-search-icon-container">
              <img src={search} alt="search" className="message-search-icon" />
            </div>
            <input
              type="text"
              className={isDarkMode ? 'message-search-input' : 'd-message-search-input'}
              placeholder="Search People here..."
            />
          </div>
        </div>

        {selectedMembers.length > 0 && (
          <div className={isDarkMode ? 'added-people-container' : 'd-added-people-container'}>
            {selectedMembers.map((memberId) => {
              const member = GroupData.find((item) => item.id === memberId);
              return (
                <div className="added-people-profile-container" key={member.id}>
                  <img
                    className="added-people-profile"
                    src={member.profileImg}
                    alt="selected member"
                  />
                  <img
                    src={remove}
                    className="remove-added-people"
                    alt="remove"
                    onClick={() => removeSelectedMember(member.id)}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="grp-content-header-container">
          <div className="recent-container">
            <p className={isDarkMode ? 'recent-text' : 'd-recent-text'}>Recent</p>
          </div>
          <div className="seeAll-container">
            <p className="seeAll-text">See All</p>
          </div>
        </div>

        <div className="add-grp-people-container">
          {GroupData.map((item) => (
            <div className="add-grp-box" key={item}>
              <div className="add-grp-profile-container">
                <img alt="image" className="add-grp-profile" src={item.profileImg} />
              </div>
              <div className="add-grp-people-name-container">
                <p className={isDarkMode ? 'add-grp-people-name' : 'd-add-grp-people-name'}>
                  {item.name}
                </p>
              </div>
              <div className="grp-checkbox-container">
                <img
                  src={selectedMembers.includes(item.id) ? mark : unmark}
                  className="grp-checkbox"
                  alt="checkbox"
                  onClick={() => toggleSelection(item.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ margin: '4%' }}>
          <div
            className="create-grp-btn-container"
            style={{ backgroundColor: selectedMembers.length > 0 ? '#6E44FF' : '#C8BFE9' }}
            onClick={openCreateGroupModal}
          >
            <button
              className="create-grp-btn"
              disabled={selectedMembers.length === 0}
              onClick={openCreateGroupModal}
            >
              Create a group
            </button>
          </div>
        </div>
      </div>

      {messageAddGroup && (
        <div
          className={isDarkMode ? 'message-group-overlay' : 'd-message-group-overlay'}
          onClick={closeCreateGroupModal}
        >
          <div
            className={isDarkMode ? 'message-group' : 'd-message-group'}
            onClick={(e) => e.stopPropagation()}
          >
            {!showGroupPermissions && (
              <>
                <div className="add-group-modal-container">
                  <div className="new-group-title-container">
                    <p className={isDarkMode ? 'new-group-title' : 'd-new-group-title'}>
                      New Group
                    </p>
                  </div>
                  <div className="add-group-modal-close-container" onClick={closeCreateGroupModal}>
                    <img className="add-group-modal-close" alt="close" src={close} />
                  </div>
                </div>

                <div className="add-groups-photo-container">
                  {groupIcon ? (
                    <img src={groupIcon} alt="group-icon" className="add-groups-photo" />
                  ) : (
                    <img
                      src={addGroup}
                      alt="add-photo"
                      className="add-groups-photo"
                      onClick={handleGroupIconClick}
                    />
                  )}
                </div>

                <div className="add-groups-text-container" onClick={handleGroupIconClick}>
                  <p className={isDarkMode ? 'add-groups-text' : 'd-add-groups-text'}>Group Icon</p>
                </div>

                <div className="add-groups-input-container">
                  <input
                    className={isDarkMode ? 'add-groups-name' : 'd-add-groups-name'}
                    placeholder="Group Name"
                    value={groupName}
                    onChange={handleInputChange}
                  />
                  <div className="unselect-add-group-container">
                    <img
                      src={groupName ? select : unselect}
                      alt="unselect"
                      className="unselect-add-group"
                    />
                  </div>
                </div>

                <div className="group-permissions-container" onClick={handleOpenGroupPermissions}>
                  <p className={isDarkMode ? 'group-permissions-text' : 'd-group-permissions-text'}>
                    Group Permissions
                  </p>
                </div>
              </>
            )}

            {showGroupPermissions && (
              <>
                <div className="group-permissions-header">
                  <div
                    className="group-permission-back-container"
                    onClick={handleCloseGroupPermissions}
                  >
                    {isDarkMode ? (
                      <img src={lightBack} alt="back" className="group-permission-back" />
                    ) : (
                      <img src={darkBack} alt="back" className="group-permission-back" />
                    )}
                  </div>
                  <div className="group-permission-title-container">
                    <p
                      className={isDarkMode ? 'group-permission-title' : 'd-group-permission-title'}
                    >
                      Group Permissions
                    </p>
                  </div>
                </div>

                <div className="permission-member-text-container">
                  <p className={isDarkMode ? 'permission-member-text' : 'd-permission-member-text'}>
                    Members Can
                  </p>
                </div>

                <div className="member-setting-container">
                  <div className="edit-group-setting-container">
                    <p className={isDarkMode ? 'edit-group-setting' : 'd-edit-group-setting'}>
                      Edit Group Settings
                    </p>
                  </div>

                  <div className="other-group-setting-container">
                    <div className="other-settings-box">
                      <p className={isDarkMode ? 'other-setting-text1' : 'd-other-setting-text1'}>
                        Group Name, Icon, Description, Vanishing Message, and the ability to pin,
                        keep or unkeep messages
                      </p>
                    </div>
                    <Switch unChecked onChange={onChange} />
                  </div>

                  <div className="other-group-setting-container">
                    <div className="other-settings-box">
                      <p className={isDarkMode ? 'other-setting-text2' : 'd-other-setting-text2'}>
                        Send Messages
                      </p>
                    </div>
                    <Switch unChecked onChange={onChange} />
                  </div>

                  <div className="other-group-setting-container">
                    <div className="other-settings-box">
                      <p className={isDarkMode ? 'other-setting-text3' : 'd-other-setting-text3'}>
                        Add Other Members
                      </p>
                    </div>
                    <Switch unChecked onChange={onChange} />
                  </div>
                </div>

                <div className="permission-member-text-container2">
                  <p className={isDarkMode ? 'permission-member-text' : 'd-permission-member-text'}>
                    Admins Can
                  </p>
                </div>

                <div className="member-setting-container">
                  <div className="other-group-setting-container">
                    <div className="other-settings-box2">
                      <p className={isDarkMode ? 'other-setting-text4' : 'd-other-setting-text4'}>
                        Approve New Members
                      </p>
                    </div>
                    <Switch unChecked onChange={onChange} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMessageGroups;
