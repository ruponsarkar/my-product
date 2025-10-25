import React from 'react'

export default function LoginCheck() {
    return (
        <div>
            <div className=''>
                <div className='mb-3 col-md-6'>
                    <input type="email" placeholder="Enter your email" className='form-control' />
                </div>
                <div className='mb-3 col-md-6'>
                    <input type="password" placeholder="Enter your password" className='form-control' />
                </div>
                <div className='mb-3'>
                    <button className='btn btn-primary btn-sm'>Login</button>
                </div>
            </div>
        </div>
    )
}
