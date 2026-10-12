import { useState } from 'react'
import type { FormEvent } from 'react'

type LoginFormProps = {
    /** Resolves to an error message to show, or null when sign-in succeeded. */
    onSubmit: (username: string, password: string) => Promise<string | null>
}

const INPUT_CLASSES =
    'w-full rounded-xl border border-[#263831] bg-[#161f1c] px-4 py-3 text-[14px] text-[#f3efe8] placeholder:text-[#8e9993] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e] lg:text-[16px]'

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitting(true)
        setError(null)
        const message = await onSubmit(username, password)
        // On success the page swaps this form out, so only a failure needs to reset state.
        if (message) {
            setError(message)
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-[420px] flex-col gap-4 rounded-3xl border border-[#263831] bg-[#101a19] p-6 lg:p-8">
            <h1 className="m-0 font-serif text-[26px] text-[#f3efe8] lg:text-[30px]">Sign in</h1>

            <input
                type="text"
                aria-label="Username"
                placeholder="Username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={INPUT_CLASSES}
            />

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    aria-label="Password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${INPUT_CLASSES} pr-16`}
                />
                <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md px-2 py-1 text-[12px] text-[#d9c08e] hover:text-[#f3dfb5] focus-visible:outline-2 focus-visible:outline-[#d9c08e]"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>

            {error && (
                <p role="alert" className="m-0 text-[13px] text-[#f16b4e]">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="min-h-[46px] cursor-pointer rounded-full bg-[#f16b4e] px-6 text-[14px] font-medium text-[#1b211e] shadow-[0_4px_14px_rgba(241,107,78,0.3)] transition-colors hover:bg-[#ff8062] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3dfb5] disabled:pointer-events-none disabled:opacity-60"
            >
                {submitting ? 'Signing in…' : 'Sign in'}
            </button>
        </form>
    )
}
