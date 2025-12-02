<template>
    <div>
      <h2>Score: {{ score }} out of {{ this.words.length }}</h2>
      <div class="timer">
        <strong>Time left:</strong> {{ timeLeft }}s
      </div>
  
      <form action="#" @submit.prevent="onSubmit">
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i class="united kingdom flag"></i> English
          </div>
          <input type="text" readonly :disabled="testOver" :value="currWord.english"/>
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i class="germany flag"></i> German
          </div>
          <input type="text" placeholder="Enter word..." v-model="german" :disabled="testOver" autocomplete="off" />
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">
            <i class="japan flag"></i> Japanese
          </div>
            <input type="text" placeholder="Enter word..." v-model="japanese" :disabled="testOver" autocomplete="off" />
        </div>
  
        <button class="positive ui button" :disabled="testOver || timeLeft === 0">Submit</button>
      </form>
  
      <p :class="['results', resultClass]">
        <span v-html="result"></span>
      </p>
    </div>
  </template>
  
  <script>
  import { toast } from 'vue3-toastify';

export default {
  name: 'vocab-test',
  props: {
    words: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      randWords: [...this.words.sort(() => 0.5 - Math.random())],
      incorrectGerman: [],
      incorrectJapanese: [], 
      result: '',
      resultClass: '',
      english: '',
      german: '',
      japanese: '',
      score: 0,
      testOver: false,
      timeLeft: 15,
      timerId: null
    };
  },
  computed: {
    currWord: function() {
      return this.randWords.length ? this.randWords[0] : '';
    }
  },
  methods: {
    resetAndStartTimer() {
      this.clearTimer();
      this.timeLeft = 15;
      this.timerId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft -= 1;
        }
        if (this.timeLeft === 0) {
          this.handleTimeout();
        }
      }, 1000);
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },
    handleTimeout() {
      if (this.testOver || !this.currWord) return;
      this.clearTimer();
      toast.error("Time's up!", { autoClose: 1500 });
      const prompt = this.currWord.english;
      this.incorrectGerman.push({ prompt, expected: this.currWord.german, given: '' });
      this.incorrectJapanese.push({ prompt, expected: this.currWord.japanese, given: '' });
      this.nextQuestion();
    },
    nextQuestion() {
      this.english = '';
      this.german = '';
      this.japanese = '';
      this.randWords.shift();
      if (this.randWords.length === 0) {
        this.testOver = true;
        this.displayResults();
        this.clearTimer();
      } else {
        this.resetAndStartTimer();
      }
    },
    onSubmit() {
      this.clearTimer();
      const prompt = this.currWord.english || '';
      const gExpected = this.currWord.german || '';
      const jExpected = this.currWord.japanese || '';
      const gGiven = (this.german || '').trim();
      const jGiven = (this.japanese || '').trim();

      const gOk = gGiven.length > 0 && gGiven === gExpected;   
      const jOk = jGiven.length > 0 && jGiven === jExpected;   

      if (!gOk) {
        this.incorrectGerman.push({ prompt, expected: gExpected, given: gGiven });
      }
      if (!jOk) {
        this.incorrectJapanese.push({ prompt, expected: jExpected, given: jGiven });
      }

      if (gOk && jOk) {
        this.score += 1;
        toast.success('Both correct!', { autoClose: 1500 });
      } else if (gOk || jOk) {
        this.score += 0.5;
        toast.info('One correct', { autoClose: 1500 });
      } else {
        toast.error('Wrong!', { autoClose: 1500 });
      }

      this.nextQuestion();
    },
      displayResults: function() {
        const hasGerman = this.incorrectGerman.length > 0;
        const hasJapanese = this.incorrectJapanese.length > 0;
        if (!hasGerman && !hasJapanese) {
          this.result = 'You got everything correct. Well done!';
          this.resultClass = 'success';
          return;
        }
        const gList = hasGerman
          ? '<ul>' + this.incorrectGerman
              .map(it => `<li><strong>${it.prompt}</strong>: expected "${it.expected}", you wrote "${it.given || '—'}"</li>`)
              .join('') + '</ul>'
          : '<em>No German mistakes</em>';
        const jList = hasJapanese
          ? '<ul>' + this.incorrectJapanese
              .map(it => `<li><strong>${it.prompt}</strong>: expected "${it.expected}", you wrote "${it.given || '—'}"</li>`)
              .join('') + '</ul>'
          : '<em>No Japanese mistakes</em>';
        this.result = `<div><strong>Incorrect answers</strong><div><h4>German</h4>${gList}</div><div><h4>Japanese</h4>${jList}</div></div>`;
        this.resultClass = 'error';
      }
    },
    mounted() {
      if (this.randWords.length) {
        this.resetAndStartTimer();
      }
    },
    beforeUnmount() {
      this.clearTimer();
    }
  };
  </script>
  
  <style scoped>
  .results {
    margin: 25px auto;
    padding: 15px;
    border-radius: 5px;
  }
  
  .error {
    border: 1px solid #ebccd1;
    color: #a94442;
    background-color: #f2dede;
  }
  
  .success {
    border: 1px solid #d6e9c6;
    color: #3c763d;
    background-color: #dff0d8;
  }
  .timer {
    margin: 10px 0 15px;
    font-size: 16px;
  }
  </style>