import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Login</h1>
      <button>Login with OAuth</button>
    </div>
  );
}
