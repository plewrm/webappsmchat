import React, { useEffect, useState } from 'react';
import styles from './ProfileSetup.module.css';
import gif1 from '../../assets/gifs/ani-1.gif';
import gif2 from '../../assets/gifs/ani-2.gif';
import gif3 from '../../assets/gifs/ani-3.gif';
import gif4 from '../../assets/gifs/ani-4.gif';
import gif5 from '../../assets/gifs/ani-5.gif';
import lock from '../../assets/gifs/lock.svg';

import { useTheme } from '../../context/ThemeContext';

export default function AnimationSlides() {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [intervalDuration, setIntervalDuration] = useState(18000);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < 4) return prevStep + 1;
        clearInterval(animationInterval);
        return prevStep;
      });
    }, intervalDuration);
    return () => clearInterval(animationInterval);
  }, [intervalDuration]);

  return (
    <div className={isDarkMode ? styles.soconBox : styles['d-soconBox']}>
      <div className={isDarkMode ? styles.animationContainer : styles['d-animationContainer']}>
        <div className={styles.processbar}>
          {[0, 1, 2, 3, 4].map((stepIndex) => (
            <div
              key={stepIndex}
              className={`${styles.progressStep} ${stepIndex < currentStep + 1 ? styles.complete : ''} ${stepIndex === currentStep ? styles.active : ''}`}
            ></div>
          ))}
        </div>
        <div className={styles.animationHeader}>
          <p>Hold tight until we pave the way for your entry into SOCON.</p>
        </div>
        <div className={styles.animationSteps}>
          {currentStep === 0 && (
            <div className={styles.animationCard}>
              <div className={styles.gifs}>
                <img src="/Images/firstAnimation.gif" alt="ani-1" />
                <img src="/Images/animationUser.svg" className={styles.animationProfile} />
              </div>
              <div className={styles.gifsText}>
                <p>Crafting Your Blockchain Identity</p>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div className={styles.animationCard}>
              <div className={styles.gifs}>
                <img src="/Images/secondAnimation.gif" alt="ani-2"></img>
              </div>
              <div className={styles.gifsText}>
                <p>Tuning into the Hub</p>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className={styles.animationCard}>
              <div className={styles.gifs}>
                <img src="/Images/thirdAnimation.gif" alt="ani-3"></img>
              </div>
              <div className={styles.gifsText}>
                <p>Securing Your Name in the Starts</p>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className={styles.animationCard}>
              <div className={styles.gifs} style={{ position: 'relative' }}>
                <img
                  style={{ position: 'absolute', width: '14vw', top: '-80%' }}
                  src={lock}
                  alt="lock-img"
                ></img>
                <div className={styles.gifs}>
                  <img src={gif4} alt="ani-4" />
                </div>
              </div>
              <div className={styles.gifsText}>
                <p>Conjuring Your Signer</p>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className={styles.animationCard}>
              <div className={styles.gifs}>
                <img src="/Images/fifthAnimation.gif" alt="ani-5"></img>
              </div>
              <div className={styles.gifsText}>
                <p>Final Touches</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
