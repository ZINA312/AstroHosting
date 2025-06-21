import UserNavigation from './UserNavigationComponent'
import { Link } from 'react-router-dom';

const NavigationComponent = () =>(
    <nav>
        <ul>
            <div class="navigationLinks">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/recent-posts">Astrophotography</Link></li>
                <li><Link to="/popular-users">Photographers</Link></li>
            </div>
            <li><input placeholder='Search'></input></li>
            <UserNavigation></UserNavigation>
        </ul>
    </nav>
)

export default NavigationComponent;