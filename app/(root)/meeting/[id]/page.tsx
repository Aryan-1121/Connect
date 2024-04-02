'use client'


import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/ui/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/Loader';

const Meeting = () => {


  // get currently authenticated/loggedIn user 
  const {user, isLoaded} = useUser();
  const { id } = useParams();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  
  if (!isLoaded || isCallLoading) return <Loader />;


  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

          {/* if meeting setup(video + mic ) is not done then first send the control to Meeting setUp where user will get the preview and setUp options for mic and camera  */}

          {/* else if setUp is done/completed then forward to Meeting room   */}
          
        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );

}

export default Meeting