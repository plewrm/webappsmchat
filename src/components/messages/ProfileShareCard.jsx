import React from 'react';
import './ProfileShareCard.css';

const ProfileShareCard = ({ profileDetails, fields, profileLink, type, imgSrc }) => {
  const { username, displayName, followers, following, bio, url } = profileDetails;

  const profileCard = (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-info">
          <h3 className="display-name">{displayName}</h3>
          <p className="username">@{username}</p>
        </div>
      </div>
      <div className="profile-stats">
        <span className="followers">Followers: {followers}</span>
        <span className="following">Following: {following}</span>
      </div>
      <div className="profile-bio">
        <p>{bio}</p>
      </div>
      {url && (
        <p className="profile-url">
          <a href={url} target="_blank" className="profile-link" rel="noreferrer">
            {url}
          </a>
        </p>
      )}
    </div>
  );

  return (
    <li className={type === 'right' ? 'end2' : ''}>
      {profileLink ? (
        <a href={profileLink} target="_blank" className="profile-link-container" rel="noreferrer">
          {profileCard}
        </a>
      ) : (
        profileCard
      )}
    </li>
  );
};

export default ProfileShareCard;
