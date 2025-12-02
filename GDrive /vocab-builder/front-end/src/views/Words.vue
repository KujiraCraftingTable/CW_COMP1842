<template>
    <div>
        <h1>Words</h1>
        <div class="ui form filters">
            <div class="three fields">
                <div class="field">
                    <label>Search</label>
                    <input type="text" v-model="search" placeholder="Search text" />
                </div>

                <div class="field">
                    <label>Deck</label>
                    <select v-model="selectedDeck">
                        <option value="">All</option>
                        <option v-for="d in decks" :key="d" :value="d">{{ d }}</option>
                    </select>
                </div>
                
                <div class="field">
                    <label>Tag</label>
                    <select v-model="selectedTag">
                        <option value="">All</option>
                        <option v-for="t in tags" :key="t" :value="t">{{ t }}</option>
                    </select>
                </div>
            </div>
        </div>

        <table id="words" class="ui celled compact table">
            <thead>
                <tr>
                    <th>English</th>
                    <th>German</th>
                    <th>Japanese</th>
                    <th>Deck</th>
                    <th>Tags</th>
                    <th colspan="3"></th>
                </tr>
            </thead>
            <tr v-for="(word, i) in filteredWords" :key="i">
                <td>{{ word.english }}</td>
                <td>{{ word.german }}</td>
                <td>{{ word.japanese }}</td>
                <td>{{ word.deck || '' }}</td>
                <td>{{ (word.tags || []).join(', ') }}</td>
                <td width="75" class="center aligned">
                    <router-link :to="{ name: 'show', params: { id: word._id }}">
                        Show
                    </router-link>
                </td>
                <td width="75" class="center aligned">
                    <router-link :to="{ name: 'edit', params: { id: word._id }}">
                        Edit
                    </router-link>
                </td>
                <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
                    <a :href="`/words/${word._id}`">Destroy</a>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { api } from '../helpers/helpers';
import { toast } from 'vue3-toastify';

export default {
    name: 'words',
    data() {
        return {
            words: [],
            search: '',
            selectedTag: '',
            selectedDeck: ''
        };
    },
    computed: {
        tags() {
            const set = new Set();
            this.words.forEach(w => (w.tags || []).forEach(t => set.add(t)));
            return Array.from(set).sort();
        },
        decks() {
            const set = new Set();
            this.words.forEach(w => { if (w.deck) set.add(w.deck); });
            return Array.from(set).sort();
        },
        filteredWords() {
            const q = this.search.trim().toLowerCase();
            return this.words.filter(w => {
                const matchesDeck = !this.selectedDeck || w.deck === this.selectedDeck;
                const matchesTag = !this.selectedTag || (w.tags || []).includes(this.selectedTag);
                const text = `${w.english || ''} ${w.german || ''} ${w.japanese || ''}`.toLowerCase();
                const matchesSearch = !q || text.includes(q);
                return matchesDeck && matchesTag && matchesSearch;
            });
        }
    },
    methods: {
        async onDestroy(id) {
            const sure = window.confirm('Are you sure?');
            if (!sure) {
                return;
            }
            await api.deleteWord(id);
            toast.success('Word deleted successfully!', { autoClose: 1500 });
            const newWords = this.words.filter(word => word._id !== id);
            this.words = newWords;
        }
    },
    async mounted() {
        this.words = await api.getWords();
    }
};
</script>