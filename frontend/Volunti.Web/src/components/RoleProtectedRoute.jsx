import React from "react";
import { Navigate } from "react-router-dom";

import { getSession, clearSession } from "../services/authService";

export default function RoleProtectedRoute({ children, allowedRoles  }) {

    const session = getSession();

  if (!session || !session.token) {
    return <Navigate to="/login" state={{message: "Din session har gått ut, logga in igen."}}/>;
  }

  try {

    const tokenParts = session.token.split(".");

    const payload = tokenParts[1];

    const decodedPayload = JSON.parse(atob(payload));

    const exp = decodedPayload.exp;

    const currentTime = Date.now() / 1000;

    // Om token har gått ut
    if (exp < currentTime) {

      clearSession();

      return (
        <Navigate
          to="/login"
          state={{ message: "Din session har gått ut, logga in igen" }}
        />
      );
    }

    // Skicka roll till giltig sida
    const role = decodedPayload.role; 
    if (allowedRoles && !allowedRoles.includes(role)) 
    {
      if (role === "OrgAdmin") return <Navigate to="/org-dashboard" />;
      if (role === "OrgUser") return <Navigate to="/org-user-dashboard" /> ;
      return <Navigate to="/missions" />;
    }
   

  } catch {

    // Om token är ogiltig
    clearSession();

    return <Navigate to="/login" />;
  }

  return children;
}