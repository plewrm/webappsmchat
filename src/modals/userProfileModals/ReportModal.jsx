import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { setShowReportModal, setShowReportUserModal } from '../../redux/slices/modalSlice';
import { reportData } from '../../data/DummyData';
import { useParams } from 'react-router-dom';
import { BEARER_TOKEN, REPORTUSERBYID, BASE_URL, REPORTPOSTBYUSERID } from '../../api/EndPoint';

const ReportModal = ({ postHash, soconPostId, soconId: propSoconId }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [otherConcern, setOtherConcern] = useState('');
  const { soconId: paramsSoconId } = useParams();
  const soconId = propSoconId || paramsSoconId;

  const handleCloseReportModal = () => {
    dispatch(setShowReportModal(false));
    dispatch(setShowReportUserModal(false));
  };

  const handleOptionClick = (id) => {
    setSelectedOption(id === selectedOption ? null : id);
    setSelectedSubOption(null);
  };

  const handleSubOptionClick = (id) => {
    setSelectedSubOption(id);
  };

  const selectedOptionText = selectedOption
    ? reportData.find((item) => item.id === selectedOption).reportOption
    : '';

  const handleShowSubmitMessage = () => {
    setShowSubmitMessage(true);
  };

  const handleCloseSubmitMessage = () => {
    setShowSubmitMessage(false);
  };

  const reportUserPosts = async (soconPostId, reason, description, postHash) => {
    if (!soconPostId) {
      console.error('Post details are missing or invalid');
      return;
    }

    try {
      const token = BEARER_TOKEN || sessionStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      const body = JSON.stringify({
        reason,
        description
      });

      const response = await fetch(`${BASE_URL}${REPORTPOSTBYUSERID}/${soconPostId}/${postHash}`, {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Reported post data:', data);
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  const reportUserAccount = async (soconId, reason, description) => {
    if (!soconId) {
      console.error('User details are missing or invalid');
      return;
    }

    try {
      const token = BEARER_TOKEN || sessionStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      const body = JSON.stringify({
        reason,
        description
      });

      const response = await fetch(`${BASE_URL}${REPORTUSERBYID}${soconId}`, {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Reported user data:', data);
    } catch (error) {
      console.error('Error reporting user:', error);
    }
  };

  const handleSubmit = async () => {
    if (selectedOption) {
      const selectedOptionData = reportData.find((item) => item.id === selectedOption);
      let description = '';

      if (selectedOption === 7) {
        if (otherConcern.trim() === '') {
          alert('Please provide a description for "Other"');
          return;
        }
        description = otherConcern;
      } else {
        const selectedSubOptionData = selectedOptionData.reportSubOption.find(
          (subItem) => subItem.id === selectedSubOption
        );
        if (!selectedSubOptionData) {
          alert('Please select a detailed reason');
          return;
        }
        description = selectedSubOptionData.detailReportOption;
      }

      try {
        if (postHash) {
          await reportUserPosts(
            soconPostId,
            selectedOptionData.reportOption,
            description,
            postHash
          );
        } else {
          await reportUserAccount(soconId, selectedOptionData.reportOption, description);
        }
        handleShowSubmitMessage();
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    }
  };

  return (
    <div
      className={isDarkMode ? 'reportOvelay' : 'd-reportOvelay'}
      onClick={handleCloseReportModal}
    >
      <div
        className={isDarkMode ? 'reportModalContainer' : 'd-reportModalContainer'}
        onClick={(e) => e.stopPropagation()}
      >
        {!showSubmitMessage && (
          <>
            {!selectedOption && (
              <>
                <div className="reportHeader">
                  <div className="reportTittleContainer">
                    <p className={isDarkMode ? 'reportTittleText' : 'd-reportTittleText'}>
                      Tell us why you want to report this Profile
                    </p>
                  </div>

                  <div className="reportCloseIcon" onClick={handleCloseReportModal}>
                    <img
                      src={
                        isDarkMode
                          ? '/lightIcon/closeModalLight.svg'
                          : '/darkIcon/closeModalDark.svg'
                      }
                      className="reportCloseImg"
                      alt="close"
                    />
                  </div>
                </div>

                <div className="reportTittleContainer">
                  <p className={isDarkMode ? 'reportTittleText2' : 'd-reportTittleText2'}>
                    Your feedback will help us improve your experience
                  </p>
                </div>

                <div className="reportContentsContainer">
                  {reportData.map((item) => (
                    <div
                      key={item.id}
                      className="reportContents"
                      onClick={() => handleOptionClick(item.id)}
                    >
                      <div className="reportPointsContainer">
                        <p className={isDarkMode ? 'reportPoint' : 'd-reportPoint'}>
                          {item.reportOption}
                        </p>
                      </div>

                      <div className="reportArrow">
                        <img
                          src={
                            isDarkMode
                              ? '/darkIcon/ReportArrowLight.svg'
                              : '/darkIcon/ReportArrowDark.svg'
                          }
                          className="reportArrowImg"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    className={isDarkMode ? 'reportBackButton' : 'd-reportBackButton'}
                    onClick={handleCloseReportModal}
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {selectedOption && (
              <>
                <div className="reportHeader">
                  <div className="reportTittleContainer">
                    <p className={isDarkMode ? 'reportTittleText' : 'd-reportTittleText'}>
                      Tell us your concern in detail
                      {/* Tell us how is this {selectedOptionText} */}
                    </p>
                  </div>
                  <div className="reportCloseIcon" onClick={handleCloseReportModal}>
                    <img
                      src={
                        isDarkMode
                          ? '/lightIcon/closeModalLight.svg'
                          : '/darkIcon/closeModalDark.svg'
                      }
                      className="reportCloseImg"
                      alt="close"
                    />
                  </div>
                </div>

                <div className="reportContentsContainer">
                  {selectedOption === 7 ? (
                    <div className="reportContentsContainer">
                      <textarea
                        value={otherConcern}
                        onChange={(e) => setOtherConcern(e.target.value)}
                        className={isDarkMode ? inputBox : ['d-inputBox']}
                        placeholder="Type here.."
                      ></textarea>
                      <div className="reportActionButton">
                        <button
                          className={isDarkMode ? 'reportBackButton' : 'd-reportBackButton'}
                          onClick={() => {
                            setSelectedOption(null);
                            setOtherConcern('');
                          }}
                          style={{ width: '100%', marginTop: '0' }}
                        >
                          Back
                        </button>
                        {otherConcern.trim() ? (
                          <button className="reportSubmitButtonActive" onClick={handleSubmit}>
                            Submit
                          </button>
                        ) : (
                          <button
                            className={isDarkMode ? 'reportSubmitButton' : 'd-reportSubmitButton'}
                            disabled
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="reportContentsContainer">
                      {reportData
                        .find((item) => item.id === selectedOption)
                        .reportSubOption.map((subItem) => (
                          <div
                            key={subItem.id}
                            className="reportContents"
                            onClick={() => handleSubOptionClick(subItem.id)}
                          >
                            <div className="reportPointsContainer">
                              <p className={isDarkMode ? 'reportPoint' : 'd-reportPoint'}>
                                {subItem.detailReportOption}
                              </p>
                            </div>
                            <div className="reportArrow">
                              <img
                                src={
                                  isDarkMode
                                    ? selectedSubOption === subItem.id
                                      ? '/darkIcon/clickCircleLight.svg'
                                      : '/darkIcon/unclickCircleLight.svg'
                                    : selectedSubOption === subItem.id
                                      ? '/darkIcon/clickCircleDark.svg'
                                      : '/darkIcon/unclickCircleDark.svg'
                                }
                                className="reportArrowImg"
                                alt="circle"
                              />
                            </div>
                          </div>
                        ))}
                      <div className="reportActionButton">
                        <button
                          className={isDarkMode ? 'reportBackButton' : 'd-reportBackButton'}
                          onClick={() => {
                            setSelectedOption(null);
                            setSelectedSubOption(null);
                          }}
                          style={{ width: '100%', marginTop: '0' }}
                        >
                          Back
                        </button>
                        {selectedSubOption ? (
                          <button className="reportSubmitButtonActive" onClick={handleSubmit}>
                            Submit
                          </button>
                        ) : (
                          <button
                            className={isDarkMode ? 'reportSubmitButton' : 'd-reportSubmitButton'}
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {showSubmitMessage && (
          <>
            <div className="submittedCardHeader">
              <div className="reportVerifiedIcon">
                <img src="/icon/Verified.svg" className="reportVerifiedImg" />
              </div>
              <div className="reportSubmiTittleContainer">
                <p className={isDarkMode ? 'reportSubmiTittle' : 'd-reportSubmiTittle'}>
                  Thank you for your report!
                </p>
              </div>
              <div
                className="reportCloseIcon"
                style={{ marginLeft: 'auto' }}
                onClick={handleCloseReportModal}
              >
                <img
                  src={
                    isDarkMode ? '/lightIcon/closeModalLight.svg' : '/darkIcon/closeModalDark.svg'
                  }
                  className="reportCloseImg"
                  alt="close"
                />
              </div>
            </div>

            <div className="submittedContentContainer">
              <p className={isDarkMode ? 'submittedContent' : 'd-submittedContent'}>
                If you need further assistance, please visit our{' '}
                <span style={{ color: '#8360FF', cursor: 'pointer' }}>Help Center</span>
                For additional support, contact us{' '}
                <span style={{ color: '#8360FF', cursor: 'pointer' }}>Support Page</span>
              </p>
            </div>
            <div className="submittedContentContainer">
              <p className={isDarkMode ? 'submittedContent' : 'd-submittedContent'}>
                Thank you for helping us keep our community safe. Learn more about our{' '}
                <span style={{ color: '#8360FF', cursor: 'pointer' }}>Community Guidelines</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
