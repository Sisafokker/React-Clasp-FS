import { GoogleLogout } from '@react-oauth/google';

const clientId = "240692930692-icvohb5b9herteb2oqk18qjb89hlqnls.apps.googleusercontent.com";

function Logout() {
    const onSuccess = () => { console.log("👍Logged Out Success!") };
    
    return (
            <div id="signOutButton">
            <GoogleLogout
                client_id={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
                isSignedIn={false}
            />;
            </div>
    )
}

export default Logout