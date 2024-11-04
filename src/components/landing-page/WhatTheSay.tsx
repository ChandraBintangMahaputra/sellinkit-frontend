import Slider from "react-slick";
import Section from "./Section";
import { useTranslation } from "react-i18next";



const WhatTheSay = () => {


  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Yazid Imani",
      text: t("yazidimani"),
    },
    {
      name: "Ahadian Mirza",
      text: t("ahdian"),
    },
    {
      name: "Naufal Dzakwan",
      text: t("naufal"),
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "linear",
  };

  return (
    <Section
      className="pt-0 mt-20 lg:pt-30 lg:mt-20 xl:mt-25 xl:pt-25"
      id="program"
      crosses
    >
      <div className="container flex flex-col items-center w-full h-fit">
        <h2 className="text-center mb-6 font-bold text-xl">{t("whattheysay")}</h2>
        <Slider {...sliderSettings} className="w-full py-8 lg:w-3/4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="py-8 mx-4 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <p className="text-lg italic mb-4">"{testimonial.text}"</p>
              <h3 className="text-sm font-semibold">{testimonial.name}</h3>
            </div>
          ))}
        </Slider>
      </div>
    </Section>
  );
};

export default WhatTheSay;
