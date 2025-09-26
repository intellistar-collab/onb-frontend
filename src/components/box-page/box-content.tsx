import React from "react";
import { boxContent } from "@/constant/box-content";
import BoxCard from "./box-card";

const BoxContent = () => {
  return (
    <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-oswald uppercase">BOX CONTENT</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-700 text-white text-sm font-oswald uppercase rounded hover:bg-gray-600 transition-colors">
              HIDE
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white text-sm font-oswald uppercase rounded hover:bg-gray-600 transition-colors">
              SHOW
            </button>
          </div>
        </div>
      <div className="grid grid-cols-5 gap-2">
        {boxContent.map((item, index) => (
          <BoxCard key={item.title + index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default BoxContent;
