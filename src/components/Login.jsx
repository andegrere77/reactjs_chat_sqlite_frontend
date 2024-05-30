import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from './LoadingSpinner';

const apiUrl = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(apiUrl + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      setMessageError("")
      setMessageSuccess(data.success);
      localStorage.setItem("username", data.username); // Guardamos el nombre de usuario en localStorage
      setLoading(false);
      navigate('/chatrooms'); 

    }
    if (data.error) {
      setMessageError(data.error);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex row m-0 vh-100 justify-content-center align-items-center">
      <form onSubmit={handleSubmit}>
        <div className="form-div">
          <h3 className="text-center text-light fw-bold mb-3">CHAT</h3>
          <p className="text-center text-light">Accede a la aplicación</p>
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Acceder
            </button>
          )
          }
          <span className="text-light">Si no dispones de una cuenta </span>
          <Link to="/signup" id="link">
            regístrate
          </Link>
          {messageSuccess !== "" && (
            <div className="alert alert-success mt-3">{messageSuccess}</div>
          )}
          {messageError !== "" && (
            <div className="alert alert-danger mt-3">{messageError}</div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
