import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import { useAuth } from '@clerk/clerk-react';
import Loading from '../../components/student/Loading';

const CourseDetails = () => {

  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  // Demo Payment Modal State
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isDemoProcessing, setIsDemoProcessing] = useState(false);
  const [cardHolder, setCardHolder] = useState('Demo Student');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const {
    backendUrl,
    currency,
    userData,
    fetchUserData,
    fetchUserEnrolledCourses,
    navigate,
    calculateChapterTime,
    calculateCourseDuration,
    calculateRating,
    calculateNoOfLectures
  } = useContext(AppContext);
  const { getToken } = useAuth();

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id);

      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Main CTA Handler (Clean conditional branch based on VITE_DEMO_MODE)
  const handleEnrollClick = () => {
    if (!userData) {
      return toast.warn('Login to Enroll');
    }

    if (isAlreadyEnrolled) {
      return toast.warn('Already Enrolled');
    }

    if (isDemoMode) {
      setShowDemoModal(true);
    } else {
      enrollCourse();
    }
  };

  // Real Stripe Checkout Flow
  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Login to Enroll');
      }

      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled');
      }

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Simulated Demo Payment Flow (College Presentation Mode)
  const handleDemoPayment = async (e) => {
    if (e) e.preventDefault();

    try {
      if (!userData) {
        return toast.warn('Login to Enroll');
      }

      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled');
      }

      setIsDemoProcessing(true);
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/demo-purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || '🎉 Demo Payment Successful! Enrolled in course.');
        setShowDemoModal(false);
        if (fetchUserData) await fetchUserData();
        if (fetchUserEnrolledCourses) await fetchUserEnrolledCourses();
        navigate('/my-enrollments');
      } else {
        toast.error(data.message || 'Demo payment failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDemoProcessing(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  return courseData ? (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F7F2]">
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-6 md:pt-16 pt-8 text-left max-w-7xl mx-auto w-full">

        <div className="max-w-2xl z-10 text-[#637278]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3D8CC]/60 text-[#A84B2A] text-xs font-semibold mb-3">
            <span>Course Overview</span>
          </div>

          <h1 className="md:text-course-deatails-heading-large text-course-deatails-heading-small font-bold text-[#17252A] leading-tight">
            {courseData.courseTitle}
          </h1>

          <div
            className="pt-4 md:text-base text-sm text-[#637278] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                courseData.courseDescription.slice(0, 220) +
                (courseData.courseDescription.length > 220 ? '...' : '')
            }}
          ></div>

          <div className="flex flex-wrap items-center gap-3 pt-4 pb-2 text-sm">
            <div className="flex items-center gap-1.5 font-bold text-[#A84B2A]">
              <span>{calculateRating(courseData)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                    alt=""
                    className="w-4 h-4"
                  />
                ))}
              </div>
            </div>
            <span className="text-[#DCE5E3]">|</span>
            <p className="text-[#0E3A43] font-medium">
              ({courseData.courseRatings.length} {courseData.courseRatings.length === 1 ? 'rating' : 'ratings'})
            </p>
            <span className="text-[#DCE5E3]">|</span>
            <p className="text-[#637278]">
              {courseData.enrolledStudents.length} {courseData.enrolledStudents.length === 1 ? 'student' : 'students'}
            </p>
          </div>

          <p className="text-sm text-[#637278] pt-1">
            Instructor:{' '}
            <span className="text-[#0E3A43] font-semibold hover:underline cursor-pointer">
              {courseData.educator.name}
            </span>
          </p>

          <div className="pt-10 text-[#17252A]">
            <h2 className="text-xl font-bold">Course Syllabus</h2>
            <div className="pt-4 space-y-2.5">
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className="border border-[#DCE5E3] bg-white rounded-xl overflow-hidden shadow-subtle">
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-[#F7F7F2]/60 transition-colors"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                        className={`transform transition-transform opacity-70 ${openSections[index] ? 'rotate-180' : ''}`}
                      />
                      <p className="font-semibold md:text-base text-sm text-[#17252A]">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-xs md:text-sm text-[#637278] font-medium">
                      {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <ul className="divide-y divide-[#DCE5E3]/60 bg-[#F7F7F2]/30 border-t border-[#DCE5E3]">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-center justify-between px-5 py-3 text-xs md:text-sm text-[#17252A] hover:bg-white transition-colors">
                          <div className="flex items-center gap-2.5">
                            <img src={assets.play_icon} alt="" className="w-4 h-4 opacity-70" />
                            <p className="font-medium">{lecture.lectureTitle}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {lecture.isPreviewFree && (
                              <button
                                onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}
                                className="text-[#A84B2A] font-semibold hover:underline text-xs bg-[#F3D8CC]/50 px-2 py-0.5 rounded"
                              >
                                Preview
                              </button>
                            )}
                            <span className="text-[#637278] text-xs">
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-14 text-sm md:text-base">
            <h3 className="text-xl font-bold text-[#17252A] mb-3">About this Course</h3>
            <div
              className="rich-text bg-white p-6 rounded-xl border border-[#DCE5E3]"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            ></div>
          </div>
        </div>

        {/* Sidebar Sticky Card */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-2xl overflow-hidden bg-white border border-[#DCE5E3] min-w-[300px] sm:min-w-[400px] sticky top-24">
          <div className="overflow-hidden bg-[#0E3A43]">
            {playerData ? (
              <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName="w-full aspect-video" />
            ) : (
              <img src={courseData.courseThumbnail} alt={courseData.courseTitle} className="w-full aspect-video object-cover" />
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A84B2A] bg-[#F3D8CC]/50 px-3 py-1.5 rounded-lg w-fit">
              <img className="w-3.5" src={assets.time_left_clock_icon} alt="" />
              <span>Limited enrollment period</span>
            </div>

            <div className="flex gap-3 items-baseline pt-4">
              <p className="text-[#0E3A43] md:text-3xl text-2xl font-bold">
                {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
              </p>
              {courseData.discount > 0 && (
                <>
                  <p className="text-sm text-[#637278] line-through">{currency}{courseData.coursePrice}</p>
                  <span className="text-xs font-bold text-[#2F6B4F] bg-[#2F6B4F]/10 px-2 py-0.5 rounded">
                    {courseData.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-[#DCE5E3] text-center text-xs text-[#637278]">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-[#17252A]">{calculateRating(courseData)} / 5</span>
                <span>Rating</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-[#DCE5E3]">
                <span className="font-semibold text-[#17252A]">{calculateCourseDuration(courseData)}</span>
                <span>Duration</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-[#17252A]">{calculateNoOfLectures(courseData)}</span>
                <span>Lessons</span>
              </div>
            </div>

            {isAlreadyEnrolled ? (
              <button
                disabled
                className="w-full py-3 rounded-lg font-semibold text-sm bg-[#E6EFEE] text-[#0E3A43] cursor-not-allowed"
              >
                Already Enrolled
              </button>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="btn-primary w-full py-3 rounded-lg font-semibold text-base shadow-sm cursor-pointer"
              >
                Enroll in Course
              </button>
            )}

            <div className="pt-6">
              <p className="text-sm font-bold text-[#17252A]">Includes in this course:</p>
              <ul className="pt-2 text-xs text-[#637278] space-y-2">
                <li className="flex items-center gap-2">✓ Full lifetime access with updates</li>
                <li className="flex items-center gap-2">✓ Hands-on real-world assignments</li>
                <li className="flex items-center gap-2">✓ Downloadable resources & cheat sheets</li>
                <li className="flex items-center gap-2">✓ Certificate of completion by EduLearn Pro</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* EduLearn Pro Secure Demo Checkout Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-[#FFFFFF] text-[#17252A] p-6 sm:p-8 rounded-2xl relative w-full max-w-md shadow-2xl border border-[#DCE5E3] space-y-6">

            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#DCE5E3] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img src={assets.logo} alt="EduLearn Pro" className="h-6 w-auto" />
                  <span className="text-2xs font-bold uppercase tracking-wider bg-[#F3D8CC] text-[#A84B2A] px-2 py-0.5 rounded-full">
                    Demo Checkout
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#17252A]">Secure Demo Checkout</h3>
                <p className="text-xs text-[#637278] mt-0.5">Presentation Simulation • Mock details accepted</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="text-[#637278] hover:text-[#17252A] p-1.5 rounded-lg hover:bg-[#F7F7F2] transition-colors cursor-pointer text-sm"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Course Summary Card */}
            <div className="p-4 bg-[#F7F7F2] rounded-xl border border-[#DCE5E3] flex justify-between items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-2xs uppercase tracking-wider text-[#637278] font-bold">Course</p>
                <p className="text-sm font-bold text-[#17252A] truncate mt-0.5">{courseData.courseTitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xs uppercase tracking-wider text-[#637278] font-bold">Total</p>
                <p className="text-lg font-extrabold text-[#0E3A43] mt-0.5">
                  {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Mock Payment Form */}
            <form onSubmit={handleDemoPayment} className="space-y-4 text-xs text-[#17252A]">
              <div>
                <label className="font-semibold text-[#17252A] block mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] bg-[#FFFFFF] text-sm text-[#17252A] outline-none focus:border-[#0E3A43] focus:ring-1 focus:ring-[#0E3A43] transition-all"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#17252A] block mb-1.5">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] bg-[#FFFFFF] text-sm text-[#17252A] outline-none focus:border-[#0E3A43] focus:ring-1 focus:ring-[#0E3A43] tracking-wider transition-all"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-2xs font-bold text-[#637278] bg-[#F7F7F2] border border-[#DCE5E3] px-2 py-0.5 rounded">
                    TEST CARD
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#17252A] block mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] bg-[#FFFFFF] text-sm text-[#17252A] outline-none focus:border-[#0E3A43] focus:ring-1 focus:ring-[#0E3A43] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#17252A] block mb-1.5">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    className="w-full py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] bg-[#FFFFFF] text-sm text-[#17252A] outline-none focus:border-[#0E3A43] focus:ring-1 focus:ring-[#0E3A43] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#DCE5E3] hover:bg-[#F7F7F2] text-xs font-semibold text-[#637278] hover:text-[#17252A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDemoProcessing}
                  className="btn-primary px-6 py-2.5 rounded-lg text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDemoProcessing ? (
                    <span>Processing Demo...</span>
                  ) : (
                    <span>Pay & Enroll</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  ) : <Loading />;
};

export default CourseDetails;