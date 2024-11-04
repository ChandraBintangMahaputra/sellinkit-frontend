import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { scale, scaleWhite } from "../../assets";
import { navigation } from "../../constants";
import Button from "../ui/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../ui/Header";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Header = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const prevHash = useRef<string>("");

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navigate = useNavigate();

  // Get the stored language from localStorage
  const storedLanguage = localStorage.getItem('i18nextLng') || 'en';

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        openNavigation
          ? "bg-white text-black"
          : isScrolled
          ? "bg-white/90 text-black"
          : "bg-transparent text-white"
      } ${
        !isScrolled && !openNavigation ? "lg:bg-transparent bg-transparent" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center px-5 lg:px-7.5 xl:px-10">
        <div className="hidden lg:flex lg:order-first lg:pr-10 lg:items-center">
          {
            !openNavigation && (
              <img
              src={isScrolled ? scale : scaleWhite}
              width={150}
              height={40}
              alt="otsuka"
              className="cursor-pointer"
              onClick={() => navigate(`/`)}
            />
            )
          }
        
        </div>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-0 left-0 bottom-0 right-0 bg-white lg:static lg:flex lg:mx-auto lg:bg-transparent lg:flex lg:justify-start lg:w-full lg:items-start`}
        >
          <div className="relative z-2 flex flex-col items-start left-0 justify-start m-auto lg:flex-row">
            <div
              className={`${
                openNavigation ? "flex" : "hidden"
              } lg:hidden flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9999`}
              onClick={() => navigate(`/`)}
            >
              <img
                src={isScrolled ? scale : scaleWhite}
                width={150}
                height={40}
                className="p-5"
                alt="logo"
              />
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
                  className={`block relative font-code text-2xl uppercase transition-colors lg:flex lg:justify-start lg:items-start ${
                    openNavigation
                      ? isActive
                        ? "text-green-300 font-bold"
                        : "text-black/50 hover:text-green-500"
                      : isScrolled
                      ? isActive
                        ? "text-green-300 font-bold"
                        : "text-black/50 hover:text-green-500"
                      : isActive
                      ? "text-green-500 font-bold" 
                      : "text-white hover:text-green-500"
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-sm lg:font-semibold lg:leading-5`}
                >
                  {t(`navigation.${item.title.toLowerCase()}`)}
                </Link>
              );
            })}

            {/* Language Toggle */}
            <div className="flex items-center ml-4 text-gray lg:ml-6 lg:mt-5">
              <i className="fi fi-globe mr-2"></i> {/* Globe Icon */}
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={storedLanguage} // Set the value based on localStorage
                className={`rounded-md p-2 bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bold ${isScrolled ? "text-gray-700 ":"text-gray-400"} `}
              >
                <option value="en">EN</option>
                <option value="id">ID</option>
              </select>
            </div>
          </div>
          <HamburgerMenu />
        </nav>

        <Button
          className="ml-auto lg:hidden lg:order-3 order-1"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg
            openNavigation={openNavigation}
            fillColor={
              openNavigation ? "black" : isScrolled ? "black" : "white"
            }
          />
        </Button>
      </div>
    </div>
  );
};

export default Header;
