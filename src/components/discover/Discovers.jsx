// import React, { useEffect, useState } from 'react';
// import Posts from '../pages/userpost/Posts'
// import { useTheme } from '../../context/ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import leftBack from '../../assets/icons/dark_mode_arrow_left.svg';
// import leftBackLight from '../../assets/icons/arrow-left-lightMode.svg';
// import Larrow from '../../../public/icon/arrow-left.svg'
// import Larrowlight from '../../../public/icon/arrow-left-light.svg'
// import DiscoverTimeLinesPosts from '../pages/userpost/DiscoverTimeLinePosts';
// import './Discover.css'
// // import { BASE_URL } from '../../api/EndPoint';
// import { BASE_URL, BEARER_TOKEN, DISCOVER } from '../../api/EndPoint';
// import axios from 'axios';
// import defaultProfile from '../../assets/icons/Default_pfp.webp';
// import { getDate } from '../../utils/time';
// import Search from '../pages/Search';
// import SearchComponent from '../search/SearchComponent';

// const Discovers = () => {
//   const { isDarkMode } = useTheme();
//   const navigate = useNavigate();
//   const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth <= 500);
//   const [timeLine, setTimeline] = useState(null);
//   const [textPosts, setTextPosts] = useState([]);
//   const [mediaPosts, setMediaPosts] = useState([]);
//   const [postClicked, setPostClicked] = useState(false); // Adjust as per actual use case
//   const [searchValue, setSearchValue] = useState('')

//   // Define a function that returns another function to handle click events
//   const handlePostClick = (hash) => () => {
//     setPostClicked(hash); // Adjust this line according to how you handle state
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsScreenLarge(window.innerWidth <= 500);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     getTimeline();
//   }, [])

//   const [loading, setLoading] = useState(false)
//   const getTimeline = async () => {
//     setLoading(true)
//     try {
//       const headers = {
//         'Authorization': `Bearer ${BEARER_TOKEN ? BEARER_TOKEN : sessionStorage.getItem("token")}`,
//         'Content-Type': 'application/json',
//       };
//       const response = await axios.get(`${BASE_URL}${DISCOVER}`, { headers });
//       setTimeline(response.data.posts)
//       setTextPosts(response.data.posts.filter(post => post.type === 2))
//       setMediaPosts(response.data.posts.filter(post => post.type !== 2))
//       console.log(response.data.posts.filter(post => post.type !== 2))
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false)
//     }
//   }

//   // const [imgNum, setImgNum] = useState(0)
//   // useEffect(()=>{
//   //   const timeOut = setTimeout(()=>{
//   //     setImgNum((prev) => prev+1)
//   //   },2000)
//   //   return () => clearTimeout(timeOut)
//   // },[imgNum])

//   const handleMobileBack = () => {
//     navigate('/homepage')
//   }

//   const displayRemainingTextPosts = (startIndex) => {
//     let remainingTextPosts = []; // Array to store text post components

//     for (let i = startIndex; i < textPosts.length; i++) {
//       const textPostComponent = displayTextPost(i); // Pass current index to displayTextPost function
//       remainingTextPosts.push(textPostComponent); // Push the text post component to the array
//     }

//     return remainingTextPosts; // Return the array of text post components
//   }

//   const goToProfile = (event, post) => {
//     event.preventDefault();
//     navigate(`/profile/${post.author.username}/${post.author.soconId}`, { state: { soconId: post.author.soconId } });
//   };

//   const displayTextPost = (index) => { // Pass index as parameter
//     if (index < textPosts.length && textPosts[index].isARepost) {
//       while (index < textPosts.length && textPosts[index].isARepost) {
//         index++; // Increment index
//       }
//     }
//     let textDisplay = (<></>);
//     if (index >= textPosts.length) {
//       return textDisplay;
//     }
//     textDisplay = (
//       <div className='textPosts-card'>
//         <div className='header-pro-container'>
//           <div className='post-profile-container'>
//             {textPosts[index].author.pfp ? (
//               <img src={textPosts[index].author.pfp ? textPosts[index].author.pfp : defaultProfile} className='post-profile' alt='profile-pic' />
//             ) : (
//               <img src={`https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg`} className='post-profile' alt='profile-pic' />
//             )}
//           </div>

//           <div className='post-name-container' onClick={(e) => goToProfile(e, textPosts[index])}>
//             <p className={isDarkMode ? 'post-name' : 'd-post-name'}>{textPosts[index].author.display_name}</p>
//           </div>

//           <div className='post-id-container'>
//             <p className={isDarkMode ? 'post-id' : 'd-post-id'}>{"@" + textPosts[index].author.username}</p>
//           </div>

//           <div className='post-time-container'>
//             <p className={isDarkMode ? 'post-time' : 'd-post-time'}>{getDate(textPosts[index].createdAt)}</p>
//           </div>
//         </div>
//         <p style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }} >
//           {textPosts[index].text}
//         </p>
//       </div>
//     );
//     return textDisplay;
//   }

//   // useEffect(()=>{
//   //   if(searchValue.length > 0){

//   //   }
//   // },[searchValue])

//   return (

