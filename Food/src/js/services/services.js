const postData = async (url, data) => {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    });

    return await result.json();
};

const getResourses = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Что-то пошло не так ${url}, status: ${res.status}`);
    }

    return await res.json();
};

export {postData, getResourses};
