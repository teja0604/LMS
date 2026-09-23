import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {

  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext)

  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {

      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {

    if (isEducator) {
      fetchDashboardData()
    }

  }, [isEducator])

  return dashboardData ? (
    <div className='w-full space-y-8 max-w-6xl'>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Educator Portal</span>
        <h1 className="text-2xl md:text-3xl font-bold text-[#17252A] mt-1">Overview & Analytics</h1>
        <p className="text-sm text-[#637278] mt-1">Track student enrollments, course activity, and revenue in real time.</p>
      </div>

      {/* Metrics Row */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
        <div className='bg-white border border-[#DCE5E3] p-5 rounded-xl shadow-subtle flex items-center gap-4 hover:border-[#0E3A43]/30 transition-all'>
          <img 
            src={assets.patients_icon} 
            alt="Total Enrollments" 
            className="w-13 h-13 md:w-14 md:h-14 object-contain flex-shrink-0" 
          />
          <div className="min-w-0">
            <p className='text-2xl md:text-3xl font-bold text-[#17252A]'>{dashboardData.enrolledStudentsData.length}</p>
            <p className='text-xs font-semibold text-[#637278] uppercase tracking-wider mt-0.5 truncate'>Total Enrollments</p>
          </div>
        </div>

        <div className='bg-white border border-[#DCE5E3] p-5 rounded-xl shadow-subtle flex items-center gap-4 hover:border-[#0E3A43]/30 transition-all'>
          <img 
            src={assets.appointments_icon} 
            alt="Published Courses" 
            className="w-13 h-13 md:w-14 md:h-14 object-contain flex-shrink-0" 
          />
          <div className="min-w-0">
            <p className='text-2xl md:text-3xl font-bold text-[#17252A]'>{dashboardData.totalCourses}</p>
            <p className='text-xs font-semibold text-[#637278] uppercase tracking-wider mt-0.5 truncate'>Published Courses</p>
          </div>
        </div>

        <div className='bg-white border border-[#DCE5E3] p-5 rounded-xl shadow-subtle flex items-center gap-4 hover:border-[#0E3A43]/30 transition-all'>
          <img 
            src={assets.earning_icon} 
            alt="Total Earnings" 
            className="w-13 h-13 md:w-14 md:h-14 object-contain flex-shrink-0" 
          />
          <div className="min-w-0">
            <p className='text-2xl md:text-3xl font-bold text-[#0E3A43]'>{currency}{Math.floor(dashboardData.totalEarnings)}</p>
            <p className='text-xs font-semibold text-[#637278] uppercase tracking-wider mt-0.5 truncate'>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div>
        <h2 className="text-lg font-bold text-[#17252A] mb-4">Latest Enrollments</h2>
        <div className="bg-white border border-[#DCE5E3] rounded-xl overflow-hidden shadow-subtle">
          <table className="table-fixed md:table-auto w-full">
            <thead className="text-[#17252A] bg-[#F7F7F2] border-b border-[#DCE5E3] text-xs uppercase tracking-wider text-left">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-center hidden sm:table-cell w-16">#</th>
                <th className="px-5 py-3.5 font-semibold">Student Name</th>
                <th className="px-5 py-3.5 font-semibold">Course Title</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#637278] divide-y divide-[#DCE5E3]">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className="hover:bg-[#F7F7F2]/40 transition-colors">
                  <td className="px-5 py-3.5 text-center hidden sm:table-cell text-xs font-medium">{index + 1}</td>
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      alt="Student"
                      className="w-8 h-8 rounded-full border border-[#DCE5E3] object-cover"
                    />
                    <span className="font-medium text-[#17252A] truncate">{item.student.name}</span>
                  </td>
                  <td className="px-5 py-3.5 truncate font-medium">{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {dashboardData.enrolledStudentsData.length === 0 && (
            <div className="py-10 text-center text-sm text-[#637278]">
              No student enrollments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Dashboard