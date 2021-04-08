import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { selectUser } from "../../features/userSlice";

function PrivateRoute({ component: RouteComponent, ...restProps }) {
  const currentUser = useSelector(selectUser);
  return (
    <Route
      {...restProps}
      render={(renderProps) =>
        !!currentUser ? (
          <RouteComponent {...renderProps} />
        ) : (
          <Redirect to="/register" />
        )
      }
    />
  );
}

export default PrivateRoute;
