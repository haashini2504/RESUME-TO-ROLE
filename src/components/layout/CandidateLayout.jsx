import React from "react";
import { Outlet } from "react-router-dom";
import CandidateNav from "./CandidateNav";

export default function CandidateLayout() {
  return (
    <div className="min-h-screen bg-[#141313] text-white">

      {/* NAVIGATION */}
      <CandidateNav />

      {/* PAGE CONTENT */}
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>

    </div>
  );
}