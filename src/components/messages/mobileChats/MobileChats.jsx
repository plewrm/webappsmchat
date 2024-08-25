import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './mobileChats.css';
import leftArrow from '../../../assets/images/arrow-left.png';
import {
  setIsMobile,
  setMobileChats,
  setHideAllMsg
} from '../../../redux/slices/mobileActionSlices';

export default function MobileChats() {
  const { isMobile, mobileChats, hideAllMsg } = useSelector((state) => state.mobileActions);
  const dispatch = useDispatch();
  console.log(mobileChats);

  const backToMessages = () => {
    dispatch(setHideAllMsg(false));
    dispatch(setMobileChats(null));
  };

  return (
    <div className="mobile-chat-container">
      <div className="mobile-chat-inner-container">
        <div className="mobile-chat-header">
          <div className="mobile-chat-header-left">
            <img onClick={backToMessages} src={leftArrow} alt="back"></img>
            <img className="mobile-chat-profile" src={mobileChats.img} alt="profile-pic"></img>
            <p className="mobile-chat-name">{mobileChats.name}</p>
          </div>
          <div className="mobile-chat-header-right">
            <img src={leftArrow} alt="back"></img>
            <img src={leftArrow} alt="back"></img>
            <img src={leftArrow} alt="back"></img>
          </div>
        </div>
        <div className="mobile-chat-body mobile-chat-name">nothing yet</div>
        <div className="mobile-chat-footer">
          <div className="inner-chat-typer">
            <img src={leftArrow} alt="back"></img>
            <input className="mobile-chat-input" type="text" placeholder="Type here..."></input>
            <img src={leftArrow} alt="back"></img>
            <img src={leftArrow} alt="back"></img>
            <img src={leftArrow} alt="back"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
