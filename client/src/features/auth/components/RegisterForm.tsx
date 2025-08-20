import {
  Button,
  Field,
  Fieldset,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { registerSchema } from "@chirp/shared/validation/register.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

const registerUser = async (values: RegisterFormValues) => {
  console.log(values);
};

const RegisterForm = () => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <Fieldset.Root size="lg" maxW="lg" minW="md">
      <VStack p={8}>
        <Fieldset.Legend
          fontFamily="mono"
          fontSize="2xl"
          color="white"
          fontWeight="semibold"
          margin={2}
          onSubmit={handleSubmit(registerUser)}
        >
          Create your account
        </Fieldset.Legend>
        <Fieldset.Content>
          {/* Username field */}
          <Field.Root required invalid={!!errors.username}>
            <Field.Label>
              Username <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="username" name="username" type="text" />
            <Field.ErrorText>Invalid username</Field.ErrorText>
          </Field.Root>
          {/* Email field */}
          <Field.Root required invalid={!!errors.email}>
            <Field.Label>
              Email address <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="email" name="email" type="email" />
            <Field.ErrorText>Invalid email</Field.ErrorText>
          </Field.Root>
          {/* Password field */}
          <Field.Root required invalid={!!errors.password}>
            <Field.Label>
              Password <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="password" name="password" type="password" />
            <Field.ErrorText>Invalid password</Field.ErrorText>
          </Field.Root>
          {/* Password confirmation field */}
          <Field.Root required invalid={!!errors.passwordConfirm}>
            <Field.Label>
              Confirm Password <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="confirm password"
              name="passwordConfirm"
              type="password"
            />
            <Field.ErrorText>Passwords do not match</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>
        <Button type="submit" w="100%" mt={3} bgColor="#443691">
          Register
        </Button>
        <Stack direction="row" h="20" w="100%">
          <Text fontSize="sm" mt={2} fontFamily="mono">
            Already have an account ?
          </Text>
          <Link href="#" display="inline" mt={2} fontFamily="mono">
            Sign in
          </Link>
        </Stack>
      </VStack>
    </Fieldset.Root>
  );
};

export default RegisterForm;
