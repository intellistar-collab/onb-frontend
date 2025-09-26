import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import DarkBackground from "../common/dark-background";

const BoxRequest = () => {
  return (
    <section>
      <div
        className="rounded-xl p-4 h-[30rem] relative"
      >
        <Image
          src="/box/box-request.webp"
          alt="Box Request background"
          fill
          className="object-cover object-center -z-10 rounded-xl"
        />
        <DarkBackground className="max-w-72 absolute left-10 right-10 top-1/2 -translate-y-1/2 dark-bg">
          <h1 className="md:text-4xl text-2xl font-oswald">Box Request</h1>
          <p>
            Think you have the next big box idea? You request and we listen. We
            value people with great ideas! Have your say in what we feature.
            Small price - Big Experience.{" "}
          </p>

          <div className="flex gap-4 pt-4">
            <Input />
            <Button>EMAIL US</Button>
          </div>
        </DarkBackground>
      </div>
    </section>
  );
};

export default BoxRequest;
