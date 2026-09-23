import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section className='flex flex-col items-center gap-4 py-16 md:py-20 px-6 max-w-5xl mx-auto text-center'>
      <div className="w-full bg-gradient-to-r from-[#0E3A43] to-[#155965] text-white rounded-2xl p-8 md:p-14 shadow-lg flex flex-col items-center gap-4">
        <span className="px-3.5 py-1 rounded-full bg-[#F3D8CC]/20 text-[#F3D8CC] text-xs font-semibold uppercase tracking-wider">
          Start Learning Today
        </span>
        <h2 className='md:text-3xl text-2xl font-bold max-w-2xl leading-snug'>
          Accelerate your skills with EduLearn Pro courses
        </h2>
        <p className='text-[#D5E0E1] text-sm md:text-base max-w-xl leading-relaxed'>
          Join thousands of learners worldwide gaining in-demand skills from industry experts.
        </p>
        <div className='flex flex-wrap items-center justify-center font-medium gap-4 mt-4'>
          <Link to="/course-list" onClick={() => scrollTo(0,0)} className='btn-primary px-8 py-3 rounded-lg text-white bg-[#A84B2A] hover:bg-[#A84B2A]/90 transition-all font-semibold text-sm'>
            Get Started Free
          </Link>
          <Link to="/course-list" onClick={() => scrollTo(0,0)} className='flex items-center gap-2 text-sm text-[#E6EFEE] hover:text-white transition-colors px-4 py-3'>
            Browse Catalog
            <img src={assets.arrow_icon} alt="" className="brightness-0 invert w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CallToAction