import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading , setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creation", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setCreations(data.creations); // ✅ Correct state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error( error.message); // ✅ Error handling
    }
    setLoading(false)
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/togle-like-creation",
        { id }, 
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error( error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
  <div className="flex-1 h-full flex flex-col gap-4 p-6">
    <h2 className="text-lg font-semibold">Creations</h2>
    <div className="bg-white h-full w-full rounded-xl overflow-y-scroll flex flex-wrap gap-4">
      {creations.map((creation, index) => (
        <div
          key={index}
          className="relative group inline-block p-3 w-full sm:w-1/2 lg:w-1/3"
        >
          <img
            src={creation.content}
            alt=""
            className="w-full h-auto object-cover rounded-lg"
          />

          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm line-clamp-2 w-3/4">{creation.prompt}</p>
            <div className="flex gap-1 items-center">
              <p>{creation.likes.length}</p>
              <Heart
                onClick={() => imageLikeToggle(creation.id)}
                className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                  creation.likes.includes(user.id)
                    ? 'fill-red-500 text-red-600'
                    : 'text-gray-600'
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default Community;
