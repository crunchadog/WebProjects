import {useParams} from "react-router";
import {useEffect, useState} from "react";
import useMarvelServices from "../services/MarvelServices";
import AppBanner from "../components/appBanner/AppBanner";
import setContent from "../utils/setContent";

const SinglePage = ({Component, dataType}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);
    const {getCharacterId, getComicsById, clearError, process, setProcess} = useMarvelServices();

    useEffect(() => {
        updateData();
        // eslint-disable-next-line
    }, [id])

    const updateData = () => {
        clearError();

        switch (dataType) {
            case 'comic':
                getComicsById(id).then(onDataLoaded).then(() => setProcess('confirmed'))
                break;
            case 'character':
                getCharacterId(id).then(onDataLoaded).then(() => setProcess('confirmed'))
                break;
            default:
                console.error("Error loading comics");
                break;
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, data, Component)}
        </>
    )
}

export default SinglePage;