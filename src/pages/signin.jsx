import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";

const Signin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isSubmitting, setisSubmitting] = useState();
  const [warning, setwarning] = useState("");
  const Location = useLocation();
  const { first_name } = Location.state || {};
  const navigate = useNavigate();
   const url = "https://restaurant-management-f9kx.onrender.com/api/v1/user-login";


  // const handlesignin = async () => {
  //   setisSubmitting(true);
  //   if ((password, email.toString().includes("@"))) {
  //     const payload = { email, password };
  //     const request = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const response = await request.json();
  //     console.log("response", response);
  //     console.log("data", name, email);
  //     if (request.ok && request.status.toString().includes("20")) {
  //       successNotification("successful");
  //       navigate("/home", { state: { name } });
  //     } else {
  //       errorNotification("something when wrong!");
  //     }
  //   } else {
  //     setwarning("field required!");
  //     infoNotification("follow the instruction and try again!");
  //   }
  //   setisSubmitting(false);
  // };
const handlesignin = async () => {
    setisSubmitting(true);
    const isValid =
       email && password;
    if (isValid) {
      const payload = { email, password };
      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      
      if (request.ok && request.status.toString().includes("20")) {
        
        successNotification("successfully logged in!");
        navigate("/home", { state: { first_name} });
      } else {
        errorNotification("Login failed!");
      }
      console.log("status", request.ok, request.status);
      if (password) {
        setwarning("");
      } else {
        setwarning("re-enter your password");
      }
    } else {
      setwarning("field required!");
      infoNotification("follow the instruction and try again!");
    }
    setisSubmitting(false);
  };


  return (
    <div className="container  h-max py-20">
      <form
        action=""
        className=" bg-AppWhite h-max mx-auto flex flex-col gap-5 py-10 px-5 border-2 rounded-2xl col-span-2 my-auto "
      >
        <h5 className="text-AppRed font-black text-xl uppercase text-center">
          welcome back {first_name}!
        </h5>
        <h4>sign-in to your account</h4>

        <div className="field">
          {" "}
          <label htmlFor="">email address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            required
            onChange={(e) => setemail(e.target.value)}
          />{" "}
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="field">
          {" "}
          <label htmlFor="">password</label>
          <input
            type="password"
            placeholder="Set your password"
            required
            onChange={(e) => setpassword(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div
          className="bg-AppRed text-center py-2 text-AppWhite text-xl capitalize rounded-2xl w-full "
          onClick={isSubmitting ? null : handlesignin}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </div>
        <div className="capitalize">
          {" "}
          you do not have an existing account ?{" "}
          <Link to="/signup" className="text-AppRed ">
            create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
