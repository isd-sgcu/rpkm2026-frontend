export function LoginPanel() {
  return (
    <section>
      <h1>Sample Login</h1>
      <form method="post">
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}
