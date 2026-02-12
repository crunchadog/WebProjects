import './comicsList.scss';
import useMarvelServices from "../../services/MarvelServices";
import React from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import useInfiniteList from "../../hooks/useLists";
import {Link} from "react-router";


const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error(`Unknown process state: ${process}`);
    }
}

const ComicsList = () => {
    const {process, getAllComics, setProcess} = useMarvelServices();
    const {items: comicsList, newItemLoading, ended: comicsEnded, loadMore} = useInfiniteList({
        request: getAllComics,
        limit: 6,
        setProcess
    })

    function renderItems(arr) {
        let items = arr.map((item, i) => {
            return (
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            {!comicsEnded &&
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        onClick={() => loadMore(false)}>
                    <div className="inner">load more</div>
                </button>}
        </div>
    )
}

export default ComicsList;