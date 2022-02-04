import React from "react";
import { Routes, Route } from "react-router-dom";
import { Category, SubCategory } from "./pages";
import { CommonLayout } from "src/components";

function App() {
  return (
    <CommonLayout>
      <Routes>
        <Route path="/" element={<Category />} />
        <Route path="/SubCategory" element={<SubCategory />} />
      </Routes>
    </CommonLayout>
  );
}

export default App;
