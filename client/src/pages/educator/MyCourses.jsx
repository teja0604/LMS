import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyCourses = () => {

  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext)

  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {

    try {

      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/courses', { headers: { Authorization: `Bearer ${token}` } })

      data.success && setCourses(data.courses)

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses()
    }
  }, [isEducator])

  return courses ? (
    <div className="w-full space-y-6 max-w-6xl">
      <div className="pb-4 border-b border-[#DCE5E3]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Course Management</span>
        <h1 className="text-2xl font-bold text-[#17252A] mt-1">My Published Courses</h1>
        <p className="text-sm text-[#637278] mt-1">Manage, update, and track all your courses on EduLearn Pro.</p>
      </div>

      <div className="bg-white border border-[#DCE5E3] rounded-xl overflow-hidden shadow-subtle">
        <table className="md:table-auto table-fixed w-full">
          <thead className="text-[#17252A] bg-[#F7F7F2] border-b border-[#DCE5E3] text-xs uppercase tracking-wider text-left">
            <tr>
              <th className="px-6 py-4 font-semibold">Course</th>
              <th className="px-6 py-4 font-semibold">Earnings</th>
              <th className="px-6 py-4 font-semibold">Enrolled</th>
              <th className="px-6 py-4 font-semibold">Published Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#637278] divide-y divide-[#DCE5E3]">
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-[#F7F7F2]/40 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3 truncate">
                  <img src={course.courseThumbnail} alt="" className="w-16 aspect-video object-cover rounded-lg border border-[#DCE5E3]" />
                  <span className="font-semibold text-[#17252A] truncate hidden md:block">{course.courseTitle}</span>
                </td>
                <td className="px-6 py-4 font-bold text-[#0E3A43]">
                  {currency}{Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                </td>
                <td className="px-6 py-4 font-medium text-[#17252A]">
                  <span className="px-2.5 py-1 bg-[#E6EFEE] text-[#0E3A43] rounded-full text-xs font-semibold">
                    {course.enrolledStudents.length} Students
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {courses.length === 0 && (
          <div className="py-16 text-center text-sm text-[#637278]">
            You have not created any courses yet.
          </div>
        )}
      </div>
    </div>
  ) : <Loading />
};

export default MyCourses;