import db from './db';
import { Mutex } from 'async-mutex';

// Prevent races when updating the local database
const conversationMutex = new Mutex();

export async function isPeerOnXmtpNetwork(client, peerAddress) {
  return await client.canMessage(peerAddress);
}
// TODO: figure out a better way to turn db Conversation -> XMTP.Conversation
export async function getXMTPConversation(client, conversation) {
  const conversations = await client.conversations.list();
  const xmtpConversation = conversations.find(
    (xmtpConversation) => stripTopicName(xmtpConversation.topic) === conversation.topic
  );

  if (!xmtpConversation) throw new Error('could not convert db conversation to XMTP conversation');

  return xmtpConversation;
}

export async function findConversation(topic) {
  return await db.conversations.where('topic').equals(stripTopicName(topic)).first();
}

export async function updateConversationTimestamp(topic, updatedAt) {
  const conversation = await db.conversations.where('topic').equals(topic).first();

  if (
    conversation &&
    (conversation.updatedAt < updatedAt || conversation.updatedAt === undefined)
  ) {
    await conversationMutex.runExclusive(async () => {
      await db.conversations.update(conversation, { updatedAt });
    });
  }
}

export function stripTopicName(conversationTopic) {
  return conversationTopic.replace('/xmtp/0/', '').replace('/proto', '');
}

export async function startConversation(client, userdetails) {
  const xmtpConversation = await client.conversations.newConversation(
    userdetails.peerAddress ? userdetails.peerAddress : userdetails.walletAddress
  );
  return await saveConversation(xmtpConversation, userdetails);
}

// export async function startGroupConversation(
//   client: XMTP.Client,
//   addresses: string[]
// ): Promise<Conversation> {
//   const xmtpConversation = await client.conversations.newGroupConversation(
//     addresses
//   );

//   return await saveConversation(xmtpConversation);
// }

export async function saveConversation(xmtpConversation, userdetails) {
  return await conversationMutex.runExclusive(async () => {
    const existing = await db.conversations
      .where('topic')
      .equals(stripTopicName(xmtpConversation.topic))
      .first();

    if (existing) {
      if (existing.display_name !== userdetails.display_name || existing.pfp !== userdetails.pfp) {
        await db.conversations.update(existing.id, {
          display_name: userdetails.display_name,
          pfp: userdetails.pfp
        });
      }
      return existing;
    }

    const conversation = {
      topic: stripTopicName(xmtpConversation.topic),
      title: undefined,
      createdAt: xmtpConversation.createdAt,
      // updatedAt: xmtpConversation.updatedAt,
      // isGroup: xmtpConversation.isGroup,
      peerAddress: xmtpConversation.peerAddress,
      username: userdetails.username,
      display_name: userdetails.display_name,
      pfp: userdetails.pfp,
      soconId: userdetails.soconId
    };

    // TODO: Conversations streaming in don't have isGroup set properly
    // const groupMembers = (
    //   xmtpConversation.context?.metadata.initialMembers || ""
    // ).split(",");

    // if (groupMembers.length > 1) {
    //   conversation.isGroup = true;
    //   conversation.groupMembers = groupMembers;
    // } else {
    //   conversation.isGroup = false;
    // }

    conversation.id = await db.conversations.add(conversation);

    return conversation;
  });
}
