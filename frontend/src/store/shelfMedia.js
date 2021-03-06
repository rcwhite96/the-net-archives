import { csrfFetch } from "./csrf"

const GET_SHELF_MEDIA = 'media/getShelfMedia'
const ADD_SHELF_MEDIA = 'media/addToShelf'
const REMOVE_SHELF_MEDIA = "media/removeFromShelf"

const getShelfMedia = payload => {
    return {
        type: GET_SHELF_MEDIA,
        payload
    }
}

const addToShelf = payload => {
    return {
        type: ADD_SHELF_MEDIA,
        payload
    }
}

const removeFromShelf = payload => {
    return {
        type: REMOVE_SHELF_MEDIA,
        payload
    }
}

export const get = () => async dispatch => {
    const res = await csrfFetch('/api/add-to-shelf')
    const shelfMedia = await res.json()
    dispatch(getShelfMedia(shelfMedia))
    return shelfMedia
}

export const add = (mediaId, shelfId) => async dispatch => {
    const res = await csrfFetch('/api/add-to-shelf', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mediaId, shelfId})
    })
    const shelfMedia = await res.json()
    dispatch(addToShelf(shelfMedia))
    return shelfMedia
}

export const remove = (mediaId) => async dispatch => {
    const res = await csrfFetch(`/api/add-to-shelf/${mediaId}`, {
        method: 'DELETE'
    })
    if (res.ok){
        dispatch(removeFromShelf(mediaId))
    }
}

let initialState = {shelfMedia:[]}

const shelfMediaReducer = (state = initialState, action) => {
    let newState
        switch(action.type){
            case GET_SHELF_MEDIA:
                newState = {...state}
                newState.shelfMedia = action.payload
                return newState
            case ADD_SHELF_MEDIA:
                newState = {...state}
                newState.shelfMedia.push(action.payload)
                return newState
            case REMOVE_SHELF_MEDIA:
                newState={...state}
                delete newState.shelfMedia[action.payload]
                return newState
            default:
                return state
        }
}

export default shelfMediaReducer
