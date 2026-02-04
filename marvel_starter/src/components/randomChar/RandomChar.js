import {Component} from "react";
import MarvelServices from "../../services/MarvelServices";
import Spinner from "../spinner/Spinner";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorMessage from "../errorMessage/ErrorMessage";


class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false,
    }

    marvelServices = new MarvelServices();

    validateDescr = ({name, description}) => {
        if (!description) {
            return `Данных об персонаже ${name} нет.`
        }

        if (description.length > 210) {
            return description.slice(0, 210) + '...';
        }

        return description
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    onCharLoaded = (char) => {
        char.description = this.validateDescr(char);
        this.setState({
            char,
            loading: false
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true,
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * 20);
        this.onCharLoading();
        this.marvelServices
            .getCharacterId(id)
            .then(this.onCharLoaded)
            .catch(this.onError)

    }

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 30000);
    }

    componentWillUnmount() {
        // clearInterval(this.timerId);
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const loadingMessage = loading ? <Spinner/> : null;
        const content = !(error || loading) ? <View char={char}/> : null;
        return (
            <div className="randomchar">
                {errorMessage}
                {loadingMessage}
                {content}
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
                            onClick={this.updateChar}>
                        <div className="inner">try it
                        </div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, homepage, wiki, description} = char;
    let {thumbnail} = char;
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