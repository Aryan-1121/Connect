'use client'
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const userId = 'user-id';
const token = 'authentication-token';
const user: User = { id: userId };

//   const client = new StreamVideoClient({ apiKey, user, token });
//   const call = client.call('default', 'my-first-call');
//   call.join({ create: true });

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {

    const [videoClient, setvideoClient] = useState<StreamVideoClient>()

// get the user details from currently logged in user from  CLERK and use it as a new Stream user to start a meeting 
    const { user, isLoaded } = useUser();

    useEffect(() => {
        // at start or due to any reason if user doesn't exists then simply return/exit out of function  
        if (!isLoaded || !user) return;
        if (!API_KEY) throw new Error('Stream API key is missing');

        //  creating new video client ->
        const client = new StreamVideoClient({
            apiKey: API_KEY,
            user: {
                id: user?.id,
                name: user?.username || user?.id,
                image: user?.imageUrl,
            },
            tokenProvider,
        });

        setvideoClient(client);
    }, [user, isLoaded]);


// until or if there is no video client yet then show a loader 
    if (!videoClient) return <Loader />;

    return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
