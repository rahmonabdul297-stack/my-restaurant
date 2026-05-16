import useFetch from "../hooks/useFetch";
import AppError from "../components/Apperror";
import { Apploader } from "../components/Apploader";
const ABOUT_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/notes";

export const NotesList = () => {
  const { data, error, loading } = useFetch(ABOUT_URL);
  return (
    <div>
      {loading ? (
        <Apploader />
      ) : error ? (
        <AppError />
      ) : data?.slice(7,8).map((item) => (
          <div key={item._id}>
            {/* <h3>{item.title || "No title"}</h3> */}
            <p>{item.text || "No text"}</p>
          </div>
        )) }
    </div>
  );
};
