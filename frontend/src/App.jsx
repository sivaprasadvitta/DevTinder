import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Body from './pages/Body';
import Profile from './pages/profile';
import Feed from './pages/Feed';
// store
import { Provider } from 'react-redux';
import store, { persistor } from './utils/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}> {/* Parent - Body */}
              <Route path="/" element={<Feed />} /> {/* Default child - Feed */}
              <Route path="/login" element={<Login />} /> {/* Child-1 - Login */}
              <Route path="/profile" element={<Profile />} /> {/* Child-2 - Profile */}
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
