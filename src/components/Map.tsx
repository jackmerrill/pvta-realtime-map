import { RouteVehicle } from "@/app/page";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";

export default function Map({
  routesGeoJSON,
  vehicles,
}: {
  routesGeoJSON: { color: string; json: any }[];
  vehicles: RouteVehicle[];
}) {
  return (
    <MapContainer
      center={[42.3055, -72.5208]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      id="map"
      className="z-0 "
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=57ca0087bbbf48849ddc3d4ede2fbe10"
      />
      {routesGeoJSON.length > 0 &&
        routesGeoJSON.map((r, i) => (
          <GeoJSON
            key={i}
            data={r.json}
            pathOptions={{ color: `#${r.color}`, opacity: 0.75 }}
          />
        ))}
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.VehicleId}
          position={[vehicle.Latitude, vehicle.Longitude]}
        >
          <Popup>Route 38</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
