import { BASE_URL, BEARER_TOKEN, CREATESTORY } from './EndPoint';

export const postStoryApi = async (payload = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  };
  console.log('Request URL:', `${BASE_URL}${CREATESTORY}`);
  console.log('Request Options:', options);
  try {
    const response = await fetch(`${BASE_URL}${CREATESTORY}`, options);
    const data = await response.json();
    console.log('Response Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
