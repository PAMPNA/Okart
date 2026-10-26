const AboutPage = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">

      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">

          <h1 className="text-5xl font-bold">
            About O-Kart 🇮🇳
          </h1>

          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Bringing authentic Indian flavors from their hometowns
            directly to your doorstep.
          </p>

        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-bold text-center">
          Our Story
        </h2>

        <p className="mt-6 text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
          O-Kart is an online marketplace created to help people discover
          authentic sweets, snacks and regional foods from different parts
          of India. We connect customers with the unique flavors and
          traditions of Indian hometowns.
        </p>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-16">

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">🇮🇳</div>
            <h3 className="text-2xl font-bold mt-5">
              Authentic Flavors
            </h3>
            <p className="text-gray-600 mt-3">
              Discover traditional foods and regional specialties
              from across India.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">🏠</div>
            <h3 className="text-2xl font-bold mt-5">
              From Their Hometowns
            </h3>
            <p className="text-gray-600 mt-3">
              Explore products connected to the places and traditions
              they come from.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl">🚚</div>
            <h3 className="text-2xl font-bold mt-5">
              Delivered to You
            </h3>
            <p className="text-gray-600 mt-3">
              Enjoy your favorite regional foods from the comfort
              of your home.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default AboutPage;