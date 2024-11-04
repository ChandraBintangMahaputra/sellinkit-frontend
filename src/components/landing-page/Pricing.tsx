import SecondHeader from "../landing-page/SecondHeader";

const Pricing = () => {
  return (
    <main className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden mt-10">
      <SecondHeader />
      
      {/* Judul Pricing */}
      <h1 className="text-3xl font-bold text-center mt-10 mb-10">Pricing</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mt-[-20px] mb-10">
        
        {/* Free Plan Card */}
        <div className="w-full lg:w-1/3 bg-white p-6 lg:mt-[-100px] rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 text-center">Free</h3>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>- Membuat hyperlink</li>
            <li>- Membuat katalog</li>
            <li>- Unlimited Link</li>
            <li>- Email Notification</li>
          </ul>
          <button className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600">
            Get Started
          </button>
        </div>

        {/* Membership Plan Card */}
        <div className="w-full lg:w-1/3 bg-white p-6 lg:mt-20 rounded-lg shadow-lg border-4 border-green-200">
          <h3 className="text-2xl font-semibold mb-4 text-center">Membership</h3>
          <p className="text-center text-gray-500 mb-4">(Rp25.000/Month)</p>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>- Membuat hyperlink</li>
            <li>- Membuat katalog</li>
            <li>- Unlimited Link</li>
            <li>- Email Notification</li>
            <li>- Custom Background</li>
            <li>- Custom Button</li>
            <li>- Statistic</li>
            <li>- Chatbot Support System</li>
          </ul>
          <button className="bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600">
            Subscribe
          </button>
        </div>

      </div>
    </main>
  );
};

export default Pricing;
