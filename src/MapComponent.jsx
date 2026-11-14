import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import mapEntries from './data/regional.json';

const MapComponent = () => {
    const position = [1.3521, 103.8198]; // Singapore center coordinates
    const zoom = 5; 
    const entries = Array.isArray(mapEntries) ? mapEntries : [mapEntries];

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />
            
            {/* Map through each entry and create a marker */}
            {entries.map((entry, index) => {
                // Skip entries without valid coordinates
                if (!entry.Latitude || !entry.Longitude) return null;
                
                return (
                    <Marker 
                        key={entry["Entry ID"] || index}
                        position={[entry.Latitude, entry.Longitude]}
                    >
                        <Popup>
                            <div className='popup'>
                                <h3>{entry.Title}</h3>
                                <p>
                                    <strong>Status:</strong> {entry.Status}
                                </p>
                                <p>
                                    <strong>Location:</strong> {entry["Name of Location"]}
                                </p>
                                <p>
                                    <strong>Country:</strong> {entry["Country (place-based)"]}
                                </p>
                                <p>
                                    <strong>Theme:</strong> {entry.Theme}
                                </p>
                                <p>
                                    <strong>Type:</strong> {entry["Type of Entry"]}
                                </p>
                                <p>
                                    <strong>Affected Population:</strong> {entry["Affected Population"]}
                                </p>
                                <details>
                                    <summary>View Summary</summary>
                                    <p>
                                        {entry.Summary}
                                    </p>
                                </details>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapComponent;
