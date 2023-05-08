"use client";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import toGeoJSON from "@mapbox/togeojson";
import dynamic from "next/dynamic";

export type RouteVehicle = {
  BlockFareboxId: number;
  CommStatus: string;
  Destination: string;
  Deviation: number;
  Direction: string;
  DirectionLong: string;
  DisplayStatus: string;
  StopId: number;
  CurrentStatus: string;
  DriverName: string;
  GPSStatus: number;
  Heading: number;
  LastStop: string;
  LastUpdated: string;
  Latitude: number;
  Longitude: number;
  Name: string;
  OccupancyStatus: number;
  OnBoard: number;
  OpStatus: string;
  RouteId: number;
  RunId: number;
  Speed: number;
  TripId: number;
  VehicleId: number;
  SeatingCapacity: number;
  TotalCapacity: number;
  PropertyName: string;
  OccupancyStatusReportLabel: string;
};

export type RouteStop = {
  Description: string;
  IsTimePoint: boolean;
  Latitude: number;
  Longitude: number;
  Name: string;
  StopId: number;
  StopRecordId: number;

  // Injected by us
  Route: string;
};

export type RouteDetails = {
  Color: string;
  Directions: {
    Dir: string;
    DirectionDesc: string;
    DirectionIconFileName: string;
  }[];
  GoogleDescription: string;
  Group: string;
  IncludeInGoogle: boolean;
  IsHeadway: boolean;
  IsHeadwayMonitored: boolean;
  IsVisible: boolean;
  IvrDescription: string;
  LongName: string;
  Messages: {
    Cause: number;
    CauseReportLabel: string;
    ChannelMessages: {
      ChannelId: number;
      ChannelMessageTranslations: {
        LanguageId: string;
        TranslatedText: string;
      }[];
      Message: string;
    }[];
    DaysOfWeek: number;
    Effect: number;
    EffectReportLabel: string;
    FromDate: string;
    FromTime: string;
    Message: string;
    MessageId: number;
    MessageTranslations: {
      Lang: string;
      Text: string;
    }[];
    Priority: number;
    PublicAccess: number;
    Published: boolean;
    Routes: number[];
    Signs: number[];
    ToDate: string;
    ToTime: string;
    URL: string;
    Detour_Id: number;
  }[];
  RouteAbbreviation: string;
  RouteId: number;
  RouteRecordId: number;
  RouteStops: {
    Direction: string;
    RouteId: number;
    SortOrder: number;
    StopId: number;
  }[];
  RouteTraceFilename: string;
  RouteTraceHash64: string;
  ShortName: string;
  SortOrder: number;
  Stops: {
    Description: string;
    IsTimePoint: boolean;
    Latitude: number;
    Longitude: number;
    Name: string;
    StopId: number;
    StopRecordId: number;
  }[];
  TextColor: string;
  Vehicles: {
    BlockFareboxId: number;
    CommStatus: string;
    Destination: string;
    Deviation: number;
    Direction: string;
    DirectionLong: string;
    DisplayStatus: string;
    StopId: number;
    CurrentStatus: string;
    DriverName: string;
    GPSStatus: number;
    Heading: number;
    LastStop: string;
    LastUpdated: string;
    Latitude: number;
    Longitude: number;
    Name: string;
    OccupancyStatus: number;
    OnBoard: number;
    OpStatus: string;
    RouteId: number;
    RunId: number;
    Speed: number;
    TripId: number;
    VehicleId: number;
    SeatingCapacity: number;
    TotalCapacity: number;
    PropertyName: string;
    OccupancyStatusReportLabel: string;
  }[];
  DetourActiveMessageCount: number;
};

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [routeIds, setRouteIds] = useState([
    "10001",
    "10002",
    "10003",
    "10004",
    "10005",
    "10006",
    "10007",
    "10009",
    "10010",
    "10011",
    "10012",
    "10014",
    "10017",
    "10020",
    "10021",
    "10921",
    "10023",
    "10024",
    "10029",
    "20030",
    "20031",
    "20033",
    "20034",
    "20035",
    "20036",
    "20038",
    "30039",
    "30041",
    "30042",
    "30043",
    "30943",
    "30044",
    "20045",
    "20046",
    "30048",
    "10073",
    "20079",
    "10090",
    "10092",
  ]);
  const [vehicles, setVehicles] = useState<RouteVehicle[]>([]);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [routesGeoJSON, setRoutesGeoJSON] = useState<any[]>([]);
  const [routeDetails, setRouteDetails] = useState<RouteDetails[]>([]);

  const fetchVehicles = () => {
    fetch(
      `https://bustracker.pvta.com/InfoPoint/rest/Vehicles/GetAllVehiclesForRoutes?routeIDs=${routeIds.join(
        ","
      )}`
    )
      .then((res) => res.json())
      .then((res) => {
        setVehicles(res);
      });
  };

  const fetchStops = () => {
    fetch(
      `https://bustracker.pvta.com/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=${routeIds.join(
        ","
      )}`
    )
      .then((res) => res.json())
      .then((res) => {
        setStops(res);
      });
  };

  const fetchAllRouteDetails = () => {
    fetch(
      `https://bustracker.pvta.com/InfoPoint/rest/RouteDetails/GetAllRouteDetails`
    )
      .then((res) => res.json())
      .then((res) => {
        setRouteDetails(res);
      });
  };

  const fetchKML = async () => {
    const parser = new DOMParser();

    for (const route of routeDetails.filter((r) => r.Vehicles.length > 0)) {
      await fetch(
        `https://bustracker.pvta.com/InfoPoint/Resources/Traces/${route.RouteTraceFilename}`
      )
        .then((res) => res.text())
        .then((res) => {
          const xml = parser.parseFromString(res, "text/xml");

          const geoJSON = toGeoJSON.kml(xml, { styles: true });

          setRoutesGeoJSON((prev) => [
            ...prev,
            { json: geoJSON, color: route.Color },
          ]);
        });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchVehicles, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchStops();
    fetchAllRouteDetails();
  }, []);

  useEffect(() => {
    fetchKML();
  }, [routeDetails]);

  return (
    <main className="relative w-screen h-screen">
      <div className="absolute bottom-0 z-50 flex w-full my-4">
        <div className="flex flex-col justify-self-center items-center justify-center w-full h-full">
          <span className="px-4 py-3 bg-gray-800 rounded-md bg-opacity-75">
            <span className="text-xl font-bold text-white">
              Only showing active routes
            </span>
          </span>
        </div>
      </div>
      <div className="absolute top-0 right-4 z-50 justify-end flex my-4 mx-auto">
        <div className="flex flex-col  space-y-1 w-full h-full">
          <span className="px-4 py-3 bg-gray-800 rounded-md bg-opacity-75">
            <span className="text-xl font-bold text-white">
              {vehicles.length} vehicles
            </span>
          </span>
          <span className="px-4 py-3 flex flex-col bg-gray-800 rounded-md bg-opacity-75">
            <span className="text-xl font-bold text-white">
              It&apos;s currently:
            </span>
            <span className="text-lg font-semibold text-white">
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
          </span>
        </div>
      </div>

      <Map routesGeoJSON={routesGeoJSON} vehicles={vehicles} />
    </main>
  );
}
