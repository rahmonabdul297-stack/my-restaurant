import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Apploader } from "../components/Apploader";

import { ThemeContext } from "../context/context";

import { loadSession } from "../utils/authSession";

const USERS_URL =
  "https://restaurant-management-f9kx.onrender.com/api/v1/users";

const normaliseUsersPayload = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload.users)) return payload.users;

  return [];
};

const AdminUsers = () => {
  const { dark } = useContext(ThemeContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    setLoadError(null);

    const session = loadSession();

    const token = session?.token?.trim();

    const headers = {
      Accept: "application/json",

      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await fetch(USERS_URL, {
        method: "GET",

        headers,
      });

      const text = await response.text();

      let parsed = null;

      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        setUsersList([]);

        setLoadError(
          "The server returned data we could not read. Please try again later.",
        );

        return;
      }

      if (!response.ok) {
        setUsersList([]);

        if (response.status === 401 || response.status === 403) {
          setLoadError(
            "You may need to sign in with an account that can view users.",
          );
        } else if (response.status >= 500) {
          setLoadError(
            "The service is temporarily unavailable. Please try again in a moment.",
          );
        } else {
          setLoadError(
            "We could not load users right now. Please use Retry or check back later.",
          );
        }

        return;
      }

      setUsersList(normaliseUsersPayload(parsed));

      setLoadError(null);
    } catch (err) {
      console.error(err);

      setUsersList([]);

      setLoadError(
        "We could not reach the server. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const totalUsers = useMemo(() => usersList.length, [usersList]);

  const bannerClass = dark
    ? "mb-6 rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-left text-sm text-amber-100 flex items-center justify-center"
    : "mb-6 rounded-xl border border-amber-600/30 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950 flex items-center justify-center";

  return (
    <div
      className={`flex min-h-screen w-full items-center justify-center py-20 ${
        dark ? "bg-AppGray text-AppWhite" : "bg-AppWhite text-AppBlack"
      }`}
    >
      <section className="w-full max-w-lg px-6 text-center capitalize">
        <h2
          className={
            dark
              ? "mb-6 text-2xl font-black text-AppWhite"
              : "mb-6 text-2xl font-black text-AppRed"
          }
        >
          Total users: {totalUsers}
        </h2>

        {loading ? (
          <Apploader />
        ) : (
          <>
            {loadError ? (
              <div className={bannerClass} role="alert">
                <p className="mb-3 font-medium normal-case text-center">
                  {loadError}
                </p>

                <button
                  type="button"
                  onClick={() => loadUsers()}
                  className={
                    dark
                      ? "rounded-lg bg-AppWhite px-4 py-2 text-sm font-semibold text-AppBlack normal-case hover:bg-AppWhite/90"
                      : "rounded-lg bg-AppRed px-4 py-2 text-sm font-semibold text-AppWhite normal-case hover:opacity-90"
                  }
                >
                  Retry
                </button>
              </div>
            ) : null}

            {totalUsers > 0 ? (
              <ol className="mx-auto max-w-md list-inside list-decimal text-left">
                {usersList.map((user, idx) => (
                  <li
                    key={
                      user.user_id ??
                      user.email ??
                      `user-${idx}-${String(user.first_name ?? "")}`
                    }
                  >
                    {user.first_name}

                    {user.last_name ? ` ${user.last_name}` : ""}

                    {user.email ? (
                      <span
                        className={
                          dark
                            ? "ml-1 block text-xs font-normal normal-case text-AppWhite/60 sm:ml-2 sm:inline"
                            : "ml-1 block text-xs font-normal normal-case text-AppBlack/60 sm:ml-2 sm:inline"
                        }
                      >
                        {user.email}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : !loadError ? (
              <p className="text-base font-medium">No users found!</p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;
