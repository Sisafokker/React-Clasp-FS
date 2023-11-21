import React, { useContext } from "react";
import { Context } from "../Context";


function Inventory() {
    const {user, setUser} = useContext(Context);

    const clickHandler_2 = () => {
        setUser("Yes");
    };

    return <div className='container'>
        <h1>Using 'Context' for Global Variables</h1>
        <p>"User:" {user.name}</p>
        <button onClick={clickHandler_2}>Change User</button>
        <div>
            <h1>Inventory...</h1>
            <h3>Ideas:</h3>
            <ul>
                <li></li>
            </ul>
       </div>
    </div>

    // return <div>
    //     <div>
    //         <h1>Inventory...</h1>
    //         <h3>Ideas:</h3>
    //         <ul>
    //             <li></li>
    //         </ul>
    //     </div>
    // </div>
}

export default Inventory