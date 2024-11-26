import { RLayerVectorTile, RMap, ROSM, RStyle } from "rlayers";
import "ol/ol.css";
import { RView } from "node_modules/rlayers/RMap";
import { useState } from "react";
import MVT from "ol/format/MVT";

export default function GreenAreas() {
  const [view, setView] = useState<RView>({
    center: [-6392677.3690702375, -1462790.7057716285],
    zoom: 4.776666666666669,
    resolution: 5711.021571627054,
  });

  return (
    <RMap initial={view} view={[view, setView]} className="w-[100vw] h-[100vh]">
      <RLayerVectorTile
        url={"http://34.171.229.232:7800/shared.green_areas/{z}/{x}/{y}.pbf"}
        format={new MVT()}
        zIndex={100}
      >
        <RStyle.RStyle>
          <RStyle.RStroke color={"green"} width={1} />
          <RStyle.RFill color="rgba(20,200,20,0.6)" />
        </RStyle.RStyle>
      </RLayerVectorTile>
      <RLayerVectorTile
        url={
          "http://34.171.229.232:7800/shared.municipality_boundaries/{z}/{x}/{y}.pbf"
        }
        format={new MVT()}
        zIndex={100}
      >
        <RStyle.RStyle>
          <RStyle.RStroke color={"red"} width={2} />
          <RStyle.RFill color="rgba(20,20,20,0)" />
        </RStyle.RStyle>
      </RLayerVectorTile>
      <ROSM />
    </RMap>
  );
}
