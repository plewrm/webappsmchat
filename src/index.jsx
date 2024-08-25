import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store/Store'; // Import both store and persistor
import Firebase from './firebaseConfig';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Firebase>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </Firebase>
  </React.StrictMode>
);

reportWebVitals();
