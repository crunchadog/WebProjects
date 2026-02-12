import {useState, useCallback, useEffect} from "react";
import useMarvelServices from "../services/MarvelServices";

const useInfo = ({id, getData}) => {
    const [data, setData] = useState(null);
    const {loading, error, clearError, process, setProcess} = useMarvelServices();

    const updateItem = useCallback(() => {
        if (!id) return;

        clearError();
        getData(id)
            .then(onLoaded)
            .then(() => setProcess('confirmed'));
    }, [id, getData, clearError, setProcess]);

    useEffect(() => {
        updateItem();
    }, [updateItem]);

    const onLoaded = (data) => {
        setData(data);
    };

    return {data, loading, error, clearError, process, updateItem};
};

export default useInfo;
