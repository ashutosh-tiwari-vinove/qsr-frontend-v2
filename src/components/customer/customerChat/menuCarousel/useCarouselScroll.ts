import { useCallback, useEffect, useRef, useState } from 'react'

type ScrollState = {
    canScrollPrev: boolean
    canScrollNext: boolean
    /** Scroll-progress thumb, as percentages of the track. */
    thumbWidth: number
    thumbOffset: number
}

const INITIAL_STATE: ScrollState = { canScrollPrev: false, canScrollNext: false, thumbWidth: 100, thumbOffset: 0 }

/** Tracks a horizontally scrolling element and exposes paging helpers. */
export function useCarouselScroll<T extends HTMLElement>(dependency: unknown) {
    const trackRef = useRef<T>(null)
    const [state, setState] = useState<ScrollState>(INITIAL_STATE)

    const update = useCallback(() => {
        const el = trackRef.current
        if (!el) return
        const { scrollLeft, scrollWidth, clientWidth } = el
        const maxScroll = scrollWidth - clientWidth
        setState({
            canScrollPrev: scrollLeft > 4,
            canScrollNext: scrollLeft < maxScroll - 4,
            thumbWidth: scrollWidth > 0 ? (clientWidth / scrollWidth) * 100 : 100,
            thumbOffset: scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0,
        })
    }, [])

    useEffect(() => {
        const el = trackRef.current
        if (!el) return

        let frame = 0
        const schedule = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(update)
        }

        update()
        el.addEventListener('scroll', schedule, { passive: true })
        const observer = new ResizeObserver(schedule)
        observer.observe(el)

        return () => {
            cancelAnimationFrame(frame)
            el.removeEventListener('scroll', schedule)
            observer.disconnect()
        }
    }, [update, dependency])

    const scrollByPage = useCallback((direction: 1 | -1) => {
        const el = trackRef.current
        if (!el) return
        el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
    }, [])

    return { trackRef, scrollByPage, ...state }
}
