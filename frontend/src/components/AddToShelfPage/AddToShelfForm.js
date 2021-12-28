import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import{ useParams, Redirect, useHistory} from 'react-router-dom'
import { getShelves } from  '../../store/shelf'

export default function AddToShelfForm(){
    const {shelfId} = useParams()
    const sessionUser = useSelector((state => state.session.user))
    const [option, setOption] = useState([0])
    const [errors, setErrors] = useState([])
    const history = useHistory()
    const allShelf = useSelector((state => state.shelves))
    const dispatch = useDispatch();

    if (!sessionUser) {
        return <Redirect to="/login" />;
    }

    const shelfList = allShelf?.map((shelf, index) =>
        <select key={index} onChange={(e) => setOption(e.target.value)} value={option}>
            <option value={shelf.title}>{shelf.title}</option>
        </select>
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        const shelf = await dispatch(getShelves(shelfId)).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) {
                const filteredErrors = data.errors.filter(
                  (error) => error !== 'Invalid value'
                );
                setErrors(filteredErrors);
              }
        })
        if(shelf) {
            return history.push(`/media`)
        }
      }

    return (
        <>
            <form onSubmit={handleSubmit} className="signup-container">
            <h2>Add Media to Your Shelf</h2>
                <div className="error-div">
                    <p className="form-errors">
                        {errors.map((error, i) => (
                            <span key={i}>{error}</span>
                        ))}
                    </p>
                </div>
                <div>{shelfList}</div>
                    <button className="nav-btn" type="submit">
                        Add
                    </button>
            </form>
        </>
    )
}