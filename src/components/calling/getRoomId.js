import axios from 'axios';

const getRoomId = async (hostWallets) => {
  const response = await axios.post(
    'https://api.huddle01.com/api/v1/create-room',
    {
      title: 'SoCon-Test',
      hostWallets: hostWallets
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.API_KEY
      }
    }
  );
  console.log('Print Response Id', response.data);
  return response.data.data.roomId;
};

export default getRoomId;
