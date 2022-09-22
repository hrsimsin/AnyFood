import {useEffect, useState} from "react";
import AuthService from "../../services/auth.service";
import { Navigate } from "react-router-dom";

export default function LogoutComponent() {
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        AuthService.logout();
        setSuccess(true);
    });

    return(
        success && <Navigate to="/" replace={true} />
    );
}