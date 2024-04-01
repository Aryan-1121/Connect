import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';


interface MeetingModalProps {
    title: string;
    className?: string;
    children?: ReactNode;
    handleClick?: () => void;
    buttonText?: string;
    image?: string;
    buttonIcon?: string;
    isOpen: boolean;
    onClose : ()=>void;
}



const MeetingModal = ({ isOpen, onClose, title, className, children, handleClick, buttonText, image, buttonIcon }: MeetingModalProps) => {


    return (
        // isOpen is defined to be isInstantMeeting in MeetingTypeList
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>

                <div className='flex flex-col gap-6'>
                    {/* if we have image the only render it  */}
                    {image && (
                        <div className="flex justify-center">
                            <Image src={image} alt="checked" width={72} height={72} />
                        </div>
                    )}

                    <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
                        {title}
                    </h1>

                    {/* below title render any children if in case there are any */}

                    {children}

                    <Button
                        className={
                            "bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                        }
                        onClick={handleClick}
                    >
                        {/* if buttonIcon exists then render its image */}
                        {buttonIcon && (
                            <Image
                                src={buttonIcon}
                                alt="button icon"
                                width={13}
                                height={13}
                            />
                        )}{" "}
                        &nbsp;
                        {/* &nbsp is for extra space */}
                        {buttonText || "Schedule Meeting"}
                    </Button>

                </div>

            </DialogContent>
        </Dialog>



    )
}

export default MeetingModal