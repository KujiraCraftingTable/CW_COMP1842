<template>
  <form action="#" @submit.prevent="onSubmit">
      <p v-if="errorsPresent" class="error">Please fill out all language fields!</p>   

      <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="united kingdom flag"></i> English (required)
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.english" />
     </div>
 
     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="germany flag"></i> German (required)
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.german" />
     </div>

     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="japan flag"></i> Japanese (required)
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.japanese" />
     </div>

     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="book icon"></i> Deck (not required)
       </div>
       <input type="text" placeholder="e.g., noun, verb" v-model="word.deck" />
     </div>

     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="tags icon"></i> Tags (not required)
       </div>
       <input type="text" placeholder="comma-separated (e.g., animal, food)" v-model="tagsInput" />
     </div>
 
     <button class="positive ui button">Submit</button>
   </form>
 </template>
 
 <script>

export default {
    name: 'word-form',
    props: {
     word: {
       type: Object,
       required: false,
       default: () => {
          return {
            german: '',
            english: '',
            japanese: '',
            deck: '',
            tags: [],
          };
       }
     }
   },
   data() {
     return {
       errorsPresent: false,
       tagsInput: ''
     };
   },
   mounted() {
     if (Array.isArray(this.word.tags) && this.word.tags.length) {
       this.tagsInput = this.word.tags.join(', ');
     }
   },
   watch: {
     word: {
       deep: true,
       immediate: true,
       handler(newVal) {
         if (Array.isArray(newVal?.tags)) {
           this.tagsInput = newVal.tags.join(', ');
         } else if (!newVal?.tags) {
           this.word.tags = [];
         }
       }
     }
   },
   methods: {
    onSubmit: function() {
      if (this.word.english === '' || this.word.german === '' || this.word.japanese === '') {
            this.errorsPresent = true;
        } else {
            const parsed = (this.tagsInput || '')
              .split(',')
              .map(t => t.trim())
              .filter(Boolean);
            this.word.tags = parsed;
            this.$emit('submit', this.word);
        }
      }
    }
  }
</script>
 
 <style scoped>
 .error {
   color: red;
 }
 </style>