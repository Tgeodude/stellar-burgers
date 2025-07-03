import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/constructor-slice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    // Drag and drop logic
    const [, drop] = useDrop({
      accept: 'constructor-ingredient',
      hover(item: { index: number }, monitor: any) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        dispatch(moveIngredient({ from: dragIndex, to: hoverIndex }));
        item.index = hoverIndex;
      }
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'constructor-ingredient',
      item: { index },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging()
      })
    });

    drag(drop(ref));

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.uuid));
    };

    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <BurgerConstructorElementUI
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleClose={handleClose}
        />
      </div>
    );
  }
);
