import { GoogleLogin } from '@react-oauth/google';

const clientId = "240692930692-icvohb5b9herteb2oqk18qjb89hlqnls.apps.googleusercontent.com";

function Login() {
    const onSuccess = (resp) => { console.log("👍Login Success! Current user: ", resp.profileObj); }
    const onFailure = (resp) => { console.log("❌Login Failed!", resp); }
    
    return (
            <div id="signInButton">
            <GoogleLogin
                client_id={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onfailure={onFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
            />;
            </div>
    )
}

export default Login
