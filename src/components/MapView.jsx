import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import "./MapView.css";

//Helper component enables scroll zoom after map is clicked
function EnableScrollOnClick() {
  const map = useMap();

  useEffect(() => {
    const enableScroll = () => map.scrollWheelZoom.enable();
    const disableScroll = () => map.scrollWheelZoom.disable();

    disableScroll(); // initially disables scroll zoom
    map.on("click", enableScroll);

    return () => {
      map.off("click", enableScroll);
    };
  }, [map]);

  return null;
}

function ForceMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 0); // delay ensures the container is ready
  }, [map]);

  return null;
}

export default function MapView({ center, zoom = 13, markers = [] }) {
  if (!center) return null;

  return (
    <div className="map-wrapper">
     
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="leaflet-map"
      >
        <EnableScrollOnClick />
        <ForceMapResize />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {markers.map(({ position, label }, i) => (
          <Marker key={i} position={position}>
            {label && <Popup>{label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}