import { Edit, Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const Style = [
    "Realistic",
    "Ghibili",
    "anime style",
    "fantasy",
    "cartoon",
    "3D",
    "potrait",
  ];

  const [selectedStyle, setSelectedStyle] = useState(null);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secure_url, setSecure_url] = useState("");

  const { getToken } = useAuth();

  const downloadImage = async () => {
    try {
      const response = await axios.get(secure_url, {
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
      const prompt = `Genertae an image of ${input} in the style of ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      console.log("Full API response:", data);

      if (data.success) {
        setSecure_url(data.secure_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#38d96b]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium"> Describe Your Image</p>
        <textarea
          type="text"
          className="h-[200px] w-full px-3 py-2 mt-2 text-left align-top text-sm rounded-md border border-gray-300 outline-none resize-none"
          placeholder="Describe what you what to see in image ..."
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <p className="mt-4 text-sm font-medium"> Style</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {Style.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>

            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#1d853e] to-[#69cf89] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-4" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] ">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#38d96b]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        {!secure_url ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="test-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>Describe on image and click "Generate image"to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={secure_url} alt="image" className="h-full w-full" />

            <button
              onClick={downloadImage}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-3 text-sm rounded-md w-fit"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
