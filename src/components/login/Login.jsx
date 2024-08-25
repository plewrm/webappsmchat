import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Login.css';
import socon from '../../assets/icons/socon.svg';
import { ethers } from 'ethers';
import {
  BASE_URL,
  CHECKUSERNAMEAVAILABILITY,
  LOGINORSIGNUP,
  GETPROFILE,
  BEARER_TOKEN
} from '../../api/EndPoint';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Client } from '@xmtp/xmtp-js';
import CryptoJS from 'crypto-js';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile, setXmtp, setPrivateKey } from '../../redux/slices/authSlice';
import { clearMessageDb } from '../../xmtp/models/db';
import AnimationSlides from './AnimationSlides';
import toast from 'react-hot-toast';
import BeforeLogin from './BeforeLogin';
import uncheckinput from '../../assets/icons/unchecked-input.svg';
import checkinput from '../../assets/icons/spinnbuzz-tick-circle.svg';
import infoCircle from '../../assets/icons/info-circle-login.svg';
import loginClose from '../../assets/icons/login_close.svg';
import { setHideBug } from '../../redux/slices/authSlice';
import DisplayError from '../../modals/DisplayError';

//web3auth
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings
} from '@web3auth/wallet-connect-v2-adapter';
import { WalletConnectModal } from '@walletconnect/modal';
import {
  clientId,
  walletConnectProjectId,
  chainConfig,
  useUiConfig,
  adapterSettings
} from '../../constants/web3auth';

