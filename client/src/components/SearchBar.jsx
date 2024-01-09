import React, {Fragment, useState} from 'react';

const SearchBar = () => {

    const [description, setDescription] = useState("");

    const onSubmitForm = async (e) => {
        
        e.preventDefault();
        /* Currently do nothing
        try {
            const body = {description, id: 1};
            const response = await fetch("http://localhost:3005/createPeople", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            console.log(response);
        } catch (err) {
            console.log(err)
        }
        */
    };

    return (
    <Fragment>
        <form className="d-flex mt-4 mb-4" onSubmit={onSubmitForm}>
            <input type="text" className="form-control" value={description} 
            onChange={e => setDescription(e.target.value)}/>
            <button className="btn btn-outline-secondary">Search</button>
        </form>
    </Fragment>
    );
};

export default SearchBar;
