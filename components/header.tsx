import { Skeleton } from "./ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Profile } from "./ui/profile";

const Menu = {
  PARTICIPANT: [
    { label: "My Registrations", href: "/" },
    { label: "Events", href: "/events" },
    { label: "My Certificates", href: "/certificates" },
  ],
  ORGANIZER: [
    { label: "Dashboard", href: "/" },
    { label: "My Events", href: "/events" },
    { label: "Organize Event", href: "/organize" },
  ],
};

export const Header = () => {
  const { user } = useUser();
  const { pathname } = useLocation();

  return (
    <div className="border-b flex space-x-8 p-4 items-center bg-background">
      <h2 className="text-xl font-bold">Event Organizer</h2>
      <nav className="flex-1">
        <ul className="p-2 flex space-x-8 text-sm">
          {["/sign-in", "/sign-up"].includes(pathname) ? (
            <></>
          ) : !user ? (
            <>
              <li>
                <Skeleton className="w-25 h-6 bg-gray-200" />
              </li>
              <li>
                <Skeleton className="w-25 h-6 bg-gray-200" />
              </li>
              <li>
                <Skeleton className="w-25 h-6 bg-gray-200" />
              </li>
            </>
          ) : (
            user.role &&
            Menu[user.role].map(({ label, href }, i) => (
              <li key={i}>
                <a
                  href={href}
                  className={cn(
                    "hover:text-foreground text-muted-foreground transition-all",
                    pathname === href && "text-foreground",
                  )}
                >
                  {label}
                </a>
              </li>
            ))
          )}
        </ul>
      </nav>
      <Profile />
    </div>
  );
};
