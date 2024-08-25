import { ContentTypeId } from '@xmtp/xmtp-js';

export const ContentTypeSharePost = new ContentTypeId({
  authorityId: 'com.socon',
  typeId: 'sharePost',
  versionMajor: 1,
  versionMinor: 1
});

export class SharePost {
  constructor(soconId, username, postHash, caption, image, type, msg) {
    this.soconId = soconId;
    this.username = username;
    this.postHash = postHash;
    this.caption = caption;
    this.image = image;
    this.type = type;
    this.msg = msg;
  }
}

export class ContentTypeSharePostCodec {
  get contentType() {
    return ContentTypeSharePost;
  }

  encode(postDetails) {
    const { soconId, username, postHash, caption, image, type, msg } = postDetails;
    return {
      type: ContentTypeSharePost,
      parameters: {},
      content: new TextEncoder().encode(
        JSON.stringify({ soconId, username, postHash, caption, image, type, msg })
      )
    };
  }

  decode(encodedContent) {
    const decodedContent = new TextDecoder().decode(encodedContent);
    const { soconId, username, postHash, caption, image, type, msg } = JSON.parse(decodedContent);
    return new SharePost(soconId, username, postHash, caption, image, type, msg);
  }

  // The decode method decodes the byte array, parses the string into numbers (num1, num2), and returns their product
  decodeBytes(encodedContent) {
    const decodedContent = new TextDecoder().decode(encodedContent);
    try {
      const jsonStart = decodedContent.indexOf('{');
      const jsonEnd = decodedContent.lastIndexOf('}') + 1;
      const jsonStr = decodedContent.substring(jsonStart, jsonEnd);
      const { soconId, username, postHash, caption, image, type, msg } = JSON.parse(jsonStr);
      return new SharePost(soconId, username, postHash, caption, image, type, msg);
    } catch (error) {
      return null;
    }
  }

  fallback(content) {
    return `SharePostCodec is not supported. Content was ${JSON.stringify(content)}`;
  }

  // Set to true to enable push notifications for interoperable content types.
  // Receiving clients must handle this field appropriately.
  shouldPush() {
    return true;
  }
}
