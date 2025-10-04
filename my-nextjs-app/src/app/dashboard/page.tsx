import GardenStories from "../components/GardenStories";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import InfoCards from "../components/InfoCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF2E5]">
      <Navbar />
      <div className="flex flex-1 px-4 py-8 gap-4 max-w-screen-2xl mx-auto w-full pt-[163px]">
        <div className="mt-6">
          <Sidebar />
        </div>
        <main className="flex-1 flex flex-col items-center mt-6 gap-6">
          {/* Quote at the top */}
          <div className="w-full max-w-[720px] bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200">
            <blockquote className="text-lg md:text-xl font-medium text-[#4A6544] italic text-center">
              Every seed carries the promise of a forest, just as every small effort nurtures a greener tomorrow.
            </blockquote>
          </div>

          {/* Globe/Video in the middle */}
          <div className="flex items-center justify-center rounded-2xl bg-[#FAF2E5] shadow-md w-full max-w-[720px] h-[400px] overflow-hidden">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/videos/Earth.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Info Cards below */}
          <InfoCards />
        </main>
        <div className="mt-6">
          <GardenStories />
        </div>
      </div>
    </div>
  );
}
