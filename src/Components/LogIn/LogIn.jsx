import { Helmet } from "react-helmet-async";
import { signUpImg } from "src/Assets/Images/Images";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount";
import s from "./LogIn.module.scss";
import LogInForm from "./LogInForm/LogInForm";

const LogIn = () => {
  useScrollOnMount(0);

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="Log in to your Exclusive account to access personalized shopping features, track orders, and manage your account details securely."
        />
      </Helmet>

      <main className={s.LogInPage} id="login-page">
        <div className={s.container}>
          <div className={s.imgHolder}>
            <img src={signUpImg} alt="Shopping cart and phone" />
          </div>

          <div className={s.formContainer}>
            <LogInForm />
          </div>
        </div>
      </main>
    </>
  );
};
export default LogIn;
