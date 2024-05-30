import { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import io from 'socket.io-client';

const apiUrl = process.env.REACT_APP_API_URL;
const socket = io(apiUrl);

function ChatRooms(){

    const [chatRooms, setChatRooms] = useState([]);
    const [nameChatRoom, setNameChatRoom] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getChatrooms();
        //Escucha de los mensajes obtenidos del backend
        socket.on('chatroom', data => {
            //console.log(data);
            setChatRooms([...chatRooms,{
                name: data.name,
                date: data.date,
            }])
        })
        console.log(chatRooms);

    }, [chatRooms.length]);

    function handleInputChange(e){
        setNameChatRoom(e.target.value);
        //console.log(nameChatRoom);
    }

    function handleSubmit(e){
        e.preventDefault();

        setChatRooms([...chatRooms,{
            name: nameChatRoom,
            date: new Date().toDateString(),
        }])

        //Emitimos los datos de la sala de chat al backend
        socket.emit("chatroom", {name: nameChatRoom, date: new Date().toDateString()});
        console.log(chatRooms);
    }   
    
    //Función para obtener las salas guardadas en la bdd:
    async function getChatrooms() {
        const data = await fetch(apiUrl + '/api/chatrooms');
        const chatrooms = await data.json();
        setChatRooms(chatrooms);
    }

    function handleLogout(){
        localStorage.removeItem('username');
        navigate('/'); 
    }
    
    return(
        <div id="chatrooms">
            <div className="d-flex justify-content-center">
                <h3 className="text-center text-light fw-bold mb-1 mt-5">CHAT</h3>
            </div>
            <div className="d-flex justify-content-center">
                <p className="text-center text-light">Bienvenido/a {localStorage.getItem('username')} <span className='fw-bold logout' onClick={handleLogout}> Cerrar sesión</span></p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-5 card-form-chatrooms mb-5">
                    <input id="name-chatroom" onChange={handleInputChange} type="text" className="form-control mx-1" placeholder="Indica el nombre de una sala..." name="name" />
                    <button className="btn btn-primary mx-1" type="submit">Crear</button>
                </div>
            </form>

            {
                chatRooms.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center mt-5">
                        <div className="alert alert-info mt-5 card-chatrooms">
                            No existen salas todavía, ¡Crea la primera sala!
                        </div>
                    </div>
                ):(
                    chatRooms.map((chatRoom, i) => {
                        return(

                            <Link className = "link" to = {`/chatroom/${chatRoom.name}`} key={i} >
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="card mt-3 card-chatrooms" >
                                        <div className='card-body'>
                                            <div className="d-flex justify-content-between">
                                                <span>{chatRoom.name}</span>
                                                <span>{chatRoom.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>   
                            </Link>
                        )
                    })
                )
            }

        </div>
    )
}

export default ChatRooms;
