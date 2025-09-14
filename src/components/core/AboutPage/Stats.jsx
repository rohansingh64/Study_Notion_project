import React from 'react'

const Stats=[
    {count :"5K", label:"Active Students"},
    {count :"10+", label:"Mentors"},
    {count :"200+", label:"Courses"},
    {count :"50+", label:"Awards"},
]

const StatsComponent = () => {
  return (
   <section>
    <div>
        <div className='flex sm:flex-row flex-col sm:gap-x-10 justify-center items-center border-[#2C333F] text-white bg-[#161D29]' >
            {
                Stats.map((data,index)=>{
                    return(
                        <div key={index} className='flex flex-col justify-center items-center my-10'>
                            <h1>{data.count}</h1>
                            <h2 className='text-[#585D69]'>{data.label}</h2>
                        </div>
                    )
                })
            }
        </div>
    </div>
   </section>
  )
}

export default StatsComponent
