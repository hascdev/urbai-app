import { Library } from "@/lib/definitions";
import { fetchLibraries } from "@/lib/library-data";
import { useCallback, useEffect, useState } from "react";


export function useLibrary() {

    const [libraries, setLibraries] = useState<Library[]>([]);

    useEffect(() => {
        
        const getLibraries = async () => {
            const libraries = await fetchLibraries();
            setLibraries(libraries);
        }
        getLibraries();
    }, []);

    const refreshLibraries = useCallback(async () => {
        const libraries = await fetchLibraries();
        setLibraries(libraries);
    }, []);

    return { libraries, refreshLibraries };
}