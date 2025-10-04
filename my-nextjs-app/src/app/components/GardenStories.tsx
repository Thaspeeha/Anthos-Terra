import Image from "next/image";

const stories = [
  {
    title: "Endangered Crop Rediscovered in Rural India",
    author: "Rakesh Singh",
    date: "Mar. 5, 2025",
    img: "/garden1.png",
    desc: "Farmers in Maharashtra have rediscovered an ancient variety of millet believed to be lost for decades. Scientists say this crop is drought-resistant and could be a game-changer for sustainable agriculture.",
  },
  {
    title: "Global Effort to Preserve Wildflowers Launched",
    author: "James Mathew",
    date: "Mar. 5, 2025",
    img: "/garden2.png",
    desc: "A coalition of botanists and environmental groups has started a project to map and digitally preserve the DNA of wildflowers at risk of extinction due to climate change.",
  },
  {
    title: "AI Helps Identify Rare Flowers in Seconds",
    author: "Chris Charles",
    date: "Mar. 5, 2025",
    img: "/garden3.png",
    desc: "Researchers have developed an AI-powered app that can instantly recognize over 20,000 flower species, aiding conservationists and curious explorers alike.",
  },
];

export default function GardenStories() {
  return (
    <aside className="bg-white/90 rounded-2xl p-5 shadow-md w-full max-w-[320px] h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative">
        <span className="text-green-600 text-lg">📖</span>
        <h2 className="text-[#4A6544] font-semibold text-lg relative">
          Garden stories
          <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-yellow-400 rounded-md"></span>
        </h2>
        <button className="ml-auto text-[#35655B] text-sm border px-2 py-1 rounded-full border-[#E9ECE5] hover:bg-[#E9ECE5] transition">
          View All
        </button>
      </div>
      {/* Stories List */}
      <div className="flex-1 overflow-y-auto pr-2">
        {stories.map((story) => (
          <div key={story.title} className="flex mb-6 last:mb-0">
            <Image
              src={story.img}
              alt={story.title}
              width={100}
              height={64}
              className="rounded-lg mr-3 object-cover flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-base mb-1 text-gray-900">{story.title}</h3>
              <span className="text-xs text-gray-500">
                {story.author} — {story.date}
              </span>
              <p className="text-xs text-gray-700 mt-1">
                {story.desc.substring(0, 80)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
