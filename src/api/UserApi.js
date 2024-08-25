import {
  BASE_URL,
  BEARER_TOKEN,
  CHECKUSERNAMEAVAILABILITY,
  GETUSERPROFILE,
  GETPROFILEBYADDRESS
} from './EndPoint';

import axiosImport from 'axios';

const axois = axiosImport.create({ timeout: 8000 });

export const checkUsernameAvailabilityApi = async (data) => {
  let url = `${BASE_URL + CHECKUSERNAMEAVAILABILITY + data}`;
  const header = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
  };
  return axois.get(url, { header });
};

export const getUserProfileApi = async (data) => {
  let url = `${BASE_URL + GETUSERPROFILE + data}`;
  const header = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
  };
  return axois.get(url, { header });
};

export const getProfileByAddressApi = async (data) => {
  let url = `${BASE_URL}${GETPROFILEBYADDRESS}${data}`;
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${BEARER_TOKEN}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(url, requestOptions);
  if (response.status === 200) {
    const data = await response.json();
    return data.profile;
  } else {
    return null;
  }
};
