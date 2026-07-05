import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoLogOutOutline } from "react-icons/io5";
import { Skeleton } from "./skeleton";
export const Profile = () => {
  const { user, logOut, status } = useUser();
  if (!["IDLE", "FETCHING"].includes(status))
    return <Skeleton className="size-8 bg-gray-300 rounded-full" />;
  if (!user) return;
  const imageUrl = user.image ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            {user.name.match(/\b(\w)/g)?.join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={logOut}>
            <IoLogOutOutline />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
