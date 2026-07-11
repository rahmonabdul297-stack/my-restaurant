import { useNavigate } from "react-router";
import { errorNotification } from "../utils/helper";
import { useContext, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuEyeClosed } from "react-icons/lu";
import { ThemeContext } from "../context/context";

const Adminlogin = () => {
  const userName = "Admin001";
  const Password = "welcome";
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [Display, setDisplay] = useState(false);

  const navigate = useNavigate();

  const HandleAdminSignin = () => {
    if (username === userName && password === Password) {
      try {
        window.localStorage.setItem(
          "restaurant_admin_session",
          JSON.stringify({ isAdmin: true, username }),
        );
      } catch {
        // ignore storage errors
      }
      navigate("/dashboard");
    } else {
      errorNotification("you're not an admin!");
    }
  };
  const { dark } = useContext(ThemeContext);
  return (
    <div className="py-40">
      <div className="mx-auto text-AppBlack w-[90%] lg:w-[500px] flex flex-col gap-5 items-center bg-AppWhite p-5 rounded-2xl border-2 border-AppBlack">
        <h2 className="uppercase text-xl font-bold">login as Admin</h2>
        <div className="w-full flex flex-col ">
          <label htmlFor="">username</label>
          <input type="text" onChange={(e) => setusername(e.target.value)} placeholder="Enter your username" className="bg-AppCream" />
        </div>
        <div className="w-full ">
          <label htmlFor="">password</label>
          <div className="flex items-center gap-4 border-AppBlack border-2 rounded-2xl">
            {" "}
            <input
              type={Display ? "text" : "password"}
              className="w-[90%] outline-AppWhite border-AppWhite"
              onChange={(e) => setpassword(e.target.value)}
               placeholder="Enter your password"
            />
            <div onClick={() => setDisplay((prev) => !prev)}>
              {Display ? <MdOutlineRemoveRedEye /> : <LuEyeClosed />}
            </div>
          </div>
        </div>

        <div
          className={`w-full ${dark ? "bg-AppBlack" : "bg-AppRed"} text-AppWhite text-center py-3 rounded-2xl capitalize`}
          onClick={HandleAdminSignin}
        >
          sign-in as Admin
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;
