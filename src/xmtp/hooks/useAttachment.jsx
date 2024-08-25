import db from '../models/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useAttachment(message) {
  return useLiveQuery(async () => {
    return await db.attachments.where('messageID').equals(message.id).first();
  });
}
