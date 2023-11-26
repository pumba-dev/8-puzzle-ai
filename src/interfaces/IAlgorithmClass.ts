import type { IGameSetup } from './IGameSetup'

export default interface IAlgorithmClass {
  solve(): void
  resetState(): void
  isSolved(): boolean
  advanceOneStep(): IGameSetup | null
  getSearchQueue(): IGameSetup[]
  getOptimalPath(): IGameSetup[]
  getMaxNodesInSpace(): number
  getMaxDepth(): number
  getSolutionDepth(): number
  getGeneratedNodesCount(): number
  getOpenNodesCount(): number
  getExecutionTime(): number
}
