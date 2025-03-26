import { Children, useEffect, useRef, useState } from "react";

const PlayerGround = () => {
  const wsRef = useRef<null | WebSocket>(null);
  const [players, setPlayers] = useState([]);
  const [user, setuser] = useState({});
  const newuser = (id, positions) => {
    return {
      userId: id,
      x: positions.x,
      y: positions.y,
    };
  };

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:5000");
    const wss = wsRef.current;
    wss.onopen = () => {
      wss.send(JSON.stringify({type:"get-players"}))
    };

    wss.onmessage = (m) => {
      const data = JSON.parse(m.data);
      if (data.type === "connected-user"){
        setuser(data);
      }
      if(data.type === "get-players")
        console.log("total-layers",data)
      setPlayers([...Object?.values(data?.players ?? { })]);
    };

    wss.onerror = (e) => {
      console.log("error in connecting");
    };
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
window.addEventListener("keydown",handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [user]);

  const handleKeyDown =(e) =>{
    if(!user) return
    console.log(e.key)

    if(e.key === "ArrowUp"){
wsRef.current?.send(JSON.stringify({type:"move",direction:"moveUp",id:user?.userId}))
    }
    if(e.key === "ArrowDown"){
wsRef.current?.send(JSON.stringify({type:"move",direction:"moveDown",id:user.userId}))
    }
    if(e.key === "ArrowLeft"){
wsRef.current?.send(JSON.stringify({type:"move",direction:"moveLeft",id:user.userId}))
    }
    if(e.key === "ArrowRight"){
wsRef.current?.send(JSON.stringify({type:"move",direction:"moveRight",id:user.userId}))
    }
  }
  return (
    <div>
      {players.map((p,index) => (
        <div
          key={index}
          className={`bg-green-500 h-3 w-3 rounded-full `}
          style={{transform:`translate(${p.positions.x}px ,${p.positions.y}px)`}}
        ></div>
      ))}
    </div>
  );
};

export default PlayerGround;
