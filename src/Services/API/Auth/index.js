import request from "../request";

export const SignIn = async (email, password) => {
  try {
    const res = await request.post("/auth/signin", {
      email: email,
      password: password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const SignUp = async (userName, email, password) => {
  try {
    const res = await request.post("/auth/signup", {
      name: userName,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export async function getProfile() {
  try {
    const res = await request.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export function UpdateProfile(params) {
  return request.patch("/auth/me", params);
}
