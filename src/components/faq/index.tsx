import React from "react";
import Card from "../common/card";
import Heading from "./heading";
import GeneralInformation from "./general-information";
import MyAccount from "./my-account";
import BoxesWork from "./boxes-work";
import Deposits from "./deposits";
import Withdrawls from "./withdrawls";
import BoxItems from "./box-items";
import BoxExperiences from "./box-experiences";

const faq = [
  {
    title: "General Information",
    content: <GeneralInformation />,
  },
  {
    title: "My Account",
    content: <MyAccount />,
  },
  {
    title: "How The Box Works",
    content: <BoxesWork />,
  },
  {
    title: "Deposits",
    content: <Deposits />,
  },
  {
    title: "Withdrawals",
    content: <Withdrawls />,
  },
  {
    title: "Box Items",
    content: <BoxItems />,
  },
  {
    title: "Box Experiences",
    content: <BoxExperiences />,
  },
];

const FaqContent = () => {
  return (
    <section className="text-content">
      <Card heading={`OneNightBox.com FAQ`}>
        <Heading />
      </Card>
      {faq.map((item, index) => (
        <Card key={item.title + index} heading={`${index + 1}. ${item.title}`}>
          {item.content}
        </Card>
      ))}
    </section>
  );
};

export default FaqContent;
