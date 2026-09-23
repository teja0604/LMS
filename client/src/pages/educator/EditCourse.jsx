import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';

const EditCourse = () => {

  const { courseId } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  // Fetch Existing Course Data
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.course) {
        const course = data.course;
        setCourseTitle(course.courseTitle || '');
        setCourseDescription(course.courseDescription || '');
        setCoursePrice(course.coursePrice || 0);
        setDiscount(course.discount || 0);
        setExistingThumbnail(course.courseThumbnail || '');
        setChapters(course.courseContent || []);
      } else {
        toast.error(data.message || 'Failed to load course data');
        navigate('/educator/my-courses');
      }
    } catch (error) {
      toast.error(error.message);
      navigate('/educator/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!courseTitle.trim()) {
        return toast.error('Course Title is required');
      }

      const description = quillRef.current ? quillRef.current.root.innerHTML : courseDescription;
      const cleanText = description ? description.replace(/<[^>]+>/g, '').trim() : '';
      if (!description || description === '<p><br></p>' || cleanText.length === 0) {
        return toast.error('Course Description is required');
      }

      setSubmitting(true);

      const courseData = {
        courseTitle,
        courseDescription: description,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      if (image) {
        formData.append('image', image);
      }

      const token = await getToken();

      const { data } = await axios.put(`${backendUrl}/api/educator/update-course/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message || 'Course updated successfully');
        navigate('/educator/my-courses');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (!loading && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
      if (courseDescription) {
        quillRef.current.root.innerHTML = courseDescription;
      }
      quillRef.current.on('text-change', () => {
        setCourseDescription(quillRef.current.root.innerHTML);
      });
    }
  }, [loading, courseDescription]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='w-full max-w-4xl space-y-6'>
      <div className="pb-4 border-b border-[#DCE5E3] flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Course Management</span>
          <h1 className="text-2xl font-bold text-[#17252A] mt-1">Edit Course</h1>
          <p className="text-sm text-[#637278] mt-1">Update course details, pricing, lessons, or thumbnail image.</p>
        </div>
        <button
          onClick={() => navigate('/educator/my-courses')}
          className="text-xs font-semibold text-[#637278] hover:text-[#17252A] border border-[#DCE5E3] px-3.5 py-2 rounded-lg bg-white hover:bg-[#F7F7F2] transition-colors"
        >
          ← Back to My Courses
        </button>
      </div>

      <form onSubmit={handleSubmit} className='bg-white border border-[#DCE5E3] rounded-xl p-6 md:p-8 space-y-6 shadow-subtle text-[#17252A]'>
        <div className='flex flex-col gap-1.5'>
          <label className="text-sm font-semibold">Course Title</label>
          <input
            onChange={e => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder='e.g. Master Full-Stack Web Development'
            className='outline-none py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] focus:border-[#0E3A43] focus:ring-1 focus:ring-[#0E3A43] text-sm transition-all'
            required
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className="text-sm font-semibold">Course Description</label>
          <div className="rounded-lg overflow-hidden border border-[#DCE5E3]">
            <div ref={editorRef}></div>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 items-start'>
          <div className='flex flex-col gap-1.5'>
            <label className="text-sm font-semibold">Price ($)</label>
            <input
              onChange={e => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder='0'
              min="0"
              className='outline-none py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] focus:border-[#0E3A43] text-sm'
              required
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className="text-sm font-semibold">Discount (%)</label>
            <input
              onChange={e => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder='0'
              min="0"
              max="100"
              className='outline-none py-2.5 px-3.5 rounded-lg border border-[#DCE5E3] focus:border-[#0E3A43] text-sm'
              required
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className="text-sm font-semibold">Course Thumbnail</label>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3 cursor-pointer py-2 px-3 border border-dashed border-[#0E3A43]/40 rounded-lg hover:bg-[#F7F7F2] transition-colors'>
              <div className="p-2 bg-[#0E3A43] rounded text-white">
                <img src={assets.file_upload_icon} alt="" className='w-4 h-4 brightness-0 invert' />
              </div>
              <span className="text-xs text-[#637278]">{image ? 'Change new image' : (existingThumbnail ? 'Replace thumbnail' : 'Upload image')}</span>
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
              {image ? (
                <img className='max-h-8 rounded object-cover ml-auto border border-[#DCE5E3]' src={URL.createObjectURL(image)} alt="" />
              ) : (
                existingThumbnail && <img className='max-h-8 rounded object-cover ml-auto border border-[#DCE5E3]' src={existingThumbnail} alt="" />
              )}
            </label>
          </div>
        </div>

        {/* Chapters & Lectures */}
        <div className="pt-4 border-t border-[#DCE5E3]">
          <h2 className="text-base font-bold text-[#17252A] mb-3">Course Curriculum</h2>

          <div className="space-y-3">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.chapterId || chapterIndex} className="bg-[#F7F7F2] border border-[#DCE5E3] rounded-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-[#DCE5E3] bg-white">
                  <div className="flex items-center gap-2">
                    <img
                      className={`cursor-pointer transition-transform ${chapter.collapsed ? "-rotate-90" : ""}`}
                      onClick={() => handleChapter('toggle', chapter.chapterId)}
                      src={assets.dropdown_icon}
                      width={14}
                      alt=""
                    />
                    <span className="font-semibold text-sm text-[#17252A]">Chapter {chapterIndex + 1}: {chapter.chapterTitle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#637278]">{chapter.chapterContent.length} Lectures</span>
                    <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} alt="Remove" className='cursor-pointer w-3.5 h-3.5 opacity-60 hover:opacity-100' />
                  </div>
                </div>

                {!chapter.collapsed && (
                  <div className="p-4 space-y-2">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div key={lecture.lectureId || lectureIndex} className="flex justify-between items-center p-2.5 bg-white border border-[#DCE5E3] rounded-lg text-xs text-[#17252A]">
                        <span className="font-medium">{lectureIndex + 1}. {lecture.lectureTitle} — {lecture.lectureDuration} mins • <a href={lecture.lectureUrl} target="_blank" rel="noreferrer" className="text-[#0E3A43] underline font-semibold">Video Link</a> • {lecture.isPreviewFree ? <span className="text-[#2F6B4F] font-semibold">Free Preview</span> : 'Paid'}</span>
                        <img onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} alt="Remove" className='cursor-pointer w-3 h-3 opacity-60 hover:opacity-100' />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E3A43] bg-white border border-[#0E3A43]/30 px-3 py-1.5 rounded-md hover:bg-[#E6EFEE] transition-colors mt-2 cursor-pointer"
                      onClick={() => handleLecture('add', chapter.chapterId)}
                    >
                      + Add Lecture
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full flex justify-center items-center gap-2 bg-[#E6EFEE] hover:bg-[#D5E0E1] text-[#0E3A43] font-semibold py-3 rounded-xl cursor-pointer mt-4 transition-colors text-sm"
            onClick={() => handleChapter('add')}
          >
            + Add New Chapter
          </button>

          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
              <div className="bg-white text-[#17252A] p-6 rounded-2xl relative w-full max-w-sm shadow-2xl border border-[#DCE5E3]">
                <h3 className="text-lg font-bold mb-4">Add Lecture Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-xs font-semibold text-[#637278]">Lecture Title</label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-[#DCE5E3] rounded-lg py-2 px-3 text-sm outline-none focus:border-[#0E3A43]"
                      value={lectureDetails.lectureTitle}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#637278]">Duration (minutes)</label>
                    <input
                      type="number"
                      className="mt-1 w-full border border-[#DCE5E3] rounded-lg py-2 px-3 text-sm outline-none focus:border-[#0E3A43]"
                      value={lectureDetails.lectureDuration}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#637278]">Lecture Video URL</label>
                    <input
                      type="text"
                      className="mt-1 w-full border border-[#DCE5E3] rounded-lg py-2 px-3 text-sm outline-none focus:border-[#0E3A43]"
                      value={lectureDetails.lectureUrl}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="editPreviewCheck"
                      className='rounded text-[#0E3A43] focus:ring-[#0E3A43] scale-110 cursor-pointer'
                      checked={lectureDetails.isPreviewFree}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                    />
                    <label htmlFor="editPreviewCheck" className="text-xs font-medium cursor-pointer">Allow free preview for this lecture</label>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button type='button' className="btn-primary w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer" onClick={addLecture}>
                    Save Lecture
                  </button>
                  <button type='button' className="w-full py-2.5 rounded-lg text-sm font-medium border border-[#DCE5E3] hover:bg-[#F7F7F2] cursor-pointer" onClick={() => setShowPopup(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/educator/my-courses')}
            className="px-6 py-2.5 rounded-lg border border-[#DCE5E3] hover:bg-[#F7F7F2] text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className='btn-primary py-2.5 px-8 rounded-lg font-semibold text-sm shadow-md cursor-pointer disabled:opacity-50'
          >
            {submitting ? 'Saving...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
