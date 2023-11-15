type IGameSetup = Array<'' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'>

class Node {
  state: IGameSetup
  parent: Node | null

  constructor(state: IGameSetup, parent: Node | null) {
    this.state = state
    this.parent = parent
  }
}

export default class BreadthFirstSearch {
  private goalState: IGameSetup = ['1', '2', '3', '4', '5', '6', '7', '8', '0']
  private initialState: IGameSetup
  private visitedStates: Set<string> = new Set()
  private optimalPath: IGameSetup[] = []
  private generatedNodes: number = 0
  private maxDepth: number = 0
  private maxQueueSize: number = 0

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

  solve(): IGameSetup[] {
    const queue: Node[] = [new Node(this.initialState, null)] // State Board
    const explored: Set<string> = new Set() // Visited States
    let depth = 0

    while (queue.length > 0) {
      const currentNode = queue.shift()!
      const currentState = currentNode.state

      if (this.isGoalState(currentState)) {
        this.optimalPath = this.getPathFromRoot(currentNode)
        return this.optimalPath
      }

      if (!explored.has(currentState.join(''))) {
        this.visitedStates.add(currentState.join(''))
        explored.add(currentState.join(''))

        const nextStates = this.generateNextStates(currentState)
        depth = this.getPathFromRoot(currentNode).length

        for (const nextState of nextStates) {
          const nextStateString = nextState.join('')

          if (!this.visitedStates.has(nextStateString)) {
            const newNode = new Node(nextState, currentNode)
            queue.push(newNode)
            this.visitedStates.add(nextStateString)
            this.generatedNodes++
          }
        }
      }

      this.maxDepth = Math.max(this.maxDepth, depth)
      this.maxQueueSize = Math.max(this.maxQueueSize, queue.length)
    }

    alert('No solution found')
    return []
  }

  getVisitedStates(): string[] {
    return Array.from(this.visitedStates)
  }

  getOptimalPath(): IGameSetup[] {
    return this.optimalPath
  }

  getGeneratedNodesCount(): number {
    return this.generatedNodes
  }

  getMaxDepth(): number {
    return this.maxDepth
  }

  getMaxQueueSize(): number {
    return this.maxQueueSize
  }
}
