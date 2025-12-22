import { Product, Cart, User } from "@/types";
import { fetchJson } from "./utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_FAKESTORE_URL || "https://fakestoreapi.com";

export const fakeStoreApi = {
  getProducts: async (limit = 20): Promise<Product[]> => {
    return fetchJson<Product[]>(`${BASE_URL}/products?limit=${limit}`);
  },

  getProduct: async (id: number): Promise<Product> => {
    return fetchJson<Product>(`${BASE_URL}/products/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    return fetchJson<string[]>(`${BASE_URL}/products/categories`);
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return fetchJson<Product[]>(`${BASE_URL}/products/category/${category}`);
  },

  getCarts: async (): Promise<Cart[]> => {
    return fetchJson<Cart[]>(`${BASE_URL}/carts`);
  },

  getCart: async (id: number): Promise<Cart> => {
    return fetchJson<Cart>(`${BASE_URL}/carts/${id}`);
  },

  getUsers: async (): Promise<User[]> => {
    return fetchJson<User[]>(`${BASE_URL}/users`);
  },

  getUser: async (id: number): Promise<User> => {
    return fetchJson<User>(`${BASE_URL}/users/${id}`);
  },
};
