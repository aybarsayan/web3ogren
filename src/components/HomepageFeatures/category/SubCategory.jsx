import React from "react";
import "./css/SubCategory.css";

export default function SubCategory(SubCategoryData) {
 let Data = SubCategoryData.SubCategoryData;
 return (
  <a href={Data.href}>
   <div className="sub-category-main-container">
    {Data?.Svg ? (
     <Data.Svg className="sub-category-image" />
    ) : (
     Data.imgUrl && (
      <img
       src={"http://localhost:3000" + Data.imgUrl}
       alt={Data.title}
       className="sub-category-image"
      />
     )
    )}
    <h1 className="sub-category-h1">{Data?.title}</h1>
    <p>{Data?.description}</p>
   </div>
  </a>
 );
}
