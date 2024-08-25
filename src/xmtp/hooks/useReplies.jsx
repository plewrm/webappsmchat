import db, { Message } from '../models/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useReplies(message) {
  return (
    useLiveQuery(async () => {
      return await db.messages.where('inReplyToID').equals(message.xmtpID).toArray();
    }) || []
  );
}
