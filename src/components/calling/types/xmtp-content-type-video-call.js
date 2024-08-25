import { ContentTypeId } from '@xmtp/xmtp-js';

export const ContentTypeVideoCall = new ContentTypeId({
  authorityId: 'socon',
  typeId: 'video-call',
  versionMajor: 1,
  versionMinor: 0
});

export class ContentTypeVideoCallCodec {
  get contentType() {
    return ContentTypeVideoCall;
  }

  encode(peerAddress) {
    return {
      type: ContentTypeVideoCall,
      parameters: {},
      content: new TextEncoder().encode(peerAddress)
    };
  }

  decode(content) {
    console.log('decoding content: ', content);
    const uint8Array = content.content;
    const peerAddress = new TextDecoder().decode(uint8Array);
    return peerAddress;
  }
}
