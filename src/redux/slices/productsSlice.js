import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'

const API_URL = 'http://localhost:8000/productTypes/'

export const getProductsFromAPI = createAsyncThunk(
	'products/getProductsFromAPI',
	async function (_, { rejectWithValue }) {
		try {
			const res = await axios.get(`${API_URL}`)
			if (!res.statusText === 'OK') {
				throw new Error('Something went wrong...')
			}
			res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			return res.data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const deleteProductsFromAPI = createAsyncThunk(
	'products/deleteProductsFromAPI',
	async function (id, { rejectWithValue, dispatch }) {
		try {
			const res = await axios.delete(`${API_URL}${id}`)
			if (!res.statusText === 'OK') {
				throw new Error('Something went wrong...')
			}
			dispatch(deleteProduct({ id }))
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const addProductsFromAPI = createAsyncThunk(
	'products/addProductsFromAPI',
	async function (data, { rejectWithValue, dispatch }) {
		try {
			const res = await axios.post(`${API_URL}`, {
				id: uuidv4(),
				createdAt: new Date().toISOString(),
				packsNumber: data.packsNumber,
				packageType: data.packageType,
				isArchived: data.isArchived,
				description: data.description
			})

			if (!res.statusText === 'OK') {
				throw new Error('Something went wrong...')
			}
			dispatch(addProduct(res.data))
		} catch (error) {
			return rejectWithValue(error.message)

		}
	}
)

export const editProductsFromAPI = createAsyncThunk(
	'products/editProductsFromAPI',
	async function (updatedData, { rejectWithValue, dispatch }) {
		try {
			const res = await axios.put(`http://localhost:8000/productTypes/${updatedData.id}`, {
				id: updatedData.id,
				updatedAt: updatedData.updatedAt,
				createdAt: updatedData.createdAt,
				packsNumber: updatedData.packsNumber,
				packageType: updatedData.packageType,
				isArchived: updatedData.isArchived,
				description: updatedData.description
			})
			console.log(updatedData)
			if (!res.statusText === 'OK') {
				throw new Error('Something went wrong...')
			}
			dispatch(editProduct(updatedData))
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

const setError = (state, action) => {
	state.status = 'failed'
	state.error = action.payload
}

const productsSlice = createSlice({
	name: 'products',
	initialState: {
		products: [],
		status: 'loading',
		error: null
	},
	reducers: {
		addProduct: (state, action) => {
			state.products.push(action.payload)
		},
		deleteProduct: (state, action) => {
			state.products = state.products.filter((product) => product.id !== action.payload.id)
		},
		editProduct: (state, action) => {
			const index = state.products.findIndex(product => product.id === action.payload.id);
			console.log(index)
			console.log(action.payload)
			if (index !== -1) {
				state.products.find[(product => product.index === index)] = action.payload
			}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProductsFromAPI.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(getProductsFromAPI.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.products = action.payload
			})
			.addCase(getProductsFromAPI.rejected, setError)
			.addCase(deleteProductsFromAPI.rejected, setError)
			.addCase(editProductsFromAPI.rejected, setError)
	}
})

export const { addProduct, deleteProduct, setProducts, editProduct } = productsSlice.actions

export default productsSlice.reducer 