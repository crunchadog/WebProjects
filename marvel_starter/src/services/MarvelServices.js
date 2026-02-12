import {useHttp} from "../hooks/http.hook";
import {useCallback} from "react";

const useMarvelServices = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
    const _baseOffset = 0;

    const getAllCharacters = useCallback(async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}/characters?limit=6&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }, [request])

    const getCharacterId = useCallback((async id => {
        const res = await request(`${_apiBase}/characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }), [request])

    const getAllComics = useCallback(async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}/comics?limit=6&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }, [request])

    const getComicsById = useCallback(async (id) => {
        const res = await request(`${_apiBase}/comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }, [request])

    const getCharacterByName = useCallback(async(name) => {
        const res = await request(`${_apiBase}/characters?limit=100&${_apiKey}`);

        return res.data.results
            .filter(char =>
                char.name.toLowerCase().startsWith(name.toLowerCase())
            )
            .map(_transformCharacter);
    }, [request]);
    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description,
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : "No information about the number of pages",
            thumbnail: comics.thumbnail.path
                + '.' + comics.thumbnail.extension,
            textObj: comics.textObjects?.languages || "en-us",
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : "not available",
        }
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path
                + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {
        process,
        clearError,
        getAllCharacters,
        getCharacterId,
        getAllComics,
        getComicsById,
        getCharacterByName,
        setProcess};
}

export default useMarvelServices;