<template>
  <a-layout class="homepage-layout">
    <a-layout-header class="layout__header">
      <h1>8-Puzzle AI Game</h1>

      <div class="header__menu">
        <a-button @click="handleOpenContact">Contact</a-button>
        <a-button @click="handleOpenDocumentation">Documentation</a-button>
      </div>
    </a-layout-header>

    <a-layout-content class="layout__content">
      <section class="content__game-container">
        <div class="game-container__header">
          <h2>Game Setup</h2>

          <a-tooltip
            title="Enter the initial 8-puzzle configuration and select the algorithm you want to use for solving. The empty spot is represented by the number 0."
          >
            <img src="@/assets/info-icon.svg" />
          </a-tooltip>
        </div>

        <div class="game-container__setup-grid">
          <a-input
            :key="index"
            :controls="false"
            v-for="index in 9"
            v-model:value="gameSetupData[index - 1]"
          >
          </a-input>
        </div>

        <h2>Select the algorithm</h2>

        <a-radio-group v-model:value="algorithmSetup">
          <a-radio :key="index" :value="option.value" v-for="(option, index) in algorithmOptions">
            <div class="game-container__algorithm-option">
              <span>{{ option.label }}</span>
              <a-tooltip :title="option.explanation">
                <img src="@/assets/info-icon.svg" />
              </a-tooltip>
            </div>
          </a-radio>
        </a-radio-group>

        <div class="game-container__footer-buttons">
          <a-button type="dashed" @click="genRandomGameSetup">Random Values</a-button>
          <a-button type="dashed" @click="checkHValue">Check h-value</a-button>
          <a-button type="primary" @click="handleStartGame">Start Game</a-button>
        </div>
      </section>

      <a-divider> </a-divider>

      <LoadingSpinner v-if="resultData.loading"></LoadingSpinner>

      <section v-else-if="resultData.show" class="content__result-container">
        <h3>Solution</h3>

        <div class="result__stats">
          <span>Solution Nodes: {{ resultData.path.length }}</span>
          <span>Generated Nodes: {{ resultData.generatedNodes }}</span>
          <span>Max Depth: {{ resultData.maxDepth }}</span>
          <span>Max Queue Size: {{ resultData.maxStateBorder }}</span>
          <span>Execution Time: {{ resultData.executionTime.toFixed(2) }}ms</span>
        </div>

        <div class="result__grid">
          <GameStateBoard
            :key="index"
            v-for="(data, index) in resultData.path"
            :gameSetupData="data"
          />
        </div>
      </section>
    </a-layout-content>

    <a-layout-footer class="layout__footer">
      8-Puzzle AI Game © 2023 Created by Pumba Developer
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import GameStateBoard from '@/components/shared/GameStateBoard.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

import { reactive, ref } from 'vue'
import type { IGameSetup } from '@/interfaces/IGameSetup'
import manhattanDistance from '@/utils/manhattanDistance'
import BreadthFirstSearch from '@/utils/BreadthFirstSearch'
import DepthFirstSearch from '@/utils/DepthFirstSearch'
import GreedyBestFirstSearch from '@/utils/GreedyBestFirstSearch'
import AStarSearch from '@/utils/AStarSearch'

const gameSetupData = ref<IGameSetup>(Array(9).fill(''))
const algorithmSetup = ref<'bfs' | 'dfs' | 'gs' | 'a*'>('bfs')
const resultData = reactive({
  show: false,
  loading: false,
  path: [] as IGameSetup[],
  generatedNodes: 0 as number,
  maxDepth: 0 as number,
  maxStateBorder: 0 as number,
  executionTime: 0 as number
})
const algorithmOptions = ref([
  {
    value: 'bfs',
    label: 'Breadth First Search',
    explanation: 'Explores all neighboring nodes before exploring child nodes.'
  },
  {
    value: 'dfs',
    label: 'Depth First Search',
    explanation: 'Explores all child nodes before exploring neighboring nodes.'
  },
  {
    value: 'gs',
    label: 'Greedy Search',
    explanation: 'Explores the node that appears to be the most promising according to a heuristic.'
  },
  {
    value: 'a*',
    label: 'A* Search',
    explanation:
      'Explores the node that appears to be the most promising according to a heuristic and the path cost.'
  }
])

