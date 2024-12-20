import SubCategory from "./SubCategory";
import React, { useEffect, useState } from "react";

export default function Category(category) {
 const [showAll, setShowAll] = useState(false);
 const [size, setSize] = useState(4);

 useEffect(() => {
  if (showAll)
   SubCategoryIncreament(
    4,
    category.category.subCategories.length,
    showAll,
    (value) => {
     setSize(value);
    }
   );
  else setSize(4);
 }, [showAll]);

 return (
  <div
   style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    gap: "15px",
   }}
  >
   <label
    style={{
     paddingRight: "10px",
     opacity: "80",
     fontSize: "14px",
     cursor: "pointer",
    }}
    onClick={() => setShowAll(!showAll)}
   >
    {showAll ? "Gizle" : "Hepsini Göster"}
   </label>
   <div className="cateogry-container">
    <div className="category-h1-container">
     <h1 style={{ textAlign: "center", fontSize: "28px" }}>
      {category.category.title}
     </h1>
    </div>
    <div className="category-sub-category-container">
     {category.category?.subCategories
      .slice(0, size)
      .map((SubCategoryData, index) => {
       return <SubCategory key={index} SubCategoryData={SubCategoryData} />;
      })}
    </div>
   </div>
  </div>
 );
}

function SubCategoryIncreament(start = 4, endValue, trigger, callback) {
 if (!trigger) return;
 const duration = 500;
 const steps = endValue - start;
 if (steps <= 0) return;
 const stepTime = duration / steps;
 let current = start;
 const interval = setInterval(() => {
  current++;
  callback(current);
  if (current >= endValue) clearInterval(interval);
 }, stepTime);
}
