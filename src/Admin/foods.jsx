import { useState } from "react";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";

const Foods = () => {
  const dayTime = new Date();
  //   const SplitdayTime = dayTime.toString();
  //   const currentTime = SplitdayTime[4];
  //   const currentHourArr = currentTime.split(":");
  //   const currentHour = currentHourArr[0];
 
  const url = "https://restaurant-management-f9kx.onrender.com/api/v1/food";
  const [isPosting, setisPosting] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const [warning, setwarning] = useState("");
  const [created_at, setcreated_at] = useState(dayTime);
  const [updated_at, setupdated_at] = useState(dayTime);
  const [food_id, setfood_id] = useState("reCfe09");
  const [menu_id, setmenu_id] = useState("");
  const [food_image, setfood_image] = useState();
  const [name, setname] = useState("");
  const [price, setprice] = useState(0);

  const handleFoodPosting = async () => {
    setisPosting(true);
    const isValid =
      created_at &&
      food_id &&
      food_image &&
      menu_id &&
      name &&
      price &&
      updated_at;
    if (isValid) {
      const payload = {
        created_at,
        food_id,
        food_image,
        menu_id,
        name,
        price: Number(price),
        updated_at,
      };
      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const response = await request.json();
      console.log("response",response)
      console.log(
        "data",
        created_at,
        food_id,
        food_image,
        menu_id,
        name,
        price,
        updated_at,
      );
      if (request.ok && request.status.toString().includes("20")) {
        successNotification("successful");
      } else {
        errorNotification("something went wrong!");
      }
    } else {
      setwarning("field required!");
      infoNotification("follow the instruction and try again!");
    }
    setisPosting(false);
  };
//   const handleFoodDeleting = async () => {
//     setisDeleting(true);
//     const isValid =
//       created_at &&
//       food_id &&
//       food_image &&
//       menu_id &&
//       name &&
//       price &&
//       updated_at;
//     if (isValid) {
//       const payload = {
//         created_at,
//         food_id,
//         food_image,
//         menu_id,
//         name,
//         price: Number(price),
//         updated_at,
//       };
//       const request = await fetch(url, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       const response = await request.json();
//       console.log("response", response);
//       console.log(
//         "data",
//         created_at,
//         food_id,
//         food_image,
//         menu_id,
//         name,
//         price,
//         updated_at,
//       );
//       if (request.ok && request.status.toString().includes("20")) {
//         successNotification("successful");
//       } else {
//         errorNotification("something when wrong!");
//       }
//     } else {
//       setwarning("field required!");
//       infoNotification("follow the instruction and try again!");
//     }
//     setisDeleting(false);
//   };
  return (
    <div className="py-20 h-screen ">
      <section className="px-10 py-20  ml-20 lg:ml-52   flex flex-col  lg:grid grid-cols-4 gap-5">
        <h4 className="col-span-4">Post Available Meals</h4>
        <div className="col-span-2">
          <label htmlFor="">Time created</label>
          <input
            type="text"
            placeholder={dayTime}
            className="w-full"
            disabled
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="">Food name</label>
          <input
            type="text"
            placeholder="Enter Food name"
            className="w-full"
            onChange={(e) => setname(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="">Food image</label>
          <input
            type="file"
            placeholder="upload food image"
            className="w-full"
            onChange={(e) => setfood_image(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="">Food menu id</label>
          <input
            type="text"
            placeholder="Enter food menu id"
            className="w-full"
            onChange={(e) => setmenu_id(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="col-span-2">
          <label htmlFor="">Food price</label>
          <input
            type="number"
            placeholder="Enter Food price"
            className="w-full"
            onChange={(e) => setprice(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>
        <div className="col-span-2">
          <label htmlFor="">Time updated</label>
          <input
            type="text"
            placeholder={dayTime}
            className="w-full"
            disabled
          />
        </div>
        <button
          type="submit"
          onClick={isPosting ? null : handleFoodPosting}
          className="bg-AppBlack w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl col-span-2"
        >
          {isPosting ? "posting..." : "post"}
        </button>

        <button
          type="submit"
        //   onClick={isDeleting ? null : handleFoodDeleting}
          className="bg-AppRed w-full text-AppWhite py-2 rounded-2xl capitalize font-bold text-xl col-span-2"
        >
          {isDeleting ? "posting..." : "cancel"}
        </button>
      </section>
    </div>
  );
};

export default Foods;
