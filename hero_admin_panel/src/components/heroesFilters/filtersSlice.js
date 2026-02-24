import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook";

const filterAdapter = createEntityAdapter({
    selectId: (filter) => filter.name
});

const initialState = filterAdapter.getInitialState({
    filterLoadingStatus: 'idle',
    activeFilter: 'all'
});
export const filtersFetch = createAsyncThunk(
    'filters/FetchFilters',

    () => {
        const {request} = useHttp();
        return request('http://localhost:3001/filters');
    }
)

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(filtersFetch.pending, state => {
                state.filterLoadingStatus = 'loading';
            })
            .addCase(filtersFetch.fulfilled, (state, action) => {
                state.filterLoadingStatus = 'idle';
                filterAdapter.setAll(state, action.payload);
            })
            .addCase(filtersFetch.rejected, state => {
                state.filterLoadingStatus = 'error';
            })
    }
})

const {actions, reducer} = filtersSlice;

export const {selectAll} = filterAdapter.getSelectors(state => state.filters);
export default reducer;
export const {
    filtersFetchingError,
    activeFilterChanged,
} = actions