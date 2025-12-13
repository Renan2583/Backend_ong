const API_BASE_URL = 'http://localhost:3000';

class ApiService {
    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
                throw new Error(errorData.error || `HTTP error! Status ${response.status}`);
            }
            
            // Se for status 204 (No Content), retornar null em vez de tentar fazer parse JSON
            if (response.status === 204) {
                return null;
            }
            
            // Tentar fazer parse JSON apenas se houver conteúdo
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            }
            
            return null;

        } catch (error) {
            console.error('Erro na requisição', error);
            throw error;
        }
    }

    // async getVagas() {
    //     return this.request('/Vagas')
    // }
    // async createVagas(vaga) {
    //     return this.request('/Vagas', {
    //         method: 'POST',
    //         body: JSON.stringify(vaga),
    //     });
    // }

    // async getCandidatos() {
    //     return this.request('/Candidatos');
    // }

    // async getCandidatoByNome(nome) {
    //     return this.request(`/Candidatos?nome=${nome}`);
    // }

    // async getCandidatosVaga() {
    //     return this.request(`/Vagas/Inscricoes/${null}`);
    // }

    // async createCandidato(candidato) {
    //     return this.request('/Candidatos', {
    //         method: 'POST',
    //         body: JSON.stringify(candidato),
    //     });
    // }

    // async getInscricoes(candidatoId) {
    //     console.log(candidatoId)
    //     return this.request(`/Candidatos/Inscricoes/${candidatoId}`);
    // }

    // async createInscricao({ candidatoId, vagaId }) {
    //     return this.request('/Candidatos/Inscricoes', {
    //         method: 'POST',
    //         body: JSON.stringify({ candidatoId, vagaId }),
    //     });
    // }

    async login(cpf, senha) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ cpf, senha })
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async logout() {
        this.setToken(null);
        return { success: true };
    }

    async checkAuth() {
        try {
            const user = await this.request('/auth/me');
            return user;
        } catch (error) {
            this.setToken(null);
            throw error;
        }
    }

    // Pessoas
    async getPessoas() {
        return this.request('/pessoas');
    }

    async createPessoa(pessoa) {
        return this.request('/pessoas', {
            method: 'POST',
            body: JSON.stringify(pessoa)
        });
    }

    async getPessoaById(id) {
        return this.request(`/pessoas/${id}`);
    }

    async updatePessoa(id, pessoa) {
        return this.request(`/pessoas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pessoa)
        });
    }

    async deletePessoa(id) {
        return this.request(`/pessoas/${id}`, {
            method: 'DELETE'
        });
    }

    // Animais
    async getAnimais() {
        return this.request('/animais');
    }

    async createAnimal(animal) {
        return this.request('/animais', {
            method: 'POST',
            body: JSON.stringify(animal)
        });
    }

    async getAnimalById(id) {
        return this.request(`/animais/${id}`);
    }

    async updateAnimal(id, animal) {
        return this.request(`/animais/${id}`, {
            method: 'PUT',
            body: JSON.stringify(animal)
        });
    }

    async deleteAnimal(id) {
        return this.request(`/animais/${id}`, {
            method: 'DELETE'
        });
    }

    // Espécies
    async getEspecies() {
        return this.request('/especies');
    }

    async createEspecie(especie) {
        return this.request('/especies', {
            method: 'POST',
            body: JSON.stringify(especie)
        });
    }

    async updateEspecie(id, especie) {
        return this.request(`/especies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(especie)
        });
    }

    async deleteEspecie(id) {
        return this.request(`/especies/${id}`, {
            method: 'DELETE'
        });
    }

    // Raças
    async getRacas() {
        return this.request('/racas');
    }

    async getRacasByEspecie(especieId) {
        return this.request(`/racas/especie/${especieId}`);
    }

    async createRaca(raca) {
        return this.request('/racas', {
            method: 'POST',
            body: JSON.stringify(raca)
        });
    }

    async updateRaca(id, raca) {
        return this.request(`/racas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(raca)
        });
    }

    async deleteRaca(id) {
        return this.request(`/racas/${id}`, {
            method: 'DELETE'
        });
    }

    // Veterinários
    async getVeterinarios() {
        return this.request('/veterinarios');
    }

    async createVeterinario(veterinario) {
        return this.request('/veterinarios', {
            method: 'POST',
            body: JSON.stringify(veterinario)
        });
    }

    async updateVeterinario(id, veterinario) {
        return this.request(`/veterinarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(veterinario)
        });
    }

    async deleteVeterinario(id) {
        return this.request(`/veterinarios/${id}`, {
            method: 'DELETE'
        });
    }

    // Recursos
    async getRecursos() {
        return this.request('/recursos');
    }

    async createRecurso(recurso) {
        return this.request('/recursos', {
            method: 'POST',
            body: JSON.stringify(recurso)
        });
    }

    async updateRecurso(id, recurso) {
        return this.request(`/recursos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(recurso)
        });
    }

    async deleteRecurso(id) {
        return this.request(`/recursos/${id}`, {
            method: 'DELETE'
        });
    }

    // Doações
    async getDoacoes() {
        return this.request('/doacoes');
    }

    async getDoacaoById(id) {
        return this.request(`/doacoes/${id}`);
    }

    async createDoacao(doacao) {
        return this.request('/doacoes', {
            method: 'POST',
            body: JSON.stringify(doacao)
        });
    }

    async updateDoacao(id, doacao) {
        return this.request(`/doacoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(doacao)
        });
    }

    async deleteDoacao(id, motivo) {
        return this.request(`/doacoes/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }

    // Atendimentos
    async getAtendimentosByAnimal(animalId) {
        return this.request(`/atendimentos/animal/${animalId}`);
    }

    async createAtendimento(atendimento) {
        return this.request('/atendimentos', {
            method: 'POST',
            body: JSON.stringify(atendimento)
        });
    }

    async updateAtendimento(id, atendimento) {
        return this.request(`/atendimentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(atendimento)
        });
    }

    async deleteAtendimento(id, motivo) {
        return this.request(`/atendimentos/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }

    // Adoções
    async getAdocoes() {
        return this.request('/adocoes');
    }

    async createAdocao(adocao) {
        return this.request('/adocoes', {
            method: 'POST',
            body: JSON.stringify(adocao)
        });
    }

    async updateAdocao(id, adocao) {
        return this.request(`/adocoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(adocao)
        });
    }

    async deleteAdocao(id, motivo) {
        return this.request(`/adocoes/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }

    async getAdocoesByPessoaId(pessoaId) {
        return this.request(`/adocoes/pessoa/${pessoaId}`);
    }

    async getDoacoesByPessoaId(pessoaId) {
        return this.request(`/doacoes/pessoa/${pessoaId}`);
    }

    // Relatórios
    async getRelatorioDoacoes() {
        return this.request('/doacoes/relatorio');
    }

    async getRelatorioRecursos() {
        return this.request('/recursos/relatorio');
    }

    async getRelatorioAdocoes() {
        return this.request('/adocoes/relatorio');
    }

    async getRelatorioAtendimentos() {
        return this.request('/atendimentos/relatorio');
    }

    // Histórico de Exclusões
    async getHistoricoExclusoes() {
        return this.request('/historico-exclusoes');
    }

    async getHistoricoExclusoesByTipo(tipo) {
        return this.request(`/historico-exclusoes/${tipo}`);
    }

    async restaurarExclusao(id) {
        return this.request(`/historico-exclusoes/${id}/restaurar`, {
            method: 'POST'
        });
    }

    async verificarSeFoiRestaurado(tipoEntidade, entidadeId) {
        return this.request(`/historico-exclusoes/verificar/${tipoEntidade}/${entidadeId}`);
    }

    // Recursos
    async deleteRecurso(id, motivo) {
        return this.request(`/recursos/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }

    // Pessoas
    async deletePessoa(id, motivo) {
        return this.request(`/pessoas/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }

    // Animais
    async deleteAnimal(id, motivo) {
        return this.request(`/animais/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }

    // Raças
    async deleteRaca(id, motivo) {
        return this.request(`/racas/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ motivo })
        });
    }
}

export default new ApiService()

