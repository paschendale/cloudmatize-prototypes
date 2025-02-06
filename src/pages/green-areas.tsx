import { RLayerVectorTile, RMap, ROSM } from "rlayers";
import "ol/ol.css";
import { useEffect, useRef, useState } from "react";
import MVT from "ol/format/MVT";
import { Fill, Stroke, Style } from "ol/style";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockedCities = [
  {
    id: 2,
    name: "Campo Grande",
    extent: [
      -6114145.108176996, -2461783.8310957295, -5966813.762112098,
      -2292718.1680410677,
    ],
  },
  {
    id: 4,
    name: "Altamira",
    extent: [
      -6192024.22393597, -1078806.151183669, -5749373.400745597,
      -332851.54136948125,
    ],
  },
  {
    id: 9,
    name: "Marabá",
    extent: [
      -5721999.937959531, -693524.9226643831, -5424431.807120031,
      -538657.4143822525,
    ],
  },
  {
    id: 11,
    name: "Caicó",
    extent: [
      -4144513.69782621, -751379.6676048576, -4103325.4862326984,
      -690490.3910322845,
    ],
  },
  {
    id: 3,
    name: "Juazeiro do Norte",
    extent: [
      -4382280.998211564, -811024.1855970011, -4362900.274864454,
      -791580.0646192871,
    ],
  },
  {
    id: 1,
    name: "São Caetano Do Sul",
    extent: [
      -5185807.346655569, -2710889.6295878487, -5181321.171176601,
      -2704778.0126119284,
    ],
  },
  {
    id: 5,
    name: "São Luís",
    extent: [
      -4944099.336296136, -311729.5511961376, -4916069.088514389,
      -275423.1864369044,
    ],
  },
  {
    id: 6,
    name: "Crato",
    extent: [
      -4408262.967362713, -845824.7647518881, -4378974.809335003,
      -781372.8788528391,
    ],
  },
  {
    id: 7,
    name: "Guarabira",
    extent: [
      -3956105.459658594, -777066.2696167702, -3938528.112062337,
      -760146.0366785905,
    ],
  },
  {
    id: 8,
    name: "Caruaru",
    extent: [
      -4027617.1005441933, -938316.5549985012, -3990981.856124127,
      -890799.6286330861,
    ],
  },
  {
    id: 10,
    name: "Boa Vista",
    extent: [
      -6790555.730084164, 270386.93871313025, -6710984.558065131,
      401683.3501780201,
    ],
  },
  {
    id: 12,
    name: "Florianópolis",
    extent: [
      -5411630.065678805, -3229823.5479799807, -5379837.219108245,
      -3157044.988295852,
    ],
  },
  {
    id: 13,
    name: "Tijucas",
    extent: [
      -5432869.824522161, -3167869.683561847, -5409514.995353732,
      -3140273.3111181105,
    ],
  },
];

export default function GreenAreas() {
  const [currentCity, setCurrentCity] = useState<(typeof cities)[0]>();
  const [cities, setCities] = useState<typeof mockedCities>([]);
  const map = useRef<RMap>(null);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      const response = await fetch(
        `https://postgrest-dev-945363624703.us-central1.run.app/municipality_boundaries_with_extent`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch municipalities");
      }

      const data = await response.json();

      setCities(data);
    };

    fetchMunicipalities();
  }, []);

  function handleValueChange(v: string) {
    const selectedCity = cities.filter((e) => String(e.id) === v);
    if (selectedCity.length === 0) throw new Error("Eita");
    setCurrentCity(selectedCity[0]);

    if (map.current && selectedCity.length > 0) {
      map.current.ol.getView().fit(selectedCity[0].extent, {
        size: map.current.ol.getSize(),
        duration: 1000,
        callback: () => console.log("just fitted"),
        padding: [50, 50, 50, 50],
      });
    }
  }

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <RMap
        ref={map}
        initial={{
          center: [-6389344.727940026, -1450949.419839621],
          zoom: 4.68906559745409,
          resolution: 6068.541833086031,
        }}
        className="w-[100%] h-[100%]"
      >
        {currentCity && (
          <RLayerVectorTile
            url={`https://pg-tileserv-dev-955707917965.us-central1.run.app/shared.green_areas_by_municipality/{z}/{x}/{y}.pbf?municipality_id=${currentCity.id}`}
            format={new MVT()}
            zIndex={100}
            style={(feature) => {
              const id = feature.get("id_municipality_boundaries");

              if (!currentCity || id !== currentCity.id) return;

              return new Style({
                stroke: new Stroke({
                  color: "green",
                  width: 1,
                }),
                fill: new Fill({
                  color: "rgba(20,200,20,0.5)",
                }),
              });
            }}
          ></RLayerVectorTile>
        )}
        <RLayerVectorTile
          url={`⁠https://pg-tileserv-dev-955707917965.us-central1.run.app/shared.municipality_boundaries/{z}/{x}/{y}.pbf`}
          format={new MVT()}
          zIndex={100}
          style={(feature) => {
            const id = feature.get("id");

            if (!currentCity || id !== currentCity.id) return;

            return new Style({
              stroke: new Stroke({
                color: "red",
                width: 3,
              }),
              fill: new Fill({
                color: "rgba(20,200,20,0)",
              }),
            });
          }}
        ></RLayerVectorTile>
        <ROSM />
      </RMap>
      <div className="absolute top-2 right-2  bg-white rounded-md shadow-sm">
        <Select onValueChange={handleValueChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Selecione um município" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((e) => (
              <SelectItem value={String(e.id)}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
