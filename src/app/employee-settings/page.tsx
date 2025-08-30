"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getFirestore } from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";


// Add this line to get your Firestore instance
const firestore = getFirestore();

export default function EmployeeSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  type Skill = {
    skill: string;
    experience: string;
  };

  type UserData = {
    firstName: string;
    lastName: string;
    email: string;
    skills: Skill[];
    serviceLocation: string;
    contactNumber: string;
  };

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    skills: [{ skill: "", experience: "" }],
    serviceLocation: "",
    contactNumber: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Get email from localStorage (stored during signin)
  const email = localStorage.getItem("userFirstName"); // You might want to store email separately

  // Load user data
  useEffect(() => {
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(collection(firestore, "userlog"), email);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const existingData = userSnap.data();
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...existingData,
            email: existingData.email || email
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [email]);

  // Handle adding new skill row
  const addSkill = () => {
    setUserData({ ...userData, skills: [...userData.skills, { skill: "", experience: "" }] });
  };

  // Handle removing a skill row
  const removeSkill = (index: number) => {
    if (userData.skills.length > 1) {
      const newSkills = userData.skills.filter((_, idx) => idx !== index);
      setUserData({ ...userData, skills: newSkills });
    }
  };

  const handleSkillChange = (index: number, field: "skill" | "experience", value: string) => {
    const newSkills = [...userData.skills];
    newSkills[index][field] = value;
    setUserData({ ...userData, skills: newSkills });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Auto-get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserData({
            ...userData,
            serviceLocation: `${position.coords.latitude},${position.coords.longitude}`,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleClear = () => {
    setUserData({
      ...userData,
      skills: [{ skill: "", experience: "" }],
      serviceLocation: "",
      contactNumber: "",
    });
    setProfileImage(null);
  };

  const handleSave = async () => {
    // Enhanced validations
    if (!userData.firstName || !userData.lastName || !userData.contactNumber) {
      alert("First name, Last name and Contact Number are required.");
      return;
    }

    // Validate contact number format
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(userData.contactNumber)) {
      alert("Please enter a valid contact number.");
      return;
    }

    // Validate skills
    const hasEmptySkills = userData.skills.some(skill => !skill.skill.trim() || !skill.experience.trim());
    if (hasEmptySkills) {
      alert("Please fill in all skill fields or remove empty rows.");
      return;
    }

    setLoading(true);

    try {
      // Save to new collection "employeeinfo"
      await setDoc(doc(collection(firestore, "employeeinfo"), email!), {
        ...userData,
        profileImageName: profileImage?.name || "",
        savedAt: new Date(),
        lastModified: new Date(),
      });

      // Show saving animation for 3s
      setTimeout(() => {
        setLoading(false);
        setSaved(true);

        setTimeout(() => {
          router.push("/employeedashboard"); // Use Next.js router instead
        }, 3000);
      }, 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save data. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FiSettings className="text-2xl text-purple-400" />
            <h2 className="text-xl font-bold">Employee Account Settings</h2>
          </div>
          <button
            onClick={() => router.push("/employeedashboard")}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Profile Image */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="relative">
            <Image
              src={profileImage ? URL.createObjectURL(profileImage) : "/user.png"}
              width={100}
              height={100}
              alt="Profile"
              className="rounded-full border-2 border-purple-600"
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
        </div>

        {/* Personal Info */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-600/50 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Skills Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-purple-300">Skills & Experience</h3>
            <span className="text-sm text-gray-400">({userData.skills.length} skill{userData.skills.length !== 1 ? 's' : ''})</span>
          </div>
          {userData.skills.map((s, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Skill (e.g., Plumbing)"
                value={s.skill}
                onChange={(e) => handleSkillChange(idx, "skill", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Experience (e.g., 2 years)"
                value={s.experience}
                onChange={(e) => handleSkillChange(idx, "experience", e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {userData.skills.length > 1 && (
                <button
                  onClick={() => removeSkill(idx)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addSkill}
            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg mt-2 transition"
          >
            + Add Skill
          </button>
        </div>

        {/* Service Location & Contact */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Service Location (or use GPS)"
              value={userData.serviceLocation}
              onChange={(e) => setUserData({ ...userData, serviceLocation: e.target.value })}
              className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleGetLocation}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg transition whitespace-nowrap"
            >
              📍 Get Location
            </button>
          </div>

          <input
            type="tel"
            placeholder="Contact Number (e.g., +94 77 123 4567)"
            value={userData.contactNumber}
            onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleClear}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            Clear Form
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Info"}
          </button>
        </div>
      </div>

      {/* Loading / Saving Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-purple-800/80 p-8 rounded-2xl text-center flex flex-col items-center gap-4"
          >
            <p className="text-white text-lg font-semibold">Data Saving...</p>
            <motion.div
              className="w-12 h-12 border-4 border-t-purple-500 border-b-purple-200 border-l-purple-200 border-r-purple-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </div>
      )}

      {saved && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-700 p-8 rounded-2xl text-center text-white flex flex-col items-center gap-4"
          >
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg font-semibold">Profile Saved Successfully!</p>
            <motion.div
              className="w-full h-2 bg-green-500 rounded mt-2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
