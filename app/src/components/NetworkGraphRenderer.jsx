import React, { useEffect, useState } from "react";
import {fetchNetworkGraphData} from "@/hooks/graphFetchers.js";
import GraphFullComponent from "@/components/GraphFullComponent.jsx";

export default function NetworkGraphRenderer() {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [tracksChecked, setTracksChecked] = useState(true);
    const [artistsChecked, setArtistsChecked] = useState(false);

    useEffect(() => {
        fetchNetworkGraphData({setElements, setError, setLoading});
    }, []);

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
            showFilters ={false}
        />
    );
}
