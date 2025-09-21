import React from "react";

type Props = {
  connLabel: string; loginLabel: string;
  baseUrl: string; onBaseUrl: (v: string)=>void;
};
export default function TopBar({ connLabel, loginLabel, baseUrl, onBaseUrl }: Props){
  return (
    <div className="card row" style={{alignItems:"center", justifyContent:"space-between"}}>
      <h1>StroobGame • Salas + Chat + Juego</h1>
      <span className="pill">{connLabel}</span>
      <span className="pill">{loginLabel}</span>
      <div className="row" style={{alignItems:"center"}}>
        <label>Backend:
          <input value={baseUrl} onChange={e=>onBaseUrl(e.target.value)} style={{width:360}} placeholder="https://<devtunnel>/" />
        </label>
      </div>
    </div>
  );
}
