import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { FaGoogle } from 'react-icons/fa';
import { MdError } from 'react-icons/md'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { GoogleLogin } from 'react-google-login' 
import { gapi } from 'gapi-script'

import Input from '../styled/Input';
import Button from '../styled/Button';
import CheckBox from '../styled/CheckBox';

import { googleAuth, signIn, signUp } from '../../redux/authSlice';

const logIn = {
	initialValues: {
		email: '',
		password: '',
		passwordVisible: false,
	}, 
	validate: Yup.object({
		email: Yup.string().trim()
		.email()
		.required('Must enter an email address'),
		password: Yup.string().trim()
		.min(6, 'Must be at least 6 characters')
		.required('Must enter a password')
	})
}

const register = {
	initialValues: {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		passwordVisible: false,
	}, 
	validate: Yup.object({
		firstName: Yup.string()
		.trim()
		.required('Must enter a first name'),
		lastName: Yup.string()
		.trim()
		.required('Must enter a last name'),
		email: Yup.string().trim()
		.email()
		.required('Must enter an email address'),
		password: Yup.string().trim()
		.min(6, 'Must be at least 6 characters')
		.required('Must enter a password'),
		confirmPassword: Yup.string().trim()
		.required('Must enter a password')
	})
}

const clientId = '811768979377-ct1mdt71e65kauaj7a2pd3vb4d6g1c75.apps.googleusercontent.com'

const Auth = () => {
	const user = useSelector(state => state.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isSignedIn, setIsSignedIn] = useState(true);

	useEffect(() => {
		function start() {
			gapi.auth2.init({
				client_id: clientId,
				scope: '',
			})
		}
		gapi.load('client:auth2', start);
	}, [])

	useEffect(() => {
		if (user) {
			navigate('/tasks');
		}
	}, [dispatch, navigate, user])

	const googleSuccess = (res) => {
		const { profileObj, tokenId } = res;
		dispatch(googleAuth({result: profileObj, token: tokenId}));
		navigate('/tasks');
	}

	const googleFailure = (error) => {
		console.log(error);
	}

	const handleFormSubmit = (values) => {
		const {passwordVisible, ...rest} = values;
		if (isSignedIn) {
			dispatch(signIn({ ...rest }));
		} else {
			dispatch(signUp({ ...rest }));
		}
		navigate('/tasks');
	}

	return (
		<>
			<Formik
			initialValues={isSignedIn ? 
				logIn.initialValues : 
				register.initialValues}
			validationSchema={isSignedIn ? 
				logIn.validate : 
				register.validate}
			onSubmit={(values) => handleFormSubmit(values)}
			>
			{(formik) => (
				<form onSubmit={formik.handleSubmit}
				className='flex flex-col 
				bg-ivory text-gunmetal w-full
				gap-2 px-8 py-3 text-[0.75em]'>

					<h1 className='font-semibold text-center text-[1.5em]
					w-full capitalize underline underline-offset-8 mb-2'>
						{isSignedIn ? 'Welcome back!' : 'Join Us'}
					</h1>

					<GoogleLogin 
					clientId={clientId}
					render={(renderProps) => (
						<Button type='button' onClick={renderProps.onClick}>
							<FaGoogle className='text-[14px]' />
							<p>{isSignedIn ? 'Sign In' : 'Sign Up'} with Google</p>
						</Button>
					)}
					onSuccess={googleSuccess}
					onFailure={googleFailure}
					cookiePolicy='single_host_origin'
					/>

					<span className='w-full text-center p-3 relative'>
						<hr className='border-slate-400'></hr>
						<p className='absolute top-1/2 left-1/2
						-translate-x-1/2 -translate-y-1/2 z-10
						px-2 bg-ivory text-[10px]'>
							Or {isSignedIn ? 'Sign In' : 'Sign Up'} With Email
						</p>
					</span>

					{!isSignedIn && (
						<>
							<span className='flex gap-2 
							justify-between items-center'>
								<Input 
								label='First Name*'
								type='firstName'
								id='firstName'
								placeholder='e.g. John Doe'
								autoComplete='new-password'
								{...formik.getFieldProps('firstName')} />	

								<Input 
								label='Last Name*'
								type='lastName'
								id='lastName' 
								placeholder='e.g. John Doe'
								autoComplete='new-password'
								{...formik.getFieldProps('lastName')} />	
							</span>

							<span className='flex gap-2 items-center justify-center w-full'>
							{formik.touched.firstName &&
								formik.errors.firstName &&
								(<span className='flex-1 flex items-center gap-1'>
									<MdError className='text-gunmetal text-[1.4em]'/>
									<p className='font-semibold italic text-red-500'>
										{formik.errors.firstName}
									</p>
								</span>)
							}
							{formik.touched.lastName &&
								formik.errors.lastName &&
								(<span className='flex-1 flex items-center gap-1'>
									<MdError className='text-gunmetal text-[1.4em]'/>
									<p className='font-semibold italic text-red-500'>
										{formik.errors.lastName}
									</p>
								</span>)
							}
							</span>
						</>)
					}

					<Input 
						label='Email Address*'
						type='email'
						id='email' 
						touched={formik.touched.email}
						error={formik.errors.email}
						placeholder='e.g. johndoe@gmail.com'
						autoComplete='new-password'
						{...formik.getFieldProps('email')} />

					<span className='flex gap-2 justify-between items-center'>
						<Input 
						label='Password*'
						type={formik.values.passwordVisible ? 
						'text' : 'password'}
						id='password'
						placeholder='e.g. johndoe123'
						autoComplete='new-password'
						{...formik.getFieldProps('password')} />

						{!isSignedIn && (
							<Input 
							label='Confirm Password*'
							type={formik.values.passwordVisible ? 
								'text' : 'password'}
							id='confirmPassword'
							placeholder='e.g. johndoe123'
							autoComplete='new-password'
							{...formik.getFieldProps('confirmPassword')} />
						)}
					</span>

					<span className='flex gap-2 items-center justify-center w-full'>
						{formik.touched.password &&
						formik.errors.password &&
						(<span className='flex-1 flex items-center gap-1'>
							<MdError className='text-gunmetal text-[1.4em]'/>
							<p className='font-semibold italic text-red-500'>
								{formik.errors.password}
								</p>
						</span>)}

						{formik.touched.confirmPassword &&
						formik.errors.confirmPassword &&
						(<span className='flex-1 flex items-center gap-1'>
							<MdError className='text-gunmetal text-[1.4em]'/>
							<p className='font-semibold italic text-red-500'>
								{formik.errors.confirmPassword}
							</p>
						</span>)}		
					</span>
					
					<CheckBox
						id='passwordVisible'
						name='passwordVisible'
						checked={formik.values.passwordVisible}
						{...formik.getFieldProps('passwordVisible')}
						addOnClass={isSignedIn ? 'accent-pink-500' : 
						'self-end accent-pink-500'}> 
						Show Password
					</CheckBox>
					
					<Button type='submit'>
						{isSignedIn ? 'Sign In' : 'Sign Up'}
					</Button>

					<input autoComplete="false" 
					name="hidden" type="text" 
					className='hidden' />

					<span className='px-1 mt-2 flex gap-1 w-full'>
						<p>{isSignedIn ? "Don't have an account?" :
						'Already have an account?'}</p>
						<p className='underline cursor-pointer 
						hover:text-blush transition duration-300 
						ease-in-out'
						onClick={() => 
						setIsSignedIn(prevState => !prevState)}>
							{isSignedIn ? 'Sign Up' : 'Sign In'}
						</p>
					</span>

				</form>
			)}
			</Formik>
		</>
	);
}

export default Auth