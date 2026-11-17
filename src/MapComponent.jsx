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
        "Artificial Intelligence and Data Centers": "orange",
        "Agriculture-driven Deforestation": "green"
    };

    function createColoredIcon(color, isSelected = false) {
    const size = isSelected ? 24 : 18;
    
    return L.divIcon({
        className: `custom-marker ${isSelected ? 'selected-marker' : ''}`,
        html: `<div style="
            background-color:${color}; 
            width:${size}px; 
            height:${size}px; 
            border-radius:50%; 
            border:2px solid white; 
            transition: all 0.3s ease;
            ${isSelected ? 'transform: scale(1.001);' : ''}
            ${isSelected ? '' : 'opacity: 60%'}
        "></div>`,
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
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
            <div className="map-wrapper">
                <MapContainer center={position} zoom={zoom} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                    />
                    
                    {/* map through each entry and create a marker */}
                    {filteredEntries.map((entry, index) => {
                        // skip entries without valid coordinates
                        if (!entry.Latitude || !entry.Longitude) return null;

                        // Check if this entry is currently selected
                        const isSelected = clickedEntry && clickedEntry["Entry ID"] === entry["Entry ID"];
                        
                        return (
                            <Marker 
                                key={entry["Entry ID"] || index}
                                position={[entry.Latitude, entry.Longitude]}
                                icon={createColoredIcon(themeColors[entry.Theme] || "#888",  isSelected)}
                                eventHandlers={{
                                    click: () => setClickedEntry(entry),
                                    touchstart: () => setClickedEntry(entry),
                                }}
                            >
                                
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
            
            <div className='sidebar'>
                <div className='sidebar-header'>
                    <h2>🗺️ Map Explorer</h2>
                    <p className='sidebar-subtitle'>Explore and filter data points</p>
                </div>

                <div className='filter-section'>
                    <h3>
                        <span className='filter-icon'>🔍</span> 
                        Filter by Theme
                    </h3>
                    <div className='buttons'>
                        <button className='btn-select-all' onClick={selectAll}>
                            ✓ Select All
                        </button>
                        <button className='btn-deselect-all' onClick={deselectAll}>
                            ✕ Deselect All
                        </button>
                    </div>
                    <div className='checkbox-group'>
                        {themes.map(theme => (
                            <label key={theme} className='checkbox-label'>
                                <input
                                    type="checkbox"
                                    checked={selectedThemes.includes(theme)}
                                    onChange={() => toggleTheme(theme)}
                                    className='checkbox-input'
                                />
                                <span className='checkbox-custom'>
                                    <span 
                                        className='color-dot' 
                                        style={{backgroundColor: themeColors[theme] || "#888"}}
                                    ></span>
                                    {theme}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className='entry-count'>
                    <div className='count-bar'>
                        <div 
                            className='count-fill' 
                            style={{width: `${(filteredEntries.length / entries.length) * 100}%`}}
                        ></div>
                    </div>
                    <p className='count-text'>
                        Showing <strong>{filteredEntries.length}</strong> of <strong>{entries.length}</strong> entries
                    </p>
                </div>

                <div classname='database-link'>
                    <a target="_blank" href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRtDWqRU9p2eb7yw63HyAzBxBGZHB8na2Knz0jLoh2CIQDQF7dHy1gl0iYNBxgC_wMPBnY6oNAqmcBq/pubhtml">Link to raw database</a>
                </div> {/* change to a pic */}

                <div className='entry-details'>
                    {!clickedEntry ? (
                        <div className='no-selection'>
                            <div className='placeholder-icon'>👆</div>
                            <p>Click on a marker to view details</p>
                        </div>
                    ) : (
                        <div className='entry-card'>
                            <div className='entry-header'>
                                <div className='entry-theme-badge'>
                                    {clickedEntry.Theme}
                                </div>
                                <h3>{clickedEntry.Title}</h3>
                            </div>
                            <div className='entry-info'>
                                <div className='info-row'>
                                    <span className='info-label'>Status</span>
                                    <span className='info-value status-badge'>
                                        {clickedEntry.Status}
                                    </span>
                                </div>
                                <div className='info-row'>
                                    <span className='info-label'>Location</span>
                                    <span className='info-value'>{clickedEntry["Name of Location"]}</span>
                                </div>
                                <div className='info-row'>
                                    <span className='info-label'>Country</span>
                                    <span className='info-value'>{clickedEntry["Country (place-based)"]}</span>
                                </div>
                                <div className='info-row'>
                                    <span className='info-label'>Type</span>
                                    <span className='info-value'>{clickedEntry["Type of Entry"]}</span>
                                </div>
                                <div className='info-row'>
                                    <span className='info-label'>Population</span>
                                    <span className='info-value'>{clickedEntry["Affected Population"]}</span>
                                </div>
                            </div>
                            <details className='summary-details'>
                                <summary>📄 View Summary</summary>
                                <div className='summary-content'>
                                    {clickedEntry.Summary}
                                </div>
                            </details>
                        </div>
                    )}
                </div>
            </div> {/* sidebar */}
        </div> /* main */
        
    );
};

export default MapComponent;
