import React from 'react';
import './AllMessage.css';
import { formatTimeChat } from '../../utils/time';
import './PostShareCard.css';

const PostShareCard = ({ postDetails, type, time, imgSrc }) => {
  if (type === 'left') {
    return (
      <li>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', marginBottom: '10px' }}>
          <div className="message-profile-container">
            {imgSrc && <img src={imgSrc} alt="image" className="chat-profile" />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <div className="message left">
              {postDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {postDetails?.username && (
                    <div className="postCardUsernameContainer">
                      <p className="postCardUsername">{'@' + postDetails.username}</p>
                    </div>
                  )}
                  {postDetails.image && (
                    <div
                      className="postImageCardContainer"
                      style={{ width: '100%', maxWidth: '250px', height: 'auto' }}
                    >
                      <img
                        src={postDetails.image}
                        className="postImageCard"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                  <div className="postCardCaptionContainer">
                    <p
                      className="postCardCaption"
                      style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                    >
                      {postDetails.caption && postDetails.caption}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#FCFCFC' }}>Post not found</p>
              )}
            </div>
            {time && <span className="message-time">{formatTimeChat(time)}</span>}
          </div>
        </div>
      </li>
    );
  } else if (type === 'right') {
    return (
      <li className="end2">
        <div className="message right">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {postDetails?.username && (
              <div className="postImageCardContainer">
                <p className="postCardUsername">{'@' + postDetails.username}</p>
              </div>
            )}
            {postDetails.image && (
              <div
                className="postImageCardContainer"
                style={{ width: '100%', maxWidth: '250px', height: 'auto' }}
              >
                <img
                  src={postDetails.image}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}
            <div className="postCardCaptionContainer">
              <p
                className="postCardCaption"
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              >
                {postDetails.caption && postDetails.caption}
              </p>
            </div>
          </div>
        </div>
        {time && <p className="message-time-sender">{formatTimeChat(time)}</p>}
      </li>
    );
  }
};

export default PostShareCard;
