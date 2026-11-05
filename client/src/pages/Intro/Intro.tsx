import "./Intro.css";
import { useNavigate } from "react-router-dom";
import firstIcon from "../../assets/first intro Icon.svg";
import secondIcon from "../../assets/second intro Icon.svg";
import thirdIcon from "../../assets/third intro Icon.svg";
import logo from "../../assets/Logo.svg";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <main className="intro">
      <h1 className="intro__title">
        <span>Welcome to</span>
        <img className="intro__logo" src={logo} alt="Mesh AI" />
      </h1>

      <section className="intro__cards" aria-label="Mesh AI features">
        <article className="intro__card">
          <img
            src={firstIcon}
            alt=""
            className="intro__card-icon"
            aria-hidden="true"
          />
          <p className="intro__card-text">
            Bring all your documents into one secure AI workspace
          </p>
        </article>

        <article className="intro__card">
          <img
            src={secondIcon}
            alt=""
            className="intro__card-icon"
            aria-hidden="true"
          />
          <p className="intro__card-text">
            Organize and manage the documents that power your AI
          </p>
        </article>

        <article className="intro__card">
          <img
            src={thirdIcon}
            alt=""
            className="intro__card-icon"
            aria-hidden="true"
          />
          <p className="intro__card-text">
            Your knowledge base, accessible through a simple chat interface
          </p>
        </article>
      </section>

      <p className="intro__prompt">
        Start by creating your Organization&apos;s Knowledge Base
      </p>
      <div className="intro__actions">
        <button
          className="start-btn"
          type="button"
          onClick={() => navigate("/knowledge")}
        >
          Start
        </button>
      </div>
    </main>
  );
}