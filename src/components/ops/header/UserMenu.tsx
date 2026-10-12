import { useEffect, useRef, useState } from 'react'

type UserMenuProps = {
    username: string
    onLogout: () => void
}

export default function UserMenu({ username, onLogout }: UserMenuProps) {
    const [open, setOpen] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handlePointerDown = (event: MouseEvent) => {
            if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open])

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                title={username}
                aria-label={`Account menu for ${username}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="grid size-[34px] cursor-pointer place-items-center rounded-full border border-[rgba(217,192,142,0.42)] bg-[#d9c08e] font-serif text-[14px] font-bold text-[#0c2c24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3dfb5] lg:size-[40px]"
            >
                {username.charAt(0).toUpperCase() || '?'}
            </button>
            {open && (
                <div role="menu" className="absolute top-full right-0 z-20 mt-2 min-w-[140px] rounded-xl border border-[#263831] bg-[#151c1b] p-1 shadow-lg">
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false)
                            onLogout()
                        }}
                        className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[13px] text-[#f3efe8] hover:bg-[#1d2a25] focus-visible:outline-2 focus-visible:outline-[#d9c08e]"
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    )
}
