"use client";
import { useEffect, useState } from "react";
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

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-2xl font-bold text-white">Loading...</span>
    </div>
  ),
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [routeIds, setRouteIds] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<RouteVehicle[]>([]);
  const [routesGeoJSON, setRoutesGeoJSON] = useState<any[]>([]);
  const [routeDetails, setRouteDetails] = useState<RouteDetails[]>([]);

  const fetchVehicles = (ids: string[]) => {
    return fetch(
      `https://bustracker.pvta.com/InfoPoint/rest/Vehicles/GetAllVehiclesForRoutes?routeIDs=${ids.join(
        ","
      )}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res || res !== null) {
          setVehicles(res);
        }
      });
  };

  const fetchAllRouteDetails = () => {
    fetch(
      `https://bustracker.pvta.com/InfoPoint/rest/RouteDetails/GetAllRouteDetails`
    )
      .then((res) => res.json())
      .then((res: RouteDetails[]) => {
        setRouteDetails(res);
        console.log(res.map((r) => r.RouteId.toString()));
        setRouteIds(res.map((r) => r.RouteId.toString()));
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
    const intervalId = setInterval(fetchVehicles, 5000, routeIds);

    return () => {
      clearInterval(intervalId);
    };
  }, [routeIds]);

  useEffect(() => {
    fetchAllRouteDetails();
  }, []);

  useEffect(() => {
    fetchVehicles(routeIds).then(() => setLoading(false));
  }, [routeIds]);

  useEffect(() => {
    fetchKML();
  }, [routeDetails]);

  return (
    <main className="relative w-screen h-screen">
      <div className="absolute bottom-0 z-50 flex w-full my-4">
        <div className="flex flex-col items-center justify-center w-full h-full justify-self-center">
          <span className="px-4 py-3 bg-gray-800 bg-opacity-75 rounded-md">
            <span className="text-xl font-bold text-white">
              {loading ? "Initializing..." : "Only showing active routes"}
            </span>
          </span>
        </div>
      </div>
      <div className="absolute top-0 z-50 flex justify-end mx-auto my-4 right-4">
        <div className="flex flex-col w-full h-full space-y-1">
          <span className="px-4 py-3 bg-gray-800 bg-opacity-75 rounded-md">
            <span className="text-xl font-bold text-white">
              {vehicles?.length} vehicles
            </span>
          </span>
          <span className="flex flex-col px-4 py-3 bg-gray-800 bg-opacity-75 rounded-md">
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
          <span className="flex flex-col px-4 py-3 bg-gray-800 bg-opacity-75 rounded-md">
            <a
              href="https://github.com/jackmerrill/pvta-realtime-map"
              target="_blank"
              className="text-xl font-bold text-white"
            >
              View on GitHub
            </a>
          </span>
        </div>
      </div>

      <Map
        routesGeoJSON={routesGeoJSON}
        vehicles={vehicles}
        routeDetails={routeDetails}
      />
    </main>
  );
}
