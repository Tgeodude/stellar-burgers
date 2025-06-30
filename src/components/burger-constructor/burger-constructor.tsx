import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../../services/constructor-slice';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { sendOrder } from '../../services/order-slice';
import { RootState } from '../../services/store';
import { clearOrder } from '../../services/order-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  const { loading: orderRequest, order: orderModalData } = useSelector(
    (state: RootState) => state.order
  );
  const isAuth = useSelector((state) => state.user.isAuth);

  // Подсчёт стоимости
  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      safeIngredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, safeIngredients]
  );

  // Обработчики (заглушки, будут подключены к UI)
  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    // Собираем массив id: сначала булка, потом все ингредиенты, потом булка снова
    const ingredientIds = [
      bun._id,
      ...safeIngredients.map((item) => item._id),
      bun._id
    ];
    dispatch(sendOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={{ bun, ingredients: safeIngredients }}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </DndProvider>
  );
};
