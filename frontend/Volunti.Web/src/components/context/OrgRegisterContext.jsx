
import { createContext, useContext, useState } from "react";

const OrgRegisterContext = createContext();

export const OrgRegisterProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    foretagsnamn: "",
    organisationsnummer: "",
    email: "",
    confirmEmail: "",
    password: "",

    kommun: "",
    beskrivning: "",

    branscher: [],
    dokumentation: "",

    notificationLevel: "Rekommenderat",
    emailNotification: "",
  });

  return (
    <OrgRegisterContext.Provider
      value={{ formData, setFormData }}
    >
      {children}
    </OrgRegisterContext.Provider>
  );
};

export const useOrgRegister = () =>
  useContext(OrgRegisterContext);