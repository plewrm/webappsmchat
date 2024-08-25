import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import * as XMTP from '@xmtp/xmtp-js';
import { saveMessage } from '../models/messages';
import { saveConversation } from '../models/conversations';
import db from '../models/db';
import { getProfileByAddressApi } from '../../api/UserApi';
import { useSelector } from 'react-redux';

export function useConversations(client) {
  const expanded = useSelector((state) => state.chat.expanded);

  useEffect(() => {
    const fetchData = async () => {
      if (!expanded || !client) return;
      try {
        const conversations = await client.conversations.list();
        for (const xmtpConversation of conversations) {
          const profile = await getProfileByAddressApi(xmtpConversation.peerAddress);
          if (!profile || profile.username === '') continue;
          // Load the latest message from the network for preview
          try {
            const latestMessages = await xmtpConversation.messages({
              direction: XMTP.SortDirection.SORT_DIRECTION_DESCENDING,
              limit: 1
            });

            const latestMessage = latestMessages[0];
            if (latestMessage) {
              const conversation = await saveConversation(xmtpConversation, profile);
              await saveMessage(client, conversation, latestMessage, profile);
            }
          } catch (messageError) {
            console.error('Error fetching latest message:', messageError);
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchData();
  }, [client, expanded]);

  // useEffect(() => {
  //   (async () => {
  //     if (!expanded || !client) return;
  //     for (const xmtpConversation of await client.conversations.list()) {
  //       console.log(xmtpConversation.peerAddress)
  //       const profile = await getProfileByAddressApi(xmtpConversation.peerAddress);
  //       console.log(profile)
  //       if (!profile || profile.username == '') return;
  //       const conversation = await saveConversation(xmtpConversation, profile);

  //       // Load the latest message from the network for preview
  //       (async () => {
  //         const latestMessage = (
  //           await xmtpConversation.messages({
  //             direction: XMTP.SortDirection.SORT_DIRECTION_DESCENDING,
  //             limit: 1
  //           })
  //         )[0];

  //         if (latestMessage) {
  //           await saveMessage(client, conversation, latestMessage, profile);
  //         }
  //       })();
  //     }
  //   })();
  // }, [client, expanded]);

  return (
    useLiveQuery(async () => {
      return await db.conversations.reverse().sortBy('updatedAt');
    }) || []
  );
}
