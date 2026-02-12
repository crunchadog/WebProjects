import './charSearchForm.scss';
import {useState, useEffect} from "react";
import useMarvelServices from "../../services/MarvelServices";
import {Link} from "react-router";
import {Field, Form, Formik, ErrorMessage as FormikErrorMessage} from "formik";
import * as Yup from "yup";
import useInfo from "../../hooks/useInfo";

const CharSearchForm = () => {
    const [searchTerms, setSearchTerm] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const {getCharacterByName} = useMarvelServices();

    useEffect(() => {
        if (searchValue.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        let active = true;

        const fetchSuggestions = async () => {
            try {
                const data = await getCharacterByName(searchValue);

                if (active) {
                    if (data && data.length > 0) {
                        setSuggestions(data.slice(0, 5));
                        setShowSuggestions(true);
                    } else {
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                }
            } catch (e) {
                if (active) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            }
        };

        fetchSuggestions();

        return () => {
            active = false;
        };
    }, [searchValue, getCharacterByName]);

    const {data: char} = useInfo({
        id: searchTerms,
        getData: getCharacterByName,
    });

    const results = !char ? null : char.length > 0 ? (
        <div className="char__search-list">
            {char.map((item) => (
                <div className="char__search-wrapper" key={item.id} style={{marginBottom: '15px'}}>
                    <div className="char__search-success">
                        There is! Visit {item.name} page?
                    </div>
                    <Link to={`/characters/${item.id}`} className="button button__secondary">
                        <div className="inner">To page</div>
                    </Link>
                </div>
            ))}
        </div>
    ) : (
        <div className={'char__search-error'}>
            The character was not found. Check the name and try again.
        </div>
    );

    return (
        <div className={'char__search-form'}>
            <Formik
                initialValues={{charName: ''}}
                validationSchema={Yup.object({
                    charName: Yup.string().required('Name is required'),
                })}
                onSubmit={({charName}) => {
                    const formattedName = charName.trim().charAt(0).toUpperCase() +
                        charName.trim().slice(1).toLowerCase();
                    setSearchTerm(formattedName);
                    setShowSuggestions(false);
                }}
            >
                {({setFieldValue}) => (
                    <Form>
                        <label htmlFor={'charName'} className={'char__search-label'}>
                            Or find a character by name:
                        </label>
                        <div className={'char__search-wrapper'} style={{position: 'relative'}}>
                            <Field
                                id="charName"
                                name="charName"
                                placeholder={'Enter name'}
                                type={'text'}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFieldValue('charName', value);
                                    setSearchValue(value);
                                    setSearchTerm(null);
                                }}

                                autoComplete="off"
                            />

                            <button type={'submit'} className={'button button__main'}>
                                <div className={'inner'}>find</div>
                            </button>

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="char__suggestions">
                                    {suggestions.map((character) => (
                                        <div
                                            key={character.id}
                                            className="char__suggestion-item"
                                            onClick={() => {
                                                setFieldValue('charName', character.name);
                                                setSearchValue(character.name);
                                                setShowSuggestions(false);
                                                setSuggestions([]);
                                                setSearchTerm(character.name);
                                            }}
                                        >
                                            <div className="char__suggestion-avatar">
                                                <img
                                                    src={character.thumbnail}
                                                    alt={character.name}
                                                    onError={(e) => {
                                                        e.target.src = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
                                                    }}
                                                />
                                            </div>
                                            <span className="char__suggestion-name">
                                                {character.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <FormikErrorMessage
                            name={'charName'}
                            component={'div'}
                            className={'char__search-error'}
                        />
                    </Form>
                )}
            </Formik>
            {results}
        </div>
    );
};

export default CharSearchForm;