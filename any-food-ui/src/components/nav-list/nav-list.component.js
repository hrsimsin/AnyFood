import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

export default function NavList(props) {
    const location = useLocation();
    const [pathName, setPathName] = useState("");

    const linkMap = [
        {
            link: `/app/browse`,
            name:"Home"
        } ,
        {
            link: `/app/cart`,
            name:"Cart"
        },
        {
            link:`/app/order-history`,
            name:"Order History"
        },
        {
            link:`/app/onboard-restaurant`,
            name:"Onboard Restaurant"
        },
        {
            link:`/logout`,
            name:"Logout"
        }
    ]

    useEffect(() => {
        setPathName(location.pathname);
    },[location]);

    return (
      <nav className="nav-list-component">
          {
              linkMap.map(el =>
                  <div key={el.link} className={pathName === el.link ? 'nav-link selected' : 'nav-link'} onClick={props.onNavClick}>
                      <Link to={el.link}>{el.name}</Link>
                  </div>
              )
          }
      </nav>
    );
}