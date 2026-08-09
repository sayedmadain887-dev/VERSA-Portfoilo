import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactHero from '@/components/contact/ContactHero';
import WhenToReachOut from '@/components/contact/WhenToReachOut';
import HowWeWork from '@/components/contact/HowWeWork';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfoAvailability from '@/components/contact/ContactInfoAvailability';
import ContactFaq from '@/components/contact/ContactFaq';
import WorkAgreement from '@/components/contact/WorkAgreement';
import ContactFinalCta from '@/components/contact/ContactFinalCta';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactHero />
      <WhenToReachOut />
      <HowWeWork />
      <ContactForm />
      <ContactInfoAvailability />
      <ContactFaq />
      <WorkAgreement />
      <ContactFinalCta />
      <Footer />
    </>
  );
}
