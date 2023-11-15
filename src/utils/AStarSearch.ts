import goalStateTemplate from '@/assets/goalStateTemplate'
import type { IGameSetup } from '@/interfaces/IGameSetup'
import manhattanDistance from '@/utils/manhattanDistance'

class Node {
  state: IGameSetup
  parent: Node | null
  gCost: number // Custo atual
  hCost: number // Heurística
  fCost: number // Custo total: gCost + hCost

  constructor(state: IGameSetup, parent: Node | null, gCost: number, hCost: number) {
    this.state = state
    this.parent = parent
    this.gCost = gCost
    this.hCost = hCost
    this.fCost = gCost + hCost
  }
}

export default class AStarSearch {
  private goalState: IGameSetup = goalStateTemplate
  private initialState: IGameSetup
  private visitedStates: Set<string> = new Set()
  private optimalPath: IGameSetup[] = []
  private maxNodesInSpace: number = 0
  private maxDepth: number = 0
  private solutionDepth: number = 0
  private generatedNodes: number = 0

  constructor(initialState: IGameSetup) {
    this.initialState = initialState
  }

  private isGoalState(state: IGameSetup): boolean {
    return state.join('') === this.goalState.join('')
  }

  private getEmptyTileIndex(state: IGameSetup): number {
    return state.indexOf('0')
  }

  private generateNextStates(state: IGameSetup, gCost: number): Node[] {
    const emptyTileIndex = this.getEmptyTileIndex(state)
    const possibleMoves = this.getPossibleMoves(emptyTileIndex)

    return possibleMoves.map((move) => {
      const nextState = this.swapTiles([...state], emptyTileIndex, move)
      const hCost = manhattanDistance(nextState)
      return new Node(nextState, null, gCost + 1, hCost)
    })
  }

  private getPossibleMoves(emptyTileIndex: number): number[] {
    const possibleMoves = []

    if (emptyTileIndex % 3 !== 0) possibleMoves.push(emptyTileIndex - 1) // Left
    if (emptyTileIndex % 3 !== 2) possibleMoves.push(emptyTileIndex + 1) // Right
    if (emptyTileIndex >= 3) possibleMoves.push(emptyTileIndex - 3) // Up
    if (emptyTileIndex < 6) possibleMoves.push(emptyTileIndex + 3) // Down

    return possibleMoves
  }

  private swapTiles(state: IGameSetup, indexA: number, indexB: number): IGameSetup {
    const temp = state[indexA]
    state[indexA] = state[indexB]
    state[indexB] = temp
    return state
  }

  private getPathFromRoot(node: Node): IGameSetup[] {
    const path: IGameSetup[] = []

    let currentNode = <Node | null>node

    while (currentNode !== null) {
      path.unshift(currentNode.state)
      currentNode = currentNode.parent
    }

    return path
  }

  solve(): void {
    const priorityQueue: Node[] = [
      new Node(this.initialState, null, 0, manhattanDistance(this.initialState))
    ]

    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.fCost - b.fCost)

      const currentNode = priorityQueue.shift()!
      const currentState = currentNode.state
      const currentStateString = currentState.join('')
      const depth = this.getPathFromRoot(currentNode).length

      if (this.isGoalState(currentState)) {
        this.solutionDepth = depth
        this.optimalPath = this.getPathFromRoot(currentNode)
        return
      }

      if (!this.visitedStates.has(currentStateString)) {
        this.visitedStates.add(currentStateString)
        this.generatedNodes++
        this.maxDepth = Math.max(this.maxDepth, depth)

        const nextStates = this.generateNextStates(currentState, currentNode.gCost)
        for (const nextState of nextStates) {
          const nextStateString = nextState.state.join('')
          if (!this.visitedStates.has(nextStateString)) {
            priorityQueue.push(
              new Node(nextState.state, currentNode, nextState.gCost, nextState.hCost)
            )
          }
        }

        this.maxNodesInSpace = Math.max(this.maxNodesInSpace, priorityQueue.length)
      }
    }

    alert('No solution found!')
    return
  }

  getOptimalPath(): IGameSetup[] {
    return this.optimalPath
  }

  getMaxNodesInSpace(): number {
    return this.maxNodesInSpace
  }

  getMaxDepth(): number {
    return this.maxDepth
  }

  getSolutionDepth(): number {
    return this.solutionDepth
  }

  getGeneratedNodesCount(): number {
    return this.generatedNodes
  }
}
