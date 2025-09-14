import React from "react";
import potholes from "../assets/potholes.png";
import brokenlight from "../assets/brokenlight.png";
import trash from "../assets/trash.png";
import dirtywater from "../assets/dirtywater.png";

export default function IllustrationSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 flex flex-col items-center justify-center">
      <div className="block lg:hidden w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="flex justify-center">
            <img
              src={potholes}
              alt="Potholes on road"
              className="rounded-lg w-full max-w-32 sm:max-w-40"
            />
          </div>

          <div className="flex justify-center">
            <img
              src={brokenlight}
              alt="Broken street light"
              className="rounded-lg w-full max-w-32 sm:max-w-40"
            />
          </div>

          <div className="flex justify-center">
            <img
              src={trash}
              alt="Overflowing trash bins"
              className="rounded-lg w-full max-w-32 sm:max-w-40"
            />
          </div>

          <div className="flex justify-center">
            <img
              src={dirtywater}
              alt="Dirty water"
              className="rounded-lg w-full max-w-32 sm:max-w-40"
            />
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-full flex items-center justify-center" style={{ height: 'clamp(300px, 40vw, 500px)' }}>
        <div className="absolute top-0 left-0" style={{ width: 'clamp(120px, 20vw, 200px)' }}>
          <img
            src={potholes}
            alt="Potholes on road"
            className="rounded-lg w-full h-auto"
          />
        </div>

        <div className="absolute bottom-0 left-1/4" style={{ width: 'clamp(120px, 20vw, 200px)' }}>
          <img
            src={brokenlight}
            alt="Broken street light"
            className="rounded-lg w-full h-auto"
          />
        </div>

        <div className="absolute top-0 right-1/4" style={{ width: 'clamp(120px, 20vw, 200px)' }}>
          <img
            src={trash}
            alt="Overflowing trash bins"
            className="rounded-lg w-full h-auto"
          />
        </div>

        <div className="absolute bottom-0 right-0" style={{ width: 'clamp(120px, 20vw, 200px)' }}>
          <img
            src={dirtywater}
            alt="Dirty water"
            className="rounded-lg w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
