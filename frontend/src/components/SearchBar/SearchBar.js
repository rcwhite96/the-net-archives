import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {mediaSearch} from "../../store/media"

import './SearchBar.css'

export default function SearchForm(){
    const [term, setTerm] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch(mediaSearch(term))
        if(term.length > 0){
            history.push(`/search/${term}`)
        }
    }, [term, history, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(mediaSearch(term))
        history.push(`/search/${term}`)
    }

    return(
        <div className="search-container">
            <form className="search-bar" onSubmit={handleSubmit}>
                <input
                className="search-input"
                placeholder="search media"
                value={term}
                onChange={(e) => setTerm(e.target.value)}/>
                <button className='search-btn' type='submit'>Search</button>
            </form>
        </div>
    )

}
