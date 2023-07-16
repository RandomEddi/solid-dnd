import { createSignal, type Component, Index } from 'solid-js'
import { generateId } from './utils'

interface Coords {
  x: number
  y: number
}

interface Card {
  id: number
  text: string
  coords: Coords
}

export const App: Component = () => {
  const [cards, setCards] = createSignal<Card[]>([])

  const handleAddCard = () => {
    setCards((current) => [
      ...current,
      {
        id: generateId(),
        text: 'new card',
        coords: {
          x: 100,
          y: 100,
        },
      },
    ])
  }

  const updateCardCoords = (id: number, coords: Coords) => {
    setCards((current) =>
      current.map((card) => {
        if (id === card.id) {
          return {
            ...card,
            coords,
          }
        }
        return card
      }),
    )
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <header style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <button onClick={handleAddCard} style={{ padding: '0.5rem 1.1rem' }}>
          Add Card
        </button>
      </header>
      <Index each={cards()}>
        {(card) => <Card updateCardCoords={updateCardCoords} card={card()} />}
      </Index>
    </div>
  )
}

interface CardProps {
  card: Card
  updateCardCoords: (id: number, coords: Coords) => void
}

export const Card: Component<CardProps> = (props) => {
  let cardRef!: HTMLDivElement
  let prevMouseCoords: Coords | null = null

  const handleMousedDown = (event: MouseEvent) => {
    cardRef.addEventListener('mousemove', handleMouseMove)
    cardRef.addEventListener('mouseup', handleMouseUp)

    prevMouseCoords = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!prevMouseCoords) {
      return
    }

    const deltaX = event.clientX - prevMouseCoords.x
    const deltaY = event.clientY - prevMouseCoords.y

    prevMouseCoords = {
      x: event.clientX,
      y: event.clientY,
    }

    props.updateCardCoords(props.card.id, {
      x: props.card.coords.x + deltaX,
      y: props.card.coords.y + deltaY,
    })
  }

  const handleMouseUp = (event: MouseEvent) => {
    cardRef.removeEventListener('mousemove', handleMouseMove)
    cardRef.removeEventListener('mouseup', handleMouseUp)

    prevMouseCoords = null
  }

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMousedDown}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${props.card.coords.x}px, ${props.card.coords.y}px)`,
        padding: '2rem 2.5rem',
        border: '1px solid black',
      }}
    >
      {props.card.text}
    </div>
  )
}
