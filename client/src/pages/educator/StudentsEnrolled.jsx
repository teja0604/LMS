import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext)

  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])

  return enrolledStudents ? (
    <div className="w-full space-y-6 max-w-6xl">
      <div className="pb-4 border-b border-[#DCE5E3]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Student Records</span>
        <h1 className="text-2xl font-bold text-[#17252A] mt-1">Enrolled Students</h1>
        <p className="text-sm text-[#637278] mt-1">View learners actively enrolled across all your courses.</p>
      </div>

      <div className="bg-white border border-[#DCE5E3] rounded-xl overflow-hidden shadow-subtle">
        <table className="table-fixed md:table-auto w-full">
          <thead className="text-[#17252A] bg-[#F7F7F2] border-b border-[#DCE5E3] text-xs uppercase tracking-wider text-left">
            <tr>
              <th className="px-5 py-3.5 font-semibold text-center hidden sm:table-cell w-16">#</th>
              <th className="px-5 py-3.5 font-semibold">Student Name</th>
              <th className="px-5 py-3.5 font-semibold">Course Title</th>
              <th className="px-5 py-3.5 font-semibold hidden sm:table-cell">Enrollment Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#637278] divide-y divide-[#DCE5E3]">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="hover:bg-[#F7F7F2]/40 transition-colors">
                <td className="px-5 py-3.5 text-center hidden sm:table-cell text-xs font-medium">{index + 1}</td>
                <td className="px-5 py-3.5 flex items-center gap-3">
                  <img
                    src={item.student.imageUrl}
                    alt=""
                    className="w-8 h-8 rounded-full border border-[#DCE5E3] object-cover"
                  />
                  <span className="font-semibold text-[#17252A] truncate">{item.student.name}</span>
                </td>
                <td className="px-5 py-3.5 truncate font-medium text-[#17252A]">{item.courseTitle}</td>
                <td className="px-5 py-3.5 hidden sm:table-cell text-xs font-medium">{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {enrolledStudents.length === 0 && (
          <div className="py-16 text-center text-sm text-[#637278]">
            No students enrolled yet.
          </div>
        )}
      </div>
    </div>
  ) : <Loading />
};

export default StudentsEnrolled;