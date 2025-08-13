import { VStack, Text } from "@chakra-ui/react";

const RegisterForm = () => {
  return (
    <VStack p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Text fontSize="2xl" fontWeight="bold" color="black">
        Register
      </Text>
    </VStack>
  );
};

export default RegisterForm;
