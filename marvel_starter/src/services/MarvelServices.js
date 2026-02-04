class MarvelServices {
    #_apiBase = 'https://marvel-server-zeta.vercel.app/characters';
    #_apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
    #_baseOffset = 0;
    getResourse = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this.#_baseOffset) => {
        const res = await this.getResourse(`${this.#_apiBase}?limit=6&offset=${offset}&${this.#_apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacterId = async id => {
        const res = await this.getResourse(`${this.#_apiBase}/${id}?${this.#_apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }


    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path
                + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelServices;