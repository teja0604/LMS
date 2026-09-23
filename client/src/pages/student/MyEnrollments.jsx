import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';

const MyEnrollments = () => {

    const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext)

    const [progressArray, setProgressData] = useState([])

    const getCourseProgress = async () => {
        try {
            const token = await getToken();

            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/get-course-progress`,
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    let totalLectures = calculateNoOfLectures(course);
                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                    return { totalLectures, lectureCompleted };
                })
            );

            setProgressData(tempProgressArray);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserEnrolledCourses()
        }
    }, [userData])

    useEffect(() => {

        if (enrolledCourses.length > 0) {
            getCourseProgress()
        }

    }, [enrolledCourses])

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F7F7F2]">
            <div className='md:px-36 px-6 pt-12 max-w-7xl mx-auto w-full'>

                <div className="pb-6 border-b border-[#DCE5E3]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Learning Dashboard</span>
                    <h1 className='text-3xl font-bold text-[#17252A] mt-1'>My Enrolled Courses</h1>
                    <p className="text-sm text-[#637278] mt-1">Track your progress and continue learning with EduLearn Pro.</p>
                </div>

                <div className="bg-white border border-[#DCE5E3] rounded-xl overflow-hidden mt-8 shadow-subtle">
                    <table className="md:table-auto table-fixed w-full">
                        <thead className="text-[#17252A] bg-[#F7F7F2] border-b border-[#DCE5E3] text-xs uppercase tracking-wider text-left max-sm:hidden">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Course</th>
                                <th className="px-6 py-4 font-semibold max-sm:hidden">Duration</th>
                                <th className="px-6 py-4 font-semibold max-sm:hidden">Progress</th>
                                <th className="px-6 py-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-[#637278] divide-y divide-[#DCE5E3]">
                            {enrolledCourses.map((course, index) => {
                                const isCompleted = progressArray[index] && (progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1);
                                const percent = progressArray[index] && progressArray[index].totalLectures > 0 
                                    ? Math.round((progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures) 
                                    : 0;

                                return (
                                    <tr key={course._id || index} className="hover:bg-[#F7F7F2]/40 transition-colors">
                                        <td className="px-4 md:px-6 py-4 flex items-center gap-4">
                                            <img src={course.courseThumbnail} alt="" className="w-16 sm:w-24 aspect-video object-cover rounded-lg border border-[#DCE5E3]" />
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-semibold text-[#17252A] truncate max-sm:text-sm'>{course.courseTitle}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex-1">
                                                        <Line 
                                                            strokeWidth={3} 
                                                            strokeColor="#0E3A43"
                                                            trailWidth={3}
                                                            trailColor="#DCE5E3"
                                                            percent={percent} 
                                                        />
                                                    </div>
                                                    <span className="text-xs font-semibold text-[#0E3A43]">{percent}%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-sm:hidden font-medium text-[#17252A]">{calculateCourseDuration(course)}</td>
                                        <td className="px-6 py-4 max-sm:hidden">
                                            <span className="font-semibold text-[#17252A]">{progressArray[index]?.lectureCompleted || 0}</span>
                                            <span className="text-xs text-[#637278]"> / {progressArray[index]?.totalLectures || 0} Lessons</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <button 
                                                onClick={() => navigate('/player/' + course._id)} 
                                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                                    isCompleted 
                                                        ? 'bg-[#2F6B4F] text-white hover:bg-[#2F6B4F]/90' 
                                                        : 'btn-primary'
                                                }`}
                                            >
                                                {isCompleted ? '✓ Completed' : 'Continue →'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {enrolledCourses.length === 0 && (
                        <div className="py-16 text-center">
                            <h3 className="text-lg font-semibold text-[#17252A]">You haven't enrolled in any courses yet</h3>
                            <p className="text-sm text-[#637278] mt-1">Explore our catalog to start building your skills.</p>
                            <button onClick={() => navigate('/course-list')} className="btn-primary mt-4 px-6 py-2.5 rounded-lg text-xs font-semibold">
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>

            </div>

            <Footer />
        </div>
    )
}

export default MyEnrollments