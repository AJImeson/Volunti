import usersData from "../data/users.json";

export const loginUser = async (email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = usersData.users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    // Vi tittar om mejlen finns i listan men att lösenordet var fel
    const emailExists = usersData.users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailExists) {
      throw new Error("Fel lösenord. Försök igen.");
    } else {
      throw new Error("Hittar inget konto med den e-postadressen.");
    }
  }

  // Vi skickar tillbaka all information om användaren men vi plockar bort lösenordet för säkerhets skull
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Vi sparar användaren tillfälligt så att man slipper logga in igen om man uppdaterar sidan
export const saveSession = (user) => {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
};

// Vi hämtar den sparade användaren om den finns
export const getSession = () => {
  const stored = sessionStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
};

// Vi tar bort den sparade användaren när man loggar ut
export const clearSession = () => {
  sessionStorage.removeItem("currentUser");
};
