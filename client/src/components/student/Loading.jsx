import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F7F7F2]">
      <div className="w-14 sm:w-16 aspect-square border-4 border-[#DCE5E3] border-t-4 border-t-[#0E3A43] rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-[#637278] tracking-widest uppercase">Loading EduLearn Pro</p>
    </div>
  );
};

export default Loading;
