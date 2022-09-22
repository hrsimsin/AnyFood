import {useEffect, useState} from "react";
import AuthService from "../../services/auth.service";
import { Navigate } from "react-router-dom";

class AuthComponentModel {
    mode = "Login";
    name = "";
    email = "";
    password = "";
    loginSuccess = false;
    formMessage = "";
}


export default function AuthComponent() {
    const [model, setModel] = useState(new AuthComponentModel());

    const submitEnabled = ()  => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(model.email))
            return false;
        if(model.mode === "Login")
            return model.email && model.password && model.password.length >= 6;
        return model.email && model.password && model.name && model.password.length >= 6;
    }

    const loggedIn = () => {
        return AuthService.authToken.length > 0 || model.loginSuccess;
    }

    useEffect(() => {
       if(model.formMessage) {
           setTimeout(() => {
               setModel({
                  ...model,
                  formMessage: ""
               });
           },2000);
       }
    });

    const submit = async () => {
        if(model.mode === "Login") {
            const success = await AuthService.login(model.email, model.password);
            if(success)
                setModel({...model, loginSuccess: true});
            else{
                setModel({
                    ...model,
                    formMessage: "Invalid email/password."
                });
            }
        }
        else {
            const response = await AuthService.signup(model.name, model.email, model.password);
            if(response?.success) {
                setModel({
                   ...model,
                    email : "",
                    password : "",
                    mode: "Login",
                    formMessage: "Signed up successfully, you can now login."
                });
            }
            else{
                setModel({
                    ...model,
                    formMessage: `Error: ${(response.errors || []).map(el => el.msg).join("")}`
                });
            }
        }
    }

    return (
      <div className="screen-component login">
          <div className="app-title">
              Any Food
          </div>
          <div className="mode-selector">
              <button className={model.mode === "Login" ? 'selected' : ''} onClick={() => {setModel({...model, mode: "Login"});}}>Login</button>
              <button className={model.mode === "Signup" ? 'selected' : ''} onClick={() => {setModel({...model, mode: "Signup"})}}>Signup</button>
          </div>
          <form className="auth-form">
              {
                  model.mode === "Signup" &&
                  <label>
                      Name
                      <input type="text" value={model.name} onChange={e => setModel({...model, name: e.target.value})} />
                  </label>
              }
              <label>
                  Email
                  <input type="email" value={model.email} onChange={e => setModel({...model, email: e.target.value})}/>
              </label>
              <label>
                  Password (min length 6)
                  <input type="password" value={model.password} onChange={e => setModel({...model, password: e.target.value})}/>
              </label>
              <button type="button" disabled={!submitEnabled()} onClick={submit}>{model.mode}</button>
          </form>
          { model.formMessage && <div className="form-message">
              {model.formMessage}
          </div>}
          {loggedIn() &&  <Navigate to="/app/browse" replace={true} />}
      </div>
    );
}