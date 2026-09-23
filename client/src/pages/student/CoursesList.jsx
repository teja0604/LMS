import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {

    const { input } = useParams()

    const { allCourses, navigate } = useContext(AppContext)

    const [filteredCourse, setFilteredCourse] = useState([])

    useEffect(() => {

        if (allCourses && allCourses.length > 0) {

            const tempCourses = allCourses.slice()

            input
                ? setFilteredCourse(
                    tempCourses.filter(
                        item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                    )
                )
                : setFilteredCourse(tempCourses)

        }

    }, [allCourses, input])

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F7F7F2]">
            <div className="relative md:px-36 px-6 pt-12 md:pt-16 text-left max-w-7xl mx-auto w-full">
                <div className='flex md:flex-row flex-col gap-6 items-start md:items-center justify-between w-full pb-6 border-b border-[#DCE5E3]'>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold text-[#17252A]'>Explore Courses</h1>
                        <p className='text-sm text-[#637278] mt-1'>
                            <span onClick={() => navigate('/')} className='text-[#0E3A43] font-medium cursor-pointer hover:underline'>Home</span>
                            <span className="mx-1.5 text-[#DCE5E3]">/</span>
                            <span>Course List</span>
                        </p>
                    </div>
                    <div className="w-full md:w-[460px] lg:w-[500px]">
                        <SearchBar data={input} />
                    </div>
                </div>

                {input && (
                    <div className='inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-[#DCE5E3] mt-6 text-sm text-[#17252A] shadow-subtle'>
                        <span className="text-[#637278]">Results for:</span>
                        <span className="font-semibold text-[#0E3A43]">"{input}"</span>
                        <img 
                            onClick={() => navigate('/course-list')} 
                            className='cursor-pointer w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity' 
                            src={assets.cross_icon} 
                            alt="Clear filter" 
                        />
                    </div>
                )}

                {filteredCourse.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 gap-6">
                        {filteredCourse.map((course, index) => <CourseCard key={course._id || index} course={course} />)}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <h3 className="text-xl font-semibold text-[#17252A]">No courses found</h3>
                        <p className="text-[#637278] mt-2">Try searching for different keywords or explore our full catalog.</p>
                        <button onClick={() => navigate('/course-list')} className="btn-primary mt-6 px-6 py-2.5 rounded-lg text-sm font-medium">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default CoursesList