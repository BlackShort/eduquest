import { Header } from "@/components/site/header";
import medal from "@/assets/medal.png";
import dailyMedal from "@/assets/contest/daily.png";
import weeklyMedal from "@/assets/contest/weekly.png";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

export const ContestHome = () => {
  const contests = [
    {
      id: "daily-contest",
      name: "Daily Coding Contest",
      description: "Compete and see your ranking!",
      image: dailyMedal,
      time: "Everyday 8:00 PM (UTC+0)",
    },
    {
      id: "weekly-contest-1",
      name: "Weekly Coding Contest",
      description: "Compete and see your ranking!",
      image: weeklyMedal,
      time: "Every Sunday 8:00 PM (UTC+0)",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-950">
      <Header variant="sticky" theme="dark" />

      {/* <div className="fixed top-12 inset-0 z-0 bg-[linear-gradient(to_right,var(--color-gray-300)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-gray-300)_1px,transparent_1px)] bg-size-[20px_20px] bg-position-[0_0,0_0] mask-[repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px),radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_70%)] [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px),radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_70%)] mask-intersect [-webkit-mask-composite:source-in]" /> */}

      <div
        className="fixed top-12 inset-0 z-0 
          bg-[linear-gradient(to_right,var(--color-neutral-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-900)_1px,transparent_1px)] bg-size-[20px_20px] bg-position-[0_0,0_0] 
          mask-[repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] 
          [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] mask-intersect [-webkit-mask-composite:source-in]"
      />

      <main className="z-1 relative flex justify-center w-full h-full max-w-7xl mx-auto">
        <div className="flex flex-col justify-center max-w-6xl gap-12 relative z-5 backdrop-blur-[0.5px]">
          <div className="w-full h-max flex flex-col items-center justify-center gap-2">
            <img src={medal} alt="Medal" className="w-50 h-50 object-cover" />
            <h2 className="text-center text-4xl text-orange-500 font-semibold backdrop-blur-xs">
              Daily Coding Contest
            </h2>
            <p className="text-neutral-500 text-base font-normal backdrop-blur-xs">
              Compete and see your ranking!
            </p>
          </div>

          <div className="flex gap-5">
            {contests.map((item, index) => (
              <Link to={`/contest/${item.id}`} key={index}>
                <div
                  className="transform transition-transform duration-300 ease-out hover:scale-[1.03] will-change-transform origin-center backface-hidden flex flex-col items-center justify-between bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950 text-neutral-100 w-md h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-black/40"
                >
                  {/* Image Section */}
                  <div className="p-4 w-full flex items-start justify-center">
                    <img
                      src={item.image}
                      alt="Contest Medal"
                      className="w-34 h-38 object-contain"
                    />
                  </div>

                  {/* Bottom Section */}
                  <div className="px-4 py-3 bg-neutral-800/60 backdrop-blur-sm flex items-center justify-between w-full gap-4">
                    <div className="flex flex-col">
                      <h2 className="text-base font-semibold text-neutral-100">
                        {item.name}
                      </h2>
                      <p className="text-neutral-400 text-sm">{item.time}</p>
                    </div>

                    <button
                      type="button"
                      className="cursor-pointer group flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-linear-to-br from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-700 hover:border-neutral-500 transition-all duration-300"
                    >
                      <span className="text-orange-400">Register</span>

                      <ChevronRight
                        className="w-4 h-4 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
