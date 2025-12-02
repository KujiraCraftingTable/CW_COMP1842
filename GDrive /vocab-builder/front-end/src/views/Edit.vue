<template>
    <div>
        <h1>Edit Word</h1>
        <word-form @submit="createOrUpdate" :word="word"></word-form>
    </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';
import { toast } from 'vue3-toastify';

export default {
    name: 'edit',
    components: {
        'word-form': WordForm
    },
    data() {
        return {
            word: {},
            isSaving: false
        };
    },
    async mounted() {
        this.word = await api.getWord(this.$route.params.id);
    },
    methods: {
        async createOrUpdate(word) {
            if (this.isSaving) return; 
            this.isSaving = true;
            try {
                const updated = await api.updateWord(word);
                this.word = updated; 
                toast.success('Word updated successfully!', { autoClose: 1500 });
            } catch (e) {
            } finally {
                this.isSaving = false;
            }
        }
    }
};
</script>