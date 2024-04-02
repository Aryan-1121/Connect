'use client'        // bcs we are using hooks

import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { toast } from './ui/use-toast';





const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {

    // to fetch all calls we will create a custom Hook 
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();


    const router = useRouter();             // to know where we are and for routing 

    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    //  to getcalls depending on which page we are on, we need to fetch those particular set of calls
    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'recordings':
                return recordings;
            case 'upcoming':
                return upcomingCalls;
            default:
                return [];
        }
    };




    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };



    //          FOR RECORDING   WE USE USEEFFECT FOR EACH CALL 

    useEffect(() => {
        // trying to fetch recordings for each  call
        const fetchRecordings = async () => {
            //  to handle this error we will put it in a try catch -> Error: Stream error code 9: ListRecordings failed with error: "Too many requests for user: user_2eT57XHIA9QiSvo8iUz6dy64D4m, check response headers for more information."
            try {
                const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [] );
    
    
                const recordings = callData
                    .filter(call => call.recordings.length > 0)
                    .flatMap(call => call.recordings);
    
    
                setRecordings(recordings);
                
            } catch (error) {
                toast({title : 'Try again in a moment !'});
            }
        }

        if (type === 'recordings')
            fetchRecordings();


    }, [type, callRecordings])







    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();


    if (isLoading)
        return <Loader />

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                        key={(meeting as Call).id}
                        // icon - if type=ended then show previous.svg else{ if(type==upcoming) then -> upcoming.svg, else->recordings.svg }
                        icon={
                            type === 'ended'
                                ? '/icons/previous.svg'
                                : type === 'upcoming'
                                    ? '/icons/upcoming.svg'
                                    : '/icons/recordings.svg'
                        }

                        title={
                            (meeting as Call).state?.custom?.description || (meeting as CallRecording).filename?.substring(0, 25) || 'Personal Meeting'
                        }

                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time?.toLocaleString()
                        }

                        isPreviousMeeting={type === 'ended'}

                        link={
                            type === 'recordings'
                                ? (meeting as CallRecording).url
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                        }

                        buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}

                        buttonText={type === 'recordings' ? 'Play' : 'Start'}

                        handleClick={
                            type === 'recordings'
                                ? () => router.push(`${(meeting as CallRecording).url}`)
                                : () => router.push(`/meeting/${(meeting as Call).id}`)
                        }
                    />
                ))
            ) : (
                <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
            )}
        </div>
    )
}

export default CallList