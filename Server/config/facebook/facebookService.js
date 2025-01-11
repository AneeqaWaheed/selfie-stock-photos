import fetch from "node-fetch";

export const verifyFacebookToken = async (accessToken) => {
  const response = await fetch(
    `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`
  );
  const data = await response.json();

  if (data.error) {
    throw new Error("Invalid Facebook token");
  }

  return data; // { id, name, email }
};
