import BenefitsSection from './Components/BenefitsSection';
import ContactSection from './Components/ContactSection';
import FeaturedProducts from './Components/FeaturedProducts';
import Hero from './Components/Hero';
import LocationSection from './Components/LocationSection';
import OffersSection from './Components/OffersSection';

const HomePage = () => {
  return (
    <main className="min-h-screen ">
      <Hero />
      <FeaturedProducts />
      <BenefitsSection />
      <OffersSection />
      <LocationSection />
      <ContactSection />
      {/* <Products />
      <WhyChooseUs />
      <Contact />
      <Location /> */}
    </main>
  );
};

export default HomePage;
