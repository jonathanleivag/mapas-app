import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'

export const socketIoSlice = createSlice({
  name: 'socketio',
  initialState: {
    socket: io(process.env.REACT_APP_URI, { transports: ['websocket'] })
  },
  reducers: {}
})

export default socketIoSlice.reducer
