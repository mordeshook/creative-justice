'use client';

export default function ConfirmPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Thanks for Signing Up!</h1>
      <p className="text-gray-700 max-w-md">
        Welcome to the Creative Justice Challenge. A confirmation email has been sent to your inbox.
        Please verify your email to complete your registration and begin building your profile.
      </p>
    </div>
  );
}
