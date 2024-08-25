import db from '../models/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useLatestMessages(conversations) {
  return (
    useLiveQuery(async () => {
      return await Promise.all(
        conversations.map(async (conversation) => {
          return (
            await db.messages
              .where('conversationTopic')
              .equals(conversation.topic)
              .reverse()
              .sortBy('sentAt')
          )[0];
        })
      );
    }, [conversations.map((conversation) => String(conversation.updatedAt)).join()]) || []
  );
}
