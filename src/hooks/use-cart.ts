import { create, StateCreator } from "zustand";

// Export the interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Export the interface
export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// Define the creator function with explicit types for set and get
const cartCreator: StateCreator<CartStore> = (set) => ({
  items: [],
  addItem: (item: CartItem) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  updateQuantity: (id: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
});

export const useCart = create<CartStore>(cartCreator);
