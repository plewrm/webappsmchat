import { AttachmentCodec, RemoteAttachmentCodec } from '@xmtp/content-type-remote-attachment';
import { Web3Storage } from 'web3.storage';

export default class Upload {
  constructor(name, data) {
    this.name = name;
    this.data = data;
  }

  stream() {
    const self = this;
    return new ReadableStream({
      start(controller) {
        /* eslint-disable no-undef */
        controller.enqueue(Buffer.from(self.data));
        controller.close();
      }
    });
  }
}

export async function upload(attachment) {
  const encryptedEncoded = await RemoteAttachmentCodec.encodeEncrypted(
    attachment,
    new AttachmentCodec()
  );

  let token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlhNmI5ZDBBODliZjdENDVlYzdBMGVGMWI2ODJlYjVCNjZCQjMzOWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTA3OTUxNTUwNjAsIm5hbWUiOiJUU0MifQ.NNHHB1JsSYqmlwYNsgDGiZpz5SW6W5khX4HhxKGSEzI';

  if (!token) {
    alert('No token, sorry.');
    throw new Error('no web3.storage token found');
  }

  const web3Storage = new Web3Storage({
    token: token
  });

  const upload = new Upload('XMTPEncryptedContent', encryptedEncoded.payload);
  const cid = await web3Storage.put([upload]);
  const url = `https://${cid}.ipfs.w3s.link/XMTPEncryptedContent`;

  return {
    url: url,
    contentDigest: encryptedEncoded.digest,
    salt: encryptedEncoded.salt,
    nonce: encryptedEncoded.nonce,
    secret: encryptedEncoded.secret,
    scheme: 'https://',
    filename: attachment.filename,
    contentLength: attachment.data.byteLength
  };
}
