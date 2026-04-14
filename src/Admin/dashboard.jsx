import { useContext } from "react";
import { ThemeContext } from "../context/context";
import useFetch from "../hooks/useFetch";

const AdminDashboard =  () => {
  const { dark } = useContext(ThemeContext);
  const { data, error, loading } =  useFetch(
    "https://restaurant-management-f9kx.onrender.com/api/v1/users",
  );
  return (
    <div className="py-40 flex justify-center items-center">
      <section className="ml-[100px] lg:ml-[100px]">
        <h5
          className={
            dark
              ? "text-AppBlack font-bold capitalize text-2xl  lg:text-4xl px-8 py-4"
              : "text-AppRed  font-bold capitalize  text-2xl lg:text-4xl px-8 py-4"
          }
        >
          dashboard overviews
        </h5>
        <section className="flex justify-between gap-3 px-8  flex-col lg:flex-row">
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              Total meals Available
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              150+
            </div>
          </div>
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              Total users
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
             {data? Object.keys(data).length : 0}
            </div>
          </div>  
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              orders
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              130+
            </div>
          </div>
          <div className={dark ? "overview-card" : "overview-cards"}>
            <h3
              className={
                dark
                  ? "text-xl text-AppWhite uppercase text-center font-bold"
                  : "text-AppBlack uppercase text-center text-xl font-bold"
              }
            >
              reviews
            </h3>
            <div
              className={`${dark ? "text-AppWhite" : "text-green-500"} font-black text-5xl`}
            >
              70+
            </div>
          </div>
        </section>
        <h5
          className={
            dark
              ? "text-AppBlack font-bold capitalize text-2xl  lg:text-4xl px-8 py-4"
              : "text-AppRed  font-bold capitalize  text-2xl  lg:text-4xl px-8 py-4"
          }
        >
          chart overviews
        </h5>
        <section className="flex items-center justify-between  gap-5 flex-col lg:flex-row">
          <div
            className={
              dark
                ? "bg-AppBlack/55 border-2 border-AppGray  w-[70%] lg:w-[50%] h-full p-10 rounded-xl flex justify-between items-end gap-2"
                : "bg-AppWhite border-2 border-AppRed w-[70%] lg:w-[50%] h-full p-10 rounded-xl flex justify-between items-end gap-2"
            }
          >
            <div className="bg-AppGray h-16 w-16"></div>
            <div className="bg-AppGray h-28 w-16"></div>
            <div className="bg-AppGray h-22 w-16"></div>
            <div className="bg-AppGray h-11 w-16"></div>
          </div>{" "}
          <div
            className={
              dark
                ? "bg-AppBlack/55 border-2 border-AppGray  w-[70%] lg:w-[50%] h-full p-10 rounded-xl flex justify-between items-end gap-2"
                : "bg-AppWhite border-2 border-AppRed w-[70%] lg:w-[50%] h-full p-10 rounded-xl flex justify-between items-end gap-2"
            }
          >
            <div className="bg-AppGray h-8 w-16"></div>
            <div className="bg-AppGray h-28 w-16"></div>
            <div className="bg-AppGray h-32 w-16"></div>
            <div className="bg-AppGray h-4 w-16"></div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default AdminDashboard;
