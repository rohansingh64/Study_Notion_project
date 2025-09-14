import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
    return (
        <div className='sm:text-3xl text-2xl font-bold text-white'>

            <div className='sm:h-[200px] h-[10px]'></div>

            We are passionate about revolutionizing the way we learn.
            Our innovative platform <HighlightText text={"combines technology"} />, <span className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>{" "} expertise</span>,
            and community to create an    <span className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>{" "} unparalleled educational experience.</span>

            <div className='h-[100px]'></div>

        </div>
    )
}

export default Quote
