import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaGithubAlt } from "react-icons/fa";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { handleGithub, handleGoogle } from "@/lib/providers";
import { useUser } from "@/hooks/use-user";

const API_URL = import.meta.env.VITE_API_URL;

const formSchema = z.object({
  role: z.enum(["PARTICIPANT", "ORGANIZER"]),
  name: z.string().min(4, "Enter Valid Name"),
  email: z.email(),
  password: z.string(),
});

export const SignUpPage = () => {
  const { getUser } = useUser();

  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      role: "",
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { status } = await axios.post(
          `${API_URL}/auth/sign-up/email`,
          value,
          {
            withCredentials: true,
          },
        );

        if (status === 200) {
          await getUser();
          navigate("/");
          toast.success("Signed Up!");
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Invalid Credentials");
          return;
        }

        toast.error(error.response?.data?.message ?? "Something went wrong");
      }
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm mx-10">
        <CardHeader>
          <CardTitle>Welcome </CardTitle>
          <CardDescription>
            Sign up with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field
                  name="role"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>User Role</FieldLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              aria-invalid={isInvalid}
                              onBlur={field.handleBlur}
                              name={field.name}
                              id={field.name}
                              className=" capitalize"
                            >
                              {field.state.value.toLocaleLowerCase()}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onSelect={() => field.handleChange("PARTICIPANT")}
                            >
                              Participant
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => field.handleChange("ORGANIZER")}
                            >
                              Organizer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <div className="space-y-2">
                  <Button
                    size={"lg"}
                    variant={"outline"}
                    className="w-full"
                    onClick={async () => {
                      const role = form.state.values.role;

                      if (!role || role === "") {
                        form.setFieldMeta("role", (meta) => ({
                          ...meta,
                          errorMap: { onBlur: { message: "Set your Role" } },
                        }));
                        return;
                      }
                      localStorage.setItem("user-role", form.state.values.role);
                      handleGithub(true);
                    }}
                  >
                    <FaGithubAlt />
                    <span>Sign up with GitHub</span>
                  </Button>
                  <Button
                    size={"lg"}
                    variant={"outline"}
                    className="w-full"
                    onClick={() => {
                      const role = form.state.values.role;

                      if (!role || role === "") {
                        form.setFieldMeta("role", (meta) => ({
                          ...meta,
                          errorMap: { onBlur: { message: "Set your Role" } },
                        }));
                        return;
                      }
                      localStorage.setItem("user-role", form.state.values.role);
                      handleGoogle(true);
                    }}
                  >
                    <FcGoogle />
                    <span>Sign up with Google</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-2 my-4">
                  <hr className="flex-1" />
                  <span className=" text-muted-foreground">
                    Or continue with
                  </span>
                  <hr className="flex-1" />
                </div>
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Example"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="m@example.com"
                          type="email"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Password"
                          type="password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <Button className="my-4 w-full" size={"lg"} type="submit">
                Sign Up
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
