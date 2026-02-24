import {filtersFetch, activeFilterChanged, selectAll} from './filtersSlice';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

const HeroesFilters = () => {
    const filters = useSelector(selectAll);
    const { filtersLoadingStatus, activeFilter } = useSelector(state => state.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filtersFetch())
    }, [])

    if (filtersLoadingStatus === "loading") return <h5>Загрузка...</h5>;
    if (filtersLoadingStatus === "error") return <h5>Ошибка!</h5>;

    const renderFilters = (arr) => {
        return arr.map(({name, label, className}) => {
            const btnClass = `btn ${className} ${name === activeFilter ? 'active' : ''}`

            return (
                <button
                key={name}
                className={btnClass}
                onClick={() => dispatch(activeFilterChanged(name))}
                >
                    {label}
                </button>
            )
        })
    }
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderFilters(filters)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;