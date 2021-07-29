import { configureStore } from '@reduxjs/toolkit'
import socket from './slice/socketIoSlice'
import ReduxThunk from 'redux-thunk'

export default configureStore({
  reducer: { socket },
  middleware: [ReduxThunk]
})
