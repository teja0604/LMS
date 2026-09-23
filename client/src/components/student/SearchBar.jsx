import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {

  const navigate = useNavigate()

  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = (e) => {
    e.preventDefault()
    if (input.trim()) {
      navigate('/course-list/' + input.trim())
    } else {
      navigate('/course-list')
    }
  }

  return (
    <form onSubmit={onSearchHandler} className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-[#DCE5E3] rounded-lg shadow-subtle p-1.5 focus-within:border-[#0E3A43] focus-within:ring-2 focus-within:ring-[#0E3A43]/10 transition-all overflow-hidden">
      <div className="flex items-center justify-center pl-2.5 pr-1 flex-shrink-0">
        <img className="w-4 h-4 opacity-60" src={assets.search_icon} alt="" />
      </div>
      <div className="flex-1 min-w-0 h-full flex items-center">
        <input 
          onChange={e => setInput(e.target.value)} 
          value={input} 
          type="text" 
          className="w-full h-full outline-none text-[#17252A] placeholder-[#637278]/70 text-sm md:text-base bg-transparent px-2 truncate" 
          placeholder="Search for courses, topics, or skills..." 
        />
      </div>
      <button 
        type='submit' 
        className="flex-shrink-0 btn-primary rounded-md font-medium text-sm md:text-base md:px-7 px-4 md:py-2.5 py-2 whitespace-nowrap"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar