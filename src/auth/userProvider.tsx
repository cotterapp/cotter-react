import * as React from "react";
import Cotter, { CotterEnum } from "cotter";
import { Config } from "cotter/lib/binder";
import User from "cotter/lib/models/User";
import CotterContext from "./userContext";
import { CotterAccessToken } from "cotter-token-js";

export interface CotterProviderOptions extends Partial<Config> {
  /**
   * The child nodes your Provider has wrapped
   */
  children?: React.ReactNode;
  apiKeyID: string;

  /**
   * Updates CotterEnum base urls if needed
   */
  backendURL?: string;
  jsURL?: string;
  assetURL?: string;
}

/**
 * ```jsx
 * <CotterProvider
 *   apiKeyID={YOUR_API_KEY_ID}
 * >
 *   <MyApp />
 * </CotterProvider>
 * ```
 *
 * Provides the CotterContext to its child components.
 */
const CotterProvider = (opts: CotterProviderOptions) => {
  let { children, apiKeyID, backendURL, jsURL, assetURL } = opts;
  const [loggedIn, setloggedIn] = React.useState(false);
  const [loading, setloading] = React.useState(true);
  const [user, setuser] = React.useState<User | undefined>(undefined);

  const getCotter = (config?: Config) => {
    if (config && config.ApiKeyID) {
      const c = new Cotter(config);
      return c;
    } else {
      const c = new Cotter(apiKeyID);
      return c;
    }
  };

  React.useEffect(() => {
    if (apiKeyID) {
      checkLoggedIn();
    }
  }, [apiKeyID]);

  // Update base url if needed
  React.useEffect(() => {
    if (backendURL) {
      CotterEnum.BackendURL = backendURL;
    }
  }, [backendURL]);
  React.useEffect(() => {
    if (jsURL) {
      CotterEnum.JSURL = jsURL;
    }
  }, [jsURL]);
  React.useEffect(() => {
    if (assetURL) {
      CotterEnum.AssetURL = assetURL;
    }
  }, [assetURL]);

  const checkLoggedIn = async () => {
    const cotter = getCotter();
    const accessToken = await cotter.tokenHandler.getAccessToken();
    if (accessToken && accessToken.token?.length > 0) {
      setloggedIn(true);
      const usr = cotter.getLoggedInUser();
      setuser(usr);
    } else {
      setloggedIn(false);
      setuser(undefined);
    }
    setloading(false);
  };

  const getAccessToken = async (): Promise<CotterAccessToken | null> => {
    if (apiKeyID) {
      const cotter = getCotter();
      const accessToken = await cotter.tokenHandler.getAccessToken();
      return accessToken;
    } else {
      throw new Error(
        "ApiKeyID is undefined, you may forgot to wrap your component in <CotterProvider>"
      );
    }
  };
  const logout = async (): Promise<void> => {
    if (apiKeyID) {
      const cotter = getCotter();
      await cotter.logOut();
      setloggedIn(false);
      setuser(undefined);
    } else {
      throw new Error(
        "ApiKeyID is undefined, you may forgot to wrap your component in <CotterProvider>"
      );
    }
  };

  return (
    <CotterContext.Provider
      value={{
        checkLoggedIn: checkLoggedIn,
        isLoggedIn: loggedIn,
        isLoading: typeof window === "undefined" || loading,
        getCotter: getCotter,
        user: user,
        apiKeyID: apiKeyID,
        logout: logout,
        getAccessToken: getAccessToken,
      }}
    >
      {children}
    </CotterContext.Provider>
  );
};

export default CotterProvider;
