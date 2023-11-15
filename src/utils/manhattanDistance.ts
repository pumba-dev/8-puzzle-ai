import type { IGameSetup } from '@/interfaces/IGameSetup'

export default function manhattanDistance(gameState: IGameSetup) {
  const goalState = ['1', '2', '3', '4', '5', '6', '7', '8', '0']

  return gameState.reduce((acc, value, index) => {
    const goalIndex = goalState.indexOf(value)
    const goalRow = Math.floor(goalIndex / 3)
    const goalCol = goalIndex % 3
    const row = Math.floor(index / 3)
    const col = index % 3
    return acc + Math.abs(goalRow - row) + Math.abs(goalCol - col)
  }, 0)
}
