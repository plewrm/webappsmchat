import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    isCreatePostModalOpen: false,
    activeTab: 1, // Add activeTab to track the active tab
    shareModalOpen: false,
    repostModalOpen: false,
    moreModalOpen: false,
    saveModalOpen: false,
    wavenearbyModalOpen: false,
    userProfile: false,
    opponentProfile: false,
    spinbuzzModalOpen: false,
    anonymousspinBuzz: false,
    spinbuzzMessageModalOpen: false,
    spinChatMoreModalOpen: false,
    isRevealProfile: false,
    revealProfile: false,
    storyViewModal: false,
    userLikeListModal: false,
    userRepostListModal: false,
    openAddHighLightModal: false,
    notificationModal: false,
    privacyModal: false,
    expandPostModal: false, // expandpost
    selectedPost: null, // to select post
    messageAddGroup: false,
    // anonymousView: false,
    anonymousCreateProfile: false,
    editProfile: false,
    selectnearByProfile: null,
    saveAddCollection: false,
    savedMoreOption: false,
    anonymousNotification: false,
    anonymousSelfProfile: false,
    messageHomeScreen: false,
    highlightStoryView: false,
    discoverView: false,
    globalSearchScreen: false,
    anonymousPostMoreOption: false,
    anonymousCommunityMore: false,
    isHomeSelected: true,
    isAnonymousHomeSelected: true,
    anonymousLeaveCommunity: false,
    anonymousJoinedMore: false,
    createdCommunityMore: false,
    viewRepost: false,
    commentMention: false,
    soconIdByParams: null,
    usernameByParams: null,
    showCoverStory: false, // for story highlight
    showChangeName: false, // for story highlight
    showChangeCover: false, // for story highlight
    hashTag: '',
    deleteCover: false,
    selectedMedia: [], // for select image or video from gallery for createpost Non Anonymous
    mediaFiles: [], // for select image or video from gallery for createpost  Anonymous
    showPollInputs: false, // this is for poll
    newFeature: false,
    openCommunity: false, // for open community in anon
    showFollowing: false,
    viewProfile: false,
    viewCover: false,
    deleteAccountModal: false,
    logoutAccountModal: false,
    previousPath: null,
    anonGlobalSearchScreen: false,
    showReportModal: false,
    showReportUserModal: false,
    savePostModal: false,
    addCollectionModal: false,
    scrollPosition: 0,
    unSavePosts: false,
    collectionData: []
  },
  reducers: {
    setnearByProfile: (state, action) => {
      state.selectnearByProfile = action.payload;
    },
    openCreatePostModal: (state) => {
      state.isCreatePostModalOpen = true;
    },
    closeCreatePostModal: (state) => {
      state.isCreatePostModalOpen = false;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetActiveTab: (state) => {
      state.activeTab = 1; // Reset active tab to 1 when closing the modal
    },
    openShareModal: (state) => {
      state.shareModalOpen = true;
    },
    closeShareModal: (state) => {
      state.shareModalOpen = false;
    },
    openRepostModal: (state) => {
      state.repostModalOpen = true;
    },
    closeRepostModal: (state) => {
      state.repostModalOpen = false;
    },
    openMoreModal: (state) => {
      state.moreModalOpen = true;
    },
    closeMoreModal: (state) => {
      state.moreModalOpen = false;
    },
    openSaveModal: (state) => {
      state.saveModalOpen = true;
    },
    closeSaveModal: (state) => {
      state.saveModalOpen = false;
    },
    openWaveNearbyModal: (state) => {
      state.wavenearbyModalOpen = true;
    },
    closeWaveNearbyModal: (state) => {
      state.wavenearbyModalOpen = false;
    },
    openuserProfileModal: (state) => {
      state.userProfile = true;
    },
    closeuserProfile: (state) => {
      state.userProfile = false;
    },
    openspinbuzzModal: (state) => {
      state.spinbuzzModalOpen = true;
    },
    closespinbuzzModal: (state) => {
      state.spinbuzzModalOpen = false;
    },
    openSpinbuzzMessageModal: (state) => {
      state.spinbuzzMessageModalOpen = true;
    },
    closeSpinbuzzMessageModal: (state) => {
      state.spinbuzzMessageModalOpen = false;
    },
    openSpinChatMoreModal: (state) => {
      state.spinChatMoreModalOpen = true;
    },
    closeSpinChatMoreModal: (state) => {
      state.spinChatMoreModalOpen = false;
    },
    openRevealProfileModal: (state) => {
      state.isRevealProfile = true;
    },
    closeRevealProfileModal: (state) => {
      state.isRevealProfile = false;
    },
    openRevealProfile: (state) => {
      state.revealProfile = true;
    },
    closeRevealProfile: (state) => {
      state.revealProfile = false;
    },
    openStoryViewModal: (state) => {
      state.storyViewModal = true;
    },
    closeStoryViewModal: (state) => {
      state.storyViewModal = false;
    },
    setUserLikeListModal: (state, action) => {
      state.userLikeListModal = action.payload;
    },
    setOpenAddHighLightModal: (state, action) => {
      state.openAddHighLightModal = action.payload;
    },
    setNotificationModal: (state, action) => {
      state.notificationModal = action.payload;
    },
    setPrivacyModal: (state, action) => {
      state.privacyModal = action.payload;
    },
    setExpandPostModal: (state, action) => {
      state.expandPostModal = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setMessageAddGroup: (state, action) => {
      state.messageAddGroup = action.payload;
    },
    // setAnonymousView: (state, action) => {
    //   state.anonymousView = action.payload;
    // },
    setAnonymousCreateProfile: (state, action) => {
      state.anonymousCreateProfile = action.payload;
    },
    setEditProfile: (state, action) => {
      state.editProfile = action.payload;
    },
    setOpponentProfile: (state, action) => {
      state.opponentProfile = action.payload;
    },
    setAnonymousspinBuzz: (state, action) => {
      state.anonymousspinBuzz = action.payload;
    },
    setsaveAddCollection: (state, action) => {
      state.saveAddCollection = action.payload;
    },
    setSavedMoreOption: (state, action) => {
      state.savedMoreOption = action.payload;
    },
    setAnonymousNotification: (state, action) => {
      state.anonymousNotification = action.payload;
    },
    setAnonymousSelfProfile: (state, action) => {
      state.anonymousSelfProfile = action.payload;
    },
    setMessageHomeScreen: (state, action) => {
      state.messageHomeScreen = action.payload;
    },
    setHighlightStoryView: (state, action) => {
      state.highlightStoryView = action.payload;
    },
    setDiscoverView: (state, action) => {
      state.discoverView = action.payload;
    },
    setGlobalSearchScreen: (state, action) => {
      state.globalSearchScreen = action.payload;
    },
    setAnonymousPostMoreOption: (state, action) => {
      state.anonymousPostMoreOption = action.payload;
    },
    setAnonymousCommunityMore: (state, action) => {
      state.anonymousCommunityMore = action.payload;
    },
    setIsHomeSelected: (state, action) => {
      state.isHomeSelected = action.payload;
    },
    setIsAnonymousHomeSelected: (state, action) => {
      state.isAnonymousHomeSelected = action.payload;
    },
    setAnonymousLeaveCommunity: (state, action) => {
      state.anonymousLeaveCommunity = action.payload;
    },
    setAnonymousJoinedMore: (state, action) => {
      state.anonymousJoinedMore = action.payload;
    },
    setCreatedCommunityMore: (state, action) => {
      state.createdCommunityMore = action.payload;
    },
    setViewRepost: (state, action) => {
      state.viewRepost = action.payload;
    },
    setUserRepostListModal: (state, action) => {
      state.userRepostListModal = action.payload;
    },
    setCommentMention: (state, action) => {
      state.commentMention = action.payload;
    },
    setSoconIdByParams: (state, action) => {
      state.soconIdByParams = action.payload;
      console.log(state.soconIdByParams);
    },
    setUsernameByParams: (state, action) => {
      state.usernameByParams = action.payload;
      console.log(state.soconIdByParams);
    },
    setShowCoverStory: (state, action) => {
      state.showCoverStory = action.payload;
    },
    setShowChangeCover: (state, action) => {
      state.showChangeCover = action.payload;
    },
    setShowChangeName: (state, action) => {
      state.showChangeName = action.payload;
    },
    setHashtag: (state, action) => {
      state.hashTag = action.payload;
    },
    setDeleteCover: (state, action) => {
      state.deleteCover = action.payload;
    },
    setSelectedMedia: (state, action) => {
      state.selectedMedia = action.payload;
    },
    clearSelectedMedia: (state) => {
      state.selectedMedia = [];
    },
    setMediaFiles(state, action) {
      state.mediaFiles = action.payload;
    },
    clearMediaFiles(state) {
      state.mediaFiles = [];
    },
    setShowPollInputs: (state, action) => {
      // Add this reducer
      state.showPollInputs = action.payload;
    },
    setNewFeature: (state, action) => {
      state.newFeature = action.payload;
    },
    setOpenCommunity: (state, action) => {
      state.openCommunity = action.payload;
    },
    setShowFollowing: (state, action) => {
      state.showFollowing = action.payload;
    },
    setViewProfile: (state, action) => {
      state.viewProfile = action.payload;
    },
    setViewCover: (state, action) => {
      state.viewCover = action.payload;
    },
    setDeleteAccountModal: (state, action) => {
      state.deleteAccountModal = action.payload;
    },
    setLogoutAccountModal: (state, action) => {
      state.logoutAccountModal = action.payload;
    },
    setPreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
    clearPreviousPath: (state) => {
      state.previousPath = null;
    },
    setAnonGlobalSearchScreen: (state, action) => {
      state.anonGlobalSearchScreen = action.payload;
    },
    setShowReportModal: (state, action) => {
      state.showReportModal = action.payload;
    },
    setShowReportUserModal: (state, action) => {
      state.showReportUserModal = action.payload;
    },
    setSavePostModal: (state, action) => {
      state.savePostModal = action.payload;
    },
    setAddCollectionModal: (state, action) => {
      state.addCollectionModal = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    setUnSavePosts: (state, action) => {
      state.unSavePosts = action.payload;
    },
    setCollectionData: (state, action) => {
      state.collectionData = action.payload;
    }
  }
});

export const {
  openCreatePostModal,
  closeCreatePostModal,
  openShareModal,
  openRepostModal,
  openMoreModal,
  openSaveModal,
  openWaveNearbyModal,
  openuserProfileModal,
  openspinbuzzModal,
  openSpinbuzzMessageModal,
  openSpinChatMoreModal,
  openRevealProfileModal,
  openRevealProfile,
  openStoryViewModal,
  closeMoreModal,
  closeShareModal,
  closeRepostModal,
  closeSaveModal,
  closeWaveNearbyModal,
  closeuserProfile,
  closespinbuzzModal,
  closeSpinbuzzMessageModal,
  closeSpinChatMoreModal,
  closeRevealProfileModal,
  closeRevealProfile,
  closeStoryViewModal,
  setUserLikeListModal,
  setOpenAddHighLightModal,
  setNotificationModal,
  setPrivacyModal,
  setExpandPostModal,
  setSelectedPost,
  setMessageAddGroup,
  // setAnonymousView,
  setAnonymousCreateProfile,
  setEditProfile,
  setnearByProfile,
  setOpponentProfile,
  setAnonymousspinBuzz,
  setsaveAddCollection,
  setSavedMoreOption,
  setAnonymousNotification,
  setAnonymousSelfProfile,
  setMessageHomeScreen,
  setHighlightStoryView,
  setDiscoverView,
  setGlobalSearchScreen,
  setAnonymousPostMoreOption,
  setAnonymousCommunityMore,
  setIsHomeSelected,
  setIsAnonymousHomeSelected,
  setAnonymousLeaveCommunity,
  setAnonymousJoinedMore,
  setCreatedCommunityMore,
  setViewRepost,
  setUserRepostListModal,
  setCommentMention,
  setSoconIdByParams,
  setUsernameByParams,
  setShowCoverStory,
  setShowChangeCover,
  setShowChangeName,
  setActiveTab,
  resetActiveTab,
  setHashtag,
  setDeleteCover,
  setSelectedMedia,
  clearSelectedMedia,
  setMediaFiles,
  clearMediaFiles,
  setShowPollInputs,
  setNewFeature,
  setOpenCommunity,
  setShowFollowing,
  setViewProfile,
  setViewCover,
  setDeleteAccountModal,
  setLogoutAccountModal,
  setPreviousPath,
  clearPreviousPath,
  setAnonGlobalSearchScreen,
  setShowReportModal,
  setShowReportUserModal,
  setSavePostModal,
  setAddCollectionModal,
  setScrollPosition,
  setUnSavePosts,
  setCollectionData
} = modalSlice.actions;
export const selectIsCreatePostModalOpen = (state) => state.modal.isCreatePostModalOpen;
export default modalSlice.reducer;
