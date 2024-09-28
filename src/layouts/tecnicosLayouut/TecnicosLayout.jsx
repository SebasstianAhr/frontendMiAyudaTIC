import React from "react";
import NavTecnicos from "../../components/navTecnicos/NavTecnicos";

export default function TecnicosLayout({ children }) {
  return (
      <div>
        <div>
          <NavTecnicos />
        </div>
        <div className="">{children}</div>
      </div>
  );
}
