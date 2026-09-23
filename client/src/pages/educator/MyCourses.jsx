import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyCourses = () => {

  const navigate = useNavigate();
  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      const token = await getToken();
      const { data } = await axios.delete(`${backendUrl}/api/educator/delete-course/${courseToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message || 'Course deleted successfully');
        setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id));
        setCourseToDelete(null);
      } else {
        toast.error(data.message || 'Failed to delete course');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return courses ? (
    <div className="w-full space-y-6 max-w-6xl">
      <div className="pb-4 border-b border-[#DCE5E3] flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Course Management</span>
          <h1 className="text-2xl font-bold text-[#17252A] mt-1">My Published Courses</h1>
          <p className="text-sm text-[#637278] mt-1">Manage, update, and track all your courses on EduLearn Pro.</p>
        </div>
        <button
          onClick={() => navigate('/educator/add-course')}
          className="btn-primary text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer"
        >
          + Add New Course
        </button>
      </div>

      <div className="bg-white border border-[#DCE5E3] rounded-xl overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead className="text-[#17252A] bg-[#F7F7F2] border-b border-[#DCE5E3] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Earnings</th>
                <th className="px-6 py-4 font-semibold">Enrolled</th>
                <th className="px-6 py-4 font-semibold">Published Date</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#637278] divide-y divide-[#DCE5E3]">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-[#F7F7F2]/40 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3 min-w-[280px]">
                    {course.courseThumbnail ? (
                      <img 
                        src={course.courseThumbnail} 
                        alt={course.courseTitle} 
                        className="w-16 h-10 aspect-video object-cover rounded-lg border border-[#DCE5E3] flex-shrink-0" 
                      />
                    ) : (
                      <div className="w-16 h-10 aspect-video rounded-lg border border-[#DCE5E3] bg-[#E6EFEE] flex items-center justify-center text-[#0E3A43] text-xs font-bold flex-shrink-0">
                        No Img
                      </div>
                    )}
                    <span className="font-semibold text-[#17252A] line-clamp-2">{course.courseTitle}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#0E3A43] whitespace-nowrap">
                    {currency}{Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#17252A] whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-[#E6EFEE] text-[#0E3A43] rounded-full text-xs font-semibold">
                      {course.enrolledStudents.length} Students
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium whitespace-nowrap">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E6EFEE] hover:bg-[#D5E0E1] text-[#0E3A43] text-xs font-semibold transition-colors cursor-pointer"
                        title="Edit course"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FEE2E2] hover:bg-[#FCD34D]/30 text-[#DC2626] hover:text-[#B91C1C] text-xs font-semibold transition-colors cursor-pointer"
                        title="Delete course"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && (
          <div className="py-16 text-center text-sm text-[#637278]">
            You have not created any courses yet.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white text-[#17252A] p-6 rounded-2xl relative w-full max-w-md shadow-2xl border border-[#DCE5E3] space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-[#FEE2E2] text-[#DC2626] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#17252A]">Delete Course</h3>
                <p className="text-sm text-[#637278] mt-1">
                  Are you sure you want to delete <span className="font-semibold text-[#17252A]">"{courseToDelete.courseTitle}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 rounded-lg border border-[#DCE5E3] hover:bg-[#F7F7F2] text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCourse}
                className="px-5 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : <Loading />;
};

export default MyCourses;