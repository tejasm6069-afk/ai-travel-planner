'use client';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Icon from './travel-icon';

function ConnectedAccount() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return <span className="account-loading" aria-label="Loading account" />;
  return isSignedIn ? <UserButton /> : <SignInButton mode="modal"><button className="button small secondary">Sign in <Icon name="arrow" size={15} /></button></SignInButton>;
}
export default function Account() {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <ConnectedAccount /> : <span className="pill">Explorer mode</span>;
}
export function SignInPrompt({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <p className="muted">Account access is being set up. You can still explore and try the sample trip.</p>;
  return <SignInButton mode="modal"><button className="button primary">{children}<Icon name="arrow" size={17} /></button></SignInButton>;
}


