import React from "react";
import { Routes, Route } from "react-router-dom";
import { Category, SubCategory, Setup } from "./pages";
import { CommonLayout } from "src/components";

function App() {
  return (
    <CommonLayout>
      <Routes>
        <Route path="/" element={<Setup />}/>
        <Route path="/category" element={<Category />}/>
        <Route path="/subCategory" element={<SubCategory />} />
      </Routes>
    </CommonLayout>
  );
}

export default App;
