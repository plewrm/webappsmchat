// CommunityApi.js
import axios from 'axios';
import { BASE_URL, BEARER_TOKEN, ADDMEMBER, DELETEMEMBER, DICCOVERCOMMUNITIES } from './EndPoint';

export const addMemberApi = async (communityName, username) => {
  try {
    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(
      `${BASE_URL}${ADDMEMBER}`,
      { communityName, username },
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeMemberApi = async (communityName, username) => {
  try {
    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.delete(`${BASE_URL}${DELETEMEMBER}`, {
      data: { communityName, username },
      headers
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchCommunitiesApi = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${BASE_URL}${DICCOVERCOMMUNITIES}`, { headers });

    return response.data.communities;
  } catch (error) {
    throw error.response.data;
  }
};
