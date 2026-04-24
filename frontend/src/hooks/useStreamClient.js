import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let isMounted = true;

    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        if (!isMounted) return;

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (!isMounted) return;

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });

        if (!isMounted) return;
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        // Check if already connected or connecting
        if (chatClientInstance.userID !== userId) {
          await chatClientInstance.disconnectUser();
          await chatClientInstance.connectUser(
            {
              id: userId,
              name: userName,
              image: userImage,
            },
            token
          );
        } else if (!chatClientInstance.user) {
          // If instance exists but no user (edge case), connect
          await chatClientInstance.connectUser(
            {
              id: userId,
              name: userName,
              image: userImage,
            },
            token
          );
        }

        if (!isMounted) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();

        if (!isMounted) return;
        setChannel(chatChannel);
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        if (isMounted) {
          setIsInitializingCall(false);
        }
      }
    };

    if (session && !loadingSession) initCall();

    // cleanup - performance reasons
    return () => {
      isMounted = false;
      // iife
      (async () => {
        try {
          if (videoCall) {
            try {
              await videoCall.leave();
            } catch (error) {
              // Ignore error if call is already left
              if (error.message.includes("already been left")) {
                console.log("Call already left, ignoring error.");
              } else {
                console.error("Error leaving call:", error);
              }
            }
          }
          // We don't verify strict mode here, but avoiding disconnect if we are just remounting would require more complex state.
          // However, checking isMounted in the async initCall helps prevent using a client that's about to be killed.
          // For now, valid cleanup is important.

          // Only disconnect chat if we are the ones who likely connected it (or it's safe to do so)
          // Ideally we don't disconnect the global singleton on every unmount if we plan to reuse, 
          // but for this specific session page, leaving means disconnecting.

          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
