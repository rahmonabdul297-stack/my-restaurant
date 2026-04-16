import AppError from "../components/Apperror";
import { Apploader } from "../components/Apploader";
import useFetch from "../hooks/useFetch";

const AdminUsers = () => {
  const url = "https://restaurant-management-f9kx.onrender.com/api/v1/users";

  const { data, error, loading } = useFetch(url);

  return (
    <div className="py-20 flex items-center justify-center  h-screen w-full">
      <section>
        {loading ? (
          <Apploader />
        ) : error ? (
          <AppError error={error} />
        ) :data? (
          data.map((users) => (
            <ol key={users.user_id}>
              <li>{users.first_name}</li>
            </ol>
          ))
        ):"No users found!" }
      </section>
    </div>
  );
};

export default AdminUsers;
