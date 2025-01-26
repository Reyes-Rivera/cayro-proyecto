import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import img from "@/assets/sudadera-removebg-preview.png";
import playera from "@/assets/470524508_1114544320459967_8053404278450786658_n-removebg-preview.png";
import Header from "./Header";

export default function ProductsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  const categories = [
    { name: "Escolar", icon: "🎓" },
    { name: "Deportivo", icon: "⚽" },
    { name: "Gorras", icon: "🧢" },
    { name: "Playeras", icon: "👕" },
    { name: "Polos", icon: "🦴" },
    { name: "Pantalones", icon: "👖" },
    { name: "Shorts", icon: "🩳" },
    { name: "Accesorios", icon: "🎒" },
  ];

  const allProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name:
      i % 2 === 0 ? `Uniforme Escolar ${i + 1}` : `Uniforme Deportivo ${i + 1}`,
    category: i % 2 === 0 ? "Escolar" : "Deportivo",
    subCategory: categories[i % categories.length].name,
    price: (50 + i * 10).toFixed(2),
    image: "https://via.placeholder.com/150",
  }));

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(activeSearchTerm.toLowerCase())
  );

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchEnter = (e: any) => {
    if (e.key === "Enter") {
      setActiveSearchTerm(searchTerm);
    }
  };

  const handleSearchClick = () => {
    setActiveSearchTerm(searchTerm);
  };

  return (
    <div className="">
      <Header />
    </div>
  );
}
