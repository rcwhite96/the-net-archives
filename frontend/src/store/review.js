const {csrfFetch} = require('./csrf')

const GET_REVIEWS = 'review/getAllReviews'
const GET_ONE_REVIEW ='review/getOneReview'
const POST_REVIEW = 'review/postReview'
const EDIT_REVIEW = 'review/editReview'
const DELETE_REVIEW = 'review/deleteReview'

const getAllReviews = payload => {
    return{
        type: GET_REVIEWS,
        payload
    }
}

const getOneReview = payload => {
    return{
        type: GET_ONE_REVIEW,
        payload
    }
}

const postReview = payload => {
    return {
        type: POST_REVIEW,
        payload
    }
}
const editReview = payload => {
    return {
        type: EDIT_REVIEW,
        payload
    }
}

const deleteReview = payload => {
    return {
        type: DELETE_REVIEW,
        payload
    }
}

export const getReviews = () => async dispatch => {
    const res = await csrfFetch('/api/reviews')
    if(res.ok){
        const data = await res.json()
        dispatch(getAllReviews(data))
    }
}

export const oneReview = (id) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${id}`)
    if(res.ok){
        const data = await res.json()
        dispatch(getOneReview(data))
        return data
    }
}

export const addReview = (title, content, mediaId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({title, content, mediaId})
    })
    if(res.ok){
        const review = await res.json()
        dispatch(postReview(review))
        return review
    }
}

export const putReview = (id, title, content, mediaId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id, title, content, mediaId})
    })
    if(res.ok){
        const review = await res.json()
        dispatch(editReview(review))
        return review
    }
}

export const removeReview = (id) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE'
    })
    if(res.ok){
        dispatch(deleteReview(id))
    }
}

let initialState = {reviews:[]}

const reviewReducer = (state = initialState, action) => {
    let newState
        switch(action.type){
            case GET_REVIEWS:
                newState = {...state}
                newState.reviews = action.payload
                return newState
            case GET_ONE_REVIEW:
                newState = {...state}
                newState.oneReview = action.payload
                return newState
            case POST_REVIEW:
                newState = {...state}
                newState.reviews.push(action.payload)
                return newState
            case EDIT_REVIEW:
                newState = {...state}
                const index = newState.reviews.findIndex(review => review.id === action.payload.id)
                newState.reviews[index] = action.payload
                newState.currentReview = action.payload
                return newState
            case DELETE_REVIEW:
                newState={...state}
                delete newState.reviews[action.payload]
                return newState
            default:
                return state;
        }
}

export default reviewReducer
