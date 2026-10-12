import { useCallback, useRef, useState } from 'react'
import type { MenuAttribute, MenuItem } from '../../../../api/api'
import { MAX_NOTE_LENGTH, MAX_QUANTITY, MIN_QUANTITY, createDraft, isMultiSelect } from './dishSelection.utils'
import type { DishDraft } from './dishSelection.utils'

/** Owns every open dish card. Each draft is updated by id, so other drafts are never touched. */
export function useDishDrafts() {
    const [drafts, setDrafts] = useState<DishDraft[]>([])
    const nextId = useRef(0)

    const updateDraft = useCallback((draftId: string, update: (draft: DishDraft) => DishDraft) => {
        setDrafts((prev) => prev.map((draft) => (draft.draftId === draftId ? update(draft) : draft)))
    }, [])

    const openDraft = useCallback((item: MenuItem): DishDraft => {
        const draft = createDraft(`draft-${nextId.current++}`, item)
        setDrafts((prev) => [...prev, draft])
        return draft
    }, [])

    const setQuantity = useCallback(
        (draftId: string, quantity: number) =>
            updateDraft(draftId, (draft) => ({
                ...draft,
                quantity: Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity)),
            })),
        [updateDraft],
    )

    const toggleOption = useCallback(
        (draftId: string, attribute: MenuAttribute, value: string) =>
            updateDraft(draftId, (draft) => {
                const current = draft.selections[attribute.name] ?? []
                let next: string[]
                if (isMultiSelect(attribute)) {
                    next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]
                } else {
                    // Single choice: re-selecting the active value clears it.
                    next = current.includes(value) ? [] : [value]
                }
                return { ...draft, selections: { ...draft.selections, [attribute.name]: next } }
            }),
        [updateDraft],
    )

    const setNote = useCallback(
        (draftId: string, note: string) =>
            updateDraft(draftId, (draft) => ({ ...draft, note: note.slice(0, MAX_NOTE_LENGTH) })),
        [updateDraft],
    )

    const removeDraft = useCallback((draftId: string) => {
        setDrafts((prev) => prev.filter((draft) => draft.draftId !== draftId))
    }, [])

    return { drafts, openDraft, setQuantity, toggleOption, setNote, removeDraft }
}
