import Section from "./Section";
import { FaUserGraduate, FaLock, FaMoneyBillAlt, FaHeadset } from 'react-icons/fa';
import { useTranslation } from "react-i18next";


const Purpose = () => {

  const {t} = useTranslation()

const cards = [
  {
    title: t("titleSubPurpose1"),
    content: t("descSubPurposes1"),
    icon: <FaUserGraduate className="w-6 h-6 mb-2 text-blue-500" />
  },
  {
    title: t("titleSubPurpose2"),
    content: t("descSubPurposes2"),
    icon: <FaLock className="w-6 h-6 mb-2 text-blue-500" />
  },
  {
    title: t("titleSubPurpose3"),
    content: t("descSubPurposes3"),
    icon: <FaMoneyBillAlt className="w-6 h-6 mb-2 text-blue-500" />
  },
  {
    title: t("titleSubPurpose4"),
    content: t("descSubPurposes4"),
    icon: <FaHeadset className="w-6 h-6 mb-2 text-blue-500" />
  }
];

  return (
    <Section className="pt-30 mt-40 lg:pt-30 xl:pt-25" id="program" crosses>
      <div className="container flex flex-col items-center w-full h-fit">
        <h2 className="text-xl font-bold mb-6 text-center">
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
    </Section>
  );
};

export default Purpose;
