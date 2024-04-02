'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './ui/button';
import { useRouter } from 'next/navigation';





const EndCallButton = () => {

    // get call details
    const call = useCall();
    const router = useRouter();

    if (!call)
        throw new Error(
            'useStreamCall must be used within a StreamCall component.',
        );


    // getting the local/current participant of the meeting out of many participants (who want to end call )

    // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    // checking if the user who wants to end call is meeting owner -> by checking if he is a localParticpant and check its userId against call details (created by) 
    const isMeetingOwner =
        localParticipant &&
        call.state.createdBy &&
        localParticipant.userId === call.state.createdBy.id;


        // if not the meeting owner then don't show the button 
    if (!isMeetingOwner) return null;           

    const endCall = async () => {
        await call.endCall();
        router.push('/');
    };

    return (
        <Button onClick={endCall} className="bg-red-500">
            End call for everyone
        </Button>
    );
};

export default EndCallButton;