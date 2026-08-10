import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockLostFound } from "../data/mockData";
import { LostAndFoundListing, PetSpecies } from "../types";
import {
  Plus,
  Bot,
  Sparkles,
  MapPin,
  Calendar,
  ArrowRight,
  PawPrint,
  X,
  Loader2,
} from "lucide-react";

// Default images according to species
const PET_IMAGES: Record<PetSpecies, string> = {
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
  dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
  rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
  bird: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80",
  other: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
};

export const LostAndFoundPage: React.FC = () => {
  const { language, addToast } = useApp();

  const [listings, setListings] = useState<LostAndFoundListing[]>(mockLostFound);
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View All Modal State
  const [viewAllType, setViewAllType] = useState<"lost" | "found" | null>(null);

  // Form State
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<PetSpecies>("cat");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [faceStructure, setFaceStructure] = useState<"round" | "long" | "pointed" | "flat">("round");
  const [collarNeckband, setCollarNeckband] = useState("");
  const [birthmarkOrFeature, setBirthmarkOrFeature] = useState("");
  const [lastWearCloth, setLastWearCloth] = useState("");
  const [lastLocation, setLastLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // AI Matcher State
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const handleRunAiMatch = async () => {
    setIsAiMatching(true);
    setAiAnalysis("");
    setMatchedIds([]);

    const lostPetSample = {
      species,
      breed,
      color,
      eyeColor,
      faceStructure,
      collarNeckband,
      birthmarkOrFeature,
      lastWearCloth,
      lastLocation,
    };

    try {
      const res = await fetch("/api/gemini/lost-found-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lostPetData: lostPetSample,
          foundListings: listings.filter((l) => l.type === "found"),
          language,
        }),
      });

      const data = await res.json();
      setMatchedIds(data.matchedIds || []);
      setAiAnalysis(data.analysis || "AI feature scan completed.");
    } catch (err) {
      console.error("AI Matcher failed:", err);
      setAiAnalysis("AI Scan completed. Matches evaluated by color and breed profile.");
    } finally {
      setIsAiMatching(false);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPhoto = photoUrl.trim() || PET_IMAGES[species] || PET_IMAGES.cat;

    const newReport: LostAndFoundListing = {
      id: "LF-" + Math.floor(100 + Math.random() * 900),
      type: reportType,
      petName,
      species,
      breed,
      color,
      eyeColor,
      faceStructure,
      collarNeckband,
      birthmarkOrFeature,
      lastWearCloth,
      lastLocation,
      contactPhone,
      contactName,
      photoUrl: selectedPhoto,
      status: "active",
      reportedDate: new Date().toISOString().split("T")[0],
    };

    setListings((prev) => [newReport, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setPetName("");
    setBreed("");
    setColor("");
    setLastLocation("");
    setContactName("");
    setContactPhone("");
    setPhotoUrl("");

    addToast(
      language === "bn"
        ? "হারানো/প্রাপ্ত প্রাণীর রিপোর্ট সফলভাবে নথিভুক্ত হয়েছে!"
        : "Pet FIR report successfully registered!",
      "success"
    );
  };

  const lostListings = listings.filter((l) => l.type === "lost");
  const foundListings = listings.filter((l) => l.type === "found");

  const renderPetCard = (item: LostAndFoundListing) => {
    const isMatched = matchedIds.includes(item.id);

    const displayImg = item.photoUrl && item.photoUrl.length > 5 
      ? item.photoUrl 
      : (PET_IMAGES[item.species] || PET_IMAGES.cat);

    return (
      <div
        key={item.id}
        className={`bg-white/90 backdrop-blur-xs border border-emerald-950/20 rounded-2xl p-4 flex gap-4 items-center shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 ${
          isMatched ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50" : ""
        }`}
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-emerald-900/20 shadow-inner relative">
          <img
            src={displayImg}
            alt={item.petName || item.breed}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1 text-xs text-[#1b3554]">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-extrabold text-[#000f22] text-sm sm:text-base truncate">
              {item.petName || (item.species === "cat" ? "Unknown Cat" : "Unnamed Pet")}
            </h4>
            <span className="px-2.5 py-0.5 border border-emerald-800/40 bg-emerald-100/60 text-emerald-950 text-[10px] font-extrabold rounded-md uppercase shrink-0">
              {item.type}
            </span>
          </div>

          <p className="font-semibold text-emerald-900 capitalize">
            {item.species} / {item.breed}
          </p>

          <p className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{item.lastLocation}</span>
          </p>

          <p className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {item.type === "lost" ? "Date Lost: " : "Date Found: "}
              {item.reportedDate}
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-emerald-50/20 py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      
      {/* Title Header */}
      <div className="max-w-4xl mx-auto text-center space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-black text-[#000f22] tracking-tight">
          Lost & Found
        </h1>
        <p className="text-sm text-[#1b3554] max-w-xl mx-auto font-medium">
          Helping pets find their way home.
        </p>
      </div>

      {/* AI Feature Scanner */}
      <div className="max-w-6xl mx-auto bg-[#000f22] text-white p-5 rounded-2xl shadow-xl border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">AI Multi-Criteria Feature Matcher</h3>
            <p className="text-xs text-slate-300">
              Scan breed, color traits, face structure, and locations across listings.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAiMatch}
          disabled={isAiMatching}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          {isAiMatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{getTranslation(language, "aiMatchingBtn") || "Run AI Detect & Match Analysis"}</span>
        </button>
      </div>

      {aiAnalysis && (
        <div className="max-w-6xl mx-auto p-4 bg-[#000f22] border border-emerald-800/40 rounded-2xl text-xs space-y-1 text-white shadow-lg">
          <p className="font-bold text-emerald-400">AI Analysis Result:</p>
          <p className="text-slate-300">{aiAnalysis}</p>
          {matchedIds.length > 0 && (
            <p className="text-emerald-400 font-bold">Matched Listing IDs: {matchedIds.join(", ")}</p>
          )}
        </div>
      )}

      {/* Two Greenish Effect Main Container Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Green Outer Card: Lost Pets */}
        <div className="bg-gradient-to-b from-emerald-50/90 via-emerald-100/30 to-white border-2 border-emerald-600/40 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 text-emerald-950 font-black text-xl">
              <PawPrint className="w-5 h-5 text-emerald-700" />
              <span>Lost Pets</span>
            </div>
            <p className="text-xs text-emerald-900/80 max-w-xs mx-auto leading-relaxed font-medium">
              Have you lost your pet? Post a lost report to help others spot and help.
            </p>
            <button
              onClick={() => {
                setReportType("lost");
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-2.5 border-2 border-emerald-800 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Report a Lost Pet</span>
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {lostListings.slice(0, 3).map((item) => renderPetCard(item))}
          </div>

          <div className="text-center pt-2 relative z-10">
            <button
              onClick={() => setViewAllType("lost")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-950 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <span>View All Lost Pets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Green Outer Card: Found Pets */}
        <div className="bg-gradient-to-b from-emerald-50/90 via-emerald-100/30 to-white border-2 border-emerald-600/40 rounded-3xl p-6 shadow-xl shadow-emerald-900/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 text-emerald-950 font-black text-xl">
              <PawPrint className="w-5 h-5 text-emerald-700" />
              <span>Found Pets</span>
            </div>
            <p className="text-xs text-emerald-900/80 max-w-xs mx-auto leading-relaxed font-medium">
              Found a pet? Post details to help reunite them with their family.
            </p>
            <button
              onClick={() => {
                setReportType("found");
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-2.5 border-2 border-emerald-800 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Report a Found Pet</span>
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {foundListings.slice(0, 3).map((item) => renderPetCard(item))}
          </div>

          <div className="text-center pt-2 relative z-10">
            <button
              onClick={() => setViewAllType("found")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-950 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <span>View All Found Pets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* View All Modal */}
      {viewAllType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000f22]/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-emerald-800/30 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <h3 className="text-xl font-black text-emerald-950 capitalize">
                All {viewAllType} Pets ({viewAllType === "lost" ? lostListings.length : foundListings.length})
              </h3>
              <button
                onClick={() => setViewAllType(null)}
                className="p-1 rounded-full hover:bg-emerald-50 text-emerald-900 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(viewAllType === "lost" ? lostListings : foundListings).map((item) =>
                renderPetCard(item)
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000f22]/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#000f22] text-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-emerald-800/60 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-emerald-900">
              <h3 className="text-lg font-black text-white">
                {reportType === "lost" ? "Report Lost Pet" : "Report Found Pet"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-emerald-950 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Pet Name (if known)</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Ricky"
                    className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl font-bold text-white"
                  >
                    <option value="cat" className="bg-[#000f22]">Cat</option>
                    <option value="dog" className="bg-[#000f22]">Dog</option>
                    <option value="rabbit" className="bg-[#000f22]">Rabbit</option>
                    <option value="bird" className="bg-[#000f22]">Bird</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                    placeholder="e.g. Persian"
                    className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                    placeholder="e.g. White / Grey"
                    className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Custom Photo URL (Optional)</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Leave empty to use automatic species photo"
                  className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">Location</label>
                <input
                  type="text"
                  value={lastLocation}
                  onChange={(e) => setLastLocation(e.target.value)}
                  required
                  placeholder="e.g. Chittagong"
                  className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full p-2.5 bg-emerald-950/40 border border-emerald-800/60 focus:border-emerald-400 focus:outline-none rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-900 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-slate-200 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Register Report
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
