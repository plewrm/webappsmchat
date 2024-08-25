import axios from 'axios';
import {
  BASE_URL,
  BEARER_TOKEN,
  FOLLOWING,
  retrievedSoconId,
  FOLLOW_UNFOLLOW_USER
} from './EndPoint';

// FOLLOWING API call here and the method is get()
export const fetchFollowingUsersApi = async () => {
  const headers = {
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
  const response = await axios.get(
    `${BASE_URL}${FOLLOWING}/${retrievedSoconId ? retrievedSoconId : sessionStorage.getItem('soconId')}`,
    { headers }
  );
  return response.data.following.users;
};

// FOLLOW_UNFOLLOW_USER API call here and the method is post()
export const followUserApi = async (authorSoconId) => {
  const headers = {
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
  await axios.post(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${authorSoconId}`, {}, { headers });
  return { authorSoconId, isFollowing: true };
};

// FOLLOW_UNFOLLOW_USER API call here and the methos is delete()
export const unfollowUserApi = async (authorSoconId) => {
  const headers = {
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
  await axios.delete(`${BASE_URL}${FOLLOW_UNFOLLOW_USER}${authorSoconId}`, {
    headers
  });
  return { authorSoconId, isFollowing: false };
};
