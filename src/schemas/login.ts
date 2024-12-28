import { isContainSpace } from "@/utils/methods";
import { InferInput, check, minLength, object, string, pipe } from "valibot";

const LoginSchema = object({
  username: pipe(
    string(),
    minLength(1, "Please enter your username."),
    check(isContainSpace, "Username cannot contain space.")
  ),
  password: pipe(
    string(),
    minLength(1, "Please enter your password."),
    check(isContainSpace, "Password cannot contain space.")
  ),
});

type LoginForm = InferInput<typeof LoginSchema>;
export { LoginSchema, type LoginForm };
