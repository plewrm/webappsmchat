import CryptoJS from 'crypto-js';

const getDecryptedData = (key) => {
  const secretKey = 'SOCON@2024'; // Same secret key used for encryption
  const encryptedData = localStorage.getItem(key);

  if (encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
  return null;
};

export const retrievedToken = getDecryptedData('token');
export const retrievedSoconId = parseInt(getDecryptedData('soconId'), 10);

export const BASE_URL = 'https://api.socialcontinent.xyz/api/v1';
// 'http://ec2-52-66-4-29.ap-south-1.compute.amazonaws.com:3010/api/v1';
// "https://api.socialcontinent.xyz/api/v1"

// const token = sessionStorage.getItem("token");
export const BEARER_TOKEN = retrievedToken;

// Auth
export const LOGINORSIGNUP = '/auth/loginOrSignup';

export const LOGOUT = '/api/auth/logout';

export const FIREBASETOKEN = '/auth/firebase/token';

export const DELETEACCOUNT = '/auth/account/delete';

// Posts
// ##########################################################################################################################
// '/post/timeline'
export const GETALLTIMELINEPOST = '/post/timeline';

// '/post/all/${user_id}'
export const GETALLPOST = '/post/all/';

// '/post/create' same for all post i.e image and text
export const CREATEPOST = '/post/create';

// /post/details/${user_id}/${hash_id}
export const GETPOSTBYHASH = '/post/details/';

// delete post by has_id /post/${hash_id}
export const DELETEPOST = '/post/';

// like post /post/like/${user_id}/${hash_id}
export const LIKE_UNLIKE_POST = '/post/like/';

// get all comments count /post/comment/${user_id}/${hash_id}
export const GETALLPOSTCOMMENTS = '/post/comment/';

// add comments /post/comment/{userId}/{post_hash}
export const ADDCOMMENT = '/post/comment/';

// get all like count /post/likes/${user_id}/${hash_id}
export const GETLIKESCOUNT = '/post/likes/';

// get all likes /post/likes/${user_id}/${hash_id}
export const GETALLLIKES = '/post/likes/';

// get all likes /user/follow/${user_id}
export const FOLLOWUSER = '/user/follow/';

// get all likes /user/follow/${user_id}
export const UNFOLLOWUSER = '/user/follow/';

// delete a comment
export const DELETECOMMENT = '/post/comment/';

// like a commet
export const LIKECOMMENT = '/post/like/';

// get post by soconid

export const MYPOST = '/post/all/';

export const REPOST = '/post/reposts/';

export const SHAREPOST = '/post/share/';

// report the post by posted user  /post/report/
export const REPORTPOSTBYUSERID = '/post/report';

//suggested Post Api call here
export const SUGGESTEDPOSTS = '/post/suggested';

//
//Users
// ##########################################################################################################################
// get user profile

// /user/username/availability/${username}
export const CHECKUSERNAMEAVAILABILITY = '/user/username/availability/';

// /user/profile/${userId}
export const GETUSERPROFILE = '/user/profile/';

// user/block/soconId  --user block api
export const BLOCKEDUSERBYID = '/user/block/';
// /user/block/soconId  -- this api use for unblock user
export const UNBLOCKEDUSERBYID = '/user/block/';
// user/blocked all blocked user list
export const ALLBLOCKEDUSERS = '/user/blocked';

// /user/profile/address/${walletaddress}
export const GETPROFILEBYADDRESS = '/user/profile/address/';

// /user/report/soconId    //user report api
export const REPORTUSERBYID = '/user/report/';

// ##########################################################################################################################

// whitelist
// 'post/whitelist/add'
export const ADDWHITELIST = '/whitelist/add';

// ##########################################################################################################################

//wavenearby
//'.post/wave-near-by/location/add'
export const ADDLOCATION = '/wave-near-by/location/add';

//get nearby users '/wave-near-by/location/find'
export const GETNEARBYUSER = '/wave-near-by/location/find';

// ##########################################################################################################################

//Story

// post createStory 'post/stories/add'
export const CREATESTORY = '/stories/add';

// get story details  '/stories/${user_id/${hash_id}'
export const GETSTORYDETAILS = '/stories/';

// get user Story '/stories/user/${user_id}'
export const GETUSERSTORIES = '/stories/user/';

// delete story  by hash ID '/stories/${hash_id}'
export const DELETESTORY = '/stories/';

// get all stories
export const GETALLSTORIES = '/stories/all';

// get archives
export const GETARCHIVES = '/stories/archives';

// like a story
export const LIKETHESTORY = '/stories/likes/';

// view a story & get views count
export const VIEWSTORY = '/stories/views/';

// share a story
export const SHARESTORY = '/stories/shares/';

// ##########################################################################################################################

// collections

// post create collections '/collections/create'
export const CREATECOLLECTIONS = '/collections/create'; // vaibhav implemented
export const CREATECOLLECTION = '/collections'; // new APi

// get user collection '/collections/'
export const GETUSERCOLLECTIONS = '/collections/'; //vaibhav implemented
export const GETUSERCOLLECTION = '/collections'; // new api

// add post to collection '/collections/baskeball/add'
export const ADDPOSTTOCOLLECTION = '/collections/baskeball/add'; // vaibhav implemented
export const ADDPOSTTOCOLLECTIONS = '/collections'; // new api
// delete collection
export const DELETECOLLECTION = '/collections/baskeball';

// get post in  collection // new api
export const GETPOSTCOLLECTION = '/collections';

// get display all collection post // new api
export const FETCHALLPOST = '/collections/:collectionName';

// delete all collection
export const DELETEALLCOLLECTION = '/collections/:collectionName'; // new api
// ##########################################################################################################################

// delete particular post form post
export const UNSAVE_SINGLEPOST = '/collections'; // new api
// highlight

// post create highlight '/highlights/create';
export const CREATEHIGHLIGHT = '/highlights/create';

// get highlight details  /highlights/${user_id}/avatars;
export const GETHIGHLIGHTDETAILS = '/highlights/';

// get user highlight /highlights/all/${user_id}
export const GETUSERHIGHLIGHT = '/highlights/all/';

// post add stories to highlight /highlights/add-stories/${user_id}
export const ADDSTORIESTOHIGHLIGHT = '/highlights/add-stories/';

// delete hhighlight '/highlights/${user_id}'
export const DELETEHIGHLIGHT = '/highlights/';

// ##########################################################################################################################

// spinbuzz

// post create profile '/spinbuzz/profile/create'
export const CREATEPROFILE = '/spinbuzz/profile/create';

// patch update profile '/spinbuzz/profile/update'
export const UPDATEPROFILE = '/spinbuzz/profile/update';

// get spinbuzz profile '/spinbuzz/profile'
export const GETSPINBUZZPROFILE = '/spinbuzz/profile';

// get find spinbuzz user '/spinbuzz/profile/find'
export const FINDSPINBUZZUSER = '/spinbuzz/anon/match';

/* satrt non-anonymous api*/

//get spinbuzz profile non-anonymous
export const GETSPINBUZZPROFILELIGHT = '/spinbuzz/profile/compatibility/users';

// find spinbuzz profile non-anonymous
export const FINDSPINBUZZPROFILELIGHT = '/spinbuzz/match';

// spinbuzz users for nonanon
export const SPINBUZZ_USER = '/spinbuzz/users';

/*    end non-anonymous api*/

// send message to match
export const SENDGETMESSAGETOMATCH = '/spinbuzz/profiles/chat/';

// spinbuzz users for anon
export const SPINBUZZ_USER_ANON = '/spinbuzz/anon/users';
// communities

export const CREATECOMMUNITIES = '/communities/create';

export const GETCOMMUNITIESMEMBERS = '/communities/';

export const GETALLCOMMUNITIES = '/communities/';

export const GLOBALSERACH = '/communities';

export const ADDMEMBER = '/communities/members';

export const VOTEFORPOLL = '/communities/messages/vote';

export const MESSAGETIMELINE = '/communities/messages/timeline';

export const SELFTIMELINE = '/communities/messages/sent-by/';

export const COMMUNITIESJOINEDBYME = '/communities/joined-by';

export const DELETEMESSAGE = '/communities/messages/';

export const DELETECOMMUNITY = '/communities/';

export const GETALLCOMMUNITIESCREATED = '/communities/created-by';

export const DELETEMEMBER = '/communities/members';

export const DICCOVERCOMMUNITIES = '/communities/to-join';
// user

// get suggested user
export const GETSUGGESTEDUSER = '/user/suggested';

// get profile requires socon_id
export const GETPROFILE = '/user/profile';

export const EDITPROFILE = '/user/profile';

export const FOLLOWING = '/user/following';

export const FOLLOWERS = '/user/followers';

export const FOLLOW_UNFOLLOW_USER = '/user/follow/';

export const UPDATECOVER = '/user/profile/cover';

export const DELETECOVER = '/user/profile/cover';

// ano profile

export const GETANON = '/anon-profile';

export const CHECKUSERNAMEAVAILABILITYANON = '/anon-profile/check-username/';
// post api
export const CREATEANONPROFILE = '/anon-profile';

// global search for searching people on socon
// for pagination ->> ?page=1&pageSize=2
export const SEARCHUSER = '/user/search/';

export const HASHTAGPOSTS = '/post/hashtag/';

export const TAGSUGGESTIONS = '/post/hashtags/search/';

// discover

export const DISCOVER = '/post/discover';

// notification

export const NOTIFICATIONSCOUNT = '/notifications/count';

export const MARKNOTIFICATION = '/notifications/read/';

export const GETALLNOTIFICATION = '/notifications';

// conversation calling api token

export const CALLACCESSTOKEN = '/conversations/huddle/accesstoken';
