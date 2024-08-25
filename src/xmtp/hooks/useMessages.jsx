import { useContext, useEffect } from 'react';
import { loadMessages } from '../models/messages';
import db from '../models/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSelector } from 'react-redux';

export function useMessages(conversation) {
  const xmtp = useSelector((state) => state.auth.xmtp);
  // console.log('getting qmsgs for', conversation.peerAddress, 'and topic', conversation.topic);
  useEffect(() => {
    if (!xmtp) return;
    loadMessages(conversation, xmtp);
  }, [xmtp, conversation]);

  const msgs = useLiveQuery(async () => {
    return await db.messages
      .where({
        conversationTopic: conversation.topic,
        inReplyToID: ''
      })
      .sortBy('sentAt');
  }, [conversation.topic]);
  // console.log(msgs);
  return msgs;
}
