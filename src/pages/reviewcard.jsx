import React from "react";
import { FaStar } from "react-icons/fa";
import { reviews } from "../components/Arrays"; // adjust path as needed

export const Reviewcard = () => {
  // Duplicate array for a seamless loop
  const doubledReviews = [...reviews, ...reviews];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Side Fade Masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#090D16] dark:via-[#090D16]/80 dark:to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#090D16] dark:via-[#090D16]/80 dark:to-transparent" />

      {/* Animated Motion Track */}
     <div className="flex w-max animate-[marquee_120s_linear_infinite] gap-5 hover:[animation-play-state:paused]">
        {doubledReviews.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="w-[320px] flex-shrink-0 flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md border-amber-900/10 bg-[#D7CFBF] text-slate-900 dark:border-amber-500/20 dark:bg-[#0F182C] dark:text-slate-100"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.customer_name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#D97706]"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">
                      {item.customer_name}
                    </h4>
                    <p className="text-[11px] opacity-70">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 rounded-full bg-[#D97706] px-2.5 py-1 text-white shadow-sm">
                  <FaStar className="h-3.5 w-3.5 fill-white text-white" />
                  <span className="text-xs font-bold">{item.rating}.0</span>
                </div>
              </div>

              {/* Dish Badge */}
              <div className="mt-3">
                <span className="inline-block rounded-md bg-black/5 px-2.5 py-1 text-[11px] font-medium dark:bg-white/10">
                  Ordered:{" "}
                  <strong className="text-[#D97706]">{item.item_ordered}</strong>
                </span>
              </div>

              {/* Comment */}
              <p className="mt-2.5 text-xs leading-relaxed opacity-90 line-clamp-3">
                "{item.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviewcard;
