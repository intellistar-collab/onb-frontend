import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const NewBox = () => {
  return (
    <div className="min-h-[30rem] relative overflow-hidden rounded-xl">
      <Image
        src="/box/new-box.webp"
        alt="New Box"
        fill
        className="object-cover object-center -z-10 opacity-35"
      />
      <div className="absolute top-0 left-0 flex gap-36 p-8">
        <h1 className="text-4xl font-oswald">NEW BOX LAUNCH!</h1>
        <p>
          Add your email to stay updated with our new box launches! You won’t
          want to miss what we have in store for the future drops! Small price -
          Big Experience.
        </p>

        <div className="mt-4">
          <Input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1"
          />
          <Button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewBox;
