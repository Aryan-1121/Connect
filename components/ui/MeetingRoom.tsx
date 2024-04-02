import { cn } from '@/lib/utils';
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useState } from 'react';

import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from '../EndCallButton';
import Loader from '../Loader';





type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';


const MeetingRoom = () => {

  const router = useRouter();
  const [showParticipants, setShowParticipants] = useState(false);
  
  const [layOut, setlayOut] = useState<CallLayoutType>('speaker-left');
  
  
  // if it is a personal room then true else false  -> !!
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');      // getting personal query from url



  const { useCallCallingState } = useCallStateHooks();      // useCallStateHooks => A hook-alike function that exposes all call state hooks.
  // useCallCallingState -> Utility hook providing the current calling state of the call. For example, RINGING or JOINED.
  const callingState = useCallCallingState();


  if(callingState !== CallingState.JOINED){
    return <Loader />
  }





  //    now since we know the type so we can create a new functional component which will render a specific layout depending upon the current layout state

  const CallLayout = () => {
    switch (layOut) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition='right' />
      default:
        return <SpeakerLayout participantsBarPosition='left' />

    }
  }


  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
            {/* when click on leave button route to home page   */}
        <CallControls onLeave={() => router.push('/')}/>    

          {/*  dropdown to change layout coming from shadcn */}

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem className='cursor-pointer'
                  onClick={() =>
                    setlayOut(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />


        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {!isPersonalRoom && <EndCallButton />}

      </div>
    </section>
  );
}

export default MeetingRoom