function resetResult() {
  resultData.show = false
  resultData.loading = false
  resultData.path = []
  resultData.generatedNodes = 0
  resultData.maxDepth = 0
  resultData.maxStateBorder = 0
}

function genRandomGameSetup() {
  resetResult()

  const randomArray = Array.from({ length: 9 }, (_, index) => index).sort(() => Math.random() - 0.5)
  gameSetupData.value = randomArray.map((value) => value.toString()) as IGameSetup
}

async function handleStartGame() {
  if (!gameSetupIsValid()) {
    return
  }

  resetResult()

  resultData.loading = true
  await sleep(1000)

  let algorithm

  switch (algorithmSetup.value) {
    case 'bfs':
      algorithm = new BreadthFirstSearch(gameSetupData.value)
      break
    case 'dfs':
      algorithm = new DepthFirstSearch(gameSetupData.value)
      break
    case 'gs':
      algorithm = new GreedyBestFirstSearch(gameSetupData.value)
      break
    case 'a*':
      algorithm = new AStarSearch(gameSetupData.value)
      break
  }

  algorithm.solve()

  resultData.path = algorithm.getOptimalPath()
  resultData.generatedNodes = algorithm.getGeneratedNodesCount()
  resultData.maxDepth = algorithm.getMaxDepth()
  resultData.maxStateBorder = algorithm.getMaxNodesInSpace()
  resultData.executionTime = algorithm.getExecutionTime()
  resultData.show = true
  resultData.loading = false
}

function checkHValue() {
  if (!gameSetupIsValid()) {
    return
  }
  alert(`h-value: ${manhattanDistance(gameSetupData.value)}`)
}

// Verificar se o array possui apenas números de 0 a 8 sem repetição
function gameSetupIsValid() {
  const gameSetupDataNumbers = gameSetupData.value.map((value) => parseInt(value))

  const isInvalid = gameSetupDataNumbers.some((value) => isNaN(value) || value < 0 || value > 8)

  const isRepeated = gameSetupDataNumbers.some(
    (value, index, array) => array.indexOf(value) !== index
  )

  if (isRepeated || isInvalid) {
    alert('Please, insert a valid game setup.')
    return false
  }

  return true
}

function handleOpenDocumentation() {
  window.open('https://github.com/pumba-dev/8-puzzle-ai-solution', '_blank')
}

function handleOpenContact() {
  window.open('https://linktr.ee/pumbadev', '_blank')
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
</script>

<style lang="scss" scoped>
.homepage-layout {
  min-height: 100vh;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;

  .layout__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h1 {
      color: white;
    }

    .header__menu {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
    }
  }

  .layout__content {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    .content__game-container {
      margin: 0 auto;

      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;

      h2 {
        text-align: center;
        padding: 0;
        margin: 0;
      }

      .game-container__header {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        justify-content: center;

        img {
          width: 18px;
          height: 18px;
        }
      }

      .game-container__setup-grid {
        max-width: 300px;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      .game-container__algorithm-option {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        justify-content: center;

        img {
          width: 15px;
          height: 15px;
          padding-bottom: 2px;
        }
      }

      .game-container__footer-buttons {
        display: flex;
        gap: 20px;
      }
    }

    .content__result-container {
      margin: 0 auto;

      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;

      h3 {
        text-align: center;
      }

      .result__stats {
        display: flex;
        flex-direction: row;
        gap: 20px;
      }

      .result__grid {
        max-width: 60vw;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;

        flex-wrap: wrap;
      }
    }
  }
  .layout__footer {
    text-align: center;
  }
}
</style>
