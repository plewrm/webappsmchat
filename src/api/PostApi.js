// import axios from 'axios';

import {
  BASE_URL,
  GETALLPOST,
  BEARER_TOKEN,
  GETALLTIMELINEPOST,
  GETALLPOSTCOMMENTS,
  ADDCOMMENT,
  LIKE_UNLIKE_POST
} from './EndPoint';

import axiosImport from 'axios';

const axois = axiosImport.create({ timeout: 8000 });

export const getAllTimelinePostApi = async () => {
  let url = `${BASE_URL + GETALLTIMELINEPOST}`;
  // console.log(url);
  const header = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
  };
  return axois.get(url, { header });
};

export const getAllPostForIdApi = async (data) => {
  let url = `${BASE_URL + GETALLPOST + data}`;
  // console.log(url);
  const header = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
  };
  return axois.get(url, { header });
};

// export const getAllPostCommentsApi = async (id, hash) => {
//   // let url = `${BASE_URL + GETALLPOSTCOMMENTS + id +'/'+  hash}`;
//   // const header = {
//   //   Accept: 'application/json',
//   //   'Content-type': 'application/json',
//   //   'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
//   // };
//   // console.log(url, header);
//   // return axois.get(url, {header});

//       return await fetch(`${BASE_URL}${GETALLPOSTCOMMENTS}${id}/${hash}`, {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
//       },
//     })
//       .then(response => response.json())
//       .then(responseData => {
//         // console.log(JSON.stringify(responseData));
//         // const data = JSON.stringify(responseData);
//         // return data;
//       })
//       .catch((err) => {
//         // return err;
//       })
// };

export const getAllPostCommentsApi = async (id, hash = {}) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    }
  };
  try {
    const response = await fetch(`${BASE_URL}${GETALLPOSTCOMMENTS}${id}/${hash}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postCommentsApi = async (id, hash, payload = {}) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  };
  console.log(`${BASE_URL}${ADDCOMMENT}${id}/${hash}`);
  try {
    const response = await fetch(`${BASE_URL}${ADDCOMMENT}${id}/${hash}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const likePostApi = async (id, hash = {}) => {
  const options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    }
  };
  try {
    const response = await fetch(`${BASE_URL}${LIKE_UNLIKE_POST}${id}/${hash}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const unLikePostApi = async (id, hash = {}) => {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem('token')}`
    }
  };
  try {
    const response = await fetch(`${BASE_URL}${LIKE_UNLIKE_POST}${id}/${hash}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
