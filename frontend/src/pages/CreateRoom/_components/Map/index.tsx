import React, { useState, useEffect } from 'react';

import { useNaverMap } from '@/hooks/useNaverMap';

import { defaultValue } from '../..';

import { getMyLatLng } from '@/utils';

interface MapProps {
  radius: number;
  updateLatLng: (lat: number, lng: number) => void;
}

export function Map({ radius, updateLatLng }: MapProps) {
  const { map, mapRef } = useNaverMap({
    lat: defaultValue.lat,
    lng: defaultValue.lng,
    zoom: 15,
  });

  const [centerLatLng, setCenterLatLng] = useState(new naver.maps.LatLng(defaultValue.lat, defaultValue.lng));

  return (
    <div className="relative size-full">
      <div className="size-full" ref={mapRef} />

      {map && (
        <>
          <MapEvent map={map} setCenterLatLng={setCenterLatLng} updateLatLng={updateLatLng} />
          <MapOverlays map={map} centerLatLng={centerLatLng} radius={radius} />
          <MapGpsButton map={map} />
        </>
      )}
    </div>
  );
}

interface MapGpsButtonProps {
  map: naver.maps.Map;
}

function MapGpsButton({ map }: MapGpsButtonProps) {
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const handleGpsButtonClick = async () => {
    setIsGpsLoading(true);

    const latLng = await getMyLatLng();

    if (!latLng) {
      return;
    }

    map.setCenter(new naver.maps.LatLng(latLng.lat, latLng.lng));

    setIsGpsLoading(false);
  };

  return (
    <div className="absolute bottom-0 left-0 m-3 cursor-pointer bg-black p-2" onClick={handleGpsButtonClick}>
      <p className="text-sm text-white">{isGpsLoading ? '로딩 중...' : '내 위치로 이동'}</p>
    </div>
  );
}

interface MapEvent extends Pick<MapProps, 'updateLatLng'> {
  map: naver.maps.Map;
  setCenterLatLng: React.Dispatch<React.SetStateAction<naver.maps.LatLng>>;
}

function MapEvent({ map, updateLatLng, setCenterLatLng }: MapEvent) {
  useEffect(() => {
    const handleMapCenterChange = (center: naver.maps.Coord) => {
      const { x: lng, y: lat } = center;

      setCenterLatLng(new naver.maps.LatLng(lat, lng));

      updateLatLng(lat, lng);
    };

    const centerChangedEventListener = naver.maps.Event.addListener(map, 'center_changed', handleMapCenterChange);

    return () => {
      naver.maps.Event.removeListener(centerChangedEventListener);
    };
  }, []);

  return null;
}

interface MapOverlaysProps extends Pick<MapProps, 'radius'> {
  map: naver.maps.Map;
  centerLatLng: naver.maps.LatLng;
}

function MapOverlays({ map, radius, centerLatLng }: MapOverlaysProps) {
  const [circle, setCircle] = useState<naver.maps.Circle | null>(null);
  const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * circle, polyline, marker 오버레이 생성
   */
  useEffect(() => {
    const circle = new naver.maps.Circle({
      map,
      center: centerLatLng,
      radius: radius * 1000,
      fillColor: '#000000',
      fillOpacity: 0.05,
      strokeColor: '#000000',
      strokeWeight: 2,
    });

    setCircle(circle);

    const polyline = new naver.maps.Polyline({
      map,
      path: [centerLatLng, centerLatLng.destinationPoint(90, 1000)],
      strokeColor: '#000000',
      strokeWeight: 2,
    });

    setPolyline(polyline);

    const marker = new naver.maps.Marker({
      map,
      icon: {
        content: `<div class="text-xs select-none">${radius}km</div>`,
      },
      position: centerLatLng.destinationPoint(90, 500),
      clickable: false,
    });

    setMarker(marker);

    return () => {
      circle.setMap(null);
      polyline.setMap(null);
      marker.setMap(null);
    };
  }, [map]);

  /**
   * 화면 위치 혹은 반경이 달라질 경우, 오버레이 위치 변경
   */
  useEffect(() => {
    if (circle) {
      circle.setRadius(radius * 1000);
      circle.setCenter(centerLatLng);
    }

    if (polyline) {
      polyline.setPath([centerLatLng, centerLatLng.destinationPoint(90, radius * 1000)]);
    }

    if (marker) {
      marker.setIcon({ content: `<div class="text-xs select-none">${radius}km</div>` });
      marker.setPosition(centerLatLng.destinationPoint(90, (radius * 1000) / 2));
    }
  }, [circle, polyline, marker, centerLatLng, radius]);

  return null;
}
