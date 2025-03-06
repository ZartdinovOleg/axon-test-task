'use client'
import styles from "./page.module.css";
import Link from "next/link";
import { useForm } from 'react-hook-form'
import { editProductsFromAPI } from "@/redux/slices/productsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteProductsFromAPI } from "@/redux/slices/productsSlice";
import { useState } from "react";
import Modal from 'react-modal';
import { ImCancelCircle } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";

export default function Page() {
	const router = useRouter();

	// Get edited product id from query
	const searchParams = useSearchParams()
	const id = searchParams.get('id')
	//

	// Modal
	const [modalIsOpen, setModalIsOpen] = useState(false); // Modal window

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};
	// Modal window content
	const modalContent = (
		<div>
			<h2>Do you really want to delete?</h2>
			<div className={styles.buttonsModal}>
				<button onClick={closeModal}><ImCancelCircle size={30} color='red' /></button>
				<button onClick={() => { closeModal(); handleDeleteProduct(id) }}><GiConfirmed size={30} color='green' /></button>
			</div>
		</div >
	);
	// Modal end

	const dispatch = useDispatch()

	const handleDeleteProduct = (id) => {
		dispatch(deleteProductsFromAPI(id))
		router.push('/');
	}

	const products = useSelector((state) => state.products.products)

	const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();

	const editingProduct = products.find(product => product.id === id)

	if (editingProduct) {
		setValue('packsNumber', editingProduct.packsNumber)
		setValue('packageType', editingProduct.packageType)
		setValue('isArchived', editingProduct.isArchived)
		setValue('description', editingProduct.description)
	}

	const onSubmit = (data) => {
		if (data.packageType && data.packsNumber) {
			data.packageType = getValues('packageType')
			data.packsNumber = getValues('packsNumber')
			data.isArchived = getValues('isArchived')
			data.description = getValues('description')
			data.createdAt = editingProduct.createdAt
			const updatedData = { ...data, id, updatedAt: new Date().toISOString() };
			console.log(updatedData)
			dispatch(editProductsFromAPI(updatedData));
		}
		router.push('/');
	}

	return (
		<div className={styles.page}>
			<div className={styles.pageInner}>
				<div className={styles.productionHeader}>
					<h3>Edit product</h3>
					<p className={styles.headerTitle}>Please fill the information</p>
					<p className={styles.required}><span>*</span>required</p>

					<form id='product-form' className={styles.form} onSubmit={handleSubmit((onSubmit))}>
						<div className={styles.formItem}>
							<label htmlFor="amount">
								Amount of product<span>*</span>
							</label>
							<input type="text" id="amount" placeholder="Amount of product" {...register("packsNumber", { required: 'This is required' })}></input>
						</div>
						<p className={styles.formError}>{errors.packsNumber?.message}</p>

						<div className={styles.formItem}>
							<label htmlFor="packaging">
								Packiging type<span>*</span>
							</label>
							<select id="packaging" {...register("packageType", { required: 'This is required' })}>
								<option value="compression">compression</option>
								<option value="no compression">no compression</option>
							</select>
						</div>

						<div className={styles.formItem}>
							<label htmlFor="archive">
								Archived
							</label>
							<input type="checkbox" id="archive" placeholder="Archived" {...register("isArchived")}></input>
						</div>

						<div className={styles.formItem}>
							<label htmlFor="description">
								Description
							</label>
							<textarea id="description" rows={3} {...register("description")}>
							</textarea>
						</div>

					</form>

				</div>
				<div className={styles.buttons}>
					<button className={styles.buttonDelete} onClick={() => openModal(id)}>Delete</button>
					<Link href={'/'}><button className={styles.buttonCancel}>Cancel</button ></Link>
					<button form='product-form' type='submit' className={styles.buttonAdd}>Save</button>
				</div>
			</div>
			<div>
				<Modal className={styles.modal} ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal}>
					{modalContent}
				</Modal>
			</div>
		</div>
	)
}