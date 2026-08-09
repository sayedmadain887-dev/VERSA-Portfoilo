import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsHero from '@/components/projects/ProjectsHero';
import ProjectFilterGrid from '@/components/projects/ProjectFilterGrid';

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <ProjectsHero />
      <ProjectFilterGrid />
      <Footer />
    </>
  );
}
