import { Link } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from './LoadingSpinner';

const apiUrl = process.env.REACT_APP_API_URL;

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(apiUrl + "/api/saveuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
      setMessageSuccess(data.success);
      setLoading(false);
    }
    if (data.error) {
      setMessageError(data.error);
      setLoading(false);
    }



    setUsername("");
    setEmail("");
    setPassword("");
    
  };

  return (
    <div className="d-flex row m-0 vh-100 justify-content-center align-items-center">
      
      <form onSubmit={handleSubmit}>
        <div className="form-div">
          <h3 className="text-center text-light fw-bold mb-3">CHAT</h3>
          <p className="text-center text-light">Crea una cuenta</p>
          <input
            type="text"
            className="form-control mb-3"
            name="username"
            placeholder="Nombre de usuario/a"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Registrarse
            </button>
          )
          }
          <span className="text-light">Si ya dispones de una cuenta </span>
          <Link to="/" id="link">
            accede a la aplicación
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

export default Signup;
