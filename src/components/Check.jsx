import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { Client } from '@xmtp/xmtp-js';

export default function Check() {
  const wallet_1 = new ethers.Wallet(
    '04ff18ded9c913b6b3fa43fe9a44eed5124b1fcdbf1b7cc19e12a97e0d5442d4'
  );

  const convo = async () => {
    const client = await Client.create(wallet_1);
    const conversation = await client.conversations.newConversation(
      '0x3F11b27F323b62B159D2642964fa27C46C841897'
    );
    const messages = await conversation.messages();

    console.log(messages);
  };

  // Load all messages in the conversation

  return (
    <div style={{ color: 'yellow' }}>
      <span>checking</span>
      {/* {console.log(wallet)} */}
      <button onClick={convo}>click me</button>
      {/* {(!wallet.isConnected || !client) ? <span>yes</span> : <span>no</span>} */}
    </div>
  );
}
