import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../../components/student/Rating';
import Footer from '../../components/student/Footer';
import Loading from '../../components/student/Loading';

const Player = () => {

  const { enrolledCourses, backendUrl, getToken, calculateChapterTime, userData, fetchUserEnrolledCourses } = useContext(AppContext)

  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        course.courseRatings.forEach((item) => {
          if (userData && item.userId === userData._id) {
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData()
    }
  }, [enrolledCourses])

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRate = async (rating) => {
    try {
      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/user/add-rating',
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCourseProgress()
  }, [])

  return courseData ? (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F7F2]">
      <div className='p-4 sm:p-8 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 md:px-36 max-w-7xl mx-auto w-full'>
        
        {/* Left Column: Course Syllabus */}
        <div className="text-[#17252A]">
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE5E3]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Course Content</span>
              <h2 className="text-xl font-bold text-[#17252A] mt-1">{courseData.courseTitle}</h2>
            </div>
          </div>
          
          <div className="pt-4 space-y-2.5">
            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-[#DCE5E3] bg-white rounded-xl overflow-hidden shadow-subtle">
                <div
                  className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none hover:bg-[#F7F7F2]/60 transition-colors"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform opacity-70 ${openSections[index] ? "rotate-180" : ""}`} />
                    <p className="font-semibold text-sm md:text-base text-[#17252A]">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-xs text-[#637278]">{chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}</p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                  <ul className="divide-y divide-[#DCE5E3]/60 bg-[#F7F7F2]/30 border-t border-[#DCE5E3]">
                    {chapter.chapterContent.map((lecture, i) => {
                      const isCompleted = progressData && progressData.lectureCompleted.includes(lecture.lectureId);
                      return (
                        <li key={i} className="flex items-center justify-between px-4 py-3 text-xs md:text-sm text-[#17252A] hover:bg-white transition-colors">
                          <div className="flex items-center gap-2.5">
                            <img src={isCompleted ? assets.blue_tick_icon : assets.play_icon} alt="" className="w-4 h-4" />
                            <p className="font-medium">{lecture.lectureTitle}</p>
                          </div>
                          <div className='flex items-center gap-3'>
                            {lecture.lectureUrl && (
                              <button 
                                onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} 
                                className='text-[#0E3A43] font-semibold hover:underline bg-[#E6EFEE] px-2 py-0.5 rounded text-xs'
                              >
                                Watch
                              </button>
                            )}
                            <span className="text-xs text-[#637278]">{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#DCE5E3] rounded-xl p-5 mt-6 flex items-center justify-between shadow-subtle">
            <div>
              <h3 className="text-sm font-bold text-[#17252A]">Rate this Course</h3>
              <p className="text-xs text-[#637278] mt-0.5">Share your feedback to help other learners</p>
            </div>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>

        </div>

        {/* Right Column: Active Video Player */}
        <div className='lg:sticky lg:top-24 self-start'>
          <div className="bg-white border border-[#DCE5E3] rounded-2xl overflow-hidden shadow-custom-card">
            {playerData ? (
              <div>
                <YouTube iframeClassName='w-full aspect-video' videoId={playerData.lectureUrl.split('/').pop()} />
                <div className='p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-t border-[#DCE5E3]'>
                  <div>
                    <span className="text-xs font-semibold text-[#A84B2A]">Chapter {playerData.chapter} • Lecture {playerData.lecture}</span>
                    <h3 className='text-base font-bold text-[#17252A] mt-0.5'>{playerData.lectureTitle}</h3>
                  </div>
                  <button 
                    onClick={() => markLectureAsCompleted(playerData.lectureId)} 
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                        ? 'bg-[#2F6B4F] text-white hover:bg-[#2F6B4F]/90'
                        : 'btn-primary'
                    }`}
                  >
                    {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? '✓ Completed' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <img src={courseData ? courseData.courseThumbnail : ''} alt={courseData.courseTitle} className="w-full aspect-video object-cover" />
                <div className="p-5 text-center">
                  <h4 className="font-semibold text-[#17252A]">Select a lecture to start watching</h4>
                  <p className="text-xs text-[#637278] mt-1">Pick any lecture from the syllabus on the left to begin your lesson.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  ) : <Loading />
}

export default Player