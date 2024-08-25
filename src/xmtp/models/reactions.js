import { ContentTypeText } from '@xmtp/xmtp-js';
import db from './db';
import { findConversation, getXMTPConversation } from './conversations';
import { Mutex } from 'async-mutex';
import { ContentTypeReaction } from '@xmtp/content-type-reaction';
import { shortAddress } from '../utils/shortAddress';

const reactionMutex = new Mutex();

const getReactionTo = (message) => {
  let reactionTo = '';

  // if (
  //   ContentTypeAttachment.sameAs(message.contentType)
  //   ||
  //   ContentTypeRemoteAttachment.sameAs(message.contentType)
  // ) {
  //   reactionTo = "to an attachment ";
  // }

  if (ContentTypeText.sameAs(message.contentType)) {
    reactionTo = `to "${message.content}" `;
  }

  return reactionTo;
};

export async function addReaction(reactionName, message, client) {
  if (!client) {
    return;
  }

  const conversation = await findConversation(message.conversationTopic);
  if (!conversation) {
    return;
  }

  await persistReaction({
    reactor: client.address,
    name: reactionName,
    messageXMTPID: message.xmtpID
  });

  const reaction = {
    action: 'added',
    reference: message.xmtpID,
    content: reactionName,
    schema: 'shortcode'
  };

  const xmtpConversation = await getXMTPConversation(client, conversation);
  await xmtpConversation.send(reaction, {
    contentType: ContentTypeReaction,
    contentFallback: `${shortAddress(client.address)} reacted ${getReactionTo(
      message
    )}with ${reaction.content}`
  });
}

export async function removeReaction(reactionName, message, client) {
  if (!client) {
    return;
  }

  const conversation = await findConversation(message.conversationTopic);

  if (!conversation) {
    return;
  }

  const existing = await db.reactions
    .where({
      messageXMTPID: message.xmtpID,
      reactor: client.address,
      name: reactionName
    })
    .first();

  if (existing && existing.id) {
    db.reactions.delete(existing.id);
  }

  const reaction = {
    action: 'removed',
    reference: message.xmtpID,
    content: reactionName,
    schema: 'shortcode'
  };

  const xmtpConversation = await getXMTPConversation(client, conversation);
  await xmtpConversation.send(reaction, {
    contentType: ContentTypeReaction,
    contentFallback: `${shortAddress(client.address)} unreacted ${getReactionTo(
      message
    )}with ${reaction.content}`
  });
}

export async function deleteReaction(reaction) {
  await reactionMutex.runExclusive(async () => {
    await db.reactions
      .where({
        messageXMTPID: reaction.messageXMTPID,
        reactor: reaction.reactor,
        name: reaction.name
      })
      .delete();
  });
}

export async function persistReaction(reaction) {
  await reactionMutex.runExclusive(async () => {
    const existing = await db.reactions
      .where({
        messageXMTPID: reaction.messageXMTPID,
        reactor: reaction.reactor,
        name: reaction.name
      })
      .first();

    if (existing) {
      return;
    }

    await db.reactions.add(reaction);
  });
}
