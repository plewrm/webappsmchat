import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAnonymousExpanded } from '../../../redux/slices/chatSlice';
import Chat from './Chat';

const MessageExpanded = () => {
  const dispatch = useDispatch();
  const anonymousExpanded = useSelector((state) => state.chat.anonymousExpanded);
  return (
    <div>
      <div className={'d-msg-bottom-toggle'}>
        <div className={`${'d-msg-toggle-container'} ${anonymousExpanded ? 'toggleExpanded' : ''}`}>
          <div onClick={() => dispatch(setAnonymousExpanded())} className={'d-msg-toggle'}>
            <div className="toggle-chatsContainer">
              <p className={'d-toggle-Chats'}>Chats</p>
            </div>
            <div className="toggle-ImgContainer">
              <img
                src={
                  anonymousExpanded ? '/darkIcon/arrowDownDark.svg' : '/darkIcon/arrowUpDark.svg'
                }
                alt="down"
                className="toggle-Img"
              />
            </div>
          </div>
          <div className="msg-toggle-content">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageExpanded;
