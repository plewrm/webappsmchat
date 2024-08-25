import React from 'react';
import {
  usePeerIds,
  useRemoteVideo,
  useRemoteAudio,
  useRemoteScreenShare
} from '@huddle01/react/hooks';
import { Audio, Video } from '@huddle01/react/components';

const RemotePeer = ({ peerId }) => {
  const { stream: videoStream } = useRemoteVideo({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });
  const { videoStream: screenVideoStream, audioStream: screenAudioStream } = useRemoteScreenShare({
    peerId
  });

  return (
    <div>
      {videoStream && <Video stream={videoStream} />}
      {audioStream && <Audio stream={audioStream} />}
      {screenVideoStream && <Video stream={screenVideoStream} />}
      {screenAudioStream && <Audio stream={screenAudioStream} />}
    </div>
  );
};

export default RemotePeer;
