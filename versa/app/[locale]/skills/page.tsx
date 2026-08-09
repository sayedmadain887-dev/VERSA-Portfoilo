import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillsPageHero from '@/components/skills/SkillsPageHero';
import SkillCategories from '@/components/skills/SkillCategories';
import SoftSkills from '@/components/skills/SoftSkills';

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <SkillsPageHero />
      <SkillCategories />
      <SoftSkills />
      <Footer />
    </>
  );
}
