import { SignUp } from '@clerk/nextjs'

/**
 * Renders Clerk's sign-up UI using hash-based routing.
 *
 * This is a stateless wrapper around Clerk's `SignUp` component that forces
 * hash routing (`routing='hash'`). Useful as a dedicated view for user
 * registration in the app's routing layout.
 *
 * @returns The sign-up JSX element from Clerk.
 */
export default function SignUpView() {
  return <SignUp routing='hash'/>
}