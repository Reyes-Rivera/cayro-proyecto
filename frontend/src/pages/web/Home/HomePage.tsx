import Benefits from "./Components/Benefits";
import CustomOrder from "./Components/CustomOrder";
import FeaturedCategories from "./Components/FeaturedCategories";
import FeaturedProducts from "./Components/FeaturedProducts";
import Features from "./Components/Features";
import Hero from "./Components/Hero";
import Package from "./Components/Package";
import Process from "./Components/Process";


const HomePage = () => {
  return (
    <main className="min-h-screen ">
      <Hero />
      <Features />
      <FeaturedCategories />
      <FeaturedProducts />
      <Benefits />
      <Package />
      <Process />
      <CustomOrder />
    </main>
  );
};

export default HomePage;
