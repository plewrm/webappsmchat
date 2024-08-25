import db, { Message, MessageReaction } from '../models/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useReactions(message) {
  return useLiveQuery(async () => {
    return await db.reactions.where('messageXMTPID').equals(message.xmtpID).toArray();
  });
}
