import { useContext } from "react";
import { Link } from "react-router";
import { GiCampfire, GiKnifeFork } from "react-icons/gi";
import { MdOutlineLocalFlorist } from "react-icons/md";
import { ThemeContext } from "../context/context";

const pillars = [
  {
    title: "From the source",
    copy: "We build plates around what is seasonal, bold, and honest—never an afterthought.",
    icon: MdOutlineLocalFlorist,
  },
  {
    title: "Fire & craft",
    copy: "Technique meets instinct: slow layers, fast finishes, and the kind of heat that keeps flavor honest.",
    icon: GiCampfire,
  },
  {
    title: "Gathered tables",
    copy: "Whether it is a quick lunch or a long dinner, the room is tuned for warmth, rhythm, and appetite.",
    icon: GiKnifeFork,
  },
];

const AboutPage = () => {
  const { dark } = useContext(ThemeContext);

  return (
    <div
      className={`w-full min-h-screen overflow-x-hidden pt-16 ${
        dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"
      }`}
    >
      {/* Split hero — asymmetric, brand colors */}
      <section className="relative flex flex-col lg:flex-row min-h-[72vh]">
        <div
          className={`relative z-[1] flex flex-1 flex-col justify-center gap-8 px-8 py-16 lg:py-24 lg:pl-16 lg:pr-12 ${
            dark ? "bg-AppBlack" : "bg-AppWhite text-AppBlack"
          } text-AppWhite`}
        >
          <div
            className="pointer-events-none absolute -right-1 top-0 hidden h-full w-16 skew-x-3 bg-AppRed lg:block"
            aria-hidden
          />
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-AppRed">
            Our story
          </p>
          <h1
            className={`max-w-xl font-black leading-[1.05] text-4xl sm:text-5xl lg:text-6xl ${dark ? "text-AppWhite" : "text-AppBlack"}`}
          >
            A kitchen built on <span className="text-AppRed">curiosity</span>,
            not templates.
          </h1>
          <p
            className={`max-w-md text-sm leading-relaxed ${dark ? "text-AppWhite/85" : " text-AppBlack"} sm:text-base`}
          >
            We chase the small details—how smoke curls off the grill, how citrus
            snaps against heat—so every visit feels like the first bite of
            something new.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/"
              className="rounded-xl bg-AppRed px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-AppWhite transition hover:bg-AppRed/90"
            >
              Explore the menu
            </Link>
            <Link
              to="/team"
              className={`rounded-xl border-2 ${dark?"border-AppWhite/40 text-AppWhite ":"border-AppRed text-AppBlack"} px-6 py-3 text-center text-sm font-bold uppercase tracking-wide transition`}
            >
              Meet the team
            </Link>
          </div>
        </div>

        <div
          className="relative min-h-[40vh] flex-1 bg-cover bg-center bg-no-repeat lg:min-h-0"
          style={{
            backgroundImage:
              "url('/images/Gemini_Generated_Image_gkfl0qgkfl0qgkfl.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-AppBlack/80 via-AppBlack/25 to-transparent lg:bg-gradient-to-l" />
          <div className="relative flex h-full min-h-[40vh] flex-col justify-end p-8 lg:justify-center lg:p-14">
            <div
              className={`polygons max-w-md rounded-2xl border-2 p-6 backdrop-blur-sm ${
                dark
                  ? "border-AppGray/60 bg-AppBlack/70"
                  : "border-AppRed/40 bg-AppBlack/65"
              }`}
            >
              <p className="font-black text-AppWhite text-2xl sm:text-3xl">
                Fresh, local ingredients
              </p>
              <p className="mt-2 text-AppWhite text-sm sm:text-base">
                Quality you can taste in every forkful—grown close, cooked with
                intent, served while it still hums.
              </p>
              <p className="mt-3 text-xs italic text-AppGray">
                Enjoy your taste to the fullest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accent rail */}
      <div className="flex h-2 w-full">
        <div className="h-full w-2/3 bg-AppRed" />
        <div
          className={`h-full flex-1 ${dark ? "bg-AppBlack" : "bg-AppGray"}`}
        />
      </div>

      {/* Stats strip */}
      <section
        className={`border-y ${
          dark
            ? "border-AppBlack bg-AppBlack"
            : "border-AppBlack/10 bg-AppWhite"
        }`}
      >
        <div className="container grid grid-cols-2 gap-8 py-14 md:grid-cols-4 md:gap-4">
          {[
            { label: "Courses imagined", value: "40+" },
            { label: "Local partners", value: "12" },
            { label: "Years of craft", value: "08" },
            { label: "Guests served weekly", value: "500+" },
          ].map((item) => (
            <div
              key={item.label}
              className={`text-center md:border-r md:border-AppRed/35 md:last:border-0 md:px-4 ${
                dark ? "text-AppWhite" : "text-AppBlack"
              }`}
            >
              <div className="font-black text-3xl text-AppRed md:text-4xl">
                {item.value}
              </div>
              <div
                className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                  dark ? "text-AppCream" : "text-AppBlack/60"
                }`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars — bento-style cards */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            className={`inline-block border-b-4 border-AppRed pb-2 font-black text-3xl uppercase md:text-4xl ${
              dark ? "text-AppWhite" : "text-AppBlack"
            }`}
          >
            How we cook
          </h2>
          <p
            className={`mt-4 text-sm md:text-base ${
              dark ? "text-AppCream" : "text-AppBlack/70"
            }`}
          >
            Three anchors keep the menu honest—color, contrast, and the same red
            thread you see across the brand.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ title, copy, icon: Icon }, i) => (
            <article
              key={title}
              className={`group relative overflow-hidden rounded-2xl border-2 p-8 transition ${
                dark
                  ? "border-AppGray/50 bg-AppBlack/40 hover:border-AppRed"
                  : "border-AppBlack/10 bg-AppWhite shadow-[8px_8px_0_0] shadow-AppRed/25 hover:border-AppRed"
              }`}
            >
              <div
                className={`mb-6 inline-flex rounded-2xl p-4 ${
                  i === 1
                    ? "bg-AppRed text-AppWhite"
                    : dark
                      ? "bg-AppGray/30 text-AppRed"
                      : "bg-AppGray/40 text-AppRed"
                }`}
              >
                <Icon className="text-3xl" aria-hidden />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tight">
                {title}
              </h3>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  dark ? "text-AppCream" : "text-AppBlack/75"
                }`}
              >
                {copy}
              </p>
              <span
                className={`mt-6 block h-1 w-12 rounded-full bg-AppRed transition-all group-hover:w-20`}
              />
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="polygons mx-4 mb-20 md:mx-auto md:max-w-4xl">
        <div
          className={`rounded-2xl px-8 py-12 text-center md:px-16 ${
            dark
              ? "bg-AppBlack text-AppWhite ring-2 ring-AppRed/50"
              : "bg-AppGray text-AppWhite ring-2 ring-AppRed"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-AppRed">
            Ready when you are
          </p>
          <h3
            className={`mt-4 font-black text-2xl md:text-3xl ${dark ? "text-AppWhite" : "text-AppBlack"}`}
          >
            Pull up a chair—your table is waiting.
          </h3>
          <p
            className={`mx-auto mt-3 max-w-lg text-sm ${dark ? "text-AppCream" : " text-AppBlack"}`}
          >
            Same palette you know from the site: deep charcoal, warm gray, and
            that signal red for moments that matter.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-AppRed px-8 py-3 text-sm font-bold uppercase tracking-wide text-AppWhite transition hover:bg-AppRed/90"
          >
            Give it a trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
