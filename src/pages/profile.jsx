import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { ThemeContext } from "../context/context";
import { loadSession, saveSession } from "../utils/authSession";
import { successNotification } from "../utils/helper";
import {
  loadProfileFromFirebase,
  saveProfileToFirebase,
} from "../firebase/profileService";

const ProfilePage = () => {
  const {
    dark,
    first_name,
    setFirstName,
    email,
    setemail,
    Last_name,
    setLastName,
  } = useContext(ThemeContext);
  const [form, setForm] = useState({
    first_name: first_name || "",
    last_name: Last_name || "",
    email: email || "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrateProfile = async () => {
      setIsLoading(true);
      const session = loadSession();
      const remoteProfile = await loadProfileFromFirebase(
        session?.user_id || session?.email,
      );
      const nextForm = {
        first_name: remoteProfile?.first_name || first_name || "",
        last_name: remoteProfile?.last_name || Last_name || "",
        email: remoteProfile?.email || email || "",
        phone: remoteProfile?.phone || "",
      };
      setForm(nextForm);
      setFirstName(nextForm.first_name || "");
      setLastName(nextForm.last_name || "");
      setemail(nextForm.email || "");
      setIsLoading(false);
    };

    hydrateProfile();
  }, [email, first_name, Last_name, setFirstName, setLastName, setemail]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const nextSession = {
      ...(loadSession() || {}),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    saveSession(nextSession);
    setFirstName(nextSession.first_name || "");
    setLastName(nextSession.last_name || "");
    setemail(nextSession.email || "");

    const syncedProfile = await saveProfileToFirebase(nextSession);
    setForm({
      first_name: syncedProfile.first_name || "",
      last_name: syncedProfile.last_name || "",
      email: syncedProfile.email || "",
      phone: syncedProfile.phone || "",
    });

    successNotification("Profile updated.");
    setIsSaving(false);
  };

  const hasProfile = Boolean(first_name || email || Last_name);

  return (
    <div
      className={`min-h-screen px-3 py-24 sm:px-5 lg:px-8 ${dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"}`}
    >
      <div className="mx-auto max-w-5xl rounded-[28px] border border-AppRed/20 bg-gradient-to-br from-AppRed/10 via-white to-AppRed/5 p-4 shadow-sm dark:border-AppRed/30 dark:from-AppBlack dark:via-AppGray dark:to-AppBlack sm:p-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-AppRed">
              Your profile
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Manage your account
            </h2>
            <p className="mt-2 max-w-2xl text-sm opacity-80">
              Keep your contact details fresh so your orders and account stay
              easy to manage.
            </p>
          </div>
          {!hasProfile ? (
            <Link
              to="/signin"
              className="rounded-2xl bg-AppRed px-4 py-2.5 text-sm font-semibold text-white"
            >
              Sign in to continue
            </Link>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div
            className={`rounded-[24px] border p-5 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-AppRed/15 text-2xl font-semibold text-AppRed">
                {(form.first_name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {form.first_name || "Guest user"}
                </h3>
                <p className="text-sm opacity-70">
                  {form.email || "No email on file"}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              <div className="rounded-2xl border border-AppRed/10 bg-AppRed/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-AppRed">
                  Name
                </p>
                <p className="mt-1 font-semibold">
                  {form.first_name || "—"} {form.last_name || ""}
                </p>
              </div>
              <div className="rounded-2xl border border-AppRed/10 bg-AppRed/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-AppRed">
                  Phone
                </p>
                <p className="mt-1 font-semibold">
                  {form.phone || "Add a phone number"}
                </p>
              </div>
              <div className="rounded-2xl border border-AppRed/10 bg-AppRed/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-AppRed">
                  Storage
                </p>
                <p className="mt-1 font-semibold">Saved securely in Firebase</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`rounded-[24px] border p-5 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}
          >
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block">First name</span>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) =>
                        handleChange("first_name", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block">Last name</span>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) =>
                        handleChange("last_name", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    <span className="mb-2 block">Phone</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 outline-none focus:border-AppRed"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="mt-6 w-full rounded-2xl bg-AppBlack px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-AppRed disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving profile..." : "Save profile"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
