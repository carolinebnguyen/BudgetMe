import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading, user },
    ...rest
}) => (
    <Route
        {...rest}
        render={(props) =>
            user === null ? (
                <Spinner />
            ) : isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);
const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
