import { useNavigate } from "react-router-dom";

interface RelatedProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  origin: string;
}

const RelatedProductCard = ({
  id,
  name,
  image,
  price,
  origin,
}: RelatedProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">

        <h3 className="text-lg font-bold line-clamp-2">
          {name}
        </h3>

        <p className="text-gray-500 text-sm mt-2">
          📍 {origin}
        </p>

        <div className="flex justify-between items-center mt-4">

          <span className="text-xl font-bold text-orange-600">
            ₹{price}
          </span>

          <button
            onClick={() => navigate(`/product/${id}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm"
          >
            View
          </button>

        </div>

      </div>

    </div>
  );
};

export default RelatedProductCard;