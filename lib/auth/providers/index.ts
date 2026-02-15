import { googleProvider } from "../google";

export const providers = {
  google: googleProvider,
};

export type ProviderName = keyof typeof providers;