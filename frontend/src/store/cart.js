import { removeItem } from "framer-motion";
import { create } from "zustand";
import { persist } from "zustand/middleware"

export const useCart = create ( persist (
    (set, get) => ({
        items: [],

        addItem(productId, qty = 1 ) {
            const item = [...get().item]
            const i = item.findIndex((item) => item.productId === productId)
            if (i>= 0) {
                item[i] = { ...items[i], quantity: items[i].quantity + qty}
            } else{
                items.push({ productId, quantity: qty})
            }
            set({ items })
        },

        removeItem(productId) {
            set({ items: get().items.filter((item) => item.productId !== productId) })
        },

        setQty(productId, quantity) {
            if (quantity <= 0) {
                set({ items: get().item.filter((item) => item.productId !== productId)})
                return
            }
            const items = get().item.map((items) =>
            item.productId === productId ? { ...item, quantity} : item,
            )
            set({ item})
        },

        clear() {
            set({ items: [] })
        },
    }),
    { name: "Almanatra-cart"}
),
)