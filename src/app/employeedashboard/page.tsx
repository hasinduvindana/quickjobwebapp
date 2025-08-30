"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [loggingOut, setLoggingOut] = useState(false); // For logout animation

  // Load user data from localStorage on mount
  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName");
    if (firstName) setUserFirstName(firstName);
  }, []);

  const [ads, setAds] = useState([
    {
      id: 1,
      title: "Plumber Needed",
      location: "Colombo",
      skill: "Plumbing",
      description: "Fixing water leaks, pipelines.",
      image: "/ad1.png",
    },
    {
      id: 2,
      title: "Carpenter Available",
      location: "Kandy",
      skill: "Carpentry",
      description: "Wood work, furniture making.",
      image: "/ad2.png",
    },
    {
      id: 3,
      title: "Mechanic Required",
      location: "Galle",
      skill: "Mechanic",
      description: "Vehicle repair and maintenance.",
      image: "/ad3.png",
    },
  ]);

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(search.toLowerCase()) &&
      (skill ? ad.skill === skill : true) &&
      (town ? ad.location === town : true) &&
      (district ? ad.location === district : true)
  );

  const handleLogout = async () => {
    setLoggingOut(true); // Show logout popup
    setTimeout(async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userAccountType");
        router.push("/signin");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
        setLoggingOut(false);
      }
    }, 3000); // 3-second animation
  };

  const handleAdClick = (adId: number) => router.push(`/ads/${adId}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white relative">
      {/* Use Navbar Component */}
      <Navbar
        firstName={userFirstName}
        onLogout={handleLogout}
        dashboardType="employee"
      />

      {/* Filter Section */}
      <div className="bg-black/50 backdrop-blur-md shadow-md p-4 flex flex-wrap items-center gap-4 z-10 relative">
        <input
          type="text"
          placeholder="Search ads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-purple-700/50 rounded px-3 py-2 flex-1 min-w-[200px] bg-black/30 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border border-purple-700/50 rounded px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Skills</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Electrical">Electrical</option>
          <option value="Painting">Painting</option>
        </select>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border border-purple-700/50 rounded px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Districts</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Jaffna">Jaffna</option>
          <option value="Matara">Matara</option>
        </select>
        <select
          value={town}
          onChange={(e) => setTown(e.target.value)}
          className="border border-purple-700/50 rounded px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Towns</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Jaffna">Jaffna</option>
          <option value="Matara">Matara</option>
        </select>
        <button
          onClick={() => {
            setSearch(""); setSkill(""); setDistrict(""); setTown("");
          }}
          className="bg-purple-600/70 hover:bg-purple-700/80 text-white px-4 py-2 rounded-lg transition"
        >
          Clear Filters
        </button>
      </div>

      {/* Ads List */}
      <div className="p-6">
        {filteredAds.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <p className="text-lg">No ads found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-black/40 backdrop-blur-md shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleAdClick(ad.id)}
              >
                <Image
                  src={ad.image}
                  width={400}
                  height={200}
                  alt={ad.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">{ad.title}</h3>
                  <p className="text-sm text-purple-300 mb-2">📍 {ad.location}</p>
                  <span className="inline-block bg-purple-700/30 text-purple-200 text-xs px-2 py-1 rounded-full font-medium">
                    {ad.skill}
                  </span>
                  <p className="mt-2 text-gray-200 text-sm">{ad.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Animation Overlay */}
      {loggingOut && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-800/80 p-8 rounded-2xl text-center flex flex-col items-center gap-4"
          >
            <p className="text-white text-lg font-semibold">Logging Out...</p>

            {/* Spinning Loader */}
            <motion.div
              className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
