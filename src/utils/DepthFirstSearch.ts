import type { IGameSetup } from '@/interfaces/IGameSetup'
import goalStateTemplate from '@/assets/goalStateTemplate'

class Node {
  state: IGameSetup
  parent: Node | null

  constructor(state: IGameSetup, parent: Node | null) {
    this.state = state
    this.parent = parent
  }
}

export default class DepthFirstSearch {
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

  private generateNextStates(state: IGameSetup): IGameSetup[] {
    const emptyTileIndex = this.getEmptyTileIndex(state)
    const possibleMoves = this.getPossibleMoves(emptyTileIndex)

    return possibleMoves.map((move) => this.swapTiles([...state], emptyTileIndex, move))
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
    const stack: Node[] = [new Node(this.initialState, null)]

    while (stack.length > 0) {
      const currentNode = stack.pop()!
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

        const nextStates = this.generateNextStates(currentState)
        stack.push(...nextStates.map((nextState) => new Node(nextState, currentNode)))

        this.maxNodesInSpace = Math.max(this.maxNodesInSpace, stack.length)
      }
    }
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
