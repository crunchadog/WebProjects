import './charList.scss';
import MarvelServices from "../../services/MarvelServices";
import React from 'react';
import {Component} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

class CharList extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charEnded: false,
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    marvelService = new MarvelServices();

    componentDidMount() {
        this.onRequest();
        console.log(this.itemsRef)
        window.addEventListener("scroll", this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onScroll = () => {
        const {newItemLoading, charEnded, offset} = this.state;

        if (newItemLoading || charEnded) return;

        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - (scrollTop + clientHeight) < 10) {
            this.onRequest(offset);
        }
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 6) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 6,
            charEnded: ended,
        }))
    }

    itemsRef = [];

    setRef = (ref) => {
        this.itemsRef.push(ref);
    }

    focusOnId = (id) => {
        this.itemsRef.forEach((item) => item.classList.remove('char__item_selected'));
        this.itemsRef[id].classList.add('char__item_selected');
        this.itemsRef[id].focus();
    }

    renderItems(arr) {
        let items = arr.map((item, i) => {
            if (item.thumbnail === "https://www.wallpaperflare.com/static/264/707/824/iron-man-the-avengers-robert-downey-junior-tony-wallpaper.jpg") {
                item.thumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2wiineb8zQjtxS3cWzCRV2PkZnSwWqsqjwL63ZKatXbXRHbL3xNcwQ7aGR_Sbp6mKX2BMa_belgNuNQDbLT7n4mZPRm9wf3UIu6RPQ&s=10';
            }
            return (
                <li className="char__item"
                    key={item.id}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnId(i)
                    }}>
                    <img src={item.thumbnail} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);
        const isErrorMessage = error ? <ErrorMessage/> : null;
        const isLoadingScreen = loading ? <Spinner/> : null;
        const isValid = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                {isErrorMessage}
                {isLoadingScreen}
                {isValid}
                {!charEnded &&
                    <button
                        className="button button__main button__long"
                        disabled={newItemLoading}
                        // style={{
                        //     'display': charEnded ? 'none' : 'block'
                        // }}
                        onClick={() => this.onRequest(offset)}>
                        <div className="inner">load more</div>
                    </button>}
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;