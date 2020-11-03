import * as React from "react";
import "./styles.scss";

function Loading({ loading }: { loading: boolean }) {
  return (
    <div className={`Cotter__loader-wrapper ${loading && "Cotter__is-active"}`}>
      <div className="Cotter__loader Cotter__is-loading" />
    </div>
  );
}

export default Loading;
