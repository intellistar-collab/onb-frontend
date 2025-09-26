import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import DarkBackground from "../common/dark-background";

const NewBox = () => {
  return (
    <section>
      <div className="min-h-[30rem] relative overflow-hidden rounded-xl">
        <Image
          src="/box/new-box.webp"
          alt="New Box"
          fill
          className="object-cover object-center -z-10"
        />
        <DarkBackground className="absolute top-0 left-0 flex flex-col gap-4 p-8 max-w-md">
          <h1 className="text-4xl font-oswald">NEW BOX LAUNCH!</h1>
          <p>
            Add your email to stay updated with our new box launches! You won't
            want to miss what we have in store for the future drops! Small price
            - Big Experience.
          </p>

          <div className="mt-4 flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1"
            />
            <Button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Subscribe
            </Button>
          </div>
        </DarkBackground>
      </div>
    </section>
  );
};

export default NewBox;
