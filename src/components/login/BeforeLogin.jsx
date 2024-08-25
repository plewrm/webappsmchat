import './ProfileSetup.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import checkinput from '../../assets/icons/spinnbuzz-tick-circle.svg';
import socon from '../../assets/icons/socon.svg';

const BeforeLogin = ({ setShowLoginScreen }) => {
  const [showButton, setShowButton] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHoveredApple, setIsHoveredApple] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleMouseEnter = () => {
    setIsHoveredApple(true);
  };

  const handleMouseLeave = () => {
    setIsHoveredApple(false);
  };

  function sleep(ms) {
    return new Promise((resolve) =>
      setTimeout(() => {
        setShowButton(true);
        setShowIcon(false);
      }, ms)
    );
  }

  useEffect(() => {
    const waitBeforeShow = async () => {
      await sleep(2000);
      setShowButton(true);
      setShowIcon(false);
    };
    waitBeforeShow();
  }, []);

  const handleStep = (stepIndex) => {
    // Function to handle the setup process change
    setCurrentStep(stepIndex);
  };

  const handleGetStarted = () => {
    setShowLoginScreen(true);
  };

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(newEmail === '' || validateEmail(newEmail));
  };

  // const validateEmail = (email) => {
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     return emailRegex.test(email);
  // };

  const [activeIndex, setActiveIndex] = useState(-1);
  const [zoom, setZoom] = useState(false);
  const imageCount = 5; // Number of images

  useEffect(() => {
    let currentIndex = 0;
    const animationDuration = 200; // Duration of each move up animation in ms
    const intervalId = setInterval(() => {
      setActiveIndex(currentIndex);
      if (currentIndex === imageCount - 1) {
        // Wait until the last move down animation completes before zooming
        setTimeout(() => setZoom(true), animationDuration);
        clearInterval(intervalId);
      }
      currentIndex = (currentIndex + 1) % imageCount;
    }, animationDuration);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
  return (
    <div>
      {showIcon && (
        <div className={isDarkMode ? 'soconBox' : 'd-soconBox'}>
          <div className="soconIconContainer">
            <div className={`soconNameContainer ${zoom ? 'zoom' : ''}`}>
              {['S', 'O', 'C', 'O', 'N'].map((letter, index) => (
                <div
                  key={index}
                  className={`alphabetImgContainer ${activeIndex === index ? 'moveUp' : ''}`}
                >
                  <img
                    src={`/Images/${letter}.svg`}
                    className="alphabetImg"
                    alt={`letter ${letter}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* <div className={isDarkMode ? 'signInOuter' : 'd-signInOuter'}>
                <div className={isDarkMode ? 'signInBox' : 'd-signInBox'}>
                    <div className='signInCenter'>
                        <div className='signSoconIconContainer' onClick={toggleTheme}>
                            <img src='/icon/soconIcon.svg' className='signSoconIcon' alt='socon' />
                        </div>

                        <div className='signSecondRow'>
                            <div className='signInTittleContainer'>
                                <p className={isDarkMode ? 'signInTittle' : 'd-signInTittle'}>Sign In</p>
                            </div>
                            <div className='signInRocketIcon'>
                                <img src='/icon/rocket.svg' alt='rocket' className='signInRocket' />
                            </div>
                        </div>
                        <div className='signInInfoContainer'>
                            <p className={isDarkMode ? 'signInInfo' : 'd-signInInfo'}>We're glad you are here!</p>
                        </div>
                    </div>

                    <div className='signThirdRow'>
                        <div className='continuewithLabelContainer'>
                            <p className={isDarkMode ? 'continuewithLabel' : 'd-continuewithLabel'}>Continue with</p>
                        </div>

                        <div className={isDarkMode ? 'accountContainer' : 'd-accountContainer'}>
                            <div className={isDarkMode ? 'googleAccountContainer' : 'd-googleAccountContainer'}>
                                <div className='googleInnerBox'>
                                    <div className='googleIconContainer'>
                                        <img src='/icon/googleIcon.svg' className='googleIcon' />
                                    </div>
                                    <div className='googleTittleContainer'>
                                        <p className={isDarkMode ? 'googletittle' : 'd-googletittle'}>Google</p>
                                    </div>
                                </div>
                            </div>
                            <div className={isDarkMode ? 'appleAccountContainer' : 'd-appleAccountContainer'}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                <div className='googleInnerBox'>
                                    <div className='googleIconContainer'>
                                        <img src={isDarkMode ? (isHoveredApple ? '/icon/apple.svg' : '/icon/appleblack.svg') : '/icon/apple.svg'} className='googleIcon' />
                                    </div>
                                    <div className='googleTittleContainer'>
                                        <p className={isDarkMode ? 'googletittle' : 'd-googletittle'}>Apple</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='orOuter'>
                        <div className='OrContainer'>
                            <div className={isDarkMode ? 'orLine' : 'd-orLine'}></div>
                            <p className={isDarkMode ? 'orText' : 'd-orText'}>or</p>
                            <div className={isDarkMode ? 'orLine' : 'd-orLine'}></div>
                        </div>
                    </div>

                    <div className='enterEmailContainer'>
                        <div className='emailLabelContainer'>
                            <p className={isDarkMode ? 'emailLabel' : 'd-emailLabel'}>Enter Your email</p>
                        </div>
                        <input
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            className={isDarkMode ? 'emailInput' : 'd-emailInput'}
                            placeholder='example@xyz.com'
                        />

                        <div className='errorTextBox'>
                            {!isEmailValid && <div className='errorTextBox2'>
                                <img src='/icon/infoCircle.svg' />
                                <p className={isDarkMode ? 'errorTexts' : 'd-errorTexts'}>Please enter a valid email.</p>
                            </div>}
                        </div>
                        <button
                            className={`${isDarkMode ? 'continueBtn' : 'd-continueBtn'} ${isEmailValid && email ? 'validEmail' : ''}`}
                            disabled={!isEmailValid || email === ''}
                        >Continue</button>
                    </div>
                </div>
            </div> */}

      {showButton && (
        <>
          {/* {currentStep === 0 && (
                        <div className='stepContainer'>
                            <div className='stepImgContainer'>
                                <img src='/ob2.png' alt='onboard' className='stepImg' />
                            </div>
                            {!isScreenLarge ? <>
                                <div className='onBoardStepBox'>
                                    <div className='onBoardStepActive'></div>
                                    <div className='onBoardStep' onClick={() => handleStep(1)}></div>
                                    <div className='onBoardStep' onClick={() => handleStep(2)}></div>
                                </div>

                                <div className={isDarkMode ? 'stepBox' : 'd-stepBox'}>
                                    <div className='stepTextContainer'>
                                        <p className={isDarkMode ? 'stepText' : 'd-stepText'}>Take the first step into your SOCON social world.</p>
                                    </div>
                                    <div className='yahooButtonContainer' onClick={() => handleStep(1)}>
                                        <img src='/click-vector.svg' alt='check' className='yahooButton' />
                                    </div>
                                </div>
                            </> :
                                <>
                                    <div className={isDarkMode ? 'box_mobile' : 'd-box_mobile'} >
                                        <div className='onBoardStepBox_mobile'>
                                            <div className='onBoardStepActive_mobile' ></div>
                                            <div className='onBoardStep_mobile' onClick={() => handleStep(1)}></div>
                                            <div className='onBoardStep_mobile' onClick={() => handleStep(2)}></div>
                                        </div>
                                        <div className='stepTextContainer_mobile'>
                                            <p className={isDarkMode ? 'stepText_mobile' : 'd-stepText_mobile'}>Navigate your social journey with enhanced privacy.</p>
                                        </div>
                                        <div className='yahooButtonContainer_mobile' onClick={() => handleStep(1)}>
                                            <img src='/click-vector.svg' alt='check' className='yahooButton_mobile' />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className='stepContainer'>
                            <div className='stepImgContainer'>
                                <img src='/ob3.png' alt='onboard' className={'stepImg'} />
                            </div>
                            {!isScreenLarge ?

                                <>
                                    <div className='onBoardStepBox'>
                                        <div className='onBoardStep' onClick={() => handleStep(0)}></div>
                                        <div className='onBoardStepActive' ></div>
                                        <div className='onBoardStep' onClick={() => handleStep(2)}></div>
                                    </div>

                                    <div className={isDarkMode ? 'stepBox' : 'd-stepBox'}>
                                        <div className={'stepTextContainer'}>
                                            <p className={isDarkMode ? 'stepText' : 'd-stepText'}>Empowerment through community-driven governance and decentralised ecosystem.</p>
                                        </div>
                                        <div className={'yahooButtonContainer'} onClick={() => handleStep(2)}>
                                            <img src='/click-vector.svg' alt='check' className={'yahooButton'} />
                                        </div>
                                    </div>
                                </> :
                                <>
                                    <div className={isDarkMode ? 'box_mobile' : 'd-box_mobile'}>
                                        <div className={'onBoardStepBox_mobile'}>
                                            <div className={'onBoardStep_mobile'} onClick={() => handleStep(0)}></div>
                                            <div className={'onBoardStepActive_mobile'}></div>
                                            <div className={'onBoardStep_mobile'} onClick={() => handleStep(2)}></div>
                                        </div>
                                        <div className={'stepTextContainer_mobile'}>
                                            <p className={isDarkMode ? 'stepText_mobile' : 'd-stepText_mobile'}>Empowerment through community-driven governance and decentralised ecosystem.</p>
                                        </div>
                                        <div className={'yahooButtonContainer_mobile'} onClick={() => handleStep(2)}>
                                            <img src='/click-vector.svg' alt='check' className={'yahooButton_mobile'} />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    )} */}

          {currentStep === 0 && (
            <div className={'stepContainer'}>
              <div className={'stepImgContainer'}>
                <img src="/ob1.png" alt="onboard" className={'stepImg'} />
              </div>
              {!isMobileView ? (
                <>
                  <div className={'onBoardStepBox'}>
                    <div className={'onBoardStepActive'}></div>
                  </div>

                  <div className={isDarkMode ? 'stepBox' : 'd-stepBox'}>
                    <div className={'stepTextContainer'}>
                      <p className={isDarkMode ? 'stepText' : 'd-stepText'}>
                        Take the first step into your SOCON social world.
                      </p>
                    </div>
                    <div className={'stepTextContainers'}>
                      <p className={isDarkMode ? 'stepTexts' : 'd-stepTexts'}>
                        Create your SOCON Account. Connect, Engage, and Innovate in a decentralized
                        ecosystem.
                      </p>
                    </div>
                    <button className={'gettingStartedButton'} onClick={handleGetStarted}>
                      Get Started
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={isDarkMode ? 'box_mobile' : 'd-box_mobile'}>
                    <div className={'onBoardStepBox_mobile'}>
                      <div className={'onBoardStepActive_mobile'}></div>
                    </div>
                    <div className={'stepTextContainer_mobile'}>
                      <p className={isDarkMode ? 'stepText_mobile' : 'd-stepText_mobile'}>
                        Take control and reclaim ownership of your digital experience.
                      </p>
                    </div>
                    <div className={'getStartedContainer_mobile'} onClick={handleGetStarted}>
                      <button className={'getStarted_mobile'}>Get Started</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BeforeLogin;
