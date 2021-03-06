<template>
  <div class="page page-with-buttons">
    <div class="activity">
      <Widget title="History">
        <div class="activity__container"
             v-for="item in $store.getters.getOperations"
             :key="item.id"
        >
          <h4 class="activity__title">{{ getFormatDate(item.date) }}</h4>
          <ul class="activity__list">
            <li
              class="activity__item operation"
              v-for="item in item.operations"
              :key="item.id"
            >
              <div
                :class="`operation__description ${
                item.type === 'income' ? 'operation__description-income' :
                item.type === 'expense' ? 'operation__description-expense' : ''
              }`"
              >
                <span class="operation__category">{{ item.category }}</span>
                <span class="operation__value">{{ item.value }} USD</span>
              </div>
              <div class="operation__control">
                <button
                  class="operation__edit"
                  @click="(event) => editOperation(event, item.id)"
                >
                  <font-awesome-icon icon="pencil-alt"/>
                </button>
                <button
                  class="operation__delete"
                  @click="(event) => deleteOperation(event, item.id)"
                >
                  <font-awesome-icon icon="trash"/>
                </button>
              </div>
            </li>
            <img
              class="latest-activity__illustration"
              src="@/assets/illustrations/undraw_empty_xct9.svg"
              v-if="!$store.getters.getOperations.length"
              alt=""
            />
            <span
              v-if="!$store.getters.getOperations.length"
              class="latest-activity__empty-text"
            >
            There is nothing
          </span>
          </ul>
        </div>
      </Widget>
    </div>
  </div>
  <ControlButtons/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ControlButtons from '@/components/ControlButtons.vue';
import Widget from '@/components/Widget.vue';

@Options({
  components: {
    ControlButtons,
    Widget,
  },
  methods: {
    getFormatDate(date: string) {
      const monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const numMonth = Number(date.split('-')[1]);
      const month = monthsAbbr[numMonth - 1];
      const day = Number(date.split('-')[2]);
      return `${day} ${month}`;
    },
  },
})
export default class Home extends Vue {
}
</script>
<style lang="scss" scoped>
.activity {
  .activity__container {
    padding: 12px;

    .activity__title {
      margin: 0 0 6px 0;
    }

    .activity__list {
      padding: 0;
      margin: 0;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr;
      grid-row-gap: 12px;

      .activity__illustration {
        height: 100%;
        width: 100%;
        margin: auto;
        max-height: 240px;
      }

      .activity__empty-text {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .button {
    margin-top: 12px;
  }
}

.operation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .operation__description {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .operation__category {
      font-size: 12px;
      line-height: 100%;
      margin-bottom: 2px;
      color: rgba(33, 33, 33, 0.8);
    }

    .operation__value {
      font-weight: 600;
      font-size: 14px;
      line-height: 100%;
      margin-top: 2px;
      color: rgba(33, 33, 33, 0.8);
    }
  }

  .operation__description-income {
    .operation__value {
      color: #00C12F;
    }
  }

  .operation__description-expense {
    .operation__value {
      color: #E32602;
    }
  }

  .operation__control {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;

    button {
      border: none;
      background: transparent;
      outline: none;
      cursor: pointer;
      font-weight: 900;
      font-size: 14px;
      padding: 0;
    }

    .operation__delete {
      color: #E32602;
    }

    .operation__edit {
      color: #FBD101;
    }
  }
}
</style>
