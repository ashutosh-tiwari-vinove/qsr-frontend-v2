import { useEffect } from 'react'
import KitchenHeader from '../components/kitchen/header/KitchenHeader'
import UserMenu from '../components/ops/header/UserMenu'
import LoginForm from '../components/ops/login/LoginForm'
import OpsChat from '../components/ops/opsChat/OpsChat'
import OpsQueuePanel from '../components/ops/queue/OpsQueuePanel'
import { useOpsStore } from '../store/ops.store'

function OpsPage() {
    const user = useOpsStore((state) => state.user)
    const isCheckingAuth = useOpsStore((state) => state.isCheckingAuth)
    const checkSession = useOpsStore((state) => state.checkSession)
    const login = useOpsStore((state) => state.login)
    const logout = useOpsStore((state) => state.logout)

    useEffect(() => {
        void checkSession()
    }, [checkSession])

    if (isCheckingAuth) {
        return (
            <div className="grid min-h-dvh place-items-center bg-[#0d1413]">
                <p role="status" className="m-0 text-[14px] text-[#8e9993]">Loading…</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="grid min-h-dvh place-items-center bg-[#0d1413] px-4">
                <LoginForm onSubmit={login} />
            </div>
        )
    }

    return (
        <div className="flex min-h-dvh flex-col bg-[#0d1413]">
            <KitchenHeader subtitle="Ops Dashboard">
                <UserMenu username={user.username} onLogout={() => void logout()} />
            </KitchenHeader>
            <main className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 gap-4 px-4 py-4 max-[860px]:flex-col lg:gap-6 lg:px-10 lg:py-8">
                <OpsQueuePanel />
                <OpsChat />
            </main>
        </div>
    )
}

export default OpsPage
