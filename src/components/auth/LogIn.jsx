import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { FaGoogle } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Input from '../styled/Input';
import Button from '../styled/Button';
import CheckBox from '../styled/CheckBox';

import { logIn, googleSignIn } from '../../redux/authSlice';

const LogIn = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	const validation = Yup.object({
		email: Yup.string().trim()
		.email()
		.required('Must enter an email address'),
		password: Yup.string().trim()
		.min(6, 'Must be at least 6 characters')
		.required('Must enter a password')
	});

	const onGoogleSignIn = async () => {
		try {
			await dispatch(googleSignIn()).unwrap();
			navigate('/tasks')
		} catch(error) {
			console.log('Failed to log in: ' + error.message);
		}
	}

	const handleFormSubmit = async (values) => {
		const {email, password} = values;
		try {
			await dispatch(logIn({ email, password })).unwrap();
			navigate('/tasks')
		} catch(error) {
			console.log('Failed to log in: ' + error.message);
		}
	}

	return (
		<>
			<Formik
			initialValues={{
				email: '',
				password: '',
				passwordVisible: false,
			}}
			validationSchema={validation}
			onSubmit={(values) => handleFormSubmit(values)}
			>
			{(formik) => (
				<form onSubmit={formik.handleSubmit}
				className='flex flex-col bg-ivory text-gunmetal
				gap-2 px-6 py-3 text-[0.75em] sm:w-[80%] w-full'>
					<h1 className='font-semibold text-center text-[1.4em]
					w-full'>
						Welcome back!
					</h1>
					<Button type='button' onClick={onGoogleSignIn}>
						<FaGoogle className='text-[14px]' />
						<p>Sign In With Google</p>
					</Button>
					<span className='w-full text-center p-3 relative'>
						<hr className='border-slate-400'></hr>
						<p className='absolute top-1/2 left-1/2
						-translate-x-1/2 -translate-y-1/2 z-10
						px-2 bg-ivory text-[10px]'>
							Or Sign In With Email
						</p>
					</span>
					<Input 
						label='Email Address*'
						type='email'
						id='email' 
						touched={formik.touched.email}
						error={formik.errors.email}
						placeholder='e.g. johndoe@gmail.com'
						autoComplete='new-password'
						{...formik.getFieldProps('email')} />
					<Input 
						label='Password*'
						type={formik.values.passwordVisible ? 'text' : 'password'}
						id='password' 
						touched={formik.touched.password}
						error={formik.errors.password}
						placeholder='e.g. johndoe123'
						autoComplete='new-password'
						{...formik.getFieldProps('password')} />
					<span className='flex text-[0.75em] py-1
					justify-between w-full'>
						<CheckBox
							id='passwordVisible'
							name='passwordVisible'
							checked={formik.values.passwordVisible}
							{...formik.getFieldProps('passwordVisible')}> 
							Show Password
						</CheckBox>
						<Link className='underline hover:text-blush
						transition duration-300 ease-in-out' 
						to=''>Forget password?</Link>
					</span>
					<Button type='submit'>
						Sign In
					</Button>
					<input autoComplete="false" 
					name="hidden" type="text" 
					className='hidden' />
					<span className='px-1 mt-2 flex gap-1 w-full'>
						<p>Not registered yet?</p>
						<Link to='/auth/signup' className='underline hover:text-blush
						transition duration-300 ease-in-out'>
							Create an Account
						</Link>
					</span>
				</form>
			)}
			</Formik>
		</>
	);
}

export default LogIn