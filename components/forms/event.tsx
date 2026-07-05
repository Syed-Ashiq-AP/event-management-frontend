import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { DateTimePicker } from "../ui/date-time-input";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useUser } from "@/hooks/use-user";
import z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(3, "Min 3 Chars"),
  eventDate: z.string().pipe(z.iso.datetime()),
  description: z.string().min(10, "Min 10 Chars").max(250, "Max 250 Chars"),
  location: z.string(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED", "COMPLETED"]),
});

type EventProps =
  | {
      update: true;
      value: EventUpdate;
      onUpdate: () => void;
    }
  | {
      update: false;
      value?: EventForm;
      onUpdate?: () => void;
    };

export const EventForm = ({
  value = {
    title: "",
    eventDate: new Date().toISOString(),
    description: "",
    location: "",
    status: "OPEN",
  },
  update = false,
  onUpdate,
}: EventProps) => {
  const { createEvent, updateEvent, status } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: value,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const created = update
        ? await updateEvent(value as EventUpdate)
        : await createEvent(value as EventForm);
      if (!created) toast.error("Failed to Organize Event!");
      if (update) {
        if (created) toast.success("Event updated successfully!");
        onUpdate && onUpdate();
      } else {
        if (created) toast.success("Event created successfully!");
        navigate("/events");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Event Title"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Event Description"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="location"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Event Venue"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="eventDate"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <DateTimePicker
                  value={field.state.value}
                  onChange={(date: Date) => {
                    field.handleChange(date.toISOString());
                  }}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        {update && (
          <form.Field
            name="status"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"outline"}>{field.state.value}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onSelect={() => field.handleChange("OPEN")}
                        >
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => field.handleChange("CLOSED")}
                        >
                          Closed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => field.handleChange("IN_PROGRESS")}
                        >
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => field.handleChange("COMPLETED")}
                        >
                          Completed
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        )}
      </FieldGroup>
      <Button
        disabled={status !== "IDLE"}
        className="my-4 w-full"
        size={"lg"}
        type="submit"
      >
        {update ? "Update Event" : "Organize Event"}
      </Button>
    </form>
  );
};
