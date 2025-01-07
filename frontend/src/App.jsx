import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Body from './pages/Body'
import Profile from './pages/profile'
import Feed from './pages/Feed'
// store
import { Provider } from 'react-redux'
import store from './utils/store'

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Body />}> {/*parent -Body*/}
              <Route path='/' element={<Feed/>}/>
              <Route path='/login' element={<Login />} /> {/*child-1 -Login*/}
              <Route path='/profile' element={<Profile />} /> {/*child-2  -Profile*/}
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>

    </>
  )
}

export default App