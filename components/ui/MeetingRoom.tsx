import { PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk';
import { useState } from 'react';




type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';


const MeetingRoom = () => {

  const [layOut, setlayOut] = useState<CallLayoutType>('speaker-left');

  //    now since we know the type so we can create a new functional component which will render a specific layout depending upon the current layout state

  const CallLayout = () => {
    switch(layOut){
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition = 'right'/>
      default:
        return <SpeakerLayout participantsBarPosition = 'left'/>

    }
  }


  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        
      </div>
    </section>
  );
}

export default MeetingRoom