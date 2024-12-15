import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Landing from "../components/HomepageFeatures/landing/Landing";

import styles from "./index.module.css";
import CategoryContainer from "../components/HomepageFeatures/category/CategoryContainer";

function HomepageHeader() {
 const { siteConfig } = useDocusaurusContext();
 return (
  <header className={clsx("hero hero--primary", styles.heroBanner)}>
   <div className="container">
    <h1 className="hero__title">{siteConfig.title}</h1>
    <p className="hero__subtitle">{siteConfig.tagline}</p>
    <div className={styles.buttons}>
     <Link
      className="button button--secondary button--lg"
      to="/docs/category/bilgisayar-bilimleri"
     >
      Hadi Başlayalım ⏱️
     </Link>
    </div>
   </div>
  </header>
 );
}

export default function Home() {
 const { siteConfig } = useDocusaurusContext();
 return (
  <Layout
   title={`web3ogren`}
   description="Description will go into a meta tag in <head />"
  >
   {/* <HomepageHeader /> */}
   <Landing />
   <div style={{ margin: "10vh 0" }}>
    <CategoryContainer />
   </div>
   {/* <main><HomepageFeatures /></main> */}
  </Layout>
 );
}
