import {useState, useEffect, useCallback, useRef} from "react";

const useInfiniteList = ({request, limit, setProcess}) => {
    const [items, setItems] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [ended, setEnded] = useState(false);
    const isMounted = useRef(false);

    const offset = useRef(0);

    const onRequest = useCallback((initial = false) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        request(offset.current)
            .then(newItems => {
                setItems(prev => [...prev, ...newItems]);
                setNewItemLoading(false);
                offset.current += limit;
                if (newItems.length < limit) {
                    setEnded(true);
                }
            }).then(() => setProcess('confirmed'));
    }, [request, limit, setProcess]);

    const onScroll = useCallback(() => {
        if (newItemLoading || ended) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - (scrollTop + clientHeight) < 10) {
            onRequest();
        }
    }, [onRequest, ended, newItemLoading]);

    useEffect(() => {
        if (isMounted.current) return;

        isMounted.current = true;
        onRequest(true);
    }, [onRequest]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    return {items, newItemLoading, ended, loadMore: onRequest};
};

export default useInfiniteList;
