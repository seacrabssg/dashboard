import React from 'react';
import './MapComponent.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapEntries from './data/regional.json';

const MapComponent = () => {
    const position = [1.3521, 103.8198]; // SG center coordinates
    const zoom = 5; 
    const entries = Array.isArray(mapEntries) ? mapEntries : [mapEntries];
    
    // filter dataset by removing incomplete data
    const themes = [...new Set(entries.filter(e => !e.Longitude || !e.Latitude).map(e => e.Theme).filter(Boolean))];  //
    const [selectedThemes, setSelectedThemes] = useState(themes); // state for selected themes (initially all selected)
    const filteredEntries = entries.filter(entry =>
        selectedThemes.includes(entry.Theme) && entry.Latitude && entry.Longitude
    ); // filter entries based on selected themes

    // Toggle themes
    const toggleTheme = (theme) => {
        if (selectedThemes.includes(theme)) { //if already has theme, remove them
            setSelectedThemes(selectedThemes.filter(t => t !== theme));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    // Select all themes
    const selectAll = () => setSelectedThemes(themes);
    // Deselect all
    const deselectAll = () => setSelectedThemes([]);


    return (
        <div className='main'>
            <MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                />
                
                {/* Map through each entry and create a marker */}
                {filteredEntries.map((entry, index) => {
                    // Skip entries without valid coordinates
                    if (!entry.Latitude || !entry.Longitude) return null;
                    
                    return (
                        <Marker 
                            key={entry["Entry ID"] || index}
                            position={[entry.Latitude, entry.Longitude]}
                        >
                            <Popup>
                                <div className='map'>
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

            <div className='sidebar'>
                <h3>Filter by Theme</h3>
                <div className='buttons'>
                    <button onClick={selectAll}>Select All</button>
                    <button onClick={deselectAll}>Deselect All</button>
                </div>
                {themes.map(theme => (
                    <label key={theme}>
                        <input
                            type="checkbox"
                            checked={selectedThemes.includes(theme)}
                            onChange={() => toggleTheme(theme)}
                        />
                        {theme}
                    </label>
                ))}
                <div className='numOfEntries'> {/*/ make sure data has coordinates, or else the num of entries is inaccurate */}
                    Showing {filteredEntries.length} of {entries.length} entries
                </div>
            </div>
        </div>
        
    );
};

export default MapComponent;
