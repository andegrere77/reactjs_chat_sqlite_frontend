import { Link } from 'react-router-dom';

function Error403(){
    return(

        <div className="d-flex row m-0 vh-100 justify-content-center align-items-center">
            <div>
            <h1 className="text-center fw-bold text-light">ERROR 403</h1>
            <p className="text-center text-light">No tienes permiso para acceder a esta página <Link to="/" id="link">Accede a la app</Link></p>
            </div>
        </div>

    )
}

export default Error403;