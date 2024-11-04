import Section from "./Section";
import { useRef } from "react";
import { useTranslation } from "react-i18next"; 
import { image } from "../../assets";

const Hero = () => {
  const parallaxRef = useRef(null);
  const { t } = useTranslation();

  return (
    <Section className="" id="hero">
      {/* Full width container without side padding */}
      <div className="relative w-full bg-green-950" ref={parallaxRef}>
        {/* Black Background */}
        <div className="absolute -top-[18%] lg:-top[-24%] left-0 w-full z-0 bg-green-950 h-[600px] lg:h-[700px]" />

        {/* Container for text and image */}
        <div className="relative z-10 max-w-[62rem] mx-auto flex flex-col lg:flex-row bg-green-950 items-center text-center lg:text-left mb-[1.875rem] md:mb-10 lg:mb-[2.25rem]">
          {/* Text Section */}
          <div className="lg:w-1/2">
            <h3 className="h1 mb-6 mt-0 pt-0 md:mt-0 md:pt-0 text-white font-bold">
              <span className="block md:inline">Sel<span className="text-green-500">link</span>It</span>
            </h3>
            <h3 className="body-1 max-w-3xl mx-auto mb-6 text-n-7 lg:mb-8 text-white md:px-10 px-10 lg:px-0">
              {t("introHero")}
            </h3>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 mt-8 mb-8 lg:mt-8">
            <img src={image} alt="Sellinkit" className="w-60 h-60  lg:w-full lg:h-auto lg:object-cover" />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
