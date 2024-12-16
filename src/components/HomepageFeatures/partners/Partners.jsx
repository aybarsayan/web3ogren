import React from "react";
import "./css/Partners.css";
import Data from "./store/partner.data";
import Marquee from "react-fast-marquee";
import { useColorMode } from "@docusaurus/theme-common";

export default function Partners() {
 const { colorMode } = useColorMode();

 return (
  <div className="partner-main-container">
   <div className="partner-sub-container">
    <h1 className="partner-header">Partnerler</h1>
    <Marquee
     gradientWidth={125}
     pauseOnHover
     gradient
     gradientColor={colorMode == "light" ? "#fff" : "#1B1B1D"}
    >
     {Data.map((data, index) => {
      return (
       <a href={data.href} key={index} target="_blank">
        <div className="partner-logo-container">
         {data.Svg && <data.Svg className="partner-logo" />}
         {!data.Svg && data.imageUrl && (
          <img
           src={"http://localhost:3000" + data.imageUrl}
           className="partner-logo"
          />
         )}
        </div>
       </a>
      );
     })}
    </Marquee>
   </div>
  </div>
 );
}
