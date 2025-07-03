import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '../app-header/app-header';
import React, { Suspense, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { getUser } from '../../services/user-slice';
import { fetchIngredients } from '../../services/ingredients-slice';
import { setAuthChecked } from '../../services/user-slice';
// Импорт страниц
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
// Импорт модалок
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { IngredientModal } from '../ingredient-details/ingredient-modal';
import { Preloader } from '../ui/preloader';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const loading = useSelector((state: RootState) => state.user.loading);
  const isAuthChecked = useSelector(
    (state: RootState) => state.user.isAuthChecked
  );
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (loading) {
    return <Preloader />;
  }

  return isAuth ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function GuestRoute({ children }: { children: JSX.Element }) {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  return isAuth ? <Navigate to='/profile' replace /> : children;
}

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const userName = useSelector((state: RootState) => state.user.user?.name);
  const background = location.state && location.state.background;

  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked());
    }
    dispatch(fetchIngredients());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader isAuth={isAuth} userName={userName} />
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path='/register'
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <GuestRoute>
                <ResetPassword />
              </GuestRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
        {background && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal title='' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title='' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </Suspense>
    </div>
  );
};

export default App;
