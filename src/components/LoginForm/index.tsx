import * as PropTypes from "prop-types";
import * as React from "react";
import CotterContext from "../../auth/userContext";
import {
  AUTHENTICATION_METHOD,
  IDENTIFIER_TYPE,
  Styles,
  AdditionalField,
  VerifySuccess,
  OnBeginHandler,
  Config,
} from "cotter/lib/binder";

interface LoginFormOptions {
  type: IDENTIFIER_TYPE;
  authMethod: AUTHENTICATION_METHOD;
  onSuccess: (response: VerifySuccess) => void;
  onError: (err: any) => void;
  onBegin?: OnBeginHandler;
  styles?: Styles;
  additionalFields?: AdditionalField[];
  width: number;
  height: number;
  formID?: string; // For customization
}

/**
 * ```jsx
 * <LoginForm
 *    authMethod="MAGIC_LINK"
 *    type="EMAIL"
 *    onSuccess={() => navigate("/")}
 *    onError={(err) => alert(err)}
 *    onBegin={(payload) => checkEmail(payload.identifier)}
 *    styles={{
 *      input_label: {color: "#ffffff"}
 *    }}
 *    additionalFields={[
 *      {
 *        name: "name",
 *        label: "Full Name",
 *        placeholder: "Enter your full name",
 *      },
 *    ]}
 *    width={300}
 *    height={300}
 *    formID="default"
 * />;
 * ```
 *
 * Initiate Cotter's login form
 **/

function LoginForm({
  onBegin,
  onSuccess,
  onError,
  styles,
  additionalFields,
  formID,
  type = IDENTIFIER_TYPE.EMAIL,
  authMethod = AUTHENTICATION_METHOD.MAGIC_LINK,
  width = 300,
  height = 300,
}: LoginFormOptions) {
  const [loaded, setloaded] = React.useState(false);
  const [containerID, setcontainerID] = React.useState("");
  const { getCotter, apiKeyID, checkLoggedIn } = React.useContext(
    CotterContext
  );
  React.useEffect(() => {
    const randomID = Math.random().toString(36).substring(2, 15);
    setcontainerID(`cotter-form-container-${randomID}`);
  }, []);

  React.useEffect(() => {
    console.log(containerID);
    if (getCotter && apiKeyID?.length >= 36 && containerID && !loaded) {
      const config: Config = {
        ApiKeyID: apiKeyID,
        Type: type,
      };
      if (styles) {
        config.Styles = styles;
      }
      if (additionalFields && additionalFields.length > 0) {
        config.AdditionalFields = additionalFields;
      }
      if (formID && formID.length > 0)  {
        config.FormID = formID;
      }
      config.ContainerID = containerID;
      console.log(config);
      const cotter = getCotter(config);

      let cotterMethod =
        authMethod === AUTHENTICATION_METHOD.MAGIC_LINK
          ? cotter.signInWithLink()
          : cotter.signInWithOTP();

      if (onBegin) {
        cotterMethod =
          authMethod === AUTHENTICATION_METHOD.MAGIC_LINK
            ? cotter.signInWithLink(onBegin)
            : cotter.signInWithOTP(onBegin);
      }

      const cotterType =
        type === IDENTIFIER_TYPE.EMAIL
          ? cotterMethod.showEmailForm()
          : cotterMethod.showPhoneForm();

      setloaded(true);
      cotterType
        .then((resp) => {
          checkLoggedIn();
          onSuccess(resp);
        })
        .catch((err) => onError(err));
    }
  }, [
    onSuccess,
    onError,
    authMethod,
    type,
    styles,
    additionalFields,
    containerID,
    loaded,
    onBegin,
    getCotter,
    apiKeyID,
    checkLoggedIn,
  ]);
  return (
    <>
      {(!apiKeyID || apiKeyID.length < 36) && (
        <div style={{ padding: "0px 20px" }}>
          You're missing the API KEY ID, you need to pass it to{" "}
          <code>CotterProvider</code>
        </div>
      )}
      <div
        id={containerID}
        style={{ width: width, height: apiKeyID?.length >= 36 ? height : 10 }}
      ></div>
    </>
  );
}

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default LoginForm;
