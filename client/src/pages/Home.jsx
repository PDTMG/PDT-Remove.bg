import BgRemovalStep from "../components/BgRemovalStep";
import BgSlider from "../components/BgSilider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import TryNow from "../components/TryNow";

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-['Outfit']">
            {/* Hero Section */}
            <Header />
            {/* Background Removal Step */}
           <BgRemovalStep/>

            {/* Background Removal Slider Section */}
           <BgSlider/>

            {/* Buy Credit */}
            <Pricing/>

            {/* User Testimonials Section */}
            <Testimonials/>

            {/* Try Now Section */}
            <TryNow/>

          
        </div>
    );
};

export default Home;