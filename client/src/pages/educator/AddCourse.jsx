import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';

const AddCourse = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

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

      if (!image) {
        return toast.error('Thumbnail Not Selected')
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  return (
    <div className='w-full max-w-4xl space-y-6'>
      <div className="pb-4 border-b border-[#DCE5E3]">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Course Management</span>
        <h1 className="text-2xl font-bold text-[#17252A] mt-1">Create a New Course</h1>
        <p className="text-sm text-[#637278] mt-1">Publish structured lessons, video lectures, and rich content for students.</p>
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
              <span className="text-xs text-[#637278]">{image ? 'Change image' : 'Upload image'}</span>
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
              {image && <img className='max-h-8 rounded object-cover ml-auto' src={URL.createObjectURL(image)} alt="" />}
            </label>
          </div>
        </div>

        {/* Adding Chapters & Lectures */}
        <div className="pt-4 border-t border-[#DCE5E3]">
          <h2 className="text-base font-bold text-[#17252A] mb-3">Course Curriculum</h2>
          
          <div className="space-y-3">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="bg-[#F7F7F2] border border-[#DCE5E3] rounded-xl overflow-hidden">
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
                      <div key={lectureIndex} className="flex justify-between items-center p-2.5 bg-white border border-[#DCE5E3] rounded-lg text-xs text-[#17252A]">
                        <span className="font-medium">{lectureIndex + 1}. {lecture.lectureTitle} — {lecture.lectureDuration} mins • <a href={lecture.lectureUrl} target="_blank" rel="noreferrer" className="text-[#0E3A43] underline font-semibold">Video Link</a> • {lecture.isPreviewFree ? <span className="text-[#2F6B4F] font-semibold">Free Preview</span> : 'Paid'}</span>
                        <img onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} src={assets.cross_icon} alt="Remove" className='cursor-pointer w-3 h-3 opacity-60 hover:opacity-100' />
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E3A43] bg-white border border-[#0E3A43]/30 px-3 py-1.5 rounded-md hover:bg-[#E6EFEE] transition-colors mt-2" 
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
                      id="previewCheck"
                      className='rounded text-[#0E3A43] focus:ring-[#0E3A43] scale-110 cursor-pointer'
                      checked={lectureDetails.isPreviewFree}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                    />
                    <label htmlFor="previewCheck" className="text-xs font-medium cursor-pointer">Allow free preview for this lecture</label>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button type='button' className="btn-primary w-full py-2.5 rounded-lg text-sm font-semibold" onClick={addLecture}>
                    Save Lecture
                  </button>
                  <button type='button' className="w-full py-2.5 rounded-lg text-sm font-medium border border-[#DCE5E3] hover:bg-[#F7F7F2]" onClick={() => setShowPopup(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className='btn-primary py-3 px-8 rounded-lg font-semibold text-sm shadow-md'>
            Publish Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;