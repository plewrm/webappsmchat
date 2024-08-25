import { useLiveQuery } from 'dexie-react-hooks';
import db from '../models/db';

// Keeps a conversation up to date with DB updates
export function useLiveConversation(conversation) {
  return useLiveQuery(async () => {
    return db.conversations.where('topic').equals(conversation.topic).first();
  });
}
