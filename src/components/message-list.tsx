import { useQuery, gql } from "@apollo/client";
import { useInView } from "react-intersection-observer";
import React, { useState, useEffect } from 'react';
import type { Message as IMessage } from "@/components/message";
import { Message } from "@/components/message";

const GetRecentMessagesQuery = gql`
  query GetRecentMessages($last: Int) @live {
    messageCollection(last: $last) {
      edges {
        node {
          id
          username
          avatar
          body
          likes
          createdAt
        }
      }
    }
  }
`;

export const MessageList = () => {

  const [messages, setMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    const eventSource = new EventSource('/api/sse');
  
    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data) as IMessage; // Parse the message as IMessage type
      setMessages((prevMessages: IMessage[]) => [...prevMessages, message]);
    };

    eventSource.onerror = (error) => {
      console.error('Error occurred:', error);
    };
    
    return () => {
      // Cleanup: close the EventSource connection when the component unmounts
      eventSource.close();
    };
  }, []);

    const { loading, error, data } = useQuery<{
      messageCollection: { edges: { node: IMessage }[] };
    }>(GetRecentMessagesQuery, {
      variables: {
        last: 100,
      },
    });
    
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 1000,
  });


  useEffect(() => {
    if (entry?.target) {
      entry.target.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [data?.messageCollection.edges.length, entry?.target]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Fetching most recent chat messages.</p>
      </div>
    );

  if (error)
    return (
      <p className="text-white">Something went wrong. Refresh to try again.</p>
    );

  return (
    <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
      {!inView && data?.messageCollection.edges.length && (
        <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-[120px] inset-x-0">
          <button
            className="py-1.5 px-3 text-xs bg-[#1c1c1f] border border-[#363739] rounded-full text-white font-medium"
            onClick={() => {
              entry?.target.scrollIntoView({ behavior: "smooth", block: "end" })
            }}
          >
            Scroll to see latest messages
          </button>
        </div>
      )}
      {data?.messageCollection?.edges?.map(({ node }) => (
        <Message key={node?.id} message={node} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};
