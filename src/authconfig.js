import { appUrl } from "./api/appUrl";

export const msalConfig = {
  auth: {
    clientId: "6697d6a8-133d-44be-9a06-e897c5a72a91",
    authority:
      "https://login.microsoftonline.com/f9f831d4-31a1-4d97-8894-ad202651e094",
    redirectUri: `${appUrl}`,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
