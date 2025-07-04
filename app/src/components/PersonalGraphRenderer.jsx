import React, { useEffect, useState } from 'react';
import {fetchDashboardGraphData} from "@/hooks/graphFetchers.js";
import GraphFullComponent from "@/components/GraphFullComponent.jsx";

export default function PersonalGraphRenderer() {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tracksChecked, setTracksChecked] = useState(true);
    const [artistsChecked, setArtistsChecked] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    useEffect(() => {
        fetchDashboardGraphData({ setElements, setError, setLoading, tracksChecked, artistsChecked });
    }, [tracksChecked, artistsChecked]);

    return (
        <GraphFullComponent
            tracksChecked={tracksChecked}
            setTracksChecked={setTracksChecked}
            artistsChecked={artistsChecked}
            setArtistsChecked={setArtistsChecked}
            setSelectedTrackId={setSelectedTrackId}
            selectedTrackId={selectedTrackId}
            elements={elements}
            error={error}
            loading={loading}
            showFilters ={true}
            />
        );

}
