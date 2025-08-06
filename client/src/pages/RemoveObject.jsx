import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const RemoveObject = () => {
  const [imageFile, setImageFile] = useState(null);
  const [describe, setDescribe] = useState("");
  const [loading, setLoading] = useState(false);
  const [image_url, setImage_url] = useState("");

  const { getToken } = useAuth();

  const downloadImage = async () => {
    try {
      const response = await axios.get(image_url, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.setAttribute("download", `ai-image-${timestamp}.png`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download image");
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if(describe.split(' ')>1){
        return toast('please enter only one object name')
      }
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("object", describe);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      
      if (data.success) {
        setImage_url(data.image_url);
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
          <Sparkles className="w-6 text-[#2d5dd6]" />
          <h1 className="text-xl font-semibold "> Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium "> Upload Image</p>
        {/* userinput */}
        <input
          type="file"
          accept="image/*"
          className="  w-full p-2 mt-2 outline-none text-sm rounded-md border text-gray-600 "
          required
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <p className="mt-7 text-gray-600">Describe object to remove</p>
        <textarea
          input="text"
          className="h-[200px] w-full px-3 py-2 mt-2 text-left align-top text-sm rounded-md border border-gray-300 outline-none resize-none "
          placeholder="e.g., car in background  , tree from the image"
          required
          value={describe}
          onChange={(e) => setDescribe(e.target.value)}
        ></textarea>
        <p className="mt-4 text-xs font-light text-gray-500 ">
          Be specific what u want to remove
        </p>
        {/* button */}
        <button disabled={loading}className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2d5dd6] to-[#db4c1d] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> :<Scissors className="w-4" />
          }
          
          Remove Background
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#2d5dd6]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
          {
            !image_url ?(
              <div className="flex-1 flex justify-center items-center">
          <div className="test-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-9 h-9" />
            <p>Upload an image and describe what to remove</p>
          </div>
        </div>
            ):(
              <div className="mt-3 h-full">
            <img src={image_url} alt="image" className="h-full w-full" />

            <button
              onClick={downloadImage}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-3 text-sm rounded-md w-fit"
            >
              Download Image
            </button>
          </div>
            )
          }
        
      </div>
    </div>
  );
};

export default RemoveObject;
