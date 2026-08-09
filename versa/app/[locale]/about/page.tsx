import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import Timeline from '@/components/about/Timeline';
import Education from '@/components/about/Education';
import Achievements from '@/components/about/Achievements';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <MissionVision />
      <Timeline />
      <Education />
      <Achievements />
      <Footer />
    </>
  );
}
