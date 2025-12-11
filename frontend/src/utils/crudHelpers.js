// Helper functions para páginas CRUD

export const addEditDeleteToPage = (pageComponent, config) => {
  // Esta função será usada como template, mas vamos implementar diretamente nas páginas
  return pageComponent;
};

// Função para criar handlers de editar/excluir genéricos
export const createCrudHandlers = (apiService, entityName, getByIdMethod, updateMethod, deleteMethod) => {
  return {
    handleEdit: async (id, setFormData, setEditingId, setError, setSuccess) => {
      try {
        let item;
        if (getByIdMethod) {
          item = await getByIdMethod(id);
        } else {
          // Fallback: buscar da lista
          const items = await apiService[`get${entityName}s`]();
          item = items.find(i => i.id === id);
        }
        
        if (item) {
          setFormData(item);
          setEditingId(id);
          setError('');
          setSuccess('');
          document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        setError(`Erro ao carregar ${entityName} para edição`);
      }
    },

    handleDelete: async (id, setLoading, setError, setSuccess, refreshList) => {
      if (!window.confirm(`Tem certeza que deseja excluir este ${entityName}?`)) {
        return;
      }
      setLoading(true);
      setError('');
      try {
        await deleteMethod(id);
        setSuccess(`${entityName} excluído com sucesso!`);
        refreshList();
      } catch (err) {
        setError(err.message || `Erro ao excluir ${entityName}`);
      } finally {
        setLoading(false);
      }
    }
  };
};

