import React, { useState, useEffect, useRef } from 'react';
import styles from './call.module.css';
import { useTheme } from '../../context/ThemeContext';
import { setVideoCall } from '../../redux/slices/phoneCallSlice';
import { CALLACCESSTOKEN, BASE_URL, BEARER_TOKEN } from '../../api/EndPoint';
import axios from 'axios';
import { HuddleClient, HuddleProvider } from '@huddle01/react';
import { Audio, Video } from '@huddle01/react/components';
import getRoomId from './getRoomId';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress } from '../../redux/slices/WalletSlice';
import { clientSlice } from '../../redux/slices/ClientSlice';
import { useLocalAudio, usePeerIds, useRoom, useLocalVideo } from '@huddle01/react/hooks';
import { ConversationV2 } from '@xmtp/xmtp-js';
import { useParams } from 'react-router-dom';
import {
  ContentTypeVideoCallCodec,
  ContentTypeVideoCall
} from '../../components/calling/types/xmtp-content-type-video-call';
import { useEventListener } from '@huddle01/iframe';
import Button from '../calling/vaComponents/Button';
import RemotePeer from './RemotePeer';

const VideoCall = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const closeVideoCall = () => {
    dispatch(setVideoCall(false));
  };
  const videoRef = useRef(null);

  const [authToken, setAuthToken] = useState([]);
  const address = useSelector((state) => state.wallet.address);
  const client = useSelector((state) => state.client.client);
  const { peerIds } = usePeerIds();
  const [conversation, setConversation] = useState(ConversationV2 | null);
  const { peerAddress, roomid } = useParams();

  const { joinRoom, leaveRoom, state } = useRoom({
    onJoin: () => {
      console.log('Joined the room');
    },
    onLeave: () => {
      console.log('Left the room');
    },
    onPeerJoin: (peer) => {
      console.log('peer print here', peer);
    }
  });
  const { stream: camStream, enableVideo, disableVideo, isVideoOn } = useLocalVideo();
  const { stream, enableAudio, disableAudio, isAudioOn } = useLocalAudio();

  useEffect(() => {
    const showPreview = async () => {
      console.log('video Call wallet Address', address);
      const token = await accesscallToken(roomid);
      setAuthToken(token);
    };
    showPreview();
  }, [peerAddress, address]);

  // useEventListener("room:new-peer", (data) => console.log({ data }));

  useEventListener('lobby:cam-on', () => {
    if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
  });

  const accesscallToken = async (roomidt) => {
    try {
      const headers = {
        Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}${CALLACCESSTOKEN}?roomId=${roomidt}`, {
        headers
      });
      console.log(response.data);
      return response.data.token;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (videoRef.current && camStream) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  console.log(videoRef);
  console.log(peerIds);

  return (
    <>
      {/* <div className={isDarkMode ? styles.outerContainer : styles['d-outerContainer']} onClick={closeVideoCall}> */}
      {/* <div className={isDarkMode ? styles.innerContainer : styles['d-innerContainer']} onClick={(e) => e.stopPropagation()}> */}

      <div style={{ width: '100%', height: '100%', zIndex: '-000347473646' }}>
        State: {state}
        Me Video:
        <video ref={videoRef} autoPlay muted style={{ border: 'solid-black' }}></video>
        <Button
          onClick={() => {
            isVideoOn ? disableVideo() : enableVideo();
          }}
        >
          Fetch and Produce Video Stream
        </Button>
        {/* Mic */}
        <Button
          onClick={() => {
            isAudioOn ? disableAudio() : enableAudio();
          }}
        >
          Fetch and Produce Audio Stream
        </Button>
        <Button
          onClick={() => {
            joinRoom({
              roomId: roomid,
              token: authToken
            });
          }}
        >
          Join Room
        </Button>
        <Button onClick={leaveRoom}>Leave Room</Button>
        <div className="grid grid-cols-4">
          {peerIds?.map((peerId) => {
            return <RemotePeer peerId={peerId} key={peerId} />;
          })}
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default VideoCall;
