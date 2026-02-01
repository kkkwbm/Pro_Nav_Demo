import { configureStore } from '@reduxjs/toolkit'
import clientsReducer from './slices/clientsSlice'
import notificationsReducer from './slices/notificationsSlice'

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    notifications: notificationsReducer,
  },
})