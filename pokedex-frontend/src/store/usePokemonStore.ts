import { create } from "zustand";

type PokemonState = {
  capturedPokemon: Set<string>; // Store captured Pokémon as "number-name"
  capturePokemon: (id: string) => void;
};

export const usePokemonStore = create<PokemonState>((set) => ({
  capturedPokemon: new Set(),

  capturePokemon: (id: string) =>
    set((state) => {
      const updatedSet = new Set(state.capturedPokemon);
      updatedSet.add(id);
      return { capturedPokemon: updatedSet };
    }),
}));
