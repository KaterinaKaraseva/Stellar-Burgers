import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectBurgerConstructor } from '../../slices/burgerConstructorSlice';
import {
  clearOrderBurgerData,
  fetchOrderBurgerApi,
  orderBurger,
  selectOrderBurgerIsLoading
} from '../../slices/orderSlice';
import { selectUserData } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectBurgerConstructor);

  const orderRequest = useSelector(selectOrderBurgerIsLoading);

  const orderModalData = useSelector(orderBurger);

  const user = useSelector(selectUserData);

  const onOrderClick = () => {
    if (!user.email) {
      navigate('/login');

      return;
    }

    if (
      !constructorItems.bun ||
      orderRequest ||
      !constructorItems.ingredients.length
    ) {
      return;
    }

    dispatch(
      fetchOrderBurgerApi(constructorItems.ingredients.map((item) => item._id))
    );
  };

  const closeOrderModal = () => {
    dispatch(clearOrderBurgerData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
