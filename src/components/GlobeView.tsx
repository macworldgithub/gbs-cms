// GlobeView.tsx
import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

// Random coordinates for simulating notifications
const generateRandomCoordinates = () => {
  const lat = Math.random() * 180 - 90; // Random latitude (-90 to 90)
  const lng = Math.random() * 360 - 180; // Random longitude (-180 to 180)
  return [lat, lng];
};

const GlobeView: React.FC = () => {
  useEffect(() => {
    // Initialize Mapbox
    mapboxgl.accessToken =
      "pk.eyJ1IjoibGVvbi1nYnMiLCJhIjoiY21jc3Eyam1kMTNhdDJqcTJwbzdtMWF2bSJ9.K3Jn-X37-Uy-J9hYU7XbQw";
    // Use your Mapbox access token

    const map = new mapboxgl.Map({
      container: "globe-view", // The ID of the div where the map will be rendered
      style: "mapbox://styles/mapbox/navigation-night-v1", // Choose a style that works for a globe-like view
      center: [0, 0], // Initial center of the map
      zoom: 1.5, // Adjust zoom level for globe
      pitch: 60, // Tilt the globe for 3D effect
      bearing: 0, // Rotation angle
      projection: "globe", // Set the map to a globe projection
    });

    // Wait for the style to load before adding layers
    map.on("style.load", () => {
      // Add 3D globe and the Earth after the style is loaded
      map.setFog({}); // Set up fog for a realistic 3D globe effect

      // Function to animate notification paths
      const animateNotification = (
        startCoords: [number, number],
        endCoords: [number, number]
      ) => {
        const lineLayer = {
          id: "path-animation",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [startCoords, endCoords], // From start to end coordinates
              },
            },
          },
          paint: {
            "line-color": "#ff6347", // Color for the path
            "line-width": 5, // Width of the path line
          },
        };

        // Add the line layer after the style has loaded
        if (!map.getLayer("path-animation")) {
          map.addLayer(lineLayer);
        }

        // Create a marker or animated point to move
        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(startCoords)
          .addTo(map);

        // Animation logic to move the marker
        const startTime = Date.now();
        const duration = 5000; // Duration of the animation (in milliseconds)

        const animate = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          const lat =
            startCoords[0] + progress * (endCoords[0] - startCoords[0]);
          const lng =
            startCoords[1] + progress * (endCoords[1] - startCoords[1]);

          marker.setLngLat([lat, lng]);

          if (progress < 1) {
            requestAnimationFrame(animate); // Keep animating until the progress reaches 100%
          }
        };

        animate();
      };

      // Dummy Notification animation (animate random points every few seconds)
      const animateRandomNotifications = () => {
        const randomStart = generateRandomCoordinates();
        const randomEnd = generateRandomCoordinates();

        animateNotification(randomStart, randomEnd);

        // Repeat animation every 6 seconds with new random points
        setInterval(() => {
          const newRandomStart = generateRandomCoordinates();
          const newRandomEnd = generateRandomCoordinates();
          animateNotification(newRandomStart, newRandomEnd);
        }, 6000); // Adjust time interval for your use case
      };

      // Start random notification animation
      animateRandomNotifications();
    });

    return () => {
      map.remove(); // Clean up on component unmount
    };
  }, []);

  return <div id="globe-view" style={{ width: "100%", height: "600px" }}></div>;
};

export default GlobeView;
