import * as React from "react";
import Loading from "../components/Loading";
import CotterContext from "./userContext";

const defaultLoadingComponent = (): JSX.Element => <Loading loading={true} />;

const defaultLoginPagePath = "/";

/**
 * Options for the withAuthenticationRequired
 */
export interface WithAuthenticationRequiredOptions {
  /**
   * ```js
   * withAuthenticationRequired(Dashboard, {
   *   loginPagePath: '/' // where to return after finish login
   * })
   * ```
   *
   * The path where the login page is located.
   */
  loginPagePath?: string | (() => string);
  /**
   * ```js
   * withAuthenticationRequired(Profile, {
   *   loadingComponent: () => <div>Loading... We're redirecting you to login.</div>
   * })
   * ```
   *
   * Show a component to the user while they're being redirected to the login page.
   */
  loadingComponent?: () => JSX.Element;
}

const withAuthenticationRequired = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthenticationRequiredOptions
) => (props: P) => {
  const { isLoggedIn, isLoading } = React.useContext(CotterContext);
  const {
    loginPagePath = defaultLoginPagePath,
    loadingComponent = defaultLoadingComponent,
  } = options;

  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      window.location.href =
        typeof loginPagePath === "function" ? loginPagePath() : loginPagePath;
    }
  }, [isLoggedIn, isLoading]);

  return !isLoggedIn ? loadingComponent : <Component {...props} />;
};

export default withAuthenticationRequired;
