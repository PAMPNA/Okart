import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-10 py-20">

        <div className="text-white">
          <h1 className="text-5xl font-bold leading-tight">
            Taste the
            <br />
            Authentic Flavors
            <br />
            of India 🇮🇳
          </h1>

          <p className="mt-6 text-lg opacity-90 max-w-lg">
            Discover sweets, snacks and regional foods directly from
            their hometowns. Fresh, authentic and delivered to your
            doorstep.
          </p>

          <div className="mt-8 flex gap-4">

            <button
              onClick={() => navigate("/products")}
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Shop Now
            </button>

            <button
            onClick={() => navigate("/about")}
              className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-orange-600 transition"
            >
              Learn More
            </button>
          
          </div>
        </div>

        <div className="flex justify-center mt-10 md:mt-0">

          <img
            src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900"
            alt="Indian Food"
            className="rounded-3xl shadow-2xl w-full max-w-md"
          />

        </div>

      </div>
    </section>
  );
};

export default Hero;