const Login = () => {
  const dispatch = useDispatch();
  const uiConfig = useUiConfig();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [web3auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [firstTime, setFirstTime] = useState(false);
  const [reactivate, setReactivate] = useState(false);
  const anonymousView = useSelector((state) => state.anonView.anonymousView);
  const hideBug = useSelector((state) => state.auth.hideBug);
  const [displayError, setDisplayError] = useState(null);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameAvailable, setUserNameAvailable] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [loginLoader, setLoginLoader] = useState(false);
  const [animation, setAnimations] = useState(false);
  const [isHoveredApple, setIsHoveredApple] = useState(false);
  const inputRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHoveredApple(true);
  };

  const handleMouseLeave = () => {
    setIsHoveredApple(false);
  };

  const init = async (reactivateOption = false) => {
    try {
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig }
      });

      const web3auth = new Web3AuthNoModal({
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
        privateKeyProvider,
        uiConfig: uiConfig
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: adapterSettings,
        loginSettings: {
          mfaLevel: 'none'
        },
        privateKeyProvider
      });

      web3auth.configureAdapter(openloginAdapter);

      const defaultWcSettings = await getWalletConnectV2Settings(
        CHAIN_NAMESPACES.EIP155,
        ['0x1', '0xaa36a7'],
        walletConnectProjectId
      );
      const walletConnectModal = new WalletConnectModal({
        projectId: walletConnectProjectId
      });
      const walletConnectV2Adapter = new WalletConnectV2Adapter({
        adapterSettings: {
          qrcodeModal: walletConnectModal,
          ...defaultWcSettings.adapterSettings
        },
        loginSettings: { ...defaultWcSettings.loginSettings }
      });

      web3auth.configureAdapter(walletConnectV2Adapter);
      setWeb3Auth(web3auth);
      await web3auth.init();
      setProvider(web3auth.provider);
      if (web3auth.connected) {
        setLoggedIn(true);
      }

      if (web3auth) {
        const idToken = await web3auth.authenticateUser();
        const provider = web3auth.provider;
        const privateKey = await provider.request({
          method: 'eth_private_key'
        });
        const logInObj = {
          idToken: idToken.idToken,
          privateKey: privateKey
        };
        let response = '';
        if (reactivateOption) {
          logInObj.reactivate = true;
          response = await axios.post(`${BASE_URL}${LOGINORSIGNUP}`, logInObj);
        }
        response = await axios.post(`${BASE_URL}${LOGINORSIGNUP}`, logInObj);
        if (response.data.message === 'Successfull login') {
          const currentUserData = {
            token: response.data.token,
            soconId: response.data.user.soconId
          };
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('soconId', response.data.user.soconId);
          localStorage.setItem('firstLogin', response.data.user.firstlogin);
          saveEncryptedData('token', currentUserData.token);
          saveEncryptedData('soconId', currentUserData.soconId.toString());
          xmtpConnection(privateKey, currentUserData.soconId);
          if (response.data.user.firstlogin === false) {
            if (anonymousView) {
              navigate('/anon/homepage');
            } else {
              navigate('/homepage');
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message === 'Missing username.') {
        setFirstTime(true);
      } else if (error.response?.data?.message === 'Account was deleted.') {
        setReactivate(true);
      } else if (
        error.response?.data?.message ===
        'User is already onboarded using a different method of login with the same email.'
      ) {
        setDisplayError('log in again using different method');
      }
    }
  };

  useEffect(() => {
    init();
  }, [reactivate]); // Add reactivate as a dependency to rerun the effect when it changes

  const saveEncryptedData = (key, data) => {
    const secretKey = 'SOCON@2024'; // Replace with a strong secret key
    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    localStorage.setItem(key, encryptedData);
  };

  const loginWithGoogle = async () => {
    if (!web3auth) {
      return;
    }

    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'google'
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const loginWithApple = async () => {
    if (!web3auth) {
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'apple'
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const loginWithEmail = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: 'email_passwordless',
      extraLoginOptions: {
        login_hint: email
      }
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const validate = (name) => {
    const usernameRegex = /^[a-z0-9][a-z0-9_]*[^0]$/i;
    return usernameRegex.test(name);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get(`${BASE_URL}${CHECKUSERNAMEAVAILABILITY}${userName}`);
        console.log(response.data);
        if (response.data.available && validate(userName)) {
          setUserNameAvailable(true);
        } else {
          setUserNameAvailable(false);
        }
      } catch (err) {
        setUserNameAvailable(false);
        console.log(err);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [userName]);

  const checkuserName = async (e) => {
    setUserName(e.target.value);
    // try {
    //     const response = await axios.get(`${BASE_URL}${CHECKUSERNAMEAVAILABILITY}${e.target.value}`);
    //     console.log(response.data)
    //     if (response.data.available && validate(e.target.value)) {
    //         setUserNameAvailable(true)
    //     } else {
    //         setUserNameAvailable(false)
    //     }
    // const debounce = (func, delay) => {
    //     let timeoutId;
    //     return (...args) => {
    //         clearTimeout(timeoutId);
    //         timeoutId = setTimeout(() => {
    //             func.apply(null, args);
    //         }, delay);
    //     };
    // };
    // const debouncedFetchUsers = debounce(check, 2000);
    // debouncedFetchUsers(e.target.value);
  };

  const xmtpConnection = async (privateKey, soconId) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${BASE_URL}${GETPROFILE}/${soconId}`, {
        headers
      });
      // console.log(response.data.profile)
      dispatch(setUserProfile(response.data.profile));
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    //   clearMessageDb();
    const uesrWallet = new ethers.Wallet(privateKey);
    const xmtp = await Client.create(uesrWallet);
    dispatch(setXmtp(xmtp));
    dispatch(setPrivateKey(privateKey));
    localStorage.setItem('socon-privatekey', privateKey);
  };

  const home = async () => {
    if (!web3auth) {
      // uiConsole("web3auth not initialized yet");
      return;
    }
    // setLoginLoader(true)
    setAnimations(true);
    const user = await web3auth.getUserInfo();
    const idToken = await web3auth.authenticateUser();
    const provider = web3auth.provider;
    const privateKey = await provider.request({
      method: 'eth_private_key'
    });

    const logInObj = {
      idToken: idToken.idToken,
      privateKey: privateKey,
      username: userName
    };

    try {
      // console.log(logInObj);
      const response = await axios.post(`${BASE_URL}${LOGINORSIGNUP}`, logInObj);
      console.log('general response', response.data);
      if (response.status === 400) {
        setTimeout(() => {
          home();
        }, 20000);
      } else if (response.status === 201) {
        setLoginLoader(false);
        setTimeout(() => {
          home();
        }, 40000);
      } else if (response.status === 200) {
        setAnimations(false);
        if (response.data.message.includes('Successfull')) {
          const currentUserData = {
            token: response.data.token,
            soconId: response.data.user.soconId
          };
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('soconId', response.data.user.soconId);
          localStorage.setItem('firstLogin', true);
          saveEncryptedData('token', currentUserData.token);
          saveEncryptedData('soconId', currentUserData.soconId.toString());
          xmtpConnection(privateKey, currentUserData.soconId);
          navigate('/homepage');
        } else {
          toast.error('something went wrong, try after sometime');
        }
      }
    } catch (error) {
      if (
        error.message === 'Could not create signer.' ||
        error.message === 'Something went wrong with adding username proof.' ||
        error.message === 'Something went wrong with adding user data to hub.'
      ) {
        setTimeout(() => {
          home();
        }, 10000);
      } else {
        toast.error('something went wrong, try again!');
        logout();
        setLoggedIn(false);
        return;
      }
    }
  };

  const logout = async () => {
    if (!web3auth) {
      return;
    }
    await web3auth.logout();
    setLoggedIn(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(newEmail === '' || validateEmail(newEmail));
    // console.log(isEmailValid)
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [email]); // Ensure this runs whenever the email state changes

  const reactivateProfile = () => {
    init(true); // Pass true to indicate reactivation
  };

  const closeDisplayError = () => {
    logout();
    setDisplayError(null);
    setLoggedIn(false);
  };

  const LoginModal = () => (
    <div className={isDarkMode ? 'signInOuter' : 'd-signInOuter'}>
      <div className={isDarkMode ? 'signInBox' : 'd-signInBox'}>
        <div className="signInCenter">
          <div className="signSoconIconContainer">
            <img src="/icon/soconIcon.svg" className="signSoconIcon" alt="socon" />
          </div>

          <div className="signSecondRow">
            <div className="signInTittleContainer">
              <p className={isDarkMode ? 'signInTittle' : 'd-signInTittle'}>Sign In</p>
            </div>
            <div className="signInRocketIcon">
              <img src="/icon/rocket.svg" alt="rocket" className="signInRocket" />
            </div>
          </div>
          <div className="signInInfoContainer">
            <p className={isDarkMode ? 'signInInfo' : 'd-signInInfo'}>We're glad you are here!</p>
          </div>
        </div>

        <div className="signThirdRow">
          <div className="continuewithLabelContainer">
            <p className={isDarkMode ? 'continuewithLabel' : 'd-continuewithLabel'}>
              Continue with
            </p>
          </div>

          <div className={isDarkMode ? 'accountContainer' : 'd-accountContainer'}>
            <div
              className={isDarkMode ? 'googleAccountContainer' : 'd-googleAccountContainer'}
              onClick={loginWithGoogle}
            >
              <div className="googleInnerBox">
                <div className="googleIconContainer">
                  <img src="/icon/googleIcon.svg" className="googleIcon" />
                </div>
                <div className="googleTittleContainer">
                  <p className={isDarkMode ? 'googletittle' : 'd-googletittle'}>Google</p>
                </div>
              </div>
            </div>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={isDarkMode ? 'appleAccountContainer' : 'd-appleAccountContainer'}
              onClick={loginWithApple}
            >
              <div className="googleInnerBox">
                <div className="googleIconContainer">
                  <img
                    src={
                      isDarkMode
                        ? isHoveredApple
                          ? '/icon/apple.svg'
                          : '/icon/appleblack.svg'
                        : '/icon/apple.svg'
                    }
                    className="googleIcon"
                  />
                </div>
                <div className="googleTittleContainer">
                  <p className={isDarkMode ? 'googletittle' : 'd-googletittle'}>Apple</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="orOuter">
          <div className="OrContainer">
            <div className={isDarkMode ? 'orLine' : 'd-orLine'}></div>
            <p className={isDarkMode ? 'orText' : 'd-orText'}>or</p>
            <div className={isDarkMode ? 'orLine' : 'd-orLine'}></div>
          </div>
        </div>

        <div className="enterEmailContainer">
          <div className="emailLabelContainer">
            <p className={isDarkMode ? 'emailLabel' : 'd-emailLabel'}>Enter Your email</p>
          </div>
          <input
            type="email"
            ref={inputRef}
            value={email}
            onChange={handleEmailChange}
            className={isDarkMode ? 'emailInput' : 'd-emailInput'}
            placeholder="example@xyz.com"
          />
          <div className="errorTextBox">
            {!isEmailValid && (
              <div className="errorTextBox2">
                <img src="/icon/infoCircle.svg" />
                <p className={isDarkMode ? 'errorTexts' : 'd-errorTexts'}>
                  Please enter a valid email.
                </p>
              </div>
            )}
          </div>
          <button
            className={`${isDarkMode ? 'continueBtn' : 'd-continueBtn'} ${
              isEmailValid && email ? 'validEmail' : ''
            }`}
            disabled={!isEmailValid || email === ''}
            onClick={loginWithEmail}
          >
            Continue
          </button>
          <div className="termConditionContainer">
            <p className={isDarkMode ? 'termCondition' : 'd-termCondition'}>
              By continuing you agree to the{' '}
              <span className={isDarkMode ? 'term_condition' : 'd-term_condition'}>
                Terms & Conditions
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {loggedIn ? (
        <>
          {firstTime ? (
            <>
              {animation ? (
                <AnimationSlides />
              ) : (
                <div>
                  <div className={isDarkMode ? 'outer-login-box' : 'd-outer-login-box'}>
                    <div className={isDarkMode ? 'signIn-container' : 'd-signIn-container'}>
                      <div className="loginCloseContainer" onClick={logout}>
                        <img
                          src={
                            isDarkMode
                              ? '/lightIcon/closeModalLight.svg'
                              : '/darkIcon/closeModalDark.svg'
                          }
                          alt="close"
                          className="loginClose"
                        />
                      </div>
                      <div className="soconicon-container" onClick={toggleTheme}>
                        <img src={socon} alt="socon" className="soconicon" />
                      </div>
                      <div className="box2-outer">
                        <div className="box2-inner">
                          <div className="signin-container">
                            <p className={isDarkMode ? 'signin' : 'd-signin'}>One Step Closer</p>
                          </div>
                        </div>
                        <div className="login-contents-container">
                          <p className={isDarkMode ? 'login-contents' : 'd-login-contents'}>
                            Input Your Username to Sign In
                          </p>
                        </div>
                      </div>
                      <div className="loginstep-box">
                        <div className="email-labels-container">
                          <p className={isDarkMode ? 'email-labels' : 'd-email-labels'}>
                            Add your username
                          </p>
                        </div>
                        <div
                          className={
                            isDarkMode ? 'email-input-containers' : 'd-email-input-containers'
                          }
                          style={{ border: userNameAvailable ? '1px solid #25940F' : '' }}
                        >
                          <input
                            onChange={checkuserName}
                            value={userName}
                            className={isDarkMode ? 'email-inputs' : 'd-email-inputs'}
                            type="email"
                            placeholder="ex: zeus0-9"
                          />
                          <div className="checkIconContainer">
                            <img
                              src={userNameAvailable ? checkinput : uncheckinput}
                              alt="check"
                              className="checkIcon"
                            />
                          </div>
                        </div>

                        <div className="usernameAvailableContainer_info">
                          {userNameAvailable ? (
                            <>
                              <img
                                src={
                                  isDarkMode
                                    ? '/icon/infoCircleYellowLight.svg'
                                    : '/icon/infoCircleYellow.svg'
                                }
                                className="infoCircleIcon"
                                alt="info"
                              />
                              <span
                                className={
                                  isDarkMode ? 'usernameAvailable_info' : 'd-usernameAvailable_info'
                                }
                              >
                                You will not be able to change this later.
                              </span>
                            </>
                          ) : (
                            <>
                              {userName.length > 16 ? (
                                <>
                                  <img
                                    src="/icon/infoCircle.svg"
                                    className="infoCircleIcon"
                                    alt="info"
                                  />
                                  <span
                                    className={
                                      isDarkMode
                                        ? 'usernameAvailable_infoR'
                                        : 'd-usernameAvailable_infoR'
                                    }
                                  >
                                    Username should be under 16 characters.
                                  </span>
                                </>
                              ) : userName.toLowerCase().endsWith('0') ? (
                                <>
                                  <img
                                    src="/icon/infoCircle.svg"
                                    className="infoCircleIcon"
                                    alt="info"
                                  />
                                  <span
                                    className={
                                      isDarkMode
                                        ? 'usernameAvailable_infoR'
                                        : 'd-usernameAvailable_infoR'
                                    }
                                  >
                                    Username must not end with 0.
                                  </span>
                                </>
                              ) : (
                                /^[A-Z0-9]/.test(userName) && (
                                  <>
                                    <img
                                      src="/icon/infoCircle.svg"
                                      className="infoCircleIcon"
                                      alt="info"
                                    />
                                    <span
                                      className={
                                        isDarkMode
                                          ? 'usernameAvailable_infoR'
                                          : 'd-usernameAvailable_infoR'
                                      }
                                    >
                                      Username should begin with a-z or 0-9.
                                    </span>
                                  </>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="login-step-outer-container">
                        <div className="login-step-info-container">
                          <p className={isDarkMode ? 'login-step-info' : 'd-login-step-info'}>
                            {' '}
                            &#9679; Username shall begins with a-z or 0-9
                          </p>
                        </div>
                        <div className="login-step-info-container">
                          <p className={isDarkMode ? 'login-step-info' : 'd-login-step-info'}>
                            {' '}
                            &#9679; Username can contain a-z or 0-9 or '-' (hyphen)
                          </p>
                        </div>
                        <div className="login-step-info-container">
                          <p className={isDarkMode ? 'login-step-info' : 'd-login-step-info'}>
                            {' '}
                            &#9679; Username must not end with a zero(0)
                          </p>
                        </div>
                        <div className="login-step-info-container">
                          <p className={isDarkMode ? 'login-step-info' : 'd-login-step-info'}>
                            {' '}
                            &#9679; Username must not contain more than 16 characters
                          </p>
                        </div>
                      </div>
                      {loginLoader ? (
                        <button className={isDarkMode ? 'letsGoButton' : 'd-letsGoButton'}>
                          Wait, Getting Ready
                        </button>
                      ) : (
                        <>
                          {userNameAvailable ? (
                            <button
                              onClick={home}
                              className={isDarkMode ? 'letsGoButton' : 'd-letsGoButton'}
                              style={{
                                background: '#6E44FF',
                                color: '#FCFCFC'
                              }}
                            >
                              Let's Go
                            </button>
                          ) : (
                            <button
                              className={isDarkMode ? 'letsGoButton' : 'd-letsGoButton'}
                              style={{
                                background: isDarkMode ? '#C5C2D1' : '#393644',
                                cursor: 'no-drop'
                              }}
                            >
                              Let's Go
                            </button>
                          )}
                        </>
                      )}
                      {/* <button onClick={logout}>cancle</button> */}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="outer-login-box">
              {reactivate && (
                <div className={isDarkMode ? 'displayError' : 'd-displayError'}>
                  <div className={isDarkMode ? 'innerDisplayError' : 'd-innerDisplayError'}>
                    <div className={isDarkMode ? 'errorText' : 'd-errorText'}>
                      You want to reactivate you account
                    </div>
                    <div>
                      <div className="reactivateButtons">
                        <button
                          className={isDarkMode ? 'reactivateY' : 'd-reactivateY'}
                          onClick={() => reactivateProfile()}
                        >
                          Yes
                        </button>
                        <button
                          className={isDarkMode ? 'reactivateN' : 'd-reactivateN'}
                          onClick={() => {
                            logout();
                            setReactivate(false);
                            setLoggedIn(false);
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {!showLoginScreen ? (
            <BeforeLogin setShowLoginScreen={setShowLoginScreen} />
          ) : (
            <LoginModal />
          )}
        </>
      )}
      <>
        {displayError && (
          <DisplayError close={() => closeDisplayError()} errorText={displayError} />
        )}
      </>
    </div>
  );
};

export default Login;
