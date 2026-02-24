import './heroListAnimation.scss'

import {useHttp} from '../../hooks/http.hook';
import {createRef, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {fetchHeroes, filteredHeroesSelector, heroDeleted} from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {filtersFetchingError} from "../heroesFilters/filtersSlice";

const HeroesList = () => {
    const filteredHeroes = useSelector(filteredHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());

        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`)
            .then(data => {
                console.log(data, 'delete');
                dispatch(heroDeleted(id));
            }).catch(error => filtersFetchingError(error));
    }, [request, dispatch]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={0} classNames={'hero'}>
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            const itemRef = createRef(null);
            return (
                <CSSTransition
                    key={id}
                    nodeRef={itemRef}
                    timeout={400}
                    classNames={'hero'}>
                        <HeroesListItem
                            ref={itemRef}
                            {...props}
                            onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component={'ul'}>
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;