import { configureStore } from "@reduxjs/toolkit";
import productReducer from './slices/productsSlice'

const store = configureStore({
	reducer: {
		products: productReducer
	}
})

export default store