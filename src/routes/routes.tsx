import AddItemForm from "@/pages/add";
import Header from "@/pages/header";
import ItemList from "@/pages/list";
import { Navigate, Route, Routes } from "react-router-dom";

export const MyRouter = () => {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ItemList />} />
          <Route path="/add" element={<AddItemForm />} />
          <Route path="*" element={<Navigate to="/list" replace />} />
        </Routes>
      </main>
     </>
  );
};

