import './charInfo.scss';
import PropTypes from "prop-types";
import useMarvelServices from "../../services/MarvelServices";
import useInfo from "../../hooks/useInfo";
import setContent from '../../utils/setContent'

const CharInfo = ({charId}) => {
    const { getCharacterId } = useMarvelServices();
    const {data: char, process} = useInfo({id: charId, getData: getCharacterId});

    return (
        <div className="char__info">
            {setContent(process, char, View)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, homepage, wiki, comics} = data;
    let {thumbnail} = data;
    if (thumbnail === "https://www.wallpaperflare" +
        ".com/static/264/707/824/iron-man-the-avengers-robert-downey-junior-tony-wallpaper.jpg") {
        thumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc2wiineb8zQjtxS3cWzCRV2PkZnSwWqsqjwL63ZKatXbXRHbL3xNcwQ7aGR_Sbp6mKX2BMa_belgNuNQDbLT7n4mZPRm9wf3UIu6RPQ&s=10';
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'Нюхай лапу'}
                {
                    comics.slice(0, 10).map((item, i) => {
                        return (
                            <li className="char__comics-item"
                                key={i}>
                                {item}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number,
}

export default CharInfo;