import React from 'react';
import './AllMessage.css';
import { formatTimeChat } from '../../utils/time';

const ChatMessageBox = ({ msg, type, time, imgSrc }) => {
  const containsLink = (text) => {
    const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;
    return linkRegex.test(text);
  };

  const convertLinksToHTML = (text) => {
    const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;
    return text.replace(linkRegex, (url) => {
      const shortenedUrl = url.length > 30 ? `${url.slice(0, 30)}...` : url;
      return `<a href="${url}" target="_blank" class="chat-link">${shortenedUrl}</a>`;
    });
  };

  if (type === 'left') {
    return (
      <li>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', marginBottom: '10px' }}>
          <div className="message-profile-container">
            {imgSrc && <img src={imgSrc} alt="image" className="chat-profile" />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <div className="message left">
              <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {containsLink(msg) ? (
                  <span dangerouslySetInnerHTML={{ __html: convertLinksToHTML(msg) }} />
                ) : (
                  msg
                )}
              </p>
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
          <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {containsLink(msg) ? (
              <span dangerouslySetInnerHTML={{ __html: convertLinksToHTML(msg) }} />
            ) : (
              msg
            )}
          </p>
        </div>
        {time && <p className="message-time-sender">{formatTimeChat(time)}</p>}
      </li>
    );
  }
};

export default ChatMessageBox;
