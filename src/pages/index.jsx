import React from "react";
import "./index.css";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Landing from "../components/HomepageFeatures/landing/Landing";
import Partners from "../components/HomepageFeatures/partners/Partners";
import CategoryContainer from "../components/HomepageFeatures/category/CategoryContainer";

export default function Home() {
 const { siteConfig } = useDocusaurusContext();
 return (
  <Layout
   title={`web3ogren`}
   description="Description will go into a meta tag in <head />"
  >
   <Landing />
   <div className="category-container-margin">
    <CategoryContainer />
   </div>
   <div className="partners-margin">
    <Partners />
   </div>
  </Layout>
 );
}
