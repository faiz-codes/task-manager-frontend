import { router } from "expo-router";
import SuperTokens from "supertokens-react-native";

export function formatDate(
  dateStr: string,
  format: string = "DD Mon YYYY"
): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Numeric month
  const day = date.getDate().toString().padStart(2, "0"); // Day of the month
  const monthShortName = date.toLocaleString("default", { month: "short" }); // Short month name (e.g., "Jan")

  // Replace placeholders in the format string
  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("Mon", monthShortName);
}

export const signUp = async (email: string, password: string) => {
  const response = await fetch("http://localhost:4000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formFields: [
        {
          id: "email",
          value: email,
        },
        {
          id: "password",
          value: password,
        },
      ],
    }),
  });

  console.log("sign up response", response);

  if (response.status === 200) {
    return true;
  } else return false;
};

export const signIn = async (email: string, password: string) => {
  if (await SuperTokens.doesSessionExist()) {
    await SuperTokens.signOut();
    console.log("signed out");
  }

  await fetch("http://localhost:4000/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formFields: [
        {
          id: "email",
          value: email,
        },
        {
          id: "password",
          value: password,
        },
      ],
    }),
  });

  if (await SuperTokens.doesSessionExist()) {
    await SuperTokens.attemptRefreshingSession();
    return true;
  }

  return false;
};

export const doesSessionExist = async () => {
  if (await SuperTokens.doesSessionExist()) {
    console.log("session exist");
    return true;
  } else {
    return false;
  }
};

export const handleSignOut = async () => {
  await SuperTokens.signOut();
  router.push("/task/signin");
};
