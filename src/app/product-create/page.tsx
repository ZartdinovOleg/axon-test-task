'use client'
//
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../hooks'
//
import styles from "./page.module.css";
import Link from "next/link";
import { addProductsFromAPI } from '../../redux/slices/productsSlice'
import { TypeProduct } from '@/types/Product';


export default function Page() {
	const router = useRouter();
	const dispatch = useAppDispatch()

	const { register, handleSubmit, formState: { errors } } = useForm<TypeProduct>({
		defaultValues: {
			id: '',
			packsNumber: null,
			packageType: 'compression',
			isArchived: true,
			description: '',
			createdAt: ''
		},
	}
	);

	const onSubmit = (data: TypeProduct) => {
		if (data.packageType && data.packsNumber) {
			dispatch(addProductsFromAPI(data))
		}
		router.push('/');
	}

	return (
		<div className={styles.page}>
			<div className={styles.pageInner}>
				<div className={styles.productionHeader}>
					<h3>Create new product</h3>
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
							<textarea id="description" placeholder="Add description" rows={3} {...register("description")}>
							</textarea>
						</div>

					</form>
				</div>
				<div className={styles.buttons}>
					<Link href={'/'}><button className={styles.buttonCancel}>Cancel</button ></Link>
					<button form='product-form' type='submit' className={styles.buttonAdd}>Add</button>
				</div>
			</div>
		</div>
	)
}