import { SignIn } from '@clerk/nextjs'

/**
 * Renders Clerk's sign-in UI using hash-based routing.
 *
 * This component is a simple wrapper around Clerk's `SignIn` component that configures routing to `'hash'`.
 *
 * @returns A JSX element containing the configured `SignIn` component.
 */
export default function SignInView() {
  return <SignIn routing='hash'/>
}