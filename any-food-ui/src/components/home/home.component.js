import { Outlet, Navigate } from "react-router-dom";
import NavList from "../nav-list/nav-list.component";
import {useState} from "react";
import AuthService from "../../services/auth.service";

export default function HomeComponent() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const onNavClick = () => {
        setMobileMenuOpen(false);
    }
    return (
        AuthService.authToken.length > 0 ?
        <div className="screen-component home">
            <div className="mobile-header">
                <div className="app-title">Any Food</div>
                <div style={{flex: 1}}/>
                <button onClick={() => {setMobileMenuOpen(!mobileMenuOpen)}} className="btn-menu">
                    {mobileMenuOpen ? 'Close Menu' : 'Menu'}
                </button>
            </div>
            <div className="menu-area">
                <div className={mobileMenuOpen ? 'side-panel open' : 'side-panel'}>
                    <div className="app-title">Any Food</div>
                    <div className="username">Signed in as: {AuthService.userName}</div>
                    <NavList onNavClick={onNavClick} />
                </div>
                <div className="screen-content">
                    <Outlet />
                </div>
            </div>
        </div> : <Navigate to="/" replace={true} />
    );
}