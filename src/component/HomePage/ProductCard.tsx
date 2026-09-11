import { useNavigate } from "react-router-dom";

interface ProductProps {
  id: string;
  name: string;
  image: string;
  price: number;
  origin: string;
}

const ProductCard = ({
  id,
  name,
  image,
  price,
  origin,
}: ProductProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      <img
        src={image}
        alt={name}
        className="w-full h-60 object-cover"
      />

      <div className="p-5">

        <h2 className="text-2xl font-bold">
          {name}
        </h2>

        <p className="text-gray-500 mt-2">
          📍 {origin}
        </p>

        <div className="flex justify-between items-center mt-5">

          <span className="text-2xl font-bold text-orange-600">
            ₹{price}
          </span>

          <button
            onClick={() => navigate(`/product/${id}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full"
          >
            View
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;