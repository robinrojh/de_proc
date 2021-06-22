import React from 'react';
import { authService } from '../functions/util/fbase';

class SignOut extends React.Component {
    /**
     * Handles sign out when div is clicked
     */
    signOutHandler = () => {
        authService.signOut();
    }

    render = () => {
        return (
            <div onClick={this.signOutHandler}>
                Sign Out
            </div>
        )
    }
}

export default SignOut;