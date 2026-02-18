"use client";

import { SearchUserResult } from "@/lib/api/search";
import { ConnectionRequest } from "@/lib/api/connections";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/Avatar";
import {
  MapPin,
  Users,
  UserPlus,
  MessageCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfileUrl } from "@/lib/utils/routes";
import ConnectModal from "../connections/ConnectModal";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useConnections } from "@/lib/hooks/useConnections";

interface MemberCardProps {
  member: SearchUserResult;
  onAccept?: (requestId: string) => void;
  incomingRequest?: ConnectionRequest;
  isConnecting?: boolean;
}

export default function MemberCard({
  member,
  onAccept,
  incomingRequest,
  isConnecting,
}: MemberCardProps) {
  const router = useRouter();

  const { sendRequest, useConnectionStatus,isSending,isResponding } = useConnections();

  const targetId = member.id;
  const { isAuthenticated } = useAuth();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const { data: connectionStatusData, refetch: refetchStatus } =
    useConnectionStatus(targetId);

      const [localConnectionStatus, setLocalConnectionStatus] = useState<'PENDING' | null>(null)
  // Navigate to profile on click (unless clicking button)
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking buttons/links
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    router.push(getProfileUrl(member));
  };

  const connectionStatus = useMemo(() => {
    if (!isAuthenticated || !targetId) return "NONE";

    // Optimistic update
    if (localConnectionStatus === "PENDING") return "PENDING";

    // Status from backend
    if (connectionStatusData) {
      if (connectionStatusData.status === "CONNECTED") return "CONNECTED";
      if (connectionStatusData.status === "PENDING_INCOMING") return "INCOMING";
      if (connectionStatusData.status === "PENDING_OUTGOING") return "PENDING";
    }

    return "NONE";
  }, [
    isAuthenticated,
    targetId,
    connectionStatusData,
    localConnectionStatus,
  ]);

  const handleConnect = async (message?: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!targetId) return;

    // If we have a message, it's a confirmed send from the modal
    if (message !== undefined) {
      try {
        await sendRequest(targetId, message);
        setLocalConnectionStatus("PENDING");
        setIsConnectModalOpen(false);
        toast.success("Connection request sent");
      } catch (error) {
        console.error("Connection request failed", error);
        toast.error("Failed to send connection request");
      }
      return;
    }

    // Otherwise open modal
    setIsConnectModalOpen(true);
  };

  const renderActionButton = () => {
    if (member.connectionStatus === "connected") {
      return (
        <Button
          variant="outline"
          className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
          onClick={() => router.push(`/messages?userId=${member.id}`)}
        >
          <MessageCircle size={16} />
          Message
        </Button>
      );
    }

    if (member.connectionStatus === "pending") {
      return (
        <Button
          variant="secondary"
          className="w-full gap-2 bg-muted text-muted-foreground cursor-not-allowed"
          disabled
        >
          <Clock size={16} />
          Pending
        </Button>
      );
    }

    if (incomingRequest && onAccept) {
      return (
        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90"
          onClick={() => onAccept(incomingRequest.id)}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          ) : (
            <UserCheck size={16} />
          )}
          Accept Request
        </Button>
      );
    }

    return (
      <Button
        className="w-full gap-2"
        onClick={() => handleConnect?.()}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        ) : (
          <UserPlus size={16} />
        )}
        Connect
      </Button>
    );
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-card hover:bg-accent/5 transition-colors border border-border rounded-xl p-5 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="relative mb-4">
          <div className="w-24 h-24 relative">
            <Avatar
              src={member.profilePhoto}
              name={`${member.firstName} ${member.lastName}`}
              className="w-24 h-24 text-2xl"
            />
          </div>
          {/* Availability dot could go here */}
          {member.availabilityStatus === "AVAILABLE" && (
            <div
              className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"
              title="Available for work"
            />
          )}
        </div>

        <div className="space-y-1 mb-4 w-full">
          <Link
            href={getProfileUrl(member)}
            className="font-bold text-lg text-foreground hover:text-primary hover:underline line-clamp-1"
          >
            {member.firstName} {member.lastName}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {member.headline || member.primaryRole || "Member"}
          </p>
        </div>

        <div className="w-full space-y-2 mb-6">
          {/* Role Badge */}
          {member.primaryRole && (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2">
              {member.primaryRole}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground items-center">
            {member.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={12} />
                <span className="truncate max-w-[150px]">
                  {member.location}
                </span>
              </div>
            )}
            {member.chapter && (
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span className="truncate max-w-[150px]">
                  {member.chapter.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto w-full pt-4 border-t border-border">
          {renderActionButton()}
        </div>
      </div>

      {targetId && (
            <ConnectModal
              isOpen={isConnectModalOpen}
              onClose={() => setIsConnectModalOpen(false)}
              onConfirm={handleConnect}
              recipientName={member?.firstName || 'User'}
              isSending={isSending}
            />
          )}
    </>
  );
}
