import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {

    const [calls, setCalls] = useState<Call[]>();

    const client = useStreamVideoClient();      // to fetch all calls

    const [isLoading, setIsLoading] = useState(false);          // to track loading state while fetchin calls

    const { user } = useUser();         // since we might need to fetch call for specific user


    // an useEffect to listen to the changes for client or userId 
    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return;

            setIsLoading(true);          // starting to fetch calls , once done we wil mark it as false

            try {
                // https://getstream.io/video/docs/react/guides/querying-calls/#filters
                // destructuring the calls from video stream client
                const { calls } = await client.queryCalls({
                    //      sort by starting time of meeting
                    sort: [{ field: 'starts_at', direction: -1 }],
                    //  we don't want to show all the meeting calls, so we will filter and show only those which the current logged in user created or he/she is a member of a call/meeting
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: user.id },
                            { members: { $in: [user.id] } },
                        ],
                    },
                });

                setCalls(calls);
            } catch (error) {
                console.error(error);
            } finally {
                // in any case stop loading 
                setIsLoading(false);
            }
        };

        loadCalls();
    }, [client, user?.id]);


    const now = new Date();


    // ended calls are those whose starting time < current time 

    const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
        return (startsAt && new Date(startsAt) < now) || !!endedAt
    })


    //      upcoming calls are those whose starting time > current time 
    const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
        return startsAt && new Date(startsAt) > now
    })

    return {
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading
    }




}