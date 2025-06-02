"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => signIn()}
      >
        Sign in with GitHub
      </button>
    );
  return (
    <div className="flex items-center gap-4">
      <span>Signed in as {session.user?.email}</span>
      <button
        className="px-4 py-2 bg-gray-700 text-white rounded"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
} 