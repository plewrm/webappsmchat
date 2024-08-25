import db from './db';
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec
} from '@xmtp/content-type-remote-attachment';
import { ContentTypeReply } from '@xmtp/content-type-reply';
import { deleteReaction, persistReaction } from './reactions';
import { ContentTypeReaction } from '@xmtp/content-type-reaction';
import { ContentTypeReadReceipt } from '@xmtp/content-type-read-receipt';

export async function process(client, conversation, { content, contentType, message }) {
  if (ContentTypeReadReceipt.sameAs(contentType)) {
    // Get items from the read receipts table based on peerAddress within conversation
    await db.readReceipts
      .get({ peerAddress: conversation.peerAddress })
      .then(async (existingEntry) => {
        // If the entry doesn't exist, add it with content timestamp
        if (!existingEntry) {
          await db.readReceipts.add({
            peerAddress: conversation.peerAddress,
            timestamp: message.content.timestamp
          });
        }
        // If the entry does exist, update it with content timestamp
        else {
          await db.readReceipts.update(conversation.peerAddress, {
            timestamp: message.content.timestamp
          });
        }
      });
  } else {
    message.id = await db.messages.add(message);

    if (ContentTypeReply.sameAs(contentType)) {
      const reply = content;
      await db.messages.update(message.id, {
        inReplyToID: reply.reference
      });
    }

    if (ContentTypeAttachment.sameAs(contentType)) {
      const attachment = content;
      const messageAttachment = {
        messageID: message.id,
        ...attachment
      };

      await db.attachments.add(messageAttachment);
    }

    if (ContentTypeRemoteAttachment.sameAs(contentType)) {
      const remoteAttachment = content;
      const attachment = await RemoteAttachmentCodec.load(remoteAttachment, client);

      const messageAttachment = {
        messageID: message.id,
        ...attachment
      };

      await db.attachments.add(messageAttachment);
    }

    // if (XMTP.ContentTypeGroupChatTitleChanged.sameAs(contentType)) {
    //   const titleChanged = content;

    //   await db.conversations.update(conversation, {
    //     title: titleChanged.newTitle,
    //   });
    // }

    // if (XMTP.ContentTypeGroupChatMemberAdded.sameAs(contentType)) {
    //   const memberAdded = content;

    //   const groupMembers = new Set(conversation.groupMembers);
    //   groupMembers.add(memberAdded.member);

    //   await db.conversations.update(conversation, {
    //     groupMembers: Array.from(groupMembers),
    //   });
    // }

    if (ContentTypeReaction.sameAs(message.contentType)) {
      const reaction = message.content;

      if (reaction.action === 'removed') {
        await deleteReaction({
          messageXMTPID: reaction.reference,
          reactor: message.senderAddress,
          name: reaction.content
        });
      } else {
        await persistReaction({
          reactor: message.senderAddress,
          name: reaction.content,
          messageXMTPID: reaction.reference
        });
      }
    }
  }
}
