import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'

// update role to educator
export const updateRoleToEducator = async (req, res) => {

    try {

        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add New Course
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        if (!courseData) {
            return res.json({ success: false, message: 'Course data is required' })
        }

        const parsedCourseData = JSON.parse(courseData)

        if (!parsedCourseData.courseTitle || !parsedCourseData.courseTitle.trim()) {
            return res.json({ success: false, message: 'Course title is required' })
        }

        // 1. Upload to Cloudinary first
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        // 2. Attach educator and thumbnail url
        parsedCourseData.educator = educatorId
        parsedCourseData.courseThumbnail = imageUpload.secure_url

        // 3. Create course document in MongoDB
        await Course.create(parsedCourseData)

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Get Single Educator Course By ID (for editing)
export const getEducatorCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        const educator = req.auth.userId

        const course = await Course.findById(courseId)

        if (!course) {
            return res.json({ success: false, message: 'Course not found' })
        }

        if (course.educator !== educator) {
            return res.json({ success: false, message: 'Unauthorized: You do not own this course' })
        }

        res.json({ success: true, course })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const { courseData } = req.body
        const imageFile = req.file
        const educator = req.auth.userId

        const course = await Course.findById(courseId)

        if (!course) {
            return res.json({ success: false, message: 'Course not found' })
        }

        if (course.educator !== educator) {
            return res.json({ success: false, message: 'Unauthorized: You do not own this course' })
        }

        if (!courseData) {
            return res.json({ success: false, message: 'Course data is required' })
        }

        const parsedCourseData = JSON.parse(courseData)

        // Validation
        if (!parsedCourseData.courseTitle || !parsedCourseData.courseTitle.trim()) {
            return res.json({ success: false, message: 'Course title is required' })
        }

        if (!parsedCourseData.courseDescription || !parsedCourseData.courseDescription.trim()) {
            return res.json({ success: false, message: 'Course description is required' })
        }

        if (parsedCourseData.coursePrice === undefined || parsedCourseData.coursePrice < 0) {
            return res.json({ success: false, message: 'Valid course price is required' })
        }

        if (parsedCourseData.discount === undefined || parsedCourseData.discount < 0 || parsedCourseData.discount > 100) {
            return res.json({ success: false, message: 'Discount must be between 0 and 100' })
        }

        course.courseTitle = parsedCourseData.courseTitle
        course.courseDescription = parsedCourseData.courseDescription
        course.coursePrice = Number(parsedCourseData.coursePrice)
        course.discount = Number(parsedCourseData.discount)
        course.courseContent = parsedCourseData.courseContent || []

        // If new thumbnail is uploaded
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path)
            course.courseThumbnail = imageUpload.secure_url
        }

        await course.save()

        res.json({ success: true, message: 'Course updated successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const educator = req.auth.userId

        const course = await Course.findById(courseId)

        if (!course) {
            return res.json({ success: false, message: 'Course not found' })
        }

        if (course.educator !== educator) {
            return res.json({ success: false, message: 'Unauthorized: You do not own this course' })
        }

        await Course.findByIdAndDelete(courseId)

        res.json({ success: true, message: 'Course deleted successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {

        const educator = req.auth.userId

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
