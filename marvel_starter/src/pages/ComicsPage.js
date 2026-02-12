import { Helmet } from "react-helmet-async";

import ComicsList from "../components/comicsList/ComicsList";
import AppBanner from "../components/appBanner/AppBanner";

const ComicsPage = () => {
    return (
        <>
            <Helmet>
                <meta
                    name="Comics"
                    content="Page of Comics Page"
                />
                <title>Comics Page</title>
            </Helmet>
            <AppBanner/>
            <ComicsList/>
        </>
    )
}

export default ComicsPage;