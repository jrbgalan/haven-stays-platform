import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { client } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";

export interface FavoriteItem {
  id: string;
  listingId: string;
  [key: string]: any;
}

export interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorited: (listingId: string) => boolean;
  toggle: (listingId: string) => Promise<{ needsAuth: boolean; favorited?: boolean }>;
  loading: boolean;
  reload: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    try {
      const favs = await client.entities.Favorite.filter({});
      setFavorites(favs);
    } catch (e) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  const isFavorited = useCallback(
    (listingId) => favorites.some((f) => f.listingId === listingId),
    [favorites]
  );

  const toggle = useCallback(
    async (listingId) => {
      if (!isAuthenticated) return { needsAuth: true };
      const existing = favorites.find((f) => f.listingId === listingId);
      if (existing) {
        await client.entities.Favorite.delete(existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        return { needsAuth: false, favorited: false };
      } else {
        const created = await client.entities.Favorite.create({ listingId });
        setFavorites((prev) => [...prev, created]);
        return { needsAuth: false, favorited: true };
      }
    },
    [favorites, isAuthenticated]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorited, toggle, loading, reload: load }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};