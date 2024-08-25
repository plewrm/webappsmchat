import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAudio,
  useLobby,
  usePeers,
  useRoom,
  useVideo,
  useRecording
} from '@huddle01/react/hooks';
import getRoomId from '../helpers/getRoomId';
import { Audio, Video } from '@huddle01/react/components';
import WalletContext from '../contexts/WalletContext';
import { useHuddle01 } from '@huddle01/react';
import { useEventListener } from '@huddle01/react';
import Button from '../components/Button';

import {
  ContentTypeVideoCallCodec,
  ContentTypeVideoCall
} from '../types/xmtp-content-type-video-call';

import { ClientContext } from '../contexts/ClientContext';
import { Conversation } from '@xmtp/xmtp-js';

const Meet = () => {
  const routerParams = useParams();
  const { peerAddress } = routerParams;

  const { client } = useContext(ClientContext);
  const { address } = useContext(WalletContext);

  const videoRef = useRef(null);

  const [roomId, setRoomId] = useState(null);
  const { initialize } = useHuddle01();
  const { joinLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();
  const { peers } = usePeers();
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    const showPreview = async () => {
      console.log(initialize.isCallable);
      initialize(import.meta.env.VITE_HUDDLE_PROJECT_ID);
      console.log(address);
      const room = await getRoomId([address]);
      setRoomId(room);
      console.log('got room', room);
      joinLobby.isCallable ? joinLobby(room) : console.log('Cannot join lobby.');
      client?.registerCodec(new ContentTypeVideoCallCodec());
      if (!peerAddress) return;
      const convo = await client?.conversations.newConversation(peerAddress);
      if (!convo) return;
      setConversation(convo);
    };
    showPreview();
  }, [peerAddress, address]);

  useEventListener('lobby:cam-on', () => {
    if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
  });

  const joinRoomHandler = async () => {
    if (peerAddress == '' || !peerAddress) return;
    startHandler();
    joinRoom();
    await conversation?.send(peerAddress, {
      contentType: ContentTypeVideoCall
    });
    console.log('message sent');
    stopHandler();
  };

  var milliseconds = 0;
  var Interval;

  function startHandler() {
    clearInterval(Interval);
    Interval = setInterval(startTimer, 1);
  }

  function stopHandler() {
    console.log(milliseconds);
    clearInterval(Interval);
    milliseconds = 0;
  }

  function startTimer() {
    milliseconds++;
  }
  return (
    <div>
      Me Video:
      <video ref={videoRef} autoPlay muted></video>
      <Button disabled={!fetchVideoStream.isCallable} onClick={fetchVideoStream} type="button">
        FETCH_VIDEO_STREAM
      </Button>
      <Button disabled={!fetchAudioStream.isCallable} onClick={fetchAudioStream} type="button">
        FETCH_AUDIO_STREAM
      </Button>
      <Button disabled={!joinRoom.isCallable} onClick={joinRoomHandler} type="button">
        JOIN_ROOM
      </Button>
      <div className="grid grid-cols-4">
        {Object.values(peers).map((peer) => (
          <React.Fragment key={peer.peerId}>
            {peer.cam && (
              <>
                role: {peer.role}
                <Video peerId={peer.peerId} track={peer.cam} debug />
              </>
            )}
            {peer.mic && (
              <Audio
                peerId={peer.peerId}
                track={peer.mic || undefined} // Pass undefined for null tracks
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Meet;
