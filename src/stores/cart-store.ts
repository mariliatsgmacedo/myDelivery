// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { ProductProps } from '@/utils/data/products';
// import * as cartInMemory from './helpers/cart-in-memory';

// export type ProductCartProps = ProductProps & {
//   quantity: number;
// };

// type StateProps = {
//   products: ProductCartProps[];
//   add: (product: ProductProps) => void;
//   remove: (productId: string) => void;

//   clear: () => void;
// };

// export const useCartStore = create(
//   persist<StateProps>(
//     (set) => ({
//       products: [],

//       add: (product: ProductProps) =>
//         set((state) => ({
//           products: cartInMemory.add(state.products, product),
//         })),

//       remove: (productId: string) =>
//         set((state) => ({
//           products: cartInMemory.remove(state.products, productId),
//         })),

//       clear: () => set({ products: [] }),
//     }),
//     {
//       name: 'nlw-expert:cart',
//       storage: createJSONStorage(() => AsyncStorage),
//     },
//   ),
// );

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ProductProps } from "@/utils/data/products";
import * as cartInMemory from "./helpers/cart-in-memory";

export type ProductCartProps = ProductProps & {
  quantity: number;
};

type StateProps = {
  products: ProductCartProps[];
  add: (product: ProductCartProps) => void;
  remove: (productId: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create(
  persist<StateProps>(
    (set) => ({
      products: [],

      add: (product: ProductCartProps) =>
        set((state) => {
          const existingProduct = state.products.find(
            (p) => p.id === product.id
          );
          if (existingProduct) {
            return {
              products: state.products.map((p) =>
                p.id === product.id
                  ? { ...p, quantity: p.quantity + product.quantity }
                  : p
              ),
            };
          } else {
            return {
              products: [...state.products, product],
            };
          }
        }),

      remove: (productId: string) =>
        set((state) => ({
          products: cartInMemory.remove(state.products, productId),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, quantity } : product
          ),
        })),
      clear: () => set({ products: [] }),
    }),
    {
      name: "nlw-expert:cart",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
