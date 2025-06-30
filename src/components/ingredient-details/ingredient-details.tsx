import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items: allIngredients, loading } = useSelector(
    (state) => state.ingredients
  );

  const ingredientData = allIngredients.find((item) => item._id === id);

  if (loading) return <Preloader />;
  if (!ingredientData) return <div>Ингредиент не найден</div>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
