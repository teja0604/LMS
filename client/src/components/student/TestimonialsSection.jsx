import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {

  return (
    <section className="py-20 md:px-36 px-6 max-w-7xl mx-auto w-full text-center">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#A84B2A]">Student Stories</span>
      <h2 className="text-2xl md:text-3xl font-bold text-[#17252A] mt-1">What our learners say</h2>
      <p className="md:text-base text-sm text-[#637278] mt-2 max-w-xl mx-auto">
        Hear from our global community about how EduLearn Pro courses helped transform their careers.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm bg-white border border-[#DCE5E3] p-6 rounded-xl shadow-subtle flex flex-col justify-between hover:border-[#0E3A43]/30 transition-all"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <img className="h-12 w-12 rounded-full object-cover border border-[#DCE5E3]" src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h3 className="text-base font-semibold text-[#17252A]">{testimonial.name}</h3>
                  <p className="text-xs text-[#637278]">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-4 w-4"
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt=""
                  />
                ))}
              </div>
              
              <p className="text-[#637278] leading-relaxed">
                "Learning with EduLearn Pro has been a tremendous boost for my technical skills and career development."
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-[#DCE5E3]/60 flex items-center justify-between text-xs text-[#0E3A43] font-medium">
              <span>Verified Student</span>
              <span className="text-[#2F6B4F] flex items-center gap-1">● Enrolled</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
