import { RouteDetails, RouteVehicle } from "@/app/page";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";

export default function Map({
  routesGeoJSON,
  vehicles,
  routeDetails,
}: {
  routesGeoJSON: { color: string; json: any }[];
  vehicles: RouteVehicle[];
  routeDetails: RouteDetails[];
}) {
  const getRouteDetailForVehicle = (vehicle: RouteVehicle) => {
    return routeDetails.find((r) => r.RouteId === vehicle.RouteId);
  };

  const createIconForRoute = (route?: RouteDetails) => {
    if (!route) {
      return;
    }
    const icon = L.divIcon({
      iconSize: [32, 32],
      popupAnchor: [0, -16],
      className: "route-icon",
      html: `<?xml version="1.0" ?><svg height="32" viewBox="0 0 630 630" width="32" xmlns="http://www.w3.org/2000/svg"><circle cx="315" cy="315" fill="#${route.Color}" r="300"/><g transform="translate(-15,65)"><desc/><path d="M 181.90658,156.87997 L 199.69048,87.742095 L 239.02341,48.030315 L 435.0703,48.779593 L 466.25966,87.366615 L 488.4373,162.1708 L 491.64086,357.52393 L 182.11301,346.92699 L 181.90658,156.87997 z " fill="#${route.Color}"/><path d="M 202.01059,454.26396 C 197.46571,452.29841 192.38292,447.38175 189.70017,442.3559 C 187.79829,438.79293 187.52377,436.38928 187.18755,420.3559 C 186.93398,408.26407 186.4327,402.11475 185.66034,401.62121 C 185.02798,401.21713 178.30984,400.87963 170.73116,400.87121 L 156.95172,400.8559 L 157.2491,307.1059 L 157.54647,213.3559 L 166.23798,148.3559 C 171.01831,112.60589 175.61666,81.072565 176.45653,78.281827 C 178.70708,70.803695 185.09525,61.612719 191.69715,56.354401 C 198.45661,50.970581 216.01208,42.213898 227.51059,38.490621 C 238.1229,35.054301 257.3769,30.481709 274.0106,27.447426 C 319.12791,19.217227 355.97667,19.638876 403.63238,28.930646 C 458.12668,39.555785 485.32634,54.264678 492.97337,77.244009 C 494.35387,81.392425 497.85124,105.12601 503.52447,148.84517 L 512.0106,214.24105 L 512.0106,307.54847 L 512.0106,400.8559 L 498.7606,400.87121 C 491.4731,400.87963 484.99393,401.21713 484.36245,401.62121 C 483.5971,402.11095 483.0775,408.19046 482.80396,419.8559 C 482.32844,440.13576 481.35222,443.62475 474.45466,449.69623 C 461.18568,461.37605 437.92939,455.87901 433.15203,439.93362 C 432.50229,437.76496 432.0106,429.20471 432.0106,420.06131 C 432.0106,406.79232 431.7373,403.72546 430.43917,402.42733 C 429.03292,401.02108 419.00194,400.8559 335.0106,400.8559 C 251.01925,400.8559 240.98827,401.02108 239.58202,402.42733 C 238.27993,403.72942 238.00892,406.8574 238.00082,420.67733 C 237.99179,436.10816 237.81466,437.72995 235.63317,442.3559 C 232.82337,448.31421 230.05834,451.03008 224.01059,453.77187 C 218.49991,456.27017 207.23228,456.5222 202.01059,454.26396 z M 221.1008,342.48478 C 230.56636,339.10128 237.15345,329.70599 237.15345,319.58859 C 237.15345,305.51821 226.64693,294.8559 212.78213,294.8559 C 205.89115,294.8559 201.72608,296.41078 196.62895,300.88612 C 190.80777,305.99719 188.56999,311.1258 188.56999,319.3559 C 188.56999,327.12989 190.63735,332.28185 195.66901,337.04695 C 202.11812,343.15442 212.82365,345.44348 221.1008,342.48478 z M 468.07442,341.1059 C 486.14906,331.93932 486.14906,306.77248 468.07442,297.6059 C 455.26759,291.1109 439.75171,296.7281 434.23734,309.8559 C 431.9951,315.19388 432.33827,324.8356 434.96351,330.25862 C 440.85625,342.43139 455.80462,347.32854 468.07442,341.1059 z M 470.07207,231.84424 C 473.00601,231.28783 476.4168,229.88347 477.6516,228.72344 C 480.13084,226.39431 482.04588,219.01784 481.38161,214.3559 C 481.14651,212.7059 477.84734,189.01023 474.05013,161.69886 C 466.94051,110.56314 466.17051,107.02111 461.18321,102.51081 C 456.03659,97.856439 458.4826,97.946323 335.70342,97.899788 C 252.63003,97.868302 218.62464,98.176084 215.39755,98.988675 C 209.50844,100.47157 205.39381,104.70397 203.55037,111.17496 C 201.07489,119.86455 187.85881,217.52991 188.61381,221.55443 C 189.61644,226.8989 193.81395,231.03721 199.09935,231.89208 C 206.2682,233.05159 463.94563,233.0061 470.07207,231.84424 z M 410.5106,75.881391 C 415.12597,74.812019 417.68374,72.115112 418.57173,67.38176 C 419.36445,63.156189 416.82495,57.547966 413.41536,55.994452 C 411.6147,55.17402 389.48487,54.862108 334.21355,54.878131 C 263.04857,54.898761 257.3566,55.025112 255.37764,56.628131 C 250.66932,60.442017 249.73812,66.256675 252.98332,71.579058 C 254.15373,73.498638 256.07332,75.050672 257.72958,75.416529 C 259.25914,75.754398 260.9606,76.180949 261.5106,76.364419 C 263.95909,77.181189 406.90068,76.717802 410.5106,75.881391 z " style="fill:#fff"/></g></svg>`,
    });

    return icon;
  };

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
      {vehicles.map((vehicle) => {
        const route = getRouteDetailForVehicle(vehicle);

        if (!route) {
          return null;
        }

        return (
          <Marker
            key={vehicle.VehicleId}
            position={[vehicle.Latitude, vehicle.Longitude]}
            icon={createIconForRoute(route)}
          >
            <Popup>
              <span className="text-xl font-bold">
                Route {route.RouteAbbreviation}
              </span>
              <br />
              <span className="text-lg font-semibold">
                Destination: {vehicle.Destination} ({vehicle.Direction})
              </span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
