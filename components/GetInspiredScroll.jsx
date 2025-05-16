// components/GetInspiredScroll.jsx

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GetInspiredScroll() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "-30%"]);

  return (
    <div className="w-full text-black bg-white overflow-hidden">
      {/* Clean Video Header */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          preload="auto"
        >
          <source src="/placeholder-header-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* White fade at the bottom only */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

        {/* Updated Header Text */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-6xl font-bold mb-2 drop-shadow-lg">
            Explore swapAIbility™
          </h1>
          <p className="text-sm sm:text-lg max-w-2xl text-white/90">
            The dynamic capability to interchange AI-powered tools, canvases, or modules within a unified
            creative or academic system—maximizing adaptability without sacrificing performance.
          </p>
        </div>
      </div>

      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-10"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Get Inspired
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg mb-16 max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Nuveuu is more than a platform — it’s a launchpad for creators, thinkers, and builders.
          This is where creativity meets control. Where you don’t just post — you compose, enhance,
          simulate, and publish with real tools and real power.
        </motion.p>

        {/* Inserted video block */}
        <div className="w-full max-w-4xl mx-auto mb-20">
          <video
            src="/coming_soon.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Scrollable content */}
        <div className="space-y-24 sm:space-y-32">
          {/* Manually rendering "AI-enhanced stories" first */}
          <motion.div
            className="flex flex-col md:flex-row gap-8 items-center justify-between"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="md:w-1/2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">AI-enhanced stories</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Layer images, text, and motion. Feed the engine your narrative — let it generate the rest.
              </p>
            </div>
            <div className="md:w-1/2 h-56 sm:h-64 bg-gray-100 border border-gray-300 shadow-lg rounded-xl flex items-center justify-center">
              <span className="text-xs sm:text-sm text-gray-500">[ Video Placeholder – Drop sample demo reel ]</span>
            </div>
          </motion.div>

          {/* Render the remaining 5 items */}
          {[
            {
              title: "Playable pitch decks",
              desc: "Combine timeline-based animations, interactive scripts, and brand-driven assets into living presentations.",
            },
            {
              title: "Challenge campaigns",
              desc: "Launch creator challenges with visuals, goals, and dynamic submission tools — built into your Stack.",
            },
            {
              title: "Motion branding",
              desc: "Transform your brand identity into moving media. Animate your mission, don’t just write it.",
            },
            {
              title: "Social documentaries",
              desc: "Use strategic timelines, interviews, and AI-enhanced visuals to document communities, culture, and movements.",
            },
            {
              title: "Games of governance",
              desc: "Build logic-driven, multi-user simulations based on real political theory. Test constitutions, decisions, and outcomes.",
            },
          ].map((item, i) => {
            const mediaType = i % 2 === 0 ? "image" : "video"; // alternate type starting with image
            return (
              <motion.div
                key={i}
                className="flex flex-col md:flex-row gap-8 items-center justify-between"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/2">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700">{item.desc}</p>
                </div>
                <div className="md:w-1/2 h-56 sm:h-64 bg-gray-100 border border-gray-300 shadow-lg rounded-xl flex items-center justify-center">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {mediaType === "video"
                      ? "[ Video Placeholder – Drop sample demo reel ]"
                      : "[ Image Placeholder – Screenshot / Keyframe UI ]"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h4 className="text-xl sm:text-2xl font-bold mb-6">How to Start</h4>
          <ul className="text-sm sm:text-base space-y-3 max-w-xl mx-auto text-gray-800">
            <li>Pick a Canvas — Design, 3D, Simulation, or AI Lab</li>
            <li>Layer Your Stack — Add text, images, AI generations, scripted logic, or motion</li>
            <li>Enhance It — Use the wand. Let the AI evolve your content</li>
            <li>Export or Publish — MP4, HTML5, or direct to feed</li>
          </ul>

          <p className="mt-10 text-base sm:text-lg font-medium text-gray-800">
            You’re not here to scroll. You’re here to build something that matters.
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Real Builders. Real Tools.</p>

          <a
            href="https://nuveuu.com"
            className="inline-block mt-10 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-bold text-base sm:text-lg rounded-md hover:bg-gray-800 transition"
          >
            Join the Beta
          </a>
        </motion.div>
      </section>
    </div>
  );
}
