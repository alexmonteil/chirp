import {
  Button,
  Field,
  Fieldset,
  Input,
  VStack,
  Text,
  Link,
  Stack,
} from "@chakra-ui/react";

const RegisterForm = () => {
  return (
    <Fieldset.Root size="lg" maxW="lg" minW="md">
      <VStack p={8}>
        <Fieldset.Legend
          fontFamily="mono"
          fontSize="2xl"
          color="white"
          fontWeight="semibold"
          margin={2}
        >
          Create your account
        </Fieldset.Legend>
        <Fieldset.Content>
          <Field.Root required>
            <Field.Label>
              Username <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="username" name="username" type="text" />
            <Field.ErrorText>Invalid username</Field.ErrorText>
          </Field.Root>
          <Field.Root required>
            <Field.Label>
              Email address <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="email" name="email" type="email" />
            <Field.ErrorText>Invalid email</Field.ErrorText>
          </Field.Root>
          <Field.Root required>
            <Field.Label>
              Password <Field.RequiredIndicator />
            </Field.Label>
            <Input placeholder="password" name="password" type="password" />
            <Field.ErrorText>Invalid password</Field.ErrorText>
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
