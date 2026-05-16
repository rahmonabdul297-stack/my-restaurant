import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ThemeContext } from "../context/context";
import {
  errorNotification,
  infoNotification,
  successNotification,
} from "../utils/helper";
import { normalizeLoginResponse, saveSession } from "../utils/authSession";

const USER_LOGIN_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/user-login";

const Signin = () => {
  const {
    dark,
    setFirstName,
    setemail: setUserEmail,
    setLastName,
  } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState("");
  const Location = useLocation();
  const { first_name: firstNameFromSignup } = Location.state || {};
  const navigate = useNavigate();

  const handlesignin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const isValid = trimmedEmail && password && trimmedEmail.includes("@");

    if (!isValid) {
      setWarning(
        trimmedEmail && !trimmedEmail.includes("@")
          ? "Enter a valid email address."
          : "Email and password are required.",
      );
      infoNotification("Fill the form correctly and try again.");
      return;
    }

    setWarning("");
    setIsSubmitting(true);
    try {
      const request = await fetch(USER_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const text = await request.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (request.ok && request.status >= 200 && request.status < 300) {
        const profile = normalizeLoginResponse(data);
        const session = profile
          ? {
              ...profile,
              email: profile.email || trimmedEmail,
              first_name: profile.first_name || firstNameFromSignup || "",
            }
          : {
              token: "",
              refresh_token: "",
              user_id: "",
              email: trimmedEmail,
              first_name: firstNameFromSignup || "",
              last_name: "",
            };

        if (session.token || session.first_name || session.email) {
          saveSession(session);
        }

        setUserEmail(session.email || trimmedEmail);
        setFirstName(session.first_name || firstNameFromSignup || "");
        setLastName(session.last_name || "");

        successNotification("Successfully logged in.");
        navigate("/home", {
          state: {
            first_name: session.first_name || firstNameFromSignup || "",
          },
        });
      } else {
        const msg =
          (data && (data.error || data.message)) || `Login failed try again`;
        errorNotification(msg);
      }
    } catch (err) {
      console.error(err);
      errorNotification("Network error — could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`container h-max py-20 min-h-[70vh] ${dark ? "text-AppWhite" : ""}`}
    >
      <form
        action=""
        onSubmit={handlesignin}
        className={`h-max mx-auto flex flex-col gap-5 py-10 px-5 border-2 rounded-2xl col-span-2 my-auto ${
          dark
            ? "border-AppGray bg-AppBlack/60"
            : "border-AppBlack/10 bg-AppWhite"
        }`}
      >
        <h5 className="text-AppRed font-black text-xl uppercase text-center">
          welcome {firstNameFromSignup ? `back, ${firstNameFromSignup}` : ""}!
        </h5>
        <h4>sign-in to your account</h4>

        <div className="field">
          <label htmlFor="signin-email">email address</label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <div className="field">
          <label htmlFor="signin-password">password</label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-AppRed">{warning}</div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${dark ? "bg-AppBlack" : "bg-AppRed"} text-center py-2 text-AppWhite text-xl capitalize rounded-2xl w-full border-0 cursor-pointer disabled:opacity-60`}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <div className={`capitalize ${dark ? "text-AppGray" : ""}`}>
          you do not have an existing account ?{" "}
          <Link to="/signup" className="text-blue-700 ">
            create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
