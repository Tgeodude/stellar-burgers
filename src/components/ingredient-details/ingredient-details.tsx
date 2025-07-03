import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { fetchIngredients } from '../../services/ingredients-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const {
    items: allIngredients,
    loading,
    error
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (allIngredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
    }
  }, [allIngredients.length, loading, dispatch]);

  const ingredientData = allIngredients.find((item) => item._id === id);

  if (loading) return <Preloader />;
  if (error) return <div>Ошибка загрузки ингредиентов</div>;
  if (!ingredientData) return <div>Ингредиент не найден</div>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
