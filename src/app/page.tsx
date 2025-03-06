'use client'
//
import styles from "./page.module.css";
import Link from "next/link";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FaRegQuestionCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-modal';
import { ImCancelCircle } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";
//
import formatDate from '../utils/formatDate'
import { deleteProductsFromAPI, editProduct, getProductsFromAPI } from "../redux/slices/productsSlice"

export default function Home() {

	// Modal
	const [modalIsOpen, setModalIsOpen] = useState(false); // Modal window
	const [selectedProductId, setSelectedProductId] = useState();

	const openModal = (id) => {
		setSelectedProductId(id);
		setModalIsOpen(true); // Set the selected product id
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
				<button onClick={() => { closeModal(); handleDeleteProduct(selectedProductId) }}><GiConfirmed size={30} color='green' /></button>
			</div>
		</div >
	);
	// Modal end

	const dispatch = useDispatch()

	const handleDeleteProduct = (id) => {
		dispatch(deleteProductsFromAPI(id))
	}

	const handleEditProduct = (id) => {
		dispatch(editProduct(id))
	}

	const { status, error } = useSelector(state => state.products)

	useEffect(() => {
		dispatch(getProductsFromAPI());
	}, [dispatch]);

	const products = useSelector((state) => state.products.products)

	return (
		<div className={styles.page}>
			<div className={styles.productionHeader}>
				<h3>Products list</h3>
				<Link href={'/product-create'}><button className={styles.button}>Add new product</button ></Link>
			</div>

			{status === 'loading' && <h2>Loading...</h2>}
			{error && <h2>Something went wrong...</h2>}

			{products.length === 0 ? <p className={styles.noProductsFound}></p> : (
				<div className={styles.productionTable}>
					<table>
						<thead>
							<tr>
								<th>&#8470;</th>
								<th>Amount</th>
								<th>Packaging type</th>
								<th>Date of adding</th>
								<th>Status</th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>

							{products.map((product, index) => (
								<tr key={product.id}>
									<td>{++index}</td>
									<td>{product.packsNumber}</td>
									<td>{product.packageType}</td>
									<td>{formatDate(product.createdAt)}{product.updatedAt ? <p>Updated: {formatDate(product.updatedAt)}</p> : ''}</td>
									<td>{product.isArchived ? <p>Archived</p> : <p>Active</p>}</td>
									<td><button data-tooltip-id={`description-tooltip-${product.id}`} type="button"><FaRegQuestionCircle /></button></td>
									<td>
										<div className={styles.tableActions}>
											<button onClick={() => handleEditProduct(product.id)} type="button"><Link href={`/product-edit?id=${product.id}`}><FaPencilAlt /></Link></button>
											<button onClick={() => { openModal(product.id); }} type="button"><RiDeleteBin6Line size={16} /></button>
											<ReactTooltip
												id={`description-tooltip-${product.id}`}
												place="left"
												content={product.description || <p>No description aviable</p>}
												opacity={1}
												style={{ fontSize: '14px', width: '200px' }}
											/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)
			}
			<div>
				<Modal className={styles.modal} ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal}>
					{modalContent}
				</Modal>
			</div>
		</div >


	);
}
