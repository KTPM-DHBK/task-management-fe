import { memo, useState } from "react";
import { Button, Divider, TextField } from "@mui/material";
import { TrelloIconColor } from "../../Components/Icons";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { SignIn } from "../../Services/API/Auth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useStorage } from "../../Contexts/Storage";
import routes, { workspaceRoutes } from "../../config/routes";
import { loginLogoList } from "./constants/logo";
import Loading from "../../Components/Loading";

const Login = memo(() => {
  const storage = useStorage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = (values) => {
    const { email, password } = values;
    setIsLoading(true);
    SignIn(email, password)
      .then((res) => {
        Cookies.set("authToken", res.accessToken, {
          expires: 7,
          path: "/",
        });

        Cookies.set("refreshToken", res.refreshToken, {
          expires: 7,
          path: "/",
        });

        storage.setIsLoggedIn(true);
        storage.setUserData(res.user);
        toast.success("Login successfully");
        navigate(workspaceRoutes.workspaceHome);
      })
      .catch(() => {
        toast.error("Login not successfully");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="px-[40px] py-[32px] w-[400px] shadow-lg shadow-gray-300/50">
        <div>
          <div className="mb-4">
            <div className="flex justify-center">
              <TrelloIconColor />
            </div>
            <h5 className="text-[16px] font-medium pt-6 text-center text-[var(--text-color)]">Login to continue</h5>
          </div>

          <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  type="email"
                  onChange={field.onChange}
                  value={field.email}
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: 1,
                    },
                  }}
                  placeholder="Input your email"
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  onChange={field.onChange}
                  value={field.password}
                  type="password"
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: 1,
                    },
                  }}
                  placeholder="Input your password"
                />
              )}
            />
            <Button type="submit" variant="contained">
              Continue
            </Button>
          </form>

          <div className="mt-6 text-[14px] font-bold text-slate-400">Others:</div>

          {loginLogoList.map((item, index) => (
            <div
              key={index}
              className="h-10 w-full flex justify-center items-center gap-2 border-[1px] border-[#8590A2] border-solid cursor-pointer hover:bg-slate-50 mb-4 rounded-sm"
            >
              {item.logo}
              <span className="text-[14px] font-bold">{item.name}</span>
            </div>
          ))}

          <div className="my-4">
            <Divider />
          </div>

          <div className="flex">
            <Link className="text-[#0c66e4] text-[14px] hover:underline">You can't login ?</Link>
            <p className="text-[14px] text-[#42526E] mx-2">•</p>
            <Link to={routes.signup} className="text-[#0c66e4] text-[14px] hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;
