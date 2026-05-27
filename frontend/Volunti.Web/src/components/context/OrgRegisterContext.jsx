
import { createContext, useContext, useState } from "react";

const OrgRegisterContext = createContext();

export const OrgRegisterProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    foretagsnamn: "",
    organisationsnummer: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",

    kommun: "",
    beskrivning: "",

    branscher: [],
    dokumentation: "",

    notificationLevel: "Rekommenderat",
    emailNotification: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  return (
    <OrgRegisterContext.Provider
      value={{ formData, setFormData, profileImage, setProfileImage }}
    >
      {children}
    </OrgRegisterContext.Provider>
  );
};

export const useOrgRegister = () =>
  useContext(OrgRegisterContext);