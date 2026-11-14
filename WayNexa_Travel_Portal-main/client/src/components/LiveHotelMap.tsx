import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Car,
  Crosshair,
  MapPin,
  Navigation,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWayNexa } from "../context/WayNexa";
import type { Stay } from "../data/catalog";
import {
  calculateHaversineDistanceKm,
  estimateTravelTime,
  fetchMapboxDrivingRoute,
  formatDistance,
  type GeoCoordinate,
  type MapboxRouteResult,
} from "../lib/geoUtils";

type MapStyle = "streets" | "outdoors" | "satellite";

type LiveHotelMapProps = {
  stays: Stay[];
  selectedStayId?: string | null;
  onSelectStay?: (stay: Stay) => void;
  userCoords?: GeoCoordinate | null;
  className?: string;
  height?: string;
};

export default function LiveHotelMap({
  stays,
  selectedStayId,
  onSelectStay,
  userCoords,
  className = "",
  height = "100%",
}: LiveHotelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { formatPrice } = useWayNexa();
  const [activePopupStay, setActivePopupStay] = useState<Stay | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>("streets");
  const [liveRoadRoute, setLiveRoadRoute] = useState<MapboxRouteResult | null>(null);

  const mapboxToken = import.meta.env.VITE_MAP_PUBLIC_KEY || "";
  const isMapboxActive = Boolean(mapboxToken);

  // Helper to get Tile URL for selected style
  const getTileUrl = (style: MapStyle) => {
    if (isMapboxActive) {
      if (style === "satellite") {
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;
      }
      if (style === "outdoors") {
        return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;
      }
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`;
    }
    return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = stays[0]?.lat || 20.2961;
    const initialLng = stays[0]?.lng || 85.8245;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 6,
      zoomControl: false,
    });

    const tileLayer = L.tileLayer(getTileUrl(mapStyle), {
      attribution: isMapboxActive
        ? '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        : '© <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      tileSize: 256,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    L.control.zoom({ position: "topright" }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const nextTile = L.tileLayer(getTileUrl(mapStyle), {
      attribution: isMapboxActive
        ? '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        : '© <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      tileSize: 256,
    }).addTo(map);

    tileLayerRef.current = nextTile;
  }, [mapStyle, isMapboxActive, mapboxToken]);

  // Update Markers when stays or selectedStayId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    stays.forEach((stay) => {
      const isSelected = stay.id === selectedStayId;
      const formattedPrice = formatPrice(stay.price);

      // Custom HTML Marker Pill
      const customIcon = L.divIcon({
        className: "custom-hotel-pin",
        html: `
          <div class="cursor-pointer transition duration-200 transform ${
            isSelected ? "scale-110 z-50" : "hover:scale-105"
          }">
            <div class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black shadow-xl ${
              isSelected
                ? "bg-[#183927] text-white ring-2 ring-white"
                : "bg-white text-slate-900 border border-slate-200 hover:bg-[#eef4e9]"
            }">
              <span>${formattedPrice}</span>
              <span class="text-amber-500 text-[10px]">★${stay.rating}</span>
            </div>
            <div class="w-1.5 h-1.5 mx-auto bg-[#183927] rounded-full mt-0.5 shadow-sm"></div>
          </div>
        `,
        iconSize: [80, 32],
        iconAnchor: [40, 32],
      });

      const marker = L.marker([stay.lat, stay.lng], { icon: customIcon });

      marker.on("click", () => {
        setActivePopupStay(stay);
        if (onSelectStay) onSelectStay(stay);
        map.flyTo([stay.lat, stay.lng], 13, { duration: 0.8 });
      });

      markersLayer.addLayer(marker);
    });

    // Fit bounds if multiple stays
    if (stays.length > 0 && !selectedStayId) {
      const bounds = L.latLngBounds(stays.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [stays, selectedStayId, formatPrice, onSelectStay]);

  // Center on Selected Stay & Fetch Mapbox Real-Road Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStayId) return;

    const targetStay = stays.find((s) => s.id === selectedStayId);
    if (!targetStay) return;

    setActivePopupStay(targetStay);
    map.flyTo([targetStay.lat, targetStay.lng], 13, { duration: 0.8 });

    // Fetch and Draw Real Road Driving Route with Mapbox Directions API
    if (userCoords) {
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }

      fetchMapboxDrivingRoute(
        userCoords,
        { lat: targetStay.lat, lng: targetStay.lng },
        mapboxToken
      ).then((roadResult) => {
        if (!mapInstanceRef.current) return;

        if (roadResult && roadResult.coordinates.length > 0) {
          setLiveRoadRoute(roadResult);

          // Draw real road driving path following all streets and highways
          const polyline = L.polyline(roadResult.coordinates, {
            color: "#183927",
            weight: 4,
            opacity: 0.9,
            lineJoin: "round",
          }).addTo(mapInstanceRef.current);

          routeLineRef.current = polyline;

          // Fit bounds to show entire driving route
          const bounds = polyline.getBounds();
          mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
        } else {
          // Fallback to straight dashed line if route is intercontinental or outside road network
          setLiveRoadRoute(null);
          const straightLine = L.polyline(
            [
              [userCoords.lat, userCoords.lng],
              [targetStay.lat, targetStay.lng],
            ],
            {
              color: "#183927",
              weight: 3,
              dashArray: "6, 8",
              opacity: 0.8,
            }
          ).addTo(mapInstanceRef.current);
          routeLineRef.current = straightLine;
        }
      });
    }
  }, [selectedStayId, stays, userCoords, mapboxToken]);

  // Update User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userCoords) {
      const userIcon = L.divIcon({
        className: "user-gps-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute size-7 rounded-full bg-blue-500/30 animate-ping"></span>
            <span class="relative size-4 rounded-full bg-blue-600 ring-2 ring-white shadow-md"></span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip(userCoords.name || "Your Current Location", {
          permanent: false,
          direction: "top",
        });

      userMarkerRef.current = userMarker;
    }
  }, [userCoords]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userCoords) {
      map.flyTo([userCoords.lat, userCoords.lng], 12, { duration: 0.8 });
    } else if (stays.length > 0) {
      const bounds = L.latLngBounds(stays.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  };

  // Calculate live distance for active popup
  const activeDistanceInfo = activePopupStay && userCoords
    ? (() => {
        const distKm = calculateHaversineDistanceKm(
          userCoords.lat,
          userCoords.lng,
          activePopupStay.lat,
          activePopupStay.lng
        );
        const est = estimateTravelTime(distKm);
        return { distKm, formattedDist: formatDistance(distKm), est };
      })()
    : null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-slate-200 ${className}`}
      style={{ height }}
    >
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Mapbox Controls & Layers Toggle */}
      <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          title="Center on My Location / Stays"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
        >
          <Navigation size={13} className="text-[#387a43]" /> Recenter
        </button>

        {/* Mapbox Layer Switcher */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur">
          {(["streets", "outdoors", "satellite"] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setMapStyle(style)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition ${
                mapStyle === style
                  ? "bg-[#183927] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {isMapboxActive && (
          <span className="flex items-center gap-1 rounded-xl bg-slate-900/80 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
            <Sparkles size={11} className="text-[#d8fbcc]" /> Mapbox HD Active
          </span>
        )}
      </div>

      {/* Floating Interactive Hotel Info Popup */}
      {activePopupStay && (
        <div className="absolute bottom-5 inset-x-5 z-20 mx-auto max-w-sm rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200/90 sm:inset-x-auto sm:right-5">
          <button
            type="button"
            onClick={() => setActivePopupStay(null)}
            className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={14} />
          </button>

          <div className="flex gap-3.5 items-center">
            <img
              src={activePopupStay.image}
              alt={activePopupStay.name}
              className="size-20 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#387a43]">
                {activePopupStay.type}
              </span>
              <h4 className="text-sm font-black text-slate-900 truncate">
                {activePopupStay.name}
              </h4>
              <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                {activePopupStay.destination}, {activePopupStay.state}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-black text-[#183927]">
                  {formatPrice(activePopupStay.price)}
                  <span className="text-[10px] font-normal text-slate-400"> / night</span>
                </span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-amber-700">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {activePopupStay.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Live Road Route / Distance Badge */}
          {liveRoadRoute ? (
            <div className="mt-3 rounded-xl bg-[#183927] p-2.5 text-xs text-white shadow-sm">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-[#d8fbcc]">
                  <Car size={13} /> {liveRoadRoute.distanceKm} km (Live Road Route)
                </span>
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                  Mapbox GPS
                </span>
              </div>
              <p className="mt-1 text-[11px] text-white/80">
                {liveRoadRoute.summaryText}
              </p>
            </div>
          ) : activeDistanceInfo ? (
            <div className="mt-3 rounded-xl bg-[#eef4e9] p-2.5 text-xs text-[#245239]">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  <Crosshair size={13} /> {activeDistanceInfo.formattedDist} away
                </span>
                <span className="text-[11px] text-slate-600 font-semibold">
                  {activeDistanceInfo.est.badge}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600">
                {activeDistanceInfo.est.text}
              </p>
            </div>
          ) : null}

          {/* Nearby Key Landmark */}
          {activePopupStay.landmarks?.[0] && (
            <p className="mt-2 text-[11px] text-slate-500 font-medium">
              📍 {activePopupStay.landmarks[0].distanceKm} km from {activePopupStay.landmarks[0].name} ({activePopupStay.landmarks[0].timeMinutes} min {activePopupStay.landmarks[0].mode})
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activePopupStay.lat},${activePopupStay.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#387a43] hover:underline"
            >
              Get Directions ↗
            </a>
            <Link
              to={`/hotels/${activePopupStay.id}`}
              className="rounded-xl bg-[#183927] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#245239]"
            >
              View & Reserve
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
