import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Player, {PlayerProps} from "~/components/Player";

const Home: NextPage = () => {
  const [socketTunnel, setSocketTunnel] = useState<Socket | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [playerSize, setPlayerSize] = useState<number>(1);
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 5 });
  const [playerName, setPlayerName] = useState<string>("Zach");
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [players, setPlayers] = useState<any>({})

  useEffect(() => {
     const socket = io("ws://localhost:3000"); // Replace with your server's URL

     setSocketTunnel(socket);
    // Socket event handlers
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("id", (data: string) => {
      console.log("Received message:", data);
      setPlayerId(data);
    });

    socket.on('game', (players: any) => {
      console.log(players);
      setPlayers(players);
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      setPressedKeys((prevKeys) => new Set(prevKeys).add(key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const { key } = event;
      setPressedKeys((prevKeys) => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const playerSize = 6; // Size in rem
    const minX = playerSize / 2;
    const minY = playerSize / 2;
    const maxX = screenWidth - playerSize / 2;
    const maxY = screenHeight - playerSize / 2;

    const updatePlayerPosition = () => {
      if (pressedKeys.size === 0) {
        return;
      }

      const step = 0.5; // Adjust the step size as needed

      // Calculate the new player position based on the pressed keys
      let deltaX = 0;
      let deltaY = 0;
      if (pressedKeys.has("w")) {
        deltaY -= step;
      }
      if (pressedKeys.has("s")) {
        deltaY += step;
      }
      if (pressedKeys.has("a")) {
        deltaX -= step;
      }
      if (pressedKeys.has("d")) {
        deltaX += step;
      }

      // Calculate the diagonal movement step
      if (deltaX !== 0 && deltaY !== 0) {
        const diagonalStep = Math.sqrt(2) * step;
        deltaX *= diagonalStep;
        deltaY *= diagonalStep;
      }

      // Calculate the new player position
      const newPlayerPosition = {
        x: Math.min(maxX, Math.max(minX, playerPosition.x + deltaX)),
        y: Math.min(maxY, Math.max(minY, playerPosition.y + deltaY)),
      };

      setPlayerPosition(newPlayerPosition);
      requestAnimationFrame(updatePlayerPosition);
    };


    requestAnimationFrame(updatePlayerPosition);

    return () => {
      cancelAnimationFrame(updatePlayerPosition);
    };
  }, [playerPosition, pressedKeys]);

  useEffect(() => {
    if (socketTunnel) {
      socketTunnel.emit("player", {
        id: playerId,
        data: { x: playerPosition.x, y: playerPosition.y, name: playerName, size: playerSize },
      });
    }
  }, [socketTunnel, playerPosition]);
  

  return (
    <>
      <Head>
        <title>🎈</title>
        <meta name="description" content="Fun Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"
        tabIndex={0}
      >
                      <Player
                key={playerId}
                size={playerSize}
                x={playerPosition.x}
                y={playerPosition.y}
                name={playerName}
              />
        {Object.keys(players).map((id) => {
          const { name, x, y, size } = players[id];
          if(id == playerId){
            return;
          }
          return (
            <Player
              key={id}
              size={size}
              x={x}
              y={y}
              name={name}
            />
          );
         
        })}
      </main>
    </>
  )
      };
      

export default Home;
