import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set: any) => ({
  items: [],
  addItem: (item: CartItem) =>
    set((state: CartStore) => {
      const existingItem = state.items.find((i: CartItem) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i: CartItem) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id: string) =>
    set((state: CartStore) => ({
      items: state.items.filter((item: CartItem) => item.id !== id),
    })),
  updateQuantity: (id: string, quantity: number) =>
    set((state: CartStore) => ({
      items: state.items.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
}));
