import React from "react";
import "./CategoryContainer.css";
import SubCategory from "./SubCategory";

export default function CategoryContainer() {
 return (
  <div className="cateogry-main-container">
   <div className="cateogry-container">
    <div className="category-h1-container">
     <h1 style={{ textAlign: "center", fontSize: "28px" }}>
      Temel Kavramlar & Blokzincir Geliştirme Teknolojileri
     </h1>
    </div>
    <div className="category-sub-category-container">
     {[1, 2, 3, 4, 5, 6, 7].map((e) => {
      return <SubCategory />;
     })}
    </div>
   </div>
  </div>
 );
}
