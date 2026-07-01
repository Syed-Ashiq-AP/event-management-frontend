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
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { handleGithub, handleGoogle } from "@/lib/providers";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";

const API_URL = import.meta.env.VITE_API_URL;

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const LoginPage = () => {
  const { getUser } = useUser();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { status } = await axios.post(
          `${API_URL}/auth/sign-in/email`,
          value,
          {
            withCredentials: true,
          },
        );
        if (status === 200) {
          await getUser();
          navigate("/");
          toast.success("Loged In!");
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

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    switch (error) {
      case "signup_disabled":
        toast.error("No account found. Please sign up first.");
        break;

      default:
        toast.error("Something went wrong.");
    }
  }, [searchParams]);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm mx-10">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-full"
              onClick={() => handleGithub()}
            >
              <FaGithubAlt />
              <span>Login with GitHub</span>
            </Button>
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-full"
              onClick={() => handleGoogle()}
            >
              <FcGoogle />
              <span>Login with Google</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2 my-4">
            <hr className="flex-1" />
            <span className=" text-muted-foreground">Or continue with</span>
            <hr className="flex-1" />
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
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
                Log in
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already signed up?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
