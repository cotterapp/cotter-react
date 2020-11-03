import Cotter from "cotter";
import { CotterAccessToken } from "cotter-token-js";
import { Config } from "cotter/lib/binder";
import User from "cotter/lib/models/User";
import { createContext } from "react";

/**
 * Contains the authenticated state and authentication methods provided by the `useCotter` hook.
 */
export interface CotterContextInterface {
  // Indicates if the current user is logged-in
  isLoggedIn: boolean;
  // Loading window object
  isLoading: boolean;
  // Cotter object
  getCotter?: (config?: Config) => Cotter;
  // Currently logged-in user
  user?: User;
  // Api Key ID
  apiKeyID: string;
  // Log out
  logout: () => Promise<void>;
  // checkLoggedIn
  checkLoggedIn: () => Promise<void>;
  // getAccessToken
  getAccessToken: () => Promise<CotterAccessToken | null>;
}

const stub = (): never => {
  throw new Error("You forgot to wrap your component in <CotterProvider>.");
};

/**
 * The initial initialContext.
 */
export const initialContext: CotterContextInterface = {
  isLoggedIn: false,
  // In SSR mode the library will never check the session, so loading should be initialised as false
  isLoading: typeof window !== "undefined",
  logout: stub,
  getCotter: stub,
  getAccessToken: stub,
  checkLoggedIn: stub,
  apiKeyID: "",
};

/**
 * The Cotter Context
 */
const CotterContext = createContext<CotterContextInterface>(initialContext);

export default CotterContext;