//     <div style={{ background: isDarkMode ? '#FCFCFC' : '#110E18', minHeight: '100vh', borderRadius: '16px', padding: '20px' }}>
//       {isScreenLarge ? (
//         <div className={isDarkMode ? 'mobileBackContainer' : 'd-mobileBackContainer'}>
//           <div className='leftBackContainer' onClick={handleMobileBack}>
//             <img src={isDarkMode ? Larrowlight : Larrow} alt='back' className='leftBack' />
//           </div>
//           <div className='mobileBackTittleContainer'>
//             <p className={isDarkMode ? 'mobileBackTittle' : 'd-mobileBackTittle'}>Discover</p>
//           </div>
//         </div>
//       ) : (
//         <p className='discoverHeader' style={{ color: isDarkMode ? '#363636' : '#FCFCFC' }}>Discovers</p>
//       )}

//       {
//         searchValue.length > 0 ? <SearchComponent close={() => setSearchValue('')} searchByDiscover={true} discoverSearchValue={searchValue} />
//           :
//           <>
//             {/* <div className='searchTextContainer_input'>
//               <input className={isDarkMode ? 'searchText_input' : 'd-searchText_input'}
//                 placeholder='Search users, hashtags here...'
//                 onChange={(e) => setSearchValue(e.target.value.trim()
//                 )} value={searchValue} type='text'
//               />
//             </div> */}
//             <div className='message-search-bar-containers'
//               style={{ marginBottom: '4%' }}>
//               <div className={isDarkMode ? 'message-search-bar-container' : 'd-message-search-bar-container'}>
//                 <div className='meaasge-search-icon-container'>
//                   <img src={isDarkMode ? '/lightIcon/searchLight.svg' : '/darkIcon/searchDark.svg'} alt='search' className='message-search-icon' />
//                 </div>
//                 <input value={searchValue} onChange={(e) => setSearchValue(e.target.value.trim())} type='text' className={isDarkMode ? 'message-search-input' : 'd-message-search-input'} placeholder='Search Posts' />
//               </div>
//             </div>

//             {
//               loading && <div className='loaderContainer'>
//                 <div className={isDarkMode ? 'loader' : 'd-loader'}></div>
//               </div>
//             }

//             {!postClicked && <div >
//               {mediaPosts?.map((item, index) => (
//                 <>
//                   {/* Display a text post every six posts */}
//                   {index % 6 === 0 && index !== 0 && (
//                     <div className={isDarkMode ? 'textCard' : 'd-textCard'} key={`text-${index}`}>
//                       <div onClick={handlePostClick(textPosts[Math.floor(index / 6) - 1].hash)}>
//                         {/* {textPosts[Math.floor(index / 6) - 1].text} */}
//                         {
//                           displayTextPost(Math.floor(index / 6) - 1)
//                         }
//                       </div>
//                     </div >
//                   )}

//                   {/* Start a new row for every three media posts */}
//                   {index % 3 === 0 && (
//                     <div key={`media-${index}`} className='imageCards'>
//                       {mediaPosts.slice(index, index + 3).map((subItem, subIndex) => (
//                         <div key={subIndex} className='discoverCard' onClick={handlePostClick(item.hash)}>
//                           {
//                             subItem.images[0].type === 0 ?
//                               // imgNum % subItem.images.length
//                               <img src={subItem.images[0]?.url} alt='img-ref' className='eachCardImg' />
//                               :
//                               // <img src={subItem.images[0]?.url} alt='img-refffsad' className='eachCardImg' />
//                               <video className="eachCardImg" controls>
//                                 <source src={subItem.images[0]?.url} type="video/mp4" />
//                               </video>
//                           }

//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ))}
//               {displayRemainingTextPosts(Math.floor(mediaPosts.length / 6)).map((textPostComponent, index) => (
//                 <div className='textCard' key={`text-${index}`}>
//                   {textPostComponent}
//                 </div>
//               ))}
//             </div>}
//             {postClicked && <DiscoverTimeLinesPosts isDiscover={true}  dataItems={timeLine} postClicked={postClicked} />}
//           </>
//       }

//     </div >

//   )
// }

// export default Discovers;

import React, { useEffect, useState } from 'react';
import Posts from '../pages/userpost/Posts';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import leftBack from '../../assets/icons/dark_mode_arrow_left.svg';
import leftBackLight from '../../assets/icons/arrow-left-lightMode.svg';

const Discovers = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMobileBack = () => {
    navigate('/homepage');
  };

  return (
    <div
      style={{
        background: isDarkMode ? '#FCFCFC' : '#110E18',
        minHeight: '100vh',
        borderRadius: '16px',
        overflowX: 'hidden'
      }}
    >
      {isMobileView && (
        <div className={isDarkMode ? 'mobileBackContainer' : 'd-mobileBackContainer'}>
          <div className="leftBackContainer" onClick={handleMobileBack}>
            <img src={isDarkMode ? leftBackLight : leftBack} alt="back" className="leftBack" />
          </div>
          <div className="mobileBackTittleContainer">
            <p className={isDarkMode ? 'mobileBackTittle' : 'd-mobileBackTittle'}>Discovers</p>
          </div>
        </div>
      )}
      <Posts isDiscover={true} />
    </div>
  );
};

export default Discovers;
