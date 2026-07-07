import { useContext, useState } from "react";
import { ThemeContext } from "../context/context";
import { errorNotification, successNotification } from "../utils/helper";
import { API_ENDPOINTS } from "../config/api";

const Aboutadmin = () => {
  const { dark } = useContext(ThemeContext);
  const [text, setText] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [updated_at, setUpdated_at] = useState("");
  const [id, setId] = useState("");
  const [note_id, setNote_id] = useState("");
  const [title, setTitle] = useState("");
  const [isposting, setIsposting] = useState(false);
  const NOTE_URL = API_ENDPOINTS.note;
  const handlePostingAboutAdmin = async (e) => {
    e.preventDefault();
    setIsposting(true);
    const payload = { created_at, id, note_id, title, text, updated_at };

    if (!payload) {
      errorNotification("Something went wrong, try again later");
    } else {
      const request = await fetch(NOTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (request.ok && request.status === 200) {
        successNotification("success!");
        console.log(payload);
      }
    }

    setIsposting(false);
  };
  return (
    <div
      className={`min-h-screen w-full px-3 py-6 sm:px-4 lg:px-6 ${
        dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"
      }`}
    >
      <section className="mx-auto w-full max-w-2xl">
        <h4 className="mb-4">About admin</h4>
        <p className={dark ? "text-AppBlack/75" : "text-AppBlack/80"}>
          Manage your restaurant from the dashboard. Use the sidebar to navigate
          foods, menus, orders, and users.
        </p>

        <form action="" method="post">
          <div className="flex  flex-col gap-3 lg:flex-row w-full py-3">
            <div className="w-full lg:w-[50%] flex flex-col">
              <label htmlFor="">Id</label>
              <input
                type="text"
                name=""
                id=""
                className="w-full"
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-[50%] flex flex-col">
              <label htmlFor="">Note Id</label>
              <input
                type="text"
                name=""
                id=""
                className="w-full"
                onChange={(e) => setNote_id(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="about" className="font-bold text-xl uppercase">
              title
            </label>
            <input
              type="text"
              name=""
              id=""
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <label htmlFor="about" className="font-bold text-xl uppercase">
            content
          </label>
          <textarea
            name="about"
            id="about"
            className="w-full rounded-md p-3.5"
            rows="5"
            required
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex  flex-col  gap-3 lg:flex-row w-full py-3">
            <div className="w-full lg:w-[50%] flex flex-col">
              <label htmlFor="">Time created</label>
              <input
                type="text"
                name=""
                id=""
                className="w-full"
                onChange={(e) => setCreated_at(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-[50%] flex flex-col">
              <label htmlFor="">Time updated</label>
              <input
                type="text"
                name=""
                id=""
                className="w-full"
                onChange={(e) => setUpdated_at(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`${dark ? "bg-AppBlack" : "bg-AppRed"} text-AppWhite px-4 py-2 rounded-2xl w-full capitalize`}
            onClick={isposting ? null : handlePostingAboutAdmin}
          >
            {isposting ? "posting..." : "post"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Aboutadmin;
