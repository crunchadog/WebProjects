import {useCallback, useEffect, useState} from "react";
import useMarvelServices from "../../services/MarvelServices";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import setContent from '../../utils/setContent'

const RandomChar = () => {
    const [char, setChar] = useState({});
    const {loading, getCharacterId, clearError, process, setProcess} = useMarvelServices();

    const validateDescr = ({name, description}) => {
        if (!description) {
            return `Данных об персонаже ${name} нет.`
        }

        if (description.length > 210) {
            return description.slice(0, 210) + '...';
        }

        return description
    }


    const onCharLoaded = useCallback((char) => {
        setChar({
            ...char,
            description: validateDescr(char),
        });
    }, []);

    const updateChar = useCallback(() => {
        clearError();
        const id = Math.floor(Math.random() * 19) + 1;
        getCharacterId(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))

    }, [onCharLoaded, getCharacterId, clearError, setProcess])

    useEffect(() => {
        updateChar();
        let timer = setInterval(updateChar, 60000);
        return () => {
            clearInterval(timer);
        }
    }, [updateChar]);

    return (
        <div className="randomchar">
            {setContent(process, char, View)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                        disabled={loading}
                        onClick={updateChar}>
                    <div className="inner">try it
                    </div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, homepage, wiki, description} = data;
    let {thumbnail} = data;
    if (thumbnail === "https://www.wallpaperflare" +
        ".com/static/264/707/824/iron-man-the-avengers-robert-downey-junior-tony-wallpaper.jpg") {
        thumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2wiineb8zQjtxS3cWzCRV2PkZnSwWqsqjwL63ZKatXbXRHbL3xNcwQ7aGR_Sbp6mKX2BMa_belgNuNQDbLT7n4mZPRm9wf3UIu6RPQ&s=10';
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;