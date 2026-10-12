import { useId, useState } from 'react'
import type { CartLine } from '../../../store/cart.store'
import { formatAmount } from '../../../utils/currency'
import QuantityStepper from '../../ui/QuantityStepper'

type CartLineItemProps = {
	line: CartLine
	currencySymbol?: string
	onQuantityChange: (quantity: number) => void
	onNoteChange: (note: string) => void
	onRemove: () => void
}

const MAX_NOTE_LENGTH = 200
const LINK_BUTTON =
	'cursor-pointer text-[12px] font-medium text-[#6fc9a4] underline underline-offset-2 transition-colors hover:text-[#9be3c3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e]'

/** "Regular · Extra Cheese" style summary of the options picked for a dish. */
const summarizeSelections = (selections: CartLine['selections']) =>
	Object.values(selections).flat().join(' · ')

export default function CartLineItem({ line, currencySymbol, onQuantityChange, onNoteChange, onRemove }: CartLineItemProps) {
	const noteId = useId()
	const [imageFailed, setImageFailed] = useState(false)
	const [editing, setEditing] = useState(false)
	const [draftNote, setDraftNote] = useState(line.note)

	const summary = summarizeSelections(line.selections)

	const startEditing = () => {
		setDraftNote(line.note)
		setEditing(true)
	}

	const saveNote = () => {
		onNoteChange(draftNote)
		setEditing(false)
	}

	return (
		<li className="flex gap-3 py-4">
			<div className="size-[52px] flex-none overflow-hidden rounded-lg bg-[#1d2a25]">
				{imageFailed || !line.imageUrl ? (
					<div role="img" aria-label="Image unavailable" className="grid size-full place-items-center text-[#8e9993]">
						<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6 stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M7 3v8a2 2 0 0 0 2 2v8" />
							<path d="M5 3v6" />
							<path d="M9 3v6" />
							<path d="M17 21V3c-2.5 1.5-4 4-4 8v2h4" />
						</svg>
					</div>
				) : (
					<img src={line.imageUrl} alt="" onError={() => setImageFailed(true)} className="size-full object-cover" />
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<p className="truncate text-[15px] font-semibold">{line.name}</p>
						{summary && <p className="text-[12px] leading-5 text-[#8e9993]">{summary}</p>}
					</div>
					<div className="flex flex-none flex-col items-end gap-1.5">
						<p className="text-[15px] font-semibold">{formatAmount(line.unitPrice * line.quantity, { symbol: currencySymbol })}</p>
						<button
							type="button"
							aria-label={`Remove ${line.name} from cart`}
							onClick={onRemove}
							className="grid size-7 cursor-pointer place-items-center rounded-full text-[#8e9993] transition-[background-color,color,transform] duration-200 hover:bg-[#f08a73]/10 hover:text-[#f08a73] focus-visible:outline-2 focus-visible:outline-[#d9c08e] active:scale-90"
						>
							<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 stroke-current" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 7h16" />
								<path d="M10 11v6M14 11v6" />
								<path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
								<path d="M9 7V4h6v3" />
							</svg>
						</button>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<QuantityStepper value={line.quantity} onChange={onQuantityChange} label={line.name} />
					{!editing && (
						<button type="button" onClick={startEditing} className={LINK_BUTTON}>
							{line.note ? 'Edit note' : 'Add note'}
						</button>
					)}
				</div>

				{!editing && line.note && (
					<p className="text-[12px] leading-5 wrap-break-word text-[#c7d1cc] italic">“{line.note}”</p>
				)}

				{editing && (
					<div className="flex flex-col gap-2">
						<label htmlFor={noteId} className="sr-only">
							Note for {line.name}
						</label>
						<textarea
							id={noteId}
							autoFocus
							rows={2}
							value={draftNote}
							maxLength={MAX_NOTE_LENGTH}
							onChange={(event) => setDraftNote(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) saveNote()
								// Esc only closes the editor, not the whole drawer.
								if (event.key === 'Escape') {
									event.stopPropagation()
									setEditing(false)
								}
							}}
							placeholder="Allergies or cooking instructions"
							className="w-full resize-none rounded-xl border border-[#2a3a34] bg-[#1a2420] px-3 py-2.5 text-[13px] leading-5 text-[#f3efe8] transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-[#8e9993] focus:border-[#d9c08e]/60 focus:shadow-[0_0_0_3px_rgba(217,192,142,0.12)]"
						/>
						<div className="flex items-center justify-end gap-2">
							<button type="button" onClick={() => setEditing(false)} className={`${LINK_BUTTON} no-underline`}>
								Cancel
							</button>
							<button
								type="button"
								onClick={saveNote}
								className="min-h-8 cursor-pointer rounded-full bg-[#1f5a48] px-4 text-[12px] font-semibold text-[#f3efe8] transition-[background-color,transform] duration-200 hover:bg-[#287358] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9c08e] active:scale-95"
							>
								Save note
							</button>
						</div>
					</div>
				)}
			</div>
		</li>
	)
}
