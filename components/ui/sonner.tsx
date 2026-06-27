import { InfoCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { IoAlert, IoCheckmark, IoClose } from "react-icons/io5";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IoCheckmark strokeWidth={2} className="size-4" />,
        info: <InfoCircledIcon strokeWidth={2} className="size-4" />,
        warning: <IoAlert strokeWidth={2} className="size-4" />,
        error: <IoClose strokeWidth={2} className="size-4" />,
        loading: <ReloadIcon strokeWidth={2} className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
