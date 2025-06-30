import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal/modal';
import { IngredientDetails } from './ingredient-details';

export const IngredientModal: FC = () => {
  const navigate = useNavigate();
  return (
    <Modal title='' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};
