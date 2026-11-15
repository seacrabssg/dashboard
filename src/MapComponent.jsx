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
    const themes = [...new Set(entries.filter(e => e.Longitude && e.Latitude).map(e => e.Theme).filter(Boolean))]; 
    const [selectedThemes, setSelectedThemes] = useState(themes); // state for selected themes (initially all selected)
    const filteredEntries = entries.filter(entry =>
        selectedThemes.includes(entry.Theme) && entry.Latitude && entry.Longitude
    ); // filter entries based on selected themes

    // toggle themes
    const toggleTheme = (theme) => {
        if (selectedThemes.includes(theme)) { //if already has theme, remove them
            setSelectedThemes(selectedThemes.filter(t => t !== theme));
        } else {
            setSelectedThemes([...selectedThemes, theme]);
        }
    };

    //select all themes
    const selectAll = () => setSelectedThemes(themes);
    //remove all themes
    const deselectAll = () => setSelectedThemes([]);

    //Colours of markers are hardcoded according to their themes
    const themeColors = { 
        "Energy Transition": "red",
        "Land Reclamation": "blue",
        "Artificial Intelligence and Data Centers": "black",
        "Agriculture-driven Deforestation": "brown"
    };

    function createColoredIcon(color) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color:${color}; width:18px; height:18px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconAnchor: [9, 9], //middle
            popupAnchor: [0, -9] //cover the whole button size
        });
    }

    const [clickedEntry, setClickedEntry] = useState();
    function handleClickedEntry(entry) {
        useEffect(() => {
            setClickedEntry(entry);
        }, [setClickedEntry]);
    }

    return (
        <div className='main'>
            <MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                />
                
                {/* map through each entry and create a marker */}
                {filteredEntries.map((entry, index) => {
                    // skip entries without valid coordinates
                    if (!entry.Latitude || !entry.Longitude) return null;
                    
                    return (
                        <Marker 
                            key={entry["Entry ID"] || index}
                            position={[entry.Latitude, entry.Longitude]}
                            icon={createColoredIcon(themeColors[entry.Theme] || "#888")}
                            eventHandlers={{
                                click: () => setClickedEntry(entry),
                                touchstart: () => setClickedEntry(entry),
                            }}
                        >
                            
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
                <div className='numOfEntries'> 
                    Showing {filteredEntries.length} of {entries.length} entries
                </div>
                {!clickedEntry ? <p>Please click on an item.</p> 
                : <div className='map' >
                    <h3>{clickedEntry.Title}</h3>
                    <p>
                        <strong>Status:</strong> {clickedEntry.Status}
                    </p>
                    <p>
                        <strong>Location:</strong> {clickedEntry["Name of Location"]}
                    </p>
                    <p>
                        <strong>Country:</strong> {clickedEntry["Country (place-based)"]}
                    </p>
                    <p>
                        <strong>Theme:</strong> {clickedEntry.Theme}
                    </p>
                    <p>
                        <strong>Type:</strong> {clickedEntry["Type of Entry"]}
                    </p>
                    <p>
                        <strong>Affected Population:</strong> {clickedEntry["Affected Population"]}
                    </p>
                    <details>
                        <summary>View Summary</summary>
                        <p>
                            {clickedEntry.Summary}
                        </p>
                    </details>
                </div>}
            </div> {/* sidebar */}
        </div> /* main */
        
    );
};

export default MapComponent;
