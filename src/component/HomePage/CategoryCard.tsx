import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  emoji: string;
  color: string;
}

const CategoryCard = ({ name, emoji, color }: Props) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div
      onClick={handleCategoryClick}
      className={`${color} rounded-2xl p-6 hover:shadow-xl transition duration-300 cursor-pointer`}
    >
      <div className="text-5xl mb-4">{emoji}</div>

      <h2 className="text-xl font-bold">{name}</h2>

      <p className="text-gray-600 mt-2">
        Explore authentic {name.toLowerCase()}
      </p>
    </div>
  );
};

export default CategoryCard;