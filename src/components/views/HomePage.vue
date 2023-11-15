<template>
  <a-layout class="homepage-layout">
    <a-layout-header class="layout__header">
      <h1>8-Puzzle AI Game</h1>

      <div class="header__menu">
        <a-button>Home</a-button>
        <a-button>Documentation</a-button>
        <a-button>Contact</a-button>
      </div>
    </a-layout-header>

    <a-layout-content class="layout__content">
      <section class="content__game-container">
        <h2>Insert initial game setup</h2>

        <div class="game-setup">
          <a-input
            :key="index"
            :controls="false"
            v-for="index in 9"
            v-model:value="gameSetupData[index - 1]"
          >
          </a-input>
        </div>

        <a-radio-group v-model:value="algorithmSetup" :options="algorithmOptions" />

        <div class="content__buttons">
          <a-button type="dashed" @click="genRandomGameSetup">Random Values</a-button>
          <a-button type="dashed" @click="checkHValue">Check h-value</a-button>
          <a-button type="primary" @click="handleStartGame">Start Game</a-button>
        </div>
      </section>

      <a-divider> </a-divider>

      <section class="content__result-container">
        <h3>State Border</h3>

        <div class="result__grid">
          <GameStateBoard :gameSetupData="gameSetupData" />
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

import { ref } from 'vue'
import type { IGameSetup } from '@/interfaces/IGameSetup'
import manhattanDistance from '@/utils/manhattanDistance'
import BreadthFirstSearch from '@/utils/BreadthFirstSearch'

const gameSetupData = ref<IGameSetup>(Array(9).fill(''))
const algorithmSetup = ref<'bfs' | 'dfs' | 'gs' | 'a*'>('bfs')

const algorithmOptions = ref([
  { label: 'Breadth First Search', value: 'bfs' },
  { label: 'Depth First Search', value: 'dfs' },
  { label: 'Greedy Search', value: 'gs' },
  { label: 'A* Search', value: 'a*' }
])

function genRandomGameSetup() {
  const randomArray = Array.from({ length: 9 }, (_, index) => index).sort(() => Math.random() - 0.5)
  gameSetupData.value = randomArray.map((value) => value.toString()) as IGameSetup
}

function gameSetupIsValid() {
  return gameSetupData.value.every((value) => value !== '')
}

function handleStartGame() {
  if (!gameSetupIsValid()) {
    alert('Please insert a valid initial game setup')
    return
  }

  switch (algorithmSetup.value) {
    case 'bfs':
      const bfs = BreadthFirstSearch(gameSetupData.value)
      break
    case 'dfs':
      alert('In development...')
      break
    case 'gs':
      alert('In development...')
      break
    case 'a*':
      alert('In development...')
      break
  }
}

function checkHValue() {
  if (!gameSetupIsValid()) {
    alert('Please insert initial game setup')
    return
  }

  alert(`h-value: ${manhattanDistance(gameSetupData.value)}`)
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
    display: grid;
    grid-template-columns: repeat(3, 1fr);

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
      }

      .game-setup {
        max-width: 300px;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      .content__buttons {
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

      .result__grid {
        max-width: 60vw;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 20px;
      }
    }
  }
  .layout__footer {
    text-align: center;
  }
}
</style>
