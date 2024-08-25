import db from './db';
import { getXMTPConversation, stripTopicName, updateConversationTimestamp } from './conversations';
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment
} from '@xmtp/content-type-remote-attachment';
import { Mutex } from 'async-mutex';
import { upload } from './attachments';
import { process } from './message-processor';
import { ContentTypeReply } from '@xmtp/content-type-reply';
import { getProfileByAddressApi } from '../../api/UserApi';
import { ContentTypeSharePost, ContentTypeSharePostCodec } from '../codecs/PostShareCodec';

const messageMutex = new Mutex();
const sharePostCodec = new ContentTypeSharePostCodec();

export async function sendMessage(client, conversation, content, contentType, userdetails) {
  const message = {
    conversationTopic: stripTopicName(conversation.topic),
    inReplyToID: '',
    xmtpID: 'PENDING-' + new Date().toString(),
    senderAddress: client.address,
    sentByMe: true,
    sentAt: new Date(),
    contentType: { ...contentType },
    content: content,
    isSending: true,
    senderName: userdetails?.display_name,
    senderPfp: userdetails?.pfp,
    senderSoconId: userdetails?.soconId
  };

  // process reply content as message
  if (contentType.sameAs(ContentTypeReply)) {
    const replyContent = content;
    await process(client, conversation, {
      content: replyContent.content,
      contentType: replyContent.contentType,
      message
    });
  }

  // Do the actual sending async
  (async () => {
    // check if message is a reply that contains an attachment
    if (contentType.sameAs(ContentTypeReply) && content.contentType.sameAs(ContentTypeAttachment)) {
      content.content = await upload(content.content);
      content.contentType = ContentTypeRemoteAttachment;
    } else {
      // Always treat Attachments as remote attachments so we don't send
      // huge messages to the network
      if (contentType.sameAs(ContentTypeAttachment)) {
        content = await upload(content);
        contentType = ContentTypeRemoteAttachment;
      }
    }
    client.registerCodec(new ContentTypeSharePostCodec());
    const xmtpConversation = await getXMTPConversation(client, conversation);
    const decodedMessage = await xmtpConversation.send(content, {
      contentType
    });

    if (message.contentType.typeId !== 'readReceipt') {
      await db.messages.update(message.id, {
        xmtpID: decodedMessage.id,
        sentAt: decodedMessage.sent,
        isSending: false
      });
    }

    await process(client, conversation, {
      content,
      contentType,
      message
    });
    await updateConversationTimestamp(message.conversationTopic, message.sentAt);
  })();

  return message;
}

async function nonMutex(fn) {
  return await fn();
}

export async function saveMessage(
  client,
  conversation,
  decodedMessage,
  userdetails,
  useMutex = true
) {
  if (!decodedMessage || !client || !conversation) return;

  const runner = useMutex ? messageMutex.runExclusive.bind(messageMutex) : nonMutex;

  return await runner(async () => {
    const existing = await db.messages.where('xmtpID').equals(decodedMessage.id).first();

    if (existing) {
      return existing;
    }

    if (ContentTypeSharePost.sameAs(decodedMessage.contentType)) {
      const decoded = sharePostCodec.decodeBytes(decodedMessage.contentBytes);
      if (!decoded) return;
      decodedMessage.content = decoded;
    }

    const message = {
      conversationTopic: stripTopicName(decodedMessage.contentTopic),
      inReplyToID: '',
      xmtpID: decodedMessage.id,
      senderAddress: decodedMessage.senderAddress,
      sentByMe: decodedMessage.senderAddress === client.address,
      sentAt: decodedMessage.sent,
      contentType: { ...decodedMessage.contentType },
      content: decodedMessage.content,
      isSending: false,
      senderDisplayName: userdetails?.display_name,
      senderPfp: userdetails?.pfp,
      senderSoconId: userdetails?.soconId,
      senderUsername: userdetails?.username
    };

    await process(client, conversation, {
      content: decodedMessage.content,
      contentType: decodedMessage.contentType,
      message
    });

    // process reply content as message
    if (decodedMessage.contentType.sameAs(ContentTypeReply)) {
      const replyContent = decodedMessage.content;
      await process(client, conversation, {
        content: replyContent.content,
        contentType: replyContent.contentType,
        message
      });
    }

    await updateConversationTimestamp(message.conversationTopic, message.sentAt);

    return message;
  });
}

export async function loadMessages(conversation, client) {
  const xmtpConversation = await getXMTPConversation(client, conversation);
  for (const message of await xmtpConversation.messages()) {
    const profile = await getProfileByAddressApi(message.senderAddress);
    await saveMessage(client, conversation, message, profile, true);
  }

  for await (const message of await xmtpConversation.streamMessages()) {
    const profile = await getProfileByAddressApi(message.senderAddress);
    await saveMessage(client, conversation, message, profile, true);
  }
}
