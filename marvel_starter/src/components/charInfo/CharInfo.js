import './charInfo.scss';
import {Component} from "react";
import MarvelServices from "../../services/MarvelServices";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import PropTypes from "prop-types";

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    }


    marvelServices = new MarvelServices();

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

    onCharLoading = () => {
        this.setState({
            loading: true,
        })
    }

    updateChar = () => {
        const {charId} = this.props;

        if (!charId) {
            return;
        }

        this.onCharLoading();
        this.marvelServices
            .getCharacterId(charId)
            .then(this.onLoadedCharacter)
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    onLoadedCharacter = (char) => {
        this.setState({
            char,
            loading: false,
        })
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const loadingMessage = loading ? <Spinner/> : null;
        const content = !(error || loading || !char) ? <View char={char}/> : null;
        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {loadingMessage}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, homepage, wiki, comics} = char;
    let {thumbnail} = char;
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