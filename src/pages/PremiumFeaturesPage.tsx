import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { Product } from "../types";
import {
  Compass,
  Zap,
  PhoneCall,
  HeartHandshake,
  Check,
  ArrowRight,
} from "lucide-react";

export const PremiumFeaturesPage: React.FC = () => {
  const { language, addToCart, setActivePage } = useApp();

  const handleContinueToCart = () => {
    const premiumProduct: Product = {
      product_id: "PRM-500",
      nameEn: "FurCare VIP Extra Premium Membership (1 Month)",
      nameBn: "FurCare ভিআইপি এক্সট্রা প্রিমিয়াম মেম্বারশিপ (১ মাস)",
      category: "healthcare",
      targetSpecies: "all",
      priceTk: 500,
      rating: 5.0,
      reviewsCount: 320,
      image:
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      descriptionEn:
        "Includes Pet Walking, 24/7 Emergency Ambulance, Genetic Breed Matching, and Full Pet-Friendly Places Map access.",
      descriptionBn:
        "পেট ওয়াকিং, ২৪/৭ জরুরি অ্যাম্বুলেন্স, জিনেটিক ব্রিড ম্যাচিং এবং ইন্টারেক্টিভ ম্যাপ সুবিধা।",
      stock: 999,
    };

    addToCart(premiumProduct, 1, "premium_plan");
    setActivePage("cart");
  };

  const services = [
    {
      id: "map",
      title: "Pet-Friendly Spots Map",
      description:
        "Interactive map to discover parks, pet-friendly cafes, clinics, and grooming spots in Dhaka, Chattogram & Sylhet with turn-by-turn navigation.",
      image:
        "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
      icon: <Compass className="w-5 h-5 text-[#dfba61]" />,
      tag: "GPS Live Map",
    },
    {
      id: "walking",
      title: "Pet Walking Service",
      description:
        "Background-checked professional pet walkers for daily exercise, leash training, and outdoor happiness with real-time route updates.",
      image:
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      icon: <Zap className="w-5 h-5 text-[#dfba61]" />,
      tag: "On-Demand Walk",
    },
    {
      id: "emergency",
      title: "24/7 Emergency Vet",
      description:
        "Instant hotline access to senior veterinary surgeons in Bangladesh, plus oxygen-equipped ambulance dispatch for critical pet care.",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      icon: <PhoneCall className="w-5 h-5 text-[#dfba61]" />,
      tag: "24/7 Ambulance",
    },
    {
      id: "breed",
      title: "Breed Matchmaker",
      description:
        "Connect with verified pedigree pet owners for breeding, health compatibility analysis, and genetic disease screening.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      icon: <HeartHandshake className="w-5 h-5 text-[#dfba61]" />,
      tag: "Genetic Match",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#132c38] via-[#0f212c] to-[#0a151d] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/15 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Main Hero Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fef0cd] via-[#e5c158] to-[#cba33d] drop-shadow-sm">
          Care that goes the extra mile.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium">
          Unlock our pet service designed for the pet parents who want the very best for their pets
        </p>
        <p className="text-xs font-bold text-[#e5c158] pt-1">
          Less than Tk 17/day
        </p>
      </div>

      {/* Pricing Pill Badge */}
      <div className="flex items-center justify-center gap-2 relative z-10">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
        <span className="px-4 py-1.5 bg-gradient-to-r from-[#dfba61] via-[#c6a043] to-[#b88e2c] text-slate-950 font-black text-xs rounded-md shadow-[0_4px_14px_rgba(15,82,72,0.35)] border border-[#f3e1b6]/40">
          Tk 500/ Month
        </span>
      </div>

      {/* 4 Vertical Service Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#1c3a32]/90 border border-[#cba33d]/30 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[#dfba61]/60 transition-all flex flex-col justify-between"
          >
            {/* Upper Service Image */}
            <div className="h-44 bg-slate-800 relative overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur-xs text-amber-200 text-[10px] font-bold rounded-md border border-[#cba33d]/30">
                {service.tag}
              </span>
            </div>

            {/* Lower Details Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Logo Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-[#0f212c] border border-[#cba33d]/40 flex items-center justify-center shadow-inner">
                  {service.icon}
                </div>

                <h3 className="font-extrabold text-slate-100 text-base leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-emerald-100/70 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Call To Action Button */}
      <div className="text-center space-y-2 pt-2 pb-8 relative z-10">
        <button
          onClick={handleContinueToCart}
          className="px-8 py-3.5 bg-gradient-to-r from-[#dfba61] via-[#c6a043] to-[#b88e2c] hover:from-[#ebc66f] hover:to-[#cfa339] text-slate-950 font-black text-sm rounded-xl shadow-[0_8px_20px_rgba(19,44,56,0.35)] hover:shadow-[0_10px_25px_rgba(15,82,72,0.45)] transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2 border border-[#f3e1b6]/40"
        >
          <span>Continue — Tk 500</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-slate-400 font-medium">Cancel Anytime</p>
      </div>

    </div>
  );
};
