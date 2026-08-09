import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesGrid from '@/components/services/ServicesGrid';

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <ServicesHero />
      <ServicesGrid />
      <Footer />
    </>
  );
}
