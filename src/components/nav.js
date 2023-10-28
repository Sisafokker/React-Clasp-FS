import { Link } from "react-router-dom"

function Nav() {
    return <div>
       <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
       </ul>
    </div>
}

export default Nav