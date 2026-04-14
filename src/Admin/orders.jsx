import { useContext } from "react";
import { ThemeContext } from "../context/context";
import useFetch from "../hooks/useFetch";
import AppError from "../components/Apperror";
import { Apploader } from "../components/Apploader";

const OrdersPage = () => {
  const { dark } = useContext(ThemeContext);
  const { data, error, loading } = useFetch(
    "https://restaurant-management-f9kx.onrender.com/api/v1/orders",
  );
  return (
    <div
      className={`py-20 ${dark ? "bg-AppGray" : ""} text-AppBlack h-screen w-full font-black  flex items-center justify-center capitalize`}
    >
      {data ? (
        data.map((order) => <div>{order.order_date}</div>)
      ) : error ? (
        <AppError error={error} />
      ) : loading ? (
        <Apploader size={50}/>
      ) : "no order found!"}
    </div>
  );
};

export default OrdersPage;
