<template>
    <div>
        <h1>New Word</h1>
        <word-form @submit="createOrUpdate"></word-form>
    </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';   
import { toast } from 'vue3-toastify';

export default {
    name: 'new-word',
    components: {
        'word-form': WordForm
    },
    data() {
        return {
            isSaving: false
        };
    },
    methods: {
        async createOrUpdate(word) {
            if (this.isSaving) return; 
            const english = (word.english || '').trim();
            const german = (word.german || '').trim();
            const japanese = (word.japanese || '').trim();
            if (!english || !german || !japanese) {
                return;
            }
            this.isSaving = true;
            try {
                const res = await api.createWord({
                    ...word,
                    english,
                    german,
                    japanese
                });
                if (res && res._id) {
                    toast.success('Word created', { autoClose: 1500 });
                }
            } catch (e) {
            } finally {
                this.isSaving = false;
            }
        }
    }
};
</script>