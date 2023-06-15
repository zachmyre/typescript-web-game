import { type NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Player from "~/components/Player";

const Home: NextPage = () => {
  useEffect(() => {
    const socket = io('ws://localhost:3000'); // Replace with your server's URL

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('message', (data: any) => {
      console.log('Received message:', data);
      // Do something with the received message
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>🎈</title>
        <meta name="description" content="Fun Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <Player size={6} x={10} y={5} name="John" />
      </main>
    </>
  );
};

export default Home;
