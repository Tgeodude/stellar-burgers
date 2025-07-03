import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { RootState } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  // Получаем данные заказа из истории заказов или ленты заказов
  const profileOrders = useSelector(
    (state: RootState) => state.profileOrders.orders
  );
  const feedOrders = useSelector((state: RootState) => state.feed.orders);

  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!number) return;
    const orderNumber = parseInt(number || '0');
    const order = [...profileOrders, ...feedOrders].find(
      (order) => order.number === orderNumber
    );
    if (!order && !fetching && !fetchedOrder && !fetchError) {
      setFetching(true);
      getOrderByNumberApi(orderNumber)
        .then((res: { orders: TOrder[] }) => {
          if (res.orders && res.orders.length > 0) {
            setFetchedOrder(res.orders[0]);
          } else {
            setFetchError('Заказ не найден');
          }
        })
        .catch(() => setFetchError('Ошибка загрузки заказа'))
        .finally(() => setFetching(false));
    }
  }, [number, profileOrders, feedOrders, fetchedOrder, fetching, fetchError]);

  const orderData: TOrder | null = useMemo(() => {
    const orderNumber = parseInt(number || '0');
    return (
      [...profileOrders, ...feedOrders].find(
        (order) => order.number === orderNumber
      ) || fetchedOrder
    );
  }, [number, profileOrders, feedOrders, fetchedOrder]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = (
      Object.values(ingredientsInfo) as (TIngredient & { count: number })[]
    ).reduce((acc: number, item) => acc + item.price * item.count, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    } as const;
  }, [orderData, ingredients]);

  if (fetchError) {
    return (
      <div style={{ textAlign: 'center', color: 'red' }}>
        Ошибка: {fetchError}
      </div>
    );
  }
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
