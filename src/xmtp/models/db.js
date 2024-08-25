/*
  DB.js

  This file defines the local database schema for our app. Any time we show any
  data in the UI, it should come from the database.
*/

import Dexie from 'dexie';

class DB extends Dexie {
  constructor() {
    super('DB');
    this.version(2).stores({
      conversations: `
        ++id,
        topic,
        title,
        createdAt,
        updatedAt,
        isGroup,
        groupMembers,
        peerAddress,
        username,
        display_name,
        pfp,
        soconId
        `,
      messages: `
        ++id,
        [conversationTopic+inReplyToID],
        inReplyToID,
        conversationTopic,
        xmtpID,
        senderAddress,
        senderUsername,
        senderDisplayName,
        senderPfp,
        senderSoconId,
        sentByMe,
        sentAt,
        contentType,
        content
        `,
      attachments: `
        ++id,
        messageID,
        filename,
        mimeType,
        data
      `,
      reactions: `
        ++id,
        [messageXMTPID+reactor+name],
        messageXMTPID,
        reactor,
        name
      `,
      readReceipts: `
       ++peerAddress,
       timestamp
      `
    });
  }
}

const db = new DB();

export const clearMessageDb = async () => {
  await db.conversations.clear();
  await db.messages.clear();
  await db.attachments.clear();
  await db.reactions.clear();
  await db.readReceipts.clear();
  await db.delete();
};
// clearMessageDb();

export default db;
