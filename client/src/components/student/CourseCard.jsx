import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {

    const { currency, calculateRating } = useContext(AppContext)

    const finalPrice = (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2);
    const ratingValue = calculateRating(course);

    return (
        <Link 
            onClick={() => scrollTo(0, 0)} 
            to={'/course/' + course._id} 
            className="group bg-white border border-[#DCE5E3] pb-5 overflow-hidden rounded-xl course-card-hover flex flex-col justify-between"
        >
            <div className="overflow-hidden bg-[#F7F7F2]">
                <img 
                    className="w-full aspect-video object-cover image-scale-hover group-hover:scale-[1.03] transition-transform duration-300" 
                    src={course.courseThumbnail} 
                    alt={course.courseTitle} 
                />
            </div>
            <div className="p-4 text-left flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-[#17252A] group-hover:text-[#0E3A43] transition-colors line-clamp-2">
                        {course.courseTitle}
                    </h3>
                    <p className="text-xs text-[#637278] mt-1 font-medium">{course.educator?.name || 'Educator'}</p>
                </div>
                
                <div className="mt-3">
                    <div className="flex items-center space-x-1.5 text-xs text-[#637278]">
                        <span className="font-semibold text-[#A84B2A]">{ratingValue}</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    className="w-3.5 h-3.5"
                                    src={i < Math.floor(ratingValue) ? assets.star : assets.star_blank}
                                    alt=""
                                />
                            ))}
                        </div>
                        <span className="text-[#637278]/80">({course.courseRatings?.length || 0})</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-lg font-bold text-[#0E3A43]">{currency}{finalPrice}</p>
                        {course.discount > 0 && (
                            <p className="text-xs text-[#637278] line-through">{currency}{course.coursePrice}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default CourseCard