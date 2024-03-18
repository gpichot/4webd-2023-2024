import { useForm } from "@conform-to/react";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import useAuthContext from "../hooks/useAuthContext";
import { useState } from "react";
import { Button, Center, Group, Paper, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export default function SignInForm() {
  const auth = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignInFormSchema });
    },
    onSubmit: async (e, context) => {
      e.preventDefault();
      const { formData } = context;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const id = notifications.show({
        loading: true,
        title: "Authenticating",
        message: "Please wait while we authenticate you...",
        autoClose: false,
        withCloseButton: false,
      });
      try {
        await auth.signIn({ email, password });
        notifications.update({
          id,
          loading: false,
          color: "green",
          title: "Authentifié",
          message: "Connexion réussie",
        });
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          notifications.update({
            id,
            color: "red",
            loading: false,
            title: e.message,
            message: "Erreur lors de la connexion",
          });
          return;
        }
        notifications.update({
          id,
          loading: false,
          color: "red",
          title: "Erreur lors de la connexion",
          message: "Réessayez plus tard...",
        });
        throw e;
      }
    },
  });

  return (
    <Center style={{ minHeight: "100vh" }} bg="blue">
      <Paper shadow="xl" p="xl" style={{ minWidth: 400 }}>
        <form method="post" id={form.id} onSubmit={form.onSubmit}>
          <Title ta="center" py="lg">
            AM BigBank
          </Title>
          <div>{form.errors}</div>
          {error && <div>{error}</div>}
          <TextInput
            label="Email"
            name={fields.email.name}
            error={fields.email.errors}
          />
          <TextInput
            label="Password"
            name={fields.password.name}
            error={fields.password.errors}
            pb="xl"
            type="password"
          />
          <Group justify="right">
            <Button type="submit">Login</Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
