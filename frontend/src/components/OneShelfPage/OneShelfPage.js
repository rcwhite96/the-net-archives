import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import{ useParams, NavLink } from 'react-router-dom'
import { getOneShelf } from  '../../store/shelf'

export default function OneShelfPage(){
    let dispatch = useDispatch()
    let oneShelf = useSelector(state => state.shelf.currentShelf)


    useEffect(() => {
        dispatch(getOneShelf())
    }, [dispatch])

    // const sessionUser= useSelector(state => state.session.user){
    // if(!sessionUser) {
    //     return <Redirect to='/'/>
    // }}

    return(
        <div className="all-container">
            <div className="info-container">
                <div className="single-title">{oneShelf?.title}</div>
            </div>
        </div>
    )
}