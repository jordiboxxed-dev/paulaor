import Superheader from '@/components/Superheader';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import CollectionGrid from '@/components/CollectionGrid';
import BestsellerCarousel from '@/components/BestsellerCarousel';
import Lookbook from '@/components/Lookbook';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-off-white">
      <Superheader />
      <main>
        <Hero variant="A" />
        <TrustBar />
        <CollectionGrid />
        <BestsellerCarousel />
        <Lookbook />
        {/* UGC, Value Section, and Newsletter can be added here */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;