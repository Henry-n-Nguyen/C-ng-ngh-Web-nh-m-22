"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import clsx from "clsx";
import { find } from "lodash";

import useConversation from "@/app/hooks/useConversation";
import GroupChatModal from "@/app/components/modals/GroupChatModal";
import ConversationBox from "./ConversationBox";
import { FullConversationType, FullCallType } from "@/app/types";
import RecipveCallModal from "@/app/components/modals/RecipveCallModal";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [otherUser, setOtherUser] = useState<User>();
  const [roomId, setRoomId] = useState<String>();

  const router = useRouter();
  const session = useSession();

  const { conversationId, isOpen } = useConversation();

  return (
    <>
      <RecipveCallModal
        user={otherUser!}
        roomId={roomId!}
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
      />
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
      fixed 
      inset-y-0
      pb-20
      lg:pb-0
      lg:w-80 
      lg:left-20
      lg:block
      overflow-y-auto
      border-r
      border-gray-200
      `,
          isOpen ? "hidden" : "block w-full- left-0"
        )}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Hộp thư</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                    rounded-full
                    p-2
                    bg-gray-100
                    text-gray-600
                    cursor-pointer
                    hover:opacity-75
                    transition
                    ">
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
