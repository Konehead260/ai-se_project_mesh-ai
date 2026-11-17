import { useState } from "react";
import { useLocation, useNavigate, NavLink, type Location } from "react-router-dom";
import "../../assets/css/form.css"
import { loginUser } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";


export default function Login() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const from = (
    location.state as {
      from?: Pick<Location, "pathname" | "search" | "hash">;
    } | null
  )?.from;
  const destination =
    from?.pathname.startsWith("/") && !from.pathname.startsWith("//")
      ? `${from.pathname}${from.search}${from.hash}`
      : "/knowledge";

  async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();
  setSubmitError("");

  try {
    const res = await loginUser(
      values.email ?? "",
      values.password ?? "",
    );

    if (res.data) {
      login(res.data.token, res.data.user);
      navigate(destination, { replace: true });
    } else {
      setSubmitError(res.error?.message ?? "Login failed");
    }
  } catch (error: unknown) {
    setSubmitError(error instanceof Error ? error.message : "Login failed");
  }
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <h1 className="form__title">Sign in</h1>
      <p className="form__title-text">Access your organization’s secure workspace</p>
            <NavLink to="/login" className="form__link" >Login</NavLink>
            <NavLink to="/register" className="form__link" >Register</NavLink>
      <div className="form__input-container">
        <label className="form__label">
          Email
          <input
            className="form__input"
            name="email"
            type="email"
            required
            value={values.email ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.email && <p className="form__error">{errors.email}</p>}
      </div>
      <div className="form__input-container">
        <label className="form__label">
          Password
          <input
            className="form__input"
            name="password"
            type="password"
            required
            minLength={8}
            value={values.password ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.password && <p className="form__error">{errors.password}</p>}
      </div>
      <button className="form__submit-btn" type="submit" disabled={!isValid}>
        Login
      </button>
      {submitError && (
        <p className="form__error" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}