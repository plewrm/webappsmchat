import React from 'react';
import { FirebaseProvider } from '@useweb/firebase/useFirebase';
import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBBxI30RVs9ogbbIwMx80PpvzAJYBmumlg',
  authDomain: 'socon-41444.firebaseapp.com',
  projectId: 'socon-41444',
  storageBucket: 'socon-41444.appspot.com',
  messagingSenderId: '629265353230',
  appId: '1:629265353230:web:83b55f8d2f5b92c6b34a5f',
  measurementId: 'G-JSLVTW93L1'
};

const firebaseApp = initializeApp(firebaseConfig);

// Messaging is not supported in ios or safari as of 2022
const messagingIsSupported = await isSupported();
// need to export this messaging instance later for notification
export const messaging = messagingIsSupported ? getMessaging(firebaseApp) : undefined;

const envIsDev = 'development';
const vapidKey =
  'BObHGkn8LvuoqnFeKow54RENqgJHzM4_BiOycir_zA1_cTt_7zXl8nvjdu4yBAYm_EDIfFrPxlJc7gZthp_vSzc';

export default function Firebase({ children }) {
  return (
    <FirebaseProvider
      firebaseConfig={firebaseConfig}
      firebaseApp={firebaseApp}
      envIsDev={envIsDev}
      messaging={messaging}
      messagingOptions={{
        vapidKey
      }}
    >
      {children}
    </FirebaseProvider>
  );
}
