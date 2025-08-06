import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    // {conetnt}
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#38d96b]" />
          <h1 className="text-xl font-semibold"> Resume review</h1>
        </div>

        <p className="mt-6 text-sm font-medium"> Upload Resume</p>
        {/* userinput */}
        <input
          type="file"
          accept="application/pdf"
          className="  w-full p-2 mt-2 outline-none text-sm rounded-md border text-gray-600 "
          required
          onChange={(e) => setInput(e.target.files[0])}
        />

        <p className="mt-4 text-xs font-light text-gray-300 ">
          {" "}
          Supports PDF resume only.
        </p>

        {/* button */}
        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#38d96b] to-[#136fa8] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading?(<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>):(<FileText className="w-4" />
          )
          
          }
          Review Resume
          
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#38d96b]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>
           {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="test-sm flex flex-col items-center gap-5 text-gray-400">
            <FileText className="w-9 h-9" />
            <p>Upload image and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600 whitespace-pre-wrap">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ReviewResume;
