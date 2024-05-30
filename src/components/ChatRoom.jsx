import { useParams, Link } from "react-router-dom";
import { useState, useEffect , useRef} from "react";
import io from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;
const socket = io(apiUrl);

function ChatRoom() {
  const { name } = useParams();
  const [nameUser, setNameUser] = useState("");
  const [message, setMessage] = useState(""); //variable para almacenar el mensaje escrito por el usuario
  const [messages, setMessages] = useState([]); //Array para almacenar todos los mensajes que escribamos y recibamos
  const [messagesBdd, setMessagesBdd] = useState([]); //Array para almacenar todos los mensajes de la bdd
  const [firstTime, setFirstTime] = useState(true);
  const [haveMessagesChatroom, setHaveMessagesChatroom] = useState(false);

  const divRef = useRef(null);

  useEffect(() => {
    scrollToBottom(1000);
    if (firstTime) {
      getMessages();
      setFirstTime(false);
      setNameUser(localStorage.getItem("username"));
    }

    socket.on("message", (message) => {
      //console.log(message)
      setMessages([...messages, message]);
      scrollToBottom(100);
    });

    return () => {
      socket.off("message");
    };
  }, [messages.length]);


  function handleSubmit(e) {
    e.preventDefault();

    let dateNow = new Date();
    let day = dateNow.getDate();
    let month = dateNow.getMonth() + 1;
    let year = dateNow.getFullYear();
    let hour = dateNow.getHours();
    let minute = dateNow.getMinutes();
    let fullDate = day + "-" + month + "-" + year + " " + hour + ":" + minute;

    const newMessage = {
      user: nameUser,
      message: message,
      room: name,
      created_at: fullDate,
    };
    //Almacenamos el nuevo mensaje en el array de mensajes
    setMessages([...messages, newMessage]);
    setMessage("");
    //console.log(newMessage);

    //Emitimos el mensaje al backend para que lo reenvie al resto de clientes
    socket.emit("message", newMessage);
    scrollToBottom(100);
  }

  //Función para obtener los mensajes de la bdd
  async function getMessages() {
    const data = await fetch(apiUrl + "/api/messages");
    const messages = await data.json();
    setMessagesBdd(messages);

    for(let i = 0; i < messages.length; i++) {
      if(messages[i].room === name){
        setHaveMessagesChatroom(true);
        break;
      }
    }
  }

  //Función para eliminar un mensaje propio
  async function deleteMessage(id){
    const response = await fetch(apiUrl + "/api/deletemessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id}),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      console.log(data.success);
      //Eliminamos el mensaje del array messagesBdd
      setMessagesBdd(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  //Función para enfocar al final del div
  function scrollToBottom(offset = 0){
    if(divRef.current){
      const lastChild = divRef.current.lastElementChild;
      if(lastChild){
        lastChild.scrollIntoView({behavior: 'smooth', block: 'end'});
        setTimeout(() => {
          divRef.current.scrollTop += offset;
        }, 1000); // Ajusta el tiempo según sea necesario
      }
    }
  }

  return (
    <div className="d-flex m-0 vh-100 justify-content-center align-items-center">
        <div className="card" id="card-chat">
          <div className="card-header">
            <div className="d-flex justify-content-between">
                <h3 className="text-dark">{name}</h3> 
                <Link to="/chatrooms" id="link" className="mt-2"> <span id="exit">Salir</span></Link>
            </div>
          </div>

          <div className="card-body" id="messages-dashboard" ref={divRef}>


            {
              haveMessagesChatroom === true || messages.length > 0 ?(
            
                messagesBdd.map((msg, i) => {
                  return (
                    msg.room === name &&
                    (msg.user === nameUser ? (
                      <div className="d-flex justify-content-end" key={i}>
                        <div className="message-user mb-3">
                          <span className="text-muted fw-bold">Yo</span>:{" "}
                          {msg.message}
                          <div className="d-flex justify-content-end">
                            <span className="text-muted date-text">{msg.created_at} <button type="button" className='btn-close' onClick={() => deleteMessage(msg.id)}></button></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-start" key={i}>
                        <div className="message-other mb-3">
                          <span className="text-muted fw-bold">{msg.user}</span>:{" "}
                          {msg.message}
                          <div className="d-flex justify-content-end">
                            <span className="text-muted date-text">{msg.created_at}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  );
                })

            ):(
              <div className="d-flex justify-content-center align-items-center mt-5">
                <div className="alert alert-warning">No existen mensajes en esta sala</div>
              </div>
            )}

            {messages.map((msg, i) => {
              return (
                msg.room === name &&
                (msg.user === nameUser ? (
                  <div className="d-flex justify-content-end" key={i}>
                    <div className="message-user mb-3">
                      <span className="text-muted fw-bold">Yo</span>:{" "}
                      {msg.message}
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-start" key={i}>
                    <div className="message-other mb-3">
                      <span className="text-muted fw-bold">{msg.user}</span>:{" "}
                      {msg.message}
                    </div>
                  </div>
                ))
              );
            })}
          </div>
          <div className="card-footer">
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-center align-items-center">
                <input
                  type="text"
                  className="form-control mx-1"
                  placeholder="Escribe un mensaje..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                <button type="submit" className="btn btn-primary mx-1">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>

       
    </div>
  );
}

export default ChatRoom;
