import React from "react";
import "./SubCategory.css";
import denem from "@site/static/img/web3ogren-banner.jpg";
import DenemSvg from "@site/static/img/kilt.svg";

export default function SubCategory() {
 return (
  <div className="sub-category-main-container">
   {/* <img className="sub-category-image" src={denem} /> */}
   <DenemSvg className="sub-category-image" />
   <h1 className="sub-category-h1">Lorem ipsum dolor sit amet.</h1>
   <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum magnam
    officiis explicabo blanditiis ullam. Nihil animi cupiditate, facere aperiam
    inventore repellat laudantium illum. Maxime, pariatur.
   </p>
  </div>
 );
}
