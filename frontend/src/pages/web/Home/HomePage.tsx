import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import Benefits from "./Components/Benefits";
import CustomOrder from "./Components/CustomOrder";
import FeaturedCategories from "./Components/FeaturedCategories";
import FeaturedProducts from "./Components/FeaturedProducts";
import Hero from "./Components/Hero";
import Process from "./Components/Process";


const HomePage = () => {
  return (
    <main className="min-h-screen  ">
      <Breadcrumbs/>
      <Hero />
      <Benefits />
      <FeaturedCategories />
      <FeaturedProducts />
      <Process />
      <CustomOrder />
    </main>
  );
};

export default HomePage;
