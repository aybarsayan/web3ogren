import React from "react";
import Category from "./Category";
import "./css/CategoryContainer.css";
import Data from "./store/landing.category.data";

export default function CategoryContainer() {
 return (
  <div className="cateogry-main-container">
   {Data.map((category, index) => {
    return <Category category={category} key={index} />;
   })}
  </div>
 );
}
