import React from "react";
import "./css/SubCategory.css";
import { projectBaseUrl } from "../../../api";

export default function SubCategory({ SubCategoryData }) {
 return (
  <a href={SubCategoryData.href}>
   <div className="sub-category-main-container">
    {SubCategoryData?.Svg ? (
     <SubCategoryData.Svg className="sub-category-image" />
    ) : (
     SubCategoryData.imgUrl && (
      <img
       src={projectBaseUrl + SubCategoryData.imgUrl}
       alt={SubCategoryData.title}
       className="sub-category-image"
      />
     )
    )}
    <h1 className="sub-category-h1">{SubCategoryData?.title}</h1>
    <p>{SubCategoryData?.description}</p>
   </div>
  </a>
 );
}
