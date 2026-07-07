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
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

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

  const [socialError, setSocialError] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;
    switch (error) {
      case "invalid_callback_request":
        setSocialError("Invalid sign-in callback. Please try again.");
        break;

      case "invalid_code":
        setSocialError("Invalid or expired sign-in code. Please try again.");
        break;

      case "internal_server_error":
        setSocialError(
          "The server could not complete sign in. Please try again.",
        );
        break;

      case "state_not_found":
        setSocialError("Your sign-in session expired. Please try again.");
        break;

      case "state_invalid":
        setSocialError("Invalid sign-in session. Please try again.");
        break;

      case "state_mismatch":
        setSocialError("Sign-in session mismatch. Please start again.");
        break;

      case "no_code":
        setSocialError("Missing sign-in code. Please try again.");
        break;

      case "no_callback_url":
        setSocialError("Missing callback URL. Please contact support.");
        break;

      case "oauth_provider_not_found":
        setSocialError(
          "Sign-in provider not found. Please try another provider.",
        );
        break;

      case "email_not_found":
        setSocialError("We could not find an email from this provider.");
        break;

      case "email_doesn't_match":
        setSocialError("Provider email does not match this account.");
        break;

      case "unable_to_get_user_info":
        setSocialError("Could not get your profile from the provider.");
        break;

      case "unable_to_link_account":
        setSocialError("Could not link this provider to your account.");
        break;

      case "unable_to_create_user":
        setSocialError("Could not create your account. Please try again.");
        break;

      case "unable_to_create_session":
        setSocialError("Could not create your session. Please try again.");
        break;

      case "account_not_linked":
        setSocialError("This provider is not linked to your account.");
        break;

      case "account_already_linked_to_different_user":
        setSocialError("This provider is already linked to another account.");
        break;

      case "signup_disabled":
        setSocialError("No account found. Please sign up first.");
        break;

      default:
        setSocialError("Something went wrong.");
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
            <span className=" text-destructive">{socialError}</span>
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
                Don't have an account?{" "}
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
