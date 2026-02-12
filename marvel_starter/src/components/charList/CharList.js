import './charList.scss';
import useMarvelServices from "../../services/MarvelServices";
import React, {createRef, useMemo} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";
import useInfiniteList from "../../hooks/useLists";
import {CSSTransition, TransitionGroup} from "react-transition-group";

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

const CharList = ({onCharSelected}) => {
    const {getAllCharacters, process, setProcess} = useMarvelServices();

    const {items: charList, newItemLoading, ended: charEnded, loadMore} = useInfiniteList({
        request: getAllCharacters,
        limit: 6,
        setProcess
    });


    const focusOnItem = ref => {
        ref.current.classList.add("char__item_selected");
        ref.current.focus();
    };

    const blurOnItem = ref => {
        ref.current.classList.remove('char__item_selected')
    };

    function renderItems(arr) {
        let items = arr.map((item, i) => {
            if (item.thumbnail === "https://www.wallpaperflare.com/static/264/707/824/iron-man-the-avengers-robert-downey-junior-tony-wallpaper.jpg") {
                item.thumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2wiineb8zQjtxS3cWzCRV2PkZnSwWqsqjwL63ZKatXbXRHbL3xNcwQ7aGR_Sbp6mKX2BMa_belgNuNQDbLT7n4mZPRm9wf3UIu6RPQ&s=10';
            }

            const itemRef = createRef(null)

            return (
                <CSSTransition
                    key={item.id}
                    in={true}
                    timeout={500}
                    classNames={'char__item'}
                    nodeRef={itemRef}>
                    <li className="char__item"
                        key={item.id}
                        ref={itemRef}
                        tabIndex={0}
                        onClick={() => {
                            onCharSelected(item.id);
                            focusOnItem(itemRef)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        onBlur={() => blurOnItem(itemRef)}>
                        <img src={item.thumbnail} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
        //eslint-disable-next-line
    }, [process])

    return (
        <div className="char__list">
            {elements}
            {!charEnded &&
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    // style={{
                    //     'display': charEnded ? 'none' : 'block'
                    // }}
                    onClick={() => loadMore(false)}>
                    <div className="inner">load more</div>
                </button>}
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;

