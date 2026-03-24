/**
 * components/ui/LiveTrackingMap.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Google Maps component for live delivery tracking.
 *
 * Two modes:
 *   • "customer"  — shows delivery partner marker moving in real-time
 *   • "delivery"  — shows customer location pin
 *
 * Falls back to a visual placeholder when no Google Maps API key is set.
 * Uses NEXT_PUBLIC_GOOGLE_MAPS_API_KEY from env vars.
 */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveTrackingMapProps {
  mode: "customer" | "delivery";
  /** Customer lat/lng (shown to delivery partner) */
  customerLat?: number;
  customerLng?: number;
  /** Delivery partner lat/lng (shown to customer) */
  deliveryLat?: number;
  deliveryLng?: number;
  /** Optional: subscribe to real-time updates */
  onLocationUpdate?: (lat: number, lng: number) => void;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const DEFAULT_CENTER = { lat: 19.076, lng: 72.8777 }; // Mumbai

// ─── Component ────────────────────────────────────────────────────────────────

export function LiveTrackingMap({
  mode,
  customerLat,
  customerLng,
  deliveryLat,
  deliveryLng,
  onLocationUpdate,
  className = "",
}: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const destMarkerRef = useRef<google.maps.Marker | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!MAPS_API_KEY) return;
    if (typeof google !== "undefined" && google.maps) {
      setMapLoaded(true);
      return;
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      existing.addEventListener("load", () => setMapLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const center = mode === "delivery" && customerLat && customerLng
      ? { lat: customerLat, lng: customerLng }
      : deliveryLat && deliveryLng
      ? { lat: deliveryLat, lng: deliveryLng }
      : DEFAULT_CENTER;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });
    mapInstance.current = map;

    // Destination marker
    if (mode === "delivery" && customerLat && customerLng) {
      destMarkerRef.current = new google.maps.Marker({
        position: { lat: customerLat, lng: customerLng },
        map,
        title: "Customer Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        },
      });
    }

    if (mode === "customer" && deliveryLat && deliveryLng) {
      markerRef.current = new google.maps.Marker({
        position: { lat: deliveryLat, lng: deliveryLng },
        map,
        title: "Delivery Partner",
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#8b5cf6",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
          rotation: 0,
        },
      });
    }

    return () => {
      markerRef.current = null;
      destMarkerRef.current = null;
    };
  }, [mapLoaded, mode, customerLat, customerLng, deliveryLat, deliveryLng]);

  // Watch delivery partner position (for delivery mode)
  const startWatching = useCallback(() => {
    if (!navigator.geolocation || watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationUpdate?.(latitude, longitude);

        if (mapInstance.current && markerRef.current) {
          const newPos = new google.maps.LatLng(latitude, longitude);
          markerRef.current.setPosition(newPos);
          mapInstance.current.panTo(newPos);
        }
      },
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    setWatchId(id);
  }, [onLocationUpdate, watchId]);

  useEffect(() => {
    if (mode === "delivery" && mapLoaded) {
      startWatching();
    }
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [mode, mapLoaded, startWatching, watchId]);

  // Update marker position for customer view
  useEffect(() => {
    if (mode === "customer" && markerRef.current && deliveryLat && deliveryLng) {
      markerRef.current.setPosition({ lat: deliveryLat, lng: deliveryLng });
      mapInstance.current?.panTo({ lat: deliveryLat, lng: deliveryLng });
    }
  }, [mode, deliveryLat, deliveryLng]);

  // ─── Placeholder (no API key) ───────────────────────────────────────────────

  if (!MAPS_API_KEY) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}
        style={{ minHeight: 300 }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700">Live Tracking Map</p>
            <p className="text-xs text-slate-400 mt-1">
              {mode === "customer"
                ? "Track your delivery partner in real-time"
                : "Navigate to customer location"}
            </p>
          </div>
          {mode === "delivery" && customerLat && customerLng && (
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100">
              <Navigation className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-slate-600">
                Customer: {customerLat.toFixed(4)}, {customerLng.toFixed(4)}
              </span>
            </div>
          )}
          <p className="text-[10px] text-slate-400 bg-amber-50 px-3 py-1 rounded-full">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable
          </p>
        </div>

        {/* Decorative grid lines to simulate map */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>
    );
  }

  // ─── Map container ──────────────────────────────────────────────────────────

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ minHeight: 300 }}>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 300 }} />
    </div>
  );
}

export default LiveTrackingMap;
