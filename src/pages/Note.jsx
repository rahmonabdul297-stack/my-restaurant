import useFetch from "../hooks/useFetch";
import AppError from "../components/Apperror";
import { Apploader } from "../components/Apploader";
import { API_ENDPOINTS } from "../config/api";
const ABOUT_URL = API_ENDPOINTS.notes;

export const NotesList = () => {
  const { data, error, loading } = useFetch(ABOUT_URL);
  return (
    <div>
      {loading ? (
        <Apploader />
      ) : error ? (
        " Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus facere tenetur expedita architecto impedit, non soluta illo rem odio facilis veritatis nam quos, mollitia a voluptas tempora. Consequuntur, odio veritatis. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus facere tenetur expedita architecto impedit, non soluta illo rem odio facilis veritatis nam quos, mollitia a voluptas tempora. Consequuntur, odio veritatis. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus facere tenetur expedita architecto impedit, non soluta illo rem odio facilis veritatis nam quos, mollitia a voluptas tempora. Consequuntur, odio veritatis."
      ) : (
        data?.slice(7, 8).map((item) => (
          <div key={item._id}>
           
            {/* <h3>{item.title || "No title"}</h3> */}
            <p>{item.text || "No text"}</p>
          </div>
        ))
      )}
    </div>
  );
};
