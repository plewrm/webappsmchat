import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  closespinbuzzModal,
  openSpinbuzzMessageModal,
  setAnonymousspinBuzz
} from '../../../redux/slices/modalSlice';
import close from '../../../assets/icons/modal-close.svg';
import uncheckButton from '../../../assets/icons/unclick-vector.svg';
import checkedButton from '../../../assets/icons/click-vector.svg';
import uncheckinput from '../../../assets/icons/unchecked-input.svg';
import information from '../../../assets/icons/information.svg';
import chooseAvatar from '../../../assets/icons/choose-avatar.svg';
import DarkchooseAvatar from '../../../assets/icons/choose-avatar-dark.svg';
import add from '../../../assets/icons/add-intrest.svg';
import minus from '../../../assets/icons/minus-intrest.svg';
import checkinput from '../../../assets/icons/spinnbuzz-tick-circle.svg';
import {
  BASE_URL,
  BEARER_TOKEN,
  GETANON,
  CHECKUSERNAMEAVAILABILITYANON
} from '../../../api/EndPoint';
import axios from 'axios';
import { avatarsImageData } from '../../../data/DummyData';
import search from '../../../assets/icons/search.svg';
import downs from '../../../assets/icons/arrow-down-spin.svg';
import onBoarding from '../../../assets/anonymous/image/ano-onboardind.png';
import { setGlobalAnonProfileUpdate, setAnonDetails } from '../../../redux/slices/anonSlices';
import leftUnselect from '../../../assets/icons/arrow-circle-left.svg';
import leftSelect from '../../../assets/icons/arrow-circle-left-selected.svg';
const EditProfile = ({ closeEditProfile, anonProfile }) => {
  console.log('Profile data', anonProfile);
  const { isDarkMode } = '';
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0); // State for tracking the current step
  const [stepActive, setStepActive] = useState(false); // State for tracking step activatie
  const [username, setUsername] = useState(anonProfile.name); // State to track the input value
  const [selectedAvatar, setSelectedAvatar] = useState(anonProfile.avatar);
  console.log('Image Avatar', anonProfile.avatar);
  const [aboutyou, setAboutYou] = useState(anonProfile.bio); // State to track the input value
  const MAX_CHARACTERS = 200; // Define the maximum character limit
  const [selectedHobbies, setSelectedHobbies] = useState(anonProfile.hobbies);
  const [selectlanguages, setSelectedLanguages] = useState(anonProfile.languages);
  const [addLanguage, setAddLanguage] = useState(false);

  const handleAboutYouChange = (event) => {
    setAboutYou(event.target.value);
    console.log(event.target.value); // Log the updated value of aboutyou
  };

  const [ageRangeStates, setAgeRangeStates] = useState({
    'Below 18': false,
    '18-25': false,
    '25-35': false,
    '35-45': false,
    '45-60': false,
    '60 and above': false
  });

  const interestGroups = [
    [
      'Photography',
      'Drawing',
      'Writing',
      'Acting',
      'Hiking',
      'Skating',
      'Road Trips',
      'Camping',
      'Banking',
      'Swimming',
      'Cooking',
      'Coding',
      'Video Gaming',
      'Poetry',
      'Arts and Crafts',
      'Animne',
      'Body Building',
      'History',
      'DIY',
      'Travelling'
    ]
  ];

  const languageSelect = [
    [
      'Hindi',
      'English',
      'Hinglish',
      'Gujrati',
      'Tamil',
      'Bengali',
      'Marathi',
      'Telugu',
      'Odisa',
      'Urdu',
      'Malayalam',
      'Kannada'
    ]
  ];

  const loacationData = [
    { id: 1, name: 'Nagpur' },
    { id: 2, name: 'Mumbai' },
    { id: 3, name: 'Pune' },
    { id: 4, name: 'Shrirampur' },
    { id: 5, name: 'Solapur' },
    { id: 6, name: 'Jalgaon' },
    { id: 7, name: 'Nashik' },
    { id: 8, name: 'Jamkhed' }
  ];

  const languageData = [
    { id: 1, name: 'Marathi' },
    { id: 2, name: 'Urdhu' },
    { id: 3, name: 'English' },
    { id: 4, name: 'Punjabi' },
    { id: 5, name: 'Khandeshi' },
    { id: 6, name: 'Marwadi' },
    { id: 7, name: 'Hindi' },
    { id: 8, name: 'Spanish' }
  ];
  const [showLocation, setShowLocation] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selected location

  const [showLanguages, setShowLanguages] = useState(false);
  const [isLangOptionSelected, setIsLangOptionSelected] = useState(false);
  const [selectedOptionLanguage, setSelectedOptionLanguage] = useState(null); // State for selected location

  const selectLanguagesOption = (language) => {
    setSelectedOptionLanguage(language.name); // Update selected language with the name of the selected language
    setIsLangOptionSelected(true); // Update the state when an option is selected
    closeShowLocation(); // Close the language dropdown after selection
  };

  const openShowLanguage = () => {
    setShowLanguages(!showLanguages);
  };
  const closeShowLanguage = () => {
    setShowLanguages(false);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location.name); // Update selected location with the name of the selected location
    setIsOptionSelected(true); // Update the state when an option is selected
    closeShowLanguage(); // Close the location dropdown after selection
  };

  const openShowLocation = () => {
    setShowLocation(!showLocation);
  };
  const closeShowLocation = () => {
    setShowLocation(false);
  };

  const closeSpinbuzzModalHandler = () => {
    dispatch(closespinbuzzModal());
  };

  const [avatarId, setAvatarId] = useState(null);
  const handleAvatarClick = (avatar) => {
    console.log('Selected Avatar ID:', avatar.id);
    setAvatarId(avatar.id);
    setSelectedAvatar(avatar.id); //importent this one not below three
    // setSelectedAvatar((prevAvatar) =>
    //   prevAvatar && prevAvatar.id === avatar.id ? null : avatar.image
    // );
  };

  const handleStep = (stepIndex) => {
    // Function to handle the setup process change
    setCurrentStep(stepIndex);
    setStepActive(true);
  };

  const [ageRange, setAgeRange] = useState(anonProfile.ageRange);

  const handleAgeRangeClick = (newrange, index) => {
    console.log('select new range', newrange);
    setAgeRange(index);
    const updatedAgeRangeStates = { ...ageRangeStates };
    const range = Object.keys(updatedAgeRangeStates)[ageRange];
    updatedAgeRangeStates[range] = !updatedAgeRangeStates[range];
    updatedAgeRangeStates[newrange] = true;
    setAgeRangeStates(updatedAgeRangeStates);
  };

  const openAddLanguage = () => {
    setAddLanguage(true);
  };
  const closeAddLanguage = () => {
    setAddLanguage(false);
  };

  const handleSendHiClick = () => {
    dispatch(closespinbuzzModal());
    dispatch(openSpinbuzzMessageModal());
  };

  // const selectIntrest = (item) => {
  //     if (selectedHobbies.length === 3) {
  //         // Remove the first element using slice
  //         const updatedHobbies = selectedHobbies.slice(1);
  //         // Add the new interest to the end
  //         updatedHobbies.push(item);
  //         setSelectedHobbies(updatedHobbies);
  //     } else {
  //         // If the array length is less than three, simply add the interest
  //         setSelectedHobbies([...selectedHobbies, item]);
  //     }
  // }

  const selectIntrest = (item) => {
    if (selectedHobbies.length < 3 || selectedHobbies.includes(item)) {
      if (selectedHobbies.includes(item)) {
        // If the interest is already selected, deselect it
        setSelectedHobbies(selectedHobbies.filter((interest) => interest !== item));
      } else {
        // Add the interest if less than 3 interests are selected
        setSelectedHobbies([...selectedHobbies, item]);
      }
    }
  };

  // const selectLanguage = (item) => {
  //     console.log(item)
  //     if (selectlanguages.length === 3) {
  //         // Remove the first element using slice
  //         const updatedLanguages = selectlanguages.slice(1);
  //         // Add the new interest to the end
  //         updatedLanguages.push(item);
  //         setSelectedLanguages(updatedLanguages);
  //     } else {
  //         // If the array length is less than three, simply add the interest
  //         setSelectedLanguages([...selectlanguages, item]);
  //     }
  // }

  const selectLanguage = (item) => {
    if (selectlanguages.length < 3 || selectlanguages.includes(item)) {
      if (selectlanguages.includes(item)) {
        // If the language is already selected, deselect it
        setSelectedLanguages(selectlanguages.filter((language) => language !== item));
      } else {
        // Add the language if less than 3 languages are selected
        setSelectedLanguages([...selectlanguages, item]);
      }
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateAnonProfile = async () => {
    console.log(aboutyou);
    const anonObj = {
      name: username,
      avatar: selectedAvatar,
      hobbies: selectedHobbies,
      languages: selectlanguages,
      bio: aboutyou,
      latitude: '-10',
      longitude: '13',
      ageRange: ageRange
    };
    if (anonProfile.name === anonObj.name) {
      delete anonObj.name;
    }
    try {
      const formData = new FormData();
      Object.entries(anonObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      // formData.append("media", {
      //     uri:'file://D:\thesocialcontinent\rohit_new\src\assets\images\avatars (1).png',
      //     type: 'image/png',
      //     name: 'image.png',

      // })
      console.log(formData);

      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
      };
      const response = await fetch(`${BASE_URL}${GETANON}`, {
        method: 'PATCH',
        headers: headers,
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      dispatch(setAnonDetails(responseData.data)); // Update global state with the new profile details
      dispatch(setGlobalAnonProfileUpdate((prevState) => !prevState));
      console.log(responseData);
      closeEditProfile();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const [available, setAvailable] = useState(null);
  const checkAvalibility = async (e) => {
    setUsername(e.target.value);
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
      };
      const response = await axios.get(
        `${BASE_URL}${CHECKUSERNAMEAVAILABILITYANON}${e.target.value}`,
        { headers }
      );
      if (response.data.message === 'Username available') {
        setAvailable(true);
      } else {
        setAvailable(false);
      }
    } catch (err) {
      console.log(err);
      setAvailable(false);
    }
  };

  useEffect(() => {
    if (anonProfile && anonProfile.ageRange) {
      const updatedAgeRangeStates = { ...ageRangeStates };
      const range = Object.keys(updatedAgeRangeStates)[ageRange];
      updatedAgeRangeStates[range] = !updatedAgeRangeStates[range];
      setAgeRangeStates(updatedAgeRangeStates);
    }
  }, [anonProfile]);

  return (
    <>
      <div className="spin-modal-overlay" onClick={closeEditProfile}>
        <div
          className={isDarkMode ? 'light-spin-modal-content' : 'dark-spin-modal-content'}
          onClick={(e) => e.stopPropagation()}
        >
          {!addLanguage && (
            <>
              {currentStep !== 7 && (
                <div className="spinbuzz-setup-box">
                  <div className="spinbuzz-header">
                    <div className="spinbuzz-header-title-container">
                      <p
                        className={isDarkMode ? 'spinbuzz-header-title' : 'd-spinbuzz-header-title'}
                      >
                        Anonymous Account Setup
                      </p>
                    </div>
                    <div className="spinbuzz-close-icon-container" onClick={closeEditProfile}>
                      <img src={close} alt="close" className="spinbuzz-close-icon" />
                    </div>
                  </div>

                  <div className="processbar">
                    {[0, 1, 2, 3, 4, 5, 6].map((stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`steps ${stepIndex <= currentStep ? 'active' : ''}`}
                      ></div>
                    ))}
                  </div>

                  {currentStep === 0 && (
                    <div className="setup-body">
                      <div className="setup-inner-body">
                        <div className="first-setup-title-container">
                          <p className={isDarkMode ? 'first-setup-title' : 'd-first-setup-title'}>
                            Your unique username
                          </p>
                        </div>
                        <div className="first-setup-input-container-outer">
                          <div
                            className={
                              isDarkMode
                                ? 'first-setup-input-container'
                                : 'd-first-setup-input-container'
                            }
                          >
                            <input
                              type="text"
                              className={isDarkMode ? 'username-input' : 'd-username-input'}
                              placeholder="@username"
                              value={username}
                              onChange={checkAvalibility} // Update the username state on input change
                            />
                            <div className="uncheked-input-container">
                              {!available ? (
                                <img src={uncheckinput} className="unchecked-input" alt="uncheck" />
                              ) : (
                                <img src={checkinput} className="unchecked-input" alt="uncheck" />
                              )}
                              {/* {username.length > 0 && (
                                                                <img src={checkinput} className='unchecked-input' alt='uncheck' />
                                                            )}
                                                            {username.length < 1 && (
                                                                <img src={uncheckinput} className='unchecked-input' alt='uncheck' />
                                                            )} */}
                            </div>
                          </div>
                          {!available && (
                            <div className="error-show-container">
                              <div className="error-show-container-inner">
                                <div className="error-info-container">
                                  <img src={information} alt="info" className="error-info" />
                                </div>
                                <p className="error-texts">This username is already taken</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="suggestion-username-container">
                          <div className="suggested-container">
                            <p className={isDarkMode ? 'suggested-name' : 'd-suggested-name'}>
                              Suggested for you :
                            </p>
                          </div>
                          <div className="usernames-container">
                            <div
                              className={isDarkMode ? 'username-container' : 'd-username-container'}
                            >
                              <div className="username-name-container">
                                <p className={isDarkMode ? 'username' : 'd-username'}>@username</p>
                              </div>{' '}
                            </div>

                            <div
                              className={isDarkMode ? 'username-container' : 'd-username-container'}
                            >
                              <div className="username-name-container">
                                <p className={isDarkMode ? 'username' : 'd-username'}>@username</p>
                              </div>
                            </div>

                            <div
                              className={isDarkMode ? 'username-container' : 'd-username-container'}
                            >
                              <div className="username-name-container">
                                <p className={isDarkMode ? 'username' : 'd-username'}>@username</p>
                              </div>{' '}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="setup-next-button-container">
                        {username ? (
                          <img
                            src={checkedButton}
                            onClick={() => handleStep(1)}
                            className="setup-next-button"
                          />
                        ) : (
                          <img src={uncheckButton} className="setup-next-button" />
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="setup-body">
                      <div className="choose-avatar-body">
                        <div className="avatar-title-container">
                          <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>
                            Your Avatar
                          </p>
                        </div>
                        <div className="choose-avatar-icon-container">
                          {selectedAvatar ? (
                            <img
                              // src={selectedAvatar}
                              src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${selectedAvatar}.png`}
                              alt="selected-avatar"
                              className="avatars-images"
                            />
                          ) : (
                            <>
                              {isDarkMode ? (
                                <img src={chooseAvatar} className="choose-avatar-icon" />
                              ) : (
                                <img src={DarkchooseAvatar} className="choose-avatar-icon" />
                              )}
                            </>
                          )}
                        </div>
                        <div className="choose-avatar-option-container">
                          <p
                            className={
                              isDarkMode
                                ? 'choose-avatar-contain-option'
                                : 'd-choose-avatar-contain-option'
                            }
                          >
                            Choose from the Avatar options
                          </p>
                        </div>

                        <div className={isDarkMode ? 'avatars-containers' : 'd-avatars-containers'}>
                          {avatarsImageData.map((card) => (
                            <div key={card.id} className="avatars-containers-inner">
                              <div
                                className={`avatars-images-containers ${selectedAvatar === card.image ? 'selected' : ''}`}
                              >
                                <img
                                  src={card.image}
                                  alt="avatar"
                                  className="avatars-images"
                                  onClick={() => handleAvatarClick(card)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="setup-next-button-container">
                        {selectedAvatar ? (
                          <img
                            src={checkedButton}
                            onClick={() => handleStep(2)}
                            className="setup-next-button"
                          />
                        ) : (
                          <img src={uncheckButton} className="setup-next-button" />
                        )}
                      </div>
                      <div
                        className="setup-next-button-container_left"
                        onClick={() => handleStep(0)}
                      >
                        <img src={leftSelect} className="setup-next-button" />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="setup-body">
                      <div className="choose-avatar-body">
                        <div className="avatar-title-container">
                          <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>
                            Age Range ?
                          </p>
                        </div>
                        <div className="age-range-container">
                          {Object.keys(ageRangeStates).map((range, index) => (
                            <div
                              key={index}
                              className={` ${isDarkMode ? 'age-range' : 'd-age-range'} ${ageRangeStates[range] ? 'active' : ''}`}
                              onClick={() => handleAgeRangeClick(range, index)}
                            >
                              <span className={isDarkMode ? 'age-number' : 'd-age-number'}>
                                {range}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* <div className="age-range-container">
                          {Object.keys(ageRangeStates).map((range, index) => (
                            <div
                              key={index}
                              className={` ${isDarkMode ? 'age-range' : 'd-age-range'} ${ageRangeStates[range] ? 'active' : ''}`}
                              onClick={() => handleAgeRangeClick(range, index)}
                            >
                              <span className={isDarkMode ? 'age-number' : 'd-age-number'}>
                                {range}
                              </span>
                            </div>
                          ))}
                        </div> */}
                      </div>
                      <div className="setup-next-button-container">
                        {Object.values(ageRangeStates).some((state) => state) ? (
                          <img
                            src={checkedButton}
                            onClick={() => handleStep(3)}
                            className="setup-next-button"
                          />
                        ) : (
                          <img src={uncheckButton} className="setup-next-button" />
                        )}
                      </div>
                      <div
                        className="setup-next-button-container_left"
                        onClick={() => handleStep(1)}
                      >
                        <img src={leftSelect} className="setup-next-button" />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="setup-body">
                      <div className="choose-avatar-body">
                        <div className="avatar-title-container">
                          <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>
                            Interests and Hobbies
                          </p>
                        </div>
                        <div className="intrest-title-container">
                          <p className={isDarkMode ? 'intrest-title' : 'd-intrest-title'}>
                            You can select max 3.
                          </p>
                        </div>
                      </div>

                      <div className="intrest-external-container">
                        {interestGroups.map((interestGroup, index) => (
                          <div key={index}>
                            {/* changed from flex to grid */}
                            <div className="global-intrest-container">
                              {interestGroup.map((interest) => (
                                <div
                                  onClick={() => selectIntrest(interest)}
                                  key={interest}
                                  className={
                                    isDarkMode
                                      ? 'intrest-button-container'
                                      : 'd-intrest-button-container'
                                  }
                                  style={{
                                    background: selectedHobbies.includes(interest)
                                      ? 'rgba(110, 68, 255, 0.2)'
                                      : '#201C2B',
                                    border: selectedHobbies.includes(interest)
                                      ? '1px solid #6E44FF'
                                      : '1px solid #313036'
                                  }}
                                >
                                  <p
                                    className={isDarkMode ? 'intrest-name' : 'd-intrest-name'}
                                    style={{
                                      color: selectedHobbies.includes(interest)
                                        ? '#FCFCFC'
                                        : '#BEBEC0'
                                    }}
                                  >
                                    {interest}
                                  </p>
                                  <div className="intrest-add-icon-container">
                                    {selectedHobbies.includes(interest) ? (
                                      // Show "minus" icon if the interest is selected
                                      <img src={minus} alt="intrest-minus-icon" />
                                    ) : (
                                      // Show "add" icon if the interest is not selected
                                      <img src={add} alt="intrest-add-icon" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="setup-next-button-container">
                        <div className="setup-next-button">
                          {selectedHobbies.length >= 3 ? (
                            <img
                              src={checkedButton}
                              onClick={() => handleStep(4)}
                              className="setup-next-button"
                            />
                          ) : (
                            <img src={uncheckButton} className="setup-next-button" />
                          )}
                        </div>
                      </div>
                      <div
                        className="setup-next-button-container_left"
                        onClick={() => handleStep(2)}
                      >
                        <img src={leftSelect} className="setup-next-button" />
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="setup-body">
                      <div className="choose-avatar-body">
                        <div className="avatar-title-container">
                          <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>
                            Tell us about you
                          </p>
                        </div>
                      </div>
                      <div className="self-info-container">
                        <div className={isDarkMode ? 'self-info-body' : 'd-self-info-body'}>
                          <textarea
                            className={isDarkMode ? 'selt-info-input' : 'd-selt-info-input'}
                            placeholder="Type here..."
                            value={aboutyou}
                            onChange={handleAboutYouChange}
                            maxLength={MAX_CHARACTERS}
                          ></textarea>
                          <div className="characters-allow-container">
                            <p className={isDarkMode ? 'characters-allow' : 'd-characters-allow'}>
                              {' '}
                              {MAX_CHARACTERS - aboutyou.length} characters remaining
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="setup-next-button-container">
                        {aboutyou ? (
                          <img
                            src={checkedButton}
                            onClick={() => handleStep(5)}
                            className="setup-next-button"
                          />
                        ) : (
                          <img src={uncheckButton} className="setup-next-button" />
                        )}
                      </div>
                      <div
                        className="setup-next-button-container_left"
                        onClick={() => handleStep(3)}
                      >
                        <img src={leftSelect} className="setup-next-button" />
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <>
                      <div className="setup-body">
                        <div className="choose-avatar-body">
                          <div className="avatar-title-container">
                            <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>
                              Select your Language
                            </p>
                          </div>
                          <div className="intrest-title-container">
                            <p className={isDarkMode ? 'intrest-title' : 'd-intrest-title'}>
                              You can select max 3.
                            </p>
                          </div>
                        </div>
                        <div className="intrest-external-container">
                          {languageSelect.map((interestGroup, index) => (
                            <div key={index}>
                              {/* changed from flex to grid */}
                              <div className="global-intrest-container">
                                {interestGroup.map((interest) => (
                                  <div
                                    onClick={() => selectLanguage(interest)}
                                    key={interest}
                                    className={
                                      isDarkMode
                                        ? 'intrest-button-container'
                                        : 'd-intrest-button-container'
                                    }
                                    style={{
                                      background: selectlanguages.includes(interest)
                                        ? 'rgba(110, 68, 255, 0.2)'
                                        : '#201C2B',
                                      border: selectlanguages.includes(interest)
                                        ? '1px solid #6E44FF'
                                        : '1px solid #313036'
                                    }}
                                  >
                                    <p
                                      className={isDarkMode ? 'intrest-name' : 'd-intrest-name'}
                                      style={{
                                        color: selectlanguages.includes(interest)
                                          ? '#FCFCFC'
                                          : '#BEBEC0'
                                      }}
                                    >
                                      {interest}
                                    </p>
                                    <div className="intrest-add-icon-container">
                                      {selectlanguages.includes(interest) ? (
                                        // Show "minus" icon if the interest is selected
                                        <img src={minus} alt="intrest-minus-icon" />
                                      ) : (
                                        // Show "add" icon if the interest is not selected
                                        <img src={add} alt="intrest-add-icon" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="setup-next-button-container">
                          {selectlanguages.length >= 3 ? (
                            <img
                              src={checkedButton}
                              onClick={() => handleStep(6)}
                              className="setup-next-button"
                            />
                          ) : (
                            <img
                              src={uncheckButton}
                              className="setup-next-button"
                              alt="unchecked"
                            />
                          )}
                        </div>
                        <div
                          className="setup-next-button-container_left"
                          onClick={() => handleStep(4)}
                        >
                          <img src={leftSelect} className="setup-next-button" />
                        </div>
                      </div>
                      {/* <div className='setup-body'>
                                                <div className='choose-avatar-body'>
                                                    <div className='avatar-title-container'>
                                                        <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>Select your Language</p>
                                                    </div>
                                                    <div className='intrest-title-container'>
                                                        <p className={isDarkMode ? 'intrest-title' : 'd-intrest-title'}>Add upto 3 from the options</p>
                                                    </div>
                                                </div>

                                                <div className='intrest-external-container'>
                                                    {languageSelect.map((interestGroup, index) => (
                                                        <div key={index} >
                                                            <div className='global-lang-container2'>
                                                                {interestGroup.map((interest) => (
                                                                    <div onClick={() => selectLanguage(interest)} key={interest} className={isDarkMode ? 'intrest-button-container2' : 'd-intrest-button-container2'}
                                                                        style={{
                                                                            background: selectlanguages.includes(interest) ? 'rgba(110, 68, 255, 0.2)' : 'transparent',
                                                                        }}>
                                                                        <p className={isDarkMode ? 'intrest-name' : 'd-intrest-name'}>{interest}</p>
                                                                        <div className='intrest-add-icon-container'>
                                                                            {selectlanguages.includes(interest) ? (
                                                                                // Show "minus" icon if the interest is selected
                                                                                <img src={minus} alt='intrest-minus-icon' />
                                                                            ) : (
                                                                                // Show "add" icon if the interest is not selected
                                                                                <img src={add} alt='intrest-add-icon' />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className={isDarkMode ? 'add-other-btn-container' : 'd-add-other-btn-container'} onClick={openAddLanguage}>
                                                        <p className={isDarkMode ? 'add-other-btn' : 'd-add-other-btn'}>Add Other</p>
                                                    </div>
                                                </div>
                                                <div className='setup-next-button-container'>
                                                    {selectlanguages.length > 0 ? <img src={checkedButton} onClick={() => handleStep(6)} className='setup-next-button' /> : <img src={uncheckButton} className='setup-next-button' alt='unchecked' />}
                                                </div>
                                            </div> */}
                    </>
                  )}

                  {currentStep === 6 && (
                    <div className="setup-body">
                      <div className="choose-avatar-body">
                        <div className="avatar-title-container">
                          <p className={isDarkMode ? 'avatar-title' : 'd-avatar-title'}>
                            Select your Location
                          </p>
                        </div>

                        <div className="dropdown_location" onClick={openShowLocation}>
                          <img src={search} alt="search" />
                          <span className="dropdownText">
                            {selectedLocation || 'Search Your Location'}
                          </span>
                          <img src={downs} className="down" />
                        </div>
                        {showLocation && (
                          <div className="dropdown-content_location">
                            {loacationData.map((item) => (
                              <div
                                className="dropdown-text-container"
                                key={item.id}
                                onClick={() => selectLocation(item)}
                              >
                                <p className="dropdown-text">{item.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="lets-go-btn-container">
                        <button
                          onClick={updateAnonProfile}
                          className="lets-go-btn"
                          style={{ background: '#6E44FF' }}
                        >
                          Update Profile
                        </button>
                      </div>
                      <div
                        className="setup-next-button-container_left"
                        onClick={() => handleStep(5)}
                      >
                        <img src={leftSelect} className="setup-next-button" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {addLanguage && (
            <>
              <div className="setup-body">
                <div className="addmore-language-header">
                  <div className="addMore-titleContainer">
                    <p className={isDarkMode ? 'addMore-title' : 'd-addMore-title'}>
                      Add More Language
                    </p>
                  </div>
                </div>
                <div className="add-more-languages-dropdown">
                  <div className="dropdown_location" onClick={openShowLanguage}>
                    <img src={search} alt="search" />
                    <span className="dropdownText">
                      {selectedOptionLanguage || 'Search add langauges here...'}
                    </span>
                    <img src={downs} className="down" />
                  </div>
                  {showLanguages && (
                    <div className="dropdown-content">
                      {languageData.map((item) => (
                        <div
                          className="dropdown-text-container"
                          key={item.id}
                          onClick={() => selectLanguagesOption(item)}
                        >
                          <p className="dropdown-text">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="add-more-button-container">
                  <button
                    className={isDarkMode ? 'add-more-button-back' : 'd-add-more-button-back'}
                    onClick={closeAddLanguage}
                  >
                    Back
                  </button>
                  <button
                    className={isDarkMode ? 'add-more-button-done' : 'd-add-more-button-done'}
                    disabled={!isLangOptionSelected}
                    style={{ background: isLangOptionSelected ? '#6E44FF' : '#393644' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
