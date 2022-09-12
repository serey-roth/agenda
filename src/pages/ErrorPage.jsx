import React from 'react'
import { useNavigate } from 'react-router-dom';

import Button from '../components/styled/Button'

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className='flex-1 flex-col flex flex-wrap text-lg animate-pulse
        gap-4 items-center justify-center text-ivory'>
            <h1 className='text-5xl font-bold'>404</h1>
            <span className='flex flex-col items-center'>
                <p>Sorry, we're still working on this page.</p>
                <p>Please come back later!</p>
            </span>
            <Button addOnClass='capitalize'
            onClick={() => navigate(-1, {replace: true})}>Previous Page</Button>
        </div>
    )
}

export default ErrorPage