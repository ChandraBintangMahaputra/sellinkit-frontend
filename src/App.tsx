import Header from "./components/landing-page/Header";
import Hero from "./components/landing-page/Hero";
import Purpose from "./components/landing-page/Purpose";
import Footer from "./components/landing-page/Footer";
import WhatTheSay from "./components/landing-page/WhatTheSay";

const App = () => {

  return (
    <main>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Purpose />
        <WhatTheSay />
        <Footer />
      </div>
    </main>
  );
};
export default App;
