import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import About from "@/components/About";
import Releases from "@/components/Releases";
import PhotoSlider from "@/components/PhotoSlider";
import TextBlock from "@/components/TextBlock";
import Socials from "@/components/Socials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <VideoSection />
      <PhotoSlider />
      <About />
      <Releases />
      <TextBlock />
      <Socials />
      <Footer />
    </main>
  );
}
