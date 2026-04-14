import { useContext, useState } from "react";
import { IoIosCheckmark } from "react-icons/io";
import { Link, useNavigate } from "react-router";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Apploader } from "../components/Apploader";
import { IoClose } from "react-icons/io5";
import { ThemeContext } from "../context/context";

const Signup = () => {
  const [phone, setphone] = useState();
  const [password, setpassword] = useState("");
  const [confirmPass, setconfirmPass] = useState();
  const [isSubmitting, setisSubmitting] = useState(null);
  const [warning, setwarning] = useState("");
  const [Securitywarning, setSecuritywarning] = useState("");
  const [display, setdisplay] = useState(false);
  const navigate = useNavigate();
  const {
    dark,
    first_name,
    setFirstName,
    Last_name,
    setLastName,
    email,
    setemail,
  } = useContext(ThemeContext);
  const url = "https://restaurant-management-f9kx.onrender.com/api/v1/user";
  const passwordConditions = [
    {
      id: 1,
      conditions: "must be at least 8 characters",
      check: password?.length >= 8,
    },
    {
      id: 2,
      conditions: "must include at least a number",
      check: /[0-9]/.test(password),
    },
    {
      id: 3,
      conditions: "must include uppercase",
      check: /[A-Z]/.test(password),
    },
    {
      id: 4,
      conditions: "must include lowercase",
      check: /[a-z]/.test(password),
    },
    {
      id: 5,
      conditions: "must include at least a symbol @,$,&..",
      check: /[!@#$%^&*(),.?"~`_:{}|<>]/.test(password),
    },
  ];
  const handleSignUp = async () => {
    setisSubmitting(true);
    const isValid =
      first_name && Last_name && email && phone && password === confirmPass;
    if (isValid) {
      const payload = { first_name, Last_name, email, phone, password };
      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const response = await request.json();
      console.log("response", response);
      console.log("data", first_name, Last_name, email, phone, password);
      if (response.InsertedID&&request.ok && request.status.toString().includes("20")) {
        successNotification("Account created successfully");
        navigate("/signin", { state: { first_name } });
      } else {
        errorNotification("Signup failed!");
      }
      if (password === confirmPass) {
        setSecuritywarning("");
      } else {
        setSecuritywarning("re-enter your password");
      }
    } else {
      setwarning("field required!");
      infoNotification("follow the instruction and try again!");
    }
    setisSubmitting(false);
  };
  return (
    <div className="container py-10 lg:py-0">
      <form
        action=""
        className={`${dark ? "bg-AppWhite" : "bg-AppWhite "} h-max  mx-auto flex flex-col gap-5 py-10 px-5 border-2 rounded-2xl my-10`}
      >
        <h4>create an account</h4>
        <div className="field">
          {" "}
          <label htmlFor="">First Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={first_name}
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
          <div className="text-AppRed"> {warning}</div>
        </div>
        <div className="field">
          {" "}
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            placeholder="Enter your Last Name"
            required
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className="text-AppRed"> {warning}</div>
        </div>

        <div className="field">
          {" "}
          <label htmlFor="">email address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            required
            onChange={(e) => setemail(e.target.value)}
          />
          <div className="text-AppRed"> {warning}</div>
        </div>
        <div className="field">
          <label htmlFor="">phone number</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            required
            onChange={(e) => setphone(e.target.value)}
          />
          <div className="text-AppRed"> {warning}</div>
        </div>

        <div className="field">
          {" "}
          <label htmlFor="">password</label>
          <div className="flex items-center gap-3 border-2  rounded-2xl">
            <input
              type={display ? "text" : "password"}
              placeholder="set your password"
              required
              onChange={(e) => setpassword(e.target.value)}
              className="w-[90%] outline-0 border-2 border-AppWhite"
            />
            <div onClick={() => setdisplay((prev) => !prev)}>
              {display ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
            </div>
          </div>
          <div className="text-AppRed"> {warning}</div>
        </div>

        <div className="field">
          {" "}
          <label htmlFor="">Confirm password</label>
          <div className="flex items-center gap-3 border-2  rounded-2xl">
            <input
              type={display ? "text" : "password"}
              placeholder="Confirm your password"
              required
              onChange={(e) => setconfirmPass(e.target.value)}
              className="w-[90%] outline-0 border-2 border-AppWhite"
            />
            <div onClick={() => setdisplay((prev) => !prev)}>
              {display ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
            </div>
          </div>
          <div className="text-AppRed">{warning}</div>
          <div className="text-AppRed"> {Securitywarning}</div>
        </div>
        <div className="flex flex-col">
          {passwordConditions.map((item, id) => (
            <div
              key={id}
              className={
                item.check
                  ? "text-green-400 text-xs flex items-center"
                  : "text-AppRed text-xs flex items-center"
              }
            >
              {item.check ? <IoIosCheckmark /> : <IoClose />}
              {item.conditions}
            </div>
          ))}
        </div>
        <div
          className={`${dark?"bg-AppBlack":"bg-AppRed"} text-center py-2 text-AppWhite text-xl capitalize rounded-2xl w-full `}
          onClick={handleSignUp}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2 ">
              processing...
            </span>
          ) : (
            "sign up"
          )}
        </div>
        <div className="capitalize">
          {" "}
          Already have an account ?{" "}
          <Link to="/signin" className="text-AppRed ">
            sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
