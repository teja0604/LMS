import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <section className="py-20 md:px-36 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Top Rated Programs</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#17252A] mt-1">Learn from industry leaders</h2>
          <p className="md:text-base text-sm text-[#637278] mt-2 max-w-xl">
            Discover our curated courses across top categories. Designed with practical projects to accelerate your skills.
          </p>
        </div>
        <Link 
          to={'/course-list'} 
          onClick={() => scrollTo(0, 0)} 
          className="btn-secondary mt-4 md:mt-0 text-sm font-medium px-6 py-2.5 rounded-lg inline-flex items-center gap-2 self-start md:self-auto"
        >
          Explore all courses →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allCourses.slice(0, 4).map((course, index) => <CourseCard key={course._id || index} course={course} />)}
      </div>
    </section>
  );
};

export default CoursesSection;
