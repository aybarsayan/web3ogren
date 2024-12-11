import "./Landing.css";
import React from "react";

export default function Landing() {
 return (
  <main className="landing-main-container">
   <div className="landing-bg-container">
    <div className="landing-inner-container">
     <h1 className="landing-h1">Web3 Öğren</h1>
     <p className="landing-p">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
      <br className="landing-p-br" />
      Quibusdam, id praesentium. Voluptate, temporibus. Eius, odio?
     </p>
     <button className="landing-button">Hadi başlayalım!</button>
    </div>
    <p className="landing-sub-p">
     Heyy🖐🏻, aradığın kategorileri aşağıda bulabilirsin.
    </p>
   </div>
  </main>
 );
}
