import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/form.css"
import { registerUser } from "../../utils/api";


export default function Register() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");

    try {
      const response = await registerUser(
        values.name ?? "",
        values.email ?? "",
        values.password ?? "",
      );

      if (!response.success) {
        setSubmitError(response.error?.message ?? "Registration failed");
        return;
      }

      navigate("/login");
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <h1 className="form__title">Create account</h1>
      <p className="form__title-text">Access your organization’s secure workspace</p>
      <NavLink to="/login" className="form__link" >Login</NavLink>
      <NavLink to="/register" className="form__link" >Register</NavLink>
      <div className="form__input-container">
        <label className="form__label">
          Name
          <input
            className="form__input"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            minLength={2}
            maxLength={40}
            value={values.name ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.name && <p className="form__error">{errors.name}</p>}
      </div>
      <div className="form__input-container">
        <label className="form__label">
          Email
          <input
            className="form__input"
            name="email"
            type="email"
            placeholder="johndoe12345@gmail.com"
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
            placeholder="12345678"
            required
            minLength={8}
            value={values.password ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.password && <p className="form__error">{errors.password}</p>}
      </div>
      <button
        className="form__submit-btn"
        type="submit"
        disabled={!isValid}
      >
        Create account
      </button>
      {submitError && <p className="form__error">{submitError}</p>}
    </form>
  );
}