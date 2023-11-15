<template>
  <div class="game-state-board">
    <span>{{ `h = ${manhattanDistance(gameSetupData)}` }}</span>
    <div class="gamestate-board">
      <template :key="index" v-for="(piece, index) in gameSetupData">
        <div class="board__peace">
          <span>{{ piece == '0' ? '' : piece }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IGameSetup } from '../../interfaces/IGameSetup'
import manhattanDistance from '../../utils/manhattanDistance'

interface Props {
  gameSetupData: IGameSetup
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.game-state-board {
  display: flex;
  flex-direction: column;
  align-items: center;

  .gamestate-board {
    border: 1px solid black;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .board__peace {
      border: 1px solid black;
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 18px;
        color: black;
      }
    }
  }
}
</style>
