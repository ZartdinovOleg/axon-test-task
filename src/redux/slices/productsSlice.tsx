import { createAsyncThunk, createSlice, UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'
import { TypeProduct, ProductsState } from "@/types/Product";

const initialState: ProductsState = {
	products: [],
	status: 'succeeded',
	error: null
}

// const API_URL = 'http://localhost:8000/productTypes/'
const API_URL = 'https://d49sv2-8080.csb.app/productTypes/'

export const getProductsFromAPI = createAsyncThunk<TypeProduct[], undefined, { rejectValue: string }>(
	'products/getProductsFromAPI',
	async function (_, { rejectWithValue }) {
		const res = await axios.get(`${API_URL}`)
		if (res.status !== 200) {
			return rejectWithValue('Some error happened')
		}
		res.data.sort((a: TypeProduct, b: TypeProduct) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		);
		return res.data
	}
)

export const addProductsFromAPI = createAsyncThunk<TypeProduct, TypeProduct, { rejectValue: string }>(
	'products/addProductsFromAPI',
	async function (data, { rejectWithValue }) {
		const res = await axios.post(`${API_URL}`, {
			id: uuidv4(),
			createdAt: new Date().toISOString(),
			packsNumber: data.packsNumber,
			packageType: data.packageType,
			isArchived: data.isArchived,
			description: data.description
		})
		if (res.status !== 201) {
			return rejectWithValue('Some error happened')
		}
		return res.data as TypeProduct
	}
)

export const deleteProductsFromAPI = createAsyncThunk<TypeProduct, string, { rejectValue: string }>(
	'products/deleteProductsFromAPI',
	async function (id, { rejectWithValue, }) {
		const res = await axios.delete(`${API_URL}${id}`)
		if (res.status !== 200) {
			return rejectWithValue('Some error happened')
		}
		return res.data as TypeProduct
	}
)


export const editProductsFromAPI = createAsyncThunk<TypeProduct, TypeProduct, { rejectValue: string }>(
	'products/editProductsFromAPI',
	async function (updatedData, { rejectWithValue }) {
		const res = await axios.put(`${API_URL}${updatedData.id}`, {
			id: updatedData.id,
			updatedAt: updatedData.updatedAt,
			createdAt: updatedData.createdAt,
			packsNumber: updatedData.packsNumber,
			packageType: updatedData.packageType,
			isArchived: updatedData.isArchived,
			description: updatedData.description
		})
		if (res.status !== 200) {
			return rejectWithValue('Some error happened')
		}
		return res.data as TypeProduct
	}
)

const isError = (action: UnknownAction) => {
	return action.type.endsWith('rejected')
}

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			/// Get the products from server
			.addCase(getProductsFromAPI.pending, (state) => {
				state.status = 'loading'
				state.error = null
			})
			.addCase(getProductsFromAPI.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.error = null
				state.products = action.payload
			})
			/// Add the product to server
			.addCase(addProductsFromAPI.pending, (state) => {
				state.error = null
			})
			.addCase(addProductsFromAPI.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.products.push(action.payload)
			})
			/// Delete the product from server
			.addCase(deleteProductsFromAPI.pending, (state) => {
				state.error = null
			})
			.addCase(deleteProductsFromAPI.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.products = state.products.filter((product) => product.id !== action.payload.id)
			})
			/// Edit the product on server
			.addCase(editProductsFromAPI.pending, (state) => {
				state.error = null
			})
			.addCase(editProductsFromAPI.fulfilled, (state, action) => {
				state.status = 'succeeded'
				const index = state.products.findIndex(product => product.id === action.payload.id);
				if (index !== -1) {
					state.products[index] = action.payload;
					// state.products.find[(product => product.index === index)] = action.payload
				}
			})
			.addMatcher(isError, (state) => {
				state.error = 'error'
				state.status = "rejected"
			})

	}
})

export default productsSlice.reducer