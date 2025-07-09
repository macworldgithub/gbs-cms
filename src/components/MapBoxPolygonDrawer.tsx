import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
//@ts-ignore
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Use a public Mapbox token for development
mapboxgl.accessToken =
  "pk.eyJ1IjoibGVvbi1nYnMiLCJhIjoiY21jc3Eyam1kMTNhdDJqcTJwbzdtMWF2bSJ9.K3Jn-X37-Uy-J9hYU7XbQw";

type Props = {
  coordinates: string;
  setCoordinates: (coords: string) => void;
};

const MapboxPolygonDrawer: React.FC<Props> = ({
  coordinates,
  setCoordinates,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [features, setFeatures] = useState<any[]>([]);
  const [activePolygonIndex, setActivePolygonIndex] = useState(0);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (map.current) {
      const geocoder = new MapboxGeocoder({
        //@ts-ignore
        accessToken: mapboxgl.accessToken,
        //@ts-ignore
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: "Search location...",
      });
      //@ts-ignore
      map.current.addControl(geocoder, "top-left");
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [67.0011, 24.8607], // Karachi coordinates
      zoom: 10,
    });

    const geocoder = new MapboxGeocoder({
      //@ts-ignore
      accessToken: mapboxgl.accessToken,
      //@ts-ignore
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search location...",
    });
    map.current.addControl(geocoder, "top-left");

    // Initialize draw controls
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
      styles: [
        // Polygon fill
        {
          id: "gl-draw-polygon-fill-inactive",
          type: "fill",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "fill-color": "#3bb2d0",
            "fill-outline-color": "#3bb2d0",
            "fill-opacity": 0.1,
          },
        },
        {
          id: "gl-draw-polygon-fill-active",
          type: "fill",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          paint: {
            "fill-color": "#fbb03b",
            "fill-outline-color": "#fbb03b",
            "fill-opacity": 0.1,
          },
        },
        // Polygon stroke
        {
          id: "gl-draw-polygon-stroke-inactive",
          type: "line",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3bb2d0",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-polygon-stroke-active",
          type: "line",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#fbb03b",
            "line-width": 2,
          },
        },
        // Vertex points
        {
          id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "circle-radius": 5,
            "circle-color": "#fff",
          },
        },
        {
          id: "gl-draw-polygon-and-line-vertex-inactive",
          type: "circle",
          filter: [
            "all",
            ["==", "meta", "vertex"],
            ["==", "$type", "Point"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "circle-radius": 3,
            "circle-color": "#fbb03b",
          },
        },
      ],
    });

    // Add draw control to map
    map.current.addControl(draw.current);

    // Map event handlers
    map.current.on("load", () => {
      setIsMapLoaded(true);
      console.log("Map loaded successfully");

      // Load existing coordinates if available
      if (coordinates && draw.current) {
        loadExistingPolygon();
      }
    });

    // Draw event handlers
    const updateCoordinates = () => {
      if (!draw.current) return;

      const data = draw.current.getAll();
      const polygons = data.features.filter(
        (f) => f.geometry.type === "Polygon"
      );

      setFeatures(polygons);

      if (polygons.length > 0) {
        setActivePolygonIndex(polygons.length - 1);
        setCoordinates(
          //@ts-ignore
          JSON.stringify(polygons.map((p) => p.geometry.coordinates))
        );
      } else {
        setCoordinates("");
        setActivePolygonIndex(0);
      }
    };

    map.current.on("draw.create", updateCoordinates);
    map.current.on("draw.update", updateCoordinates);
    map.current.on("draw.delete", () => {
      console.log("Polygon deleted");
      setCoordinates("");
    });

    const loadExistingPolygon = () => {
      if (!coordinates || !draw.current) return;

      try {
        console.log("Loading existing coordinates:", coordinates);
        const parsed: number[][][][] = JSON.parse(coordinates); // MultiPolygon

        draw.current.deleteAll();

        // Store all polygons' features
        const featuresArray: any[] = [];

        parsed.forEach((polygonCoords) => {
          const feature = {
            type: "Feature" as const,
            geometry: {
              type: "Polygon" as const,
              coordinates: polygonCoords, // [[[lng, lat], ...]]
            },
            properties: {},
          };
          draw.current?.add(feature);
          featuresArray.push(feature);
        });

        console.log("Polygons loaded successfully");

        // Fit bounds to ALL polygons
        const bounds = new mapboxgl.LngLatBounds();
        parsed.forEach((polygonCoords) => {
          polygonCoords[0].forEach((coord: number[]) => {
            //@ts-ignore
            bounds.extend(coord);
          });
        });
        map.current?.fitBounds(bounds, { padding: 50 });

        setFeatures(draw.current.getAll().features); // Set features state
        setActivePolygonIndex(0); // Reset active view
      } catch (err) {
        console.error("Error loading polygons:", err);
      }
    };

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update polygon when coordinates change externally
  useEffect(() => {
    if (!isMapLoaded || !draw.current) return;

    if (coordinates) {
      try {
        console.log("External coordinates update:", coordinates);
        const parsed: number[][][][] = JSON.parse(coordinates); // MultiPolygon format

        draw.current.deleteAll();

        // Add each polygon from MultiPolygon
        parsed.forEach((polygonCoords) => {
          const feature = {
            type: "Feature" as const,
            geometry: {
              type: "Polygon" as const,
              coordinates: polygonCoords, // [[[lng, lat], ...]]
            },
            properties: {},
          };
          draw.current?.add(feature);
        });

        // Fit map to bounds of all polygons
        const bounds = new mapboxgl.LngLatBounds();
        parsed.forEach((polygonCoords) => {
          polygonCoords[0].forEach((coord: number[]) => {
            //@ts-ignore
            bounds.extend(coord);
          });
        });
        map.current?.fitBounds(bounds, { padding: 50 });

        // Optionally: update feature list & reset active index
        setFeatures(draw.current.getAll().features);
        setActivePolygonIndex(0);
      } catch (err) {
        console.error("Error updating polygons:", err);
      }
    } else {
      draw.current.deleteAll();
    }
  }, [coordinates, isMapLoaded]);

  useEffect(() => {
    if (!map.current || features.length === 0) return;

    const current = features[activePolygonIndex];
    if (!current || !current.geometry.coordinates[0]) return;

    const bounds = new mapboxgl.LngLatBounds();
    current.geometry.coordinates[0].forEach((coord: number[]) => {
      //@ts-ignore
      bounds.extend(coord);
    });
    map.current.fitBounds(bounds, { padding: 50 });
  }, [activePolygonIndex, features]);

  return (
    <div className="space-y-3">
      <div
        ref={mapContainer}
        className="w-full h-80 border-2 border-gray-300 rounded-lg shadow-sm"
        style={{ minHeight: "320px" }}
      />
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          {features.length > 1 && (
            <div className="flex justify-center space-x-4 mt-2">
              <button
                type="button"
                onClick={() =>
                  setActivePolygonIndex(
                    (i) => (i - 1 + features.length) % features.length
                  )
                }
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setActivePolygonIndex((i) => (i + 1) % features.length)
                }
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Next →
              </button>
            </div>
          )}
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to use:</p>
            <ul className="space-y-1 text-xs">
              <li>• Click the polygon tool (square icon) to start drawing</li>
              <li>• Click on the map to add points for your polygon</li>
              <li>• Double-click or press Enter to complete the polygon</li>
              <li>• Use the trash tool to delete polygons</li>
              <li>• Click and drag existing points to modify the shape</li>
            </ul>
          </div>
        </div>
      </div>
      {/* {coordinates && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-medium mb-1">
            Current Coordinates:
          </p>
          <pre className="text-xs text-gray-800 bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(JSON.parse(coordinates), null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
};

export default MapboxPolygonDrawer;
