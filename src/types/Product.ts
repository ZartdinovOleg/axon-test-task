export type TypeProduct = {
	id: string,
	createdAt: string,
	packsNumber: number | null,
	packageType: string,
	isArchived: boolean,
	description?: string,
	updatedAt?: string
}

export type ProductsState = {
	products: TypeProduct[],
	status: string,
	error: string | null
}