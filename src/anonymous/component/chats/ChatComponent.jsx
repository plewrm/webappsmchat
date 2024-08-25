import React, { useEffect, useState } from 'react';
import styles from './ChatComponent.module.css';
import { getDateForNoti } from '../../../utils/time';
import SpinbuzzMessage from '../../../modals/SpinbuzzMessage';
export default function ChatComponent({ content }) {
  return (
    <div className={styles.ChatComponent}>
      <div className={styles.left}>
        <img
          src={`https://socon-avatars.s3.ap-south-1.amazonaws.com/avatars/${content.avatar}.png`}
          alt="profile-pic"
        />
      </div>

      <div className={styles.centerColumn}>
        <div className={styles.center_01}>
          <div className={styles.nameContainer}>
            <p className={styles.name}>{content.username}</p>
          </div>
        </div>
        <div className={styles.downColumn}>
          <div className={styles.msgInfoContainer}>
            <p className={styles.Time}>{getDateForNoti(content.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
