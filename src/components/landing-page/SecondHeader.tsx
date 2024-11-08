import { Link, useLocation, useNavigate } from "react-router-dom";
import { scaleWhite } from "../../assets";
import { navigation } from "../../constants";
import Button from "../ui/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../ui/Header";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const SecondHeader = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);
  const prevHash = useRef<string>("");

  const { t, i18n } = useTranslation(); // Destructure t from useTranslation

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const storedLanguage = localStorage.getItem("i18nextLng") || "en";

  useEffect(() => {
    if (location.hash !== prevHash.current) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
      prevHash.current = location.hash;
    }
  }, [location.pathname, location.hash]);

  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation); // Simplified toggle
  };

  const handleClick = () => {
    if (!openNavigation) return;
    setOpenNavigation(false);
  };

  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-green-950 text-white mb-10">
      <div className="flex flex-col lg:flex-row justify-between items-center px-5 py-5 lg:px-7.5 xl:px-10 lg:py-0 xl:py-0">
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-0 left-0 right-0 bottom-0 bg-green-950 lg:static lg:flex lg:mx-auto lg:justify-center lg:items-center lg:w-full`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            <div
              className={`${
                openNavigation ? "flex" : "hidden"
              } lg:hidden flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9999 `}
              onClick={() => navigate(`/`)}
            >
              {/* <img
                src={scaleWhite} // green logo always
                width={130}
                height={40}
                className="p-5"
                alt="tpl"
              /> */}
            </div>
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.url ||
                location.hash === `#${item.id}`;
              return (
                <Link
                  key={item.id}
                  to={item.title === "About" ? item.url : `${item.url}`}
                  target={item.url.startsWith("https://") ? "_blank" : "_self"}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase transition-colors lg:flex lg:justify-center lg:items-center ${
                    isActive
                      ? "text-green-500 font-bold" // Warna ungu untuk item aktif
                      : "text-white hover:text-green-500"
                  } px-6 py-6 md:py-8 lg:text-sm lg:font-semibold lg:leading-5`}
                >
                  {t(`navigation.${item.title.toLowerCase()}`)}
                </Link>
              );
            })}

            {/* Language Toggle */}
            <div className="flex items-center ml-4 text-gray-300 lg:ml-6 lg:mt-2">
              <i className="fi fi-globe mr-2"></i> {/* Globe Icon */}
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={storedLanguage} // Set the value based on localStorage
                className={`rounded-md p-2 bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bold `}
              >
                <option value="en">EN</option>
                <option value="id">ID</option>
              </select>
            </div>
          </div>

          <div className="hidden lg:flex lg:order-first lg:pr-10 lg:items-center">
            <img
              src={scaleWhite} // green logo always
              width={130}
              height={40}
              alt="otsuka"
              className="cursor-pointer"
              onClick={() => navigate(`/`)}
            />
          </div>

          <HamburgerMenu />
        </nav>

        <Button
          className="ml-auto lg:hidden lg:order-3 order-1"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} fillColor="white" />
        </Button>
      </div>
    </div>
  );
};

export default SecondHeader;
