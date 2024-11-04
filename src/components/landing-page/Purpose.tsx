import Section from "./Section";
import { FaLink } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { imagepurpose } from "../../assets";
import { GrCatalogOption } from "react-icons/gr";
import { MdAnalytics, MdDashboardCustomize } from "react-icons/md";

const Purpose = () => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("titleSubPurpose1"),
      content: t("descSubPurposes1"),
      icon: <GrCatalogOption className="w-6 h-6 mb-2 text-blue-500" />
    },
    {
      title: t("titleSubPurpose2"),
      content: t("descSubPurposes2"),
      icon: <FaLink className="w-6 h-6 mb-2 text-blue-500" />
    },
    {
      title: t("titleSubPurpose3"),
      content: t("descSubPurposes3"),
      icon: <MdAnalytics className="w-6 h-6 mb-2 text-blue-500" />
    },
    {
      title: t("titleSubPurpose4"),
      content: t("descSubPurposes4"),
      icon: <MdDashboardCustomize className="w-6 h-6 mb-2 text-blue-500" />
    }
  ];

  return (
    <Section className="pt-0 mt-0 lg:pt-30 lg:mt-20 xl:mt-25 xl:pt-25" id="program" crosses>
      <div className="container flex flex-col lg:flex-row items-center w-full h-fit">

                {/* Image on the right side */}
                <div className="flex-1 mt-8 mb-8 lg:mt-0 lg:mr-8 ">
          <img src={imagepurpose} alt="Purpose" className="lg:w-full lg:h-auto w-100 h-100 object-cover rounded-lg shadow-lg" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6 text-center lg:text-left">
            {t("titlePurpose")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                {card.icon}
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-gray-600">{card.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
};

export default Purpose;
