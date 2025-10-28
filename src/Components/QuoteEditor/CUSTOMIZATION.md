# Guide de personnalisation - QuoteEditor

## 🎨 Personnalisation des styles

### Variables CSS personnalisées

Le composant utilise des variables CSS dynamiques qui peuvent être surchargées :

```css
:root {
  /* Couleurs principales */
  --dynamic-primary-color: #0066cc;
  --dynamic-primary-contrast: white;
  --dynamic-primary-light: rgba(0, 102, 204, 0.1);
  --dynamic-primary-lighter: rgba(0, 102, 204, 0.05);
  --dynamic-primary-dark: #004499;
  
  /* Layout de la page */
  --page-width: 21cm;
  --page-margin: 0.8cm;
  
  /* Couleurs de composants */
  --quote-border-color: #dee2e6;
  --quote-text-color: #212529;
  --quote-muted-color: #6c757d;
}
```

### Thèmes personnalisés

```css
/* Thème sombre */
.dark-theme {
  --dynamic-primary-color: #66b3ff;
  --quote-text-color: #e8e9ea;
  --quote-border-color: #444;
  --page-secondary-color: #2d3748;
}

/* Thème entreprise */
.corporate-theme {
  --dynamic-primary-color: #2c5aa0;
  --page-width: 21cm;
  --page-margin: 1.5cm;
}

/* Thème moderne */
.modern-theme {
  --dynamic-primary-color: #667eea;
  --quote-border-color: #e2e8f0;
  border-radius: 12px;
}
```

### Application des thèmes

```tsx
function ThemedQuoteEditor() {
  const [theme, setTheme] = useState('default');
  
  return (
    <div className={`quote-container ${theme}-theme`}>
      <div className="theme-selector mb-3">
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="default">Défaut</option>
          <option value="dark">Sombre</option>
          <option value="corporate">Corporate</option>
          <option value="modern">Moderne</option>
        </select>
      </div>
      
      <QuoteEditor
        data={quoteData}
        onChange={setQuoteData}
      />
    </div>
  );
}
```

## 🏗️ Personnalisation de la structure

### Composants wrapper personnalisés

```tsx
// Wrapper avec sidebar
function QuoteEditorWithSidebar({ data, onChange, onSave }) {
  const [showSidebar, setShowSidebar] = useState(true);
  
  return (
    <div className="quote-editor-layout">
      {showSidebar && (
        <div className="quote-sidebar">
          <QuoteStatistics data={data} />
          <QuoteValidation data={data} />
          <QuoteHistory />
        </div>
      )}
      
      <div className="quote-main">
        <QuoteEditor
          data={data}
          onChange={onChange}
          onSave={onSave}
        />
      </div>
    </div>
  );
}

// Composants sidebar personnalisés
function QuoteStatistics({ data }) {
  const stats = {
    sections: data.sections.length,
    totalLines: data.sections.reduce((acc, s) => acc + s.lines.length, 0),
    optionBlocks: data.optionBlocks.length,
    totalTTC: data.totals.ttc
  };
  
  return (
    <div className="card mb-3">
      <div className="card-header">📊 Statistiques</div>
      <div className="card-body">
        <div className="stat-item">
          <strong>{stats.sections}</strong> sections
        </div>
        <div className="stat-item">
          <strong>{stats.totalLines}</strong> lignes
        </div>
        <div className="stat-item">
          <strong>{stats.optionBlocks}</strong> blocs d'options
        </div>
        <div className="stat-item text-primary">
          <strong>{stats.totalTTC.toFixed(2)} €</strong> TTC
        </div>
      </div>
    </div>
  );
}
```

### Layout personnalisé

```scss
// Layout sidebar + contenu
.quote-editor-layout {
  display: flex;
  height: 100vh;
  gap: 1rem;
  
  .quote-sidebar {
    width: 300px;
    flex-shrink: 0;
    overflow-y: auto;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .quote-main {
    flex: 1;
    overflow-y: auto;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    .quote-sidebar {
      width: 100%;
      height: auto;
      max-height: 30vh;
    }
  }
}
```

## 🧩 Extensions de composants

### EditableField personnalisé

```tsx
// Extension avec validation
interface ValidatedEditableFieldProps extends EditableFieldProps {
  validation?: (value: string) => string | null;
  showValidation?: boolean;
}

function ValidatedEditableField({ 
  validation, 
  showValidation = true, 
  ...props 
}: ValidatedEditableFieldProps) {
  const [error, setError] = useState<string | null>(null);
  
  const handleSave = (value: string) => {
    if (validation) {
      const validationError = validation(value);
      setError(validationError);
      if (validationError) return; // Ne pas sauvegarder si erreur
    }
    
    props.onSave(value);
  };
  
  return (
    <div className="validated-field">
      <EditableField
        {...props}
        onSave={handleSave}
        className={`${props.className} ${error ? 'is-invalid' : ''}`}
      />
      {showValidation && error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}

// Utilisation avec validation
<ValidatedEditableField
  value={data.quote.number}
  onSave={(value) => updateField('quote.number', value)}
  validation={(value) => {
    if (!value.trim()) return 'Numéro requis';
    if (!/^[A-Z]{2,3}-\d{4}-\d{3}$/.test(value)) {
      return 'Format attendu: ABC-2024-001';
    }
    return null;
  }}
  placeholder="ABC-2024-001"
/>
```

### OptionBlock étendu

```tsx
// Extension avec nouveau type de bloc
interface CustomOptionBlock extends OptionBlock {
  type: 'list' | 'notes' | 'table' | 'image';
  tableData?: Array<Record<string, string>>;
  imageUrl?: string;
}

function ExtendedOptionBlock({ block, ...props }: { block: CustomOptionBlock }) {
  if (block.type === 'table') {
    return (
      <div className="option-block table-block">
        <div className="block-header">
          <h4>{block.title}</h4>
        </div>
        <div className="block-content">
          <table className="table table-sm">
            <tbody>
              {block.tableData?.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key}>
                      <EditableField
                        value={value}
                        onSave={(newValue) => updateTableCell(index, key, newValue)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (block.type === 'image') {
    return (
      <div className="option-block image-block">
        <div className="block-header">
          <h4>{block.title}</h4>
        </div>
        <div className="block-content">
          {block.imageUrl && (
            <img 
              src={block.imageUrl} 
              alt={block.title}
              className="img-fluid"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control mt-2"
          />
        </div>
      </div>
    );
  }
  
  // Déléguer aux types standard
  return <OptionBlock block={block} {...props} />;
}
```

## 🔧 Hooks personnalisés

### Hook de validation

```tsx
interface ValidationRule {
  field: string;
  validate: (value: any) => string | null;
  required?: boolean;
}

interface UseValidationOptions {
  rules: ValidationRule[];
  validateOnChange?: boolean;
}

function useValidation(data: QuoteData, options: UseValidationOptions) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);
  
  const validateField = useCallback((field: string, value: any) => {
    const rule = options.rules.find(r => r.field === field);
    if (!rule) return null;
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      return 'Ce champ est requis';
    }
    
    return rule.validate(value);
  }, [options.rules]);
  
  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    options.rules.forEach(rule => {
      const value = getValueByPath(data, rule.field);
      const error = validateField(rule.field, value);
      if (error) {
        newErrors[rule.field] = error;
      }
    });
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [data, options.rules, validateField]);
  
  useEffect(() => {
    if (options.validateOnChange) {
      validateAll();
    }
  }, [data, options.validateOnChange, validateAll]);
  
  return {
    errors,
    isValid,
    validateField,
    validateAll,
    hasError: (field: string) => !!errors[field],
    getError: (field: string) => errors[field]
  };
}

// Utilisation
function ValidatedQuoteEditor() {
  const [quoteData, setQuoteData] = useState(quoteDataMock);
  
  const validation = useValidation(quoteData, {
    validateOnChange: true,
    rules: [
      {
        field: 'quote.number',
        required: true,
        validate: (value) => {
          if (!/^[A-Z]{2,3}-\d{4}-\d{3}$/.test(value)) {
            return 'Format: ABC-2024-001';
          }
          return null;
        }
      },
      {
        field: 'company.email',
        required: true,
        validate: (value) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Email invalide';
          }
          return null;
        }
      },
      {
        field: 'totals.ttc',
        validate: (value) => {
          if (value <= 0) {
            return 'Le total doit être positif';
          }
          return null;
        }
      }
    ]
  });
  
  return (
    <>
      {!validation.isValid && (
        <div className="alert alert-warning">
          ⚠️ {Object.keys(validation.errors).length} erreur(s) détectée(s)
          <ul className="mb-0 mt-2">
            {Object.entries(validation.errors).map(([field, error]) => (
              <li key={field}><strong>{field}:</strong> {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <QuoteEditor
        data={quoteData}
        onChange={setQuoteData}
        // Désactiver la sauvegarde si erreurs
        onSave={validation.isValid ? handleSave : undefined}
      />
    </>
  );
}
```

### Hook de templates

```tsx
function useQuoteTemplates() {
  const [templates, setTemplates] = useState<QuoteData[]>([]);
  
  const loadTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/quote-templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  }, []);
  
  const saveAsTemplate = useCallback(async (quoteData: QuoteData, name: string) => {
    const template = {
      ...quoteData,
      quote: {
        ...quoteData.quote,
        number: 'TEMPLATE',
        version: '1.0',
        issueDate: '',
        validUntil: ''
      },
      templateName: name
    };
    
    try {
      await fetch('/api/quote-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });
      
      await loadTemplates(); // Recharger la liste
    } catch (error) {
      console.error('Erreur sauvegarde template:', error);
      throw error;
    }
  }, [loadTemplates]);
  
  const createFromTemplate = useCallback((template: QuoteData): QuoteData => {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    return {
      ...template,
      quote: {
        ...template.quote,
        number: `DEV-${now.getFullYear()}-${Math.random().toString().slice(-3)}`,
        version: '1.0',
        issueDate: now.toISOString().split('T')[0],
        validUntil: nextYear.toISOString().split('T')[0]
      }
    };
  }, []);
  
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);
  
  return {
    templates,
    loadTemplates,
    saveAsTemplate,
    createFromTemplate
  };
}

// Utilisation avec sélecteur de templates
function TemplateQuoteEditor() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const { templates, saveAsTemplate, createFromTemplate } = useQuoteTemplates();
  const [showTemplates, setShowTemplates] = useState(!quoteData);
  
  const handleUseTemplate = (template: QuoteData) => {
    const newQuote = createFromTemplate(template);
    setQuoteData(newQuote);
    setShowTemplates(false);
  };
  
  const handleSaveAsTemplate = async () => {
    if (!quoteData) return;
    
    const name = prompt('Nom du template :');
    if (name) {
      await saveAsTemplate(quoteData, name);
      alert('Template sauvegardé !');
    }
  };
  
  if (showTemplates) {
    return (
      <div className="template-selector">
        <h2>Choisir un template</h2>
        <div className="row">
          {templates.map((template, index) => (
            <div key={index} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{template.templateName}</h5>
                  <p className="card-text">
                    {template.sections.length} sections, 
                    {template.optionBlocks.length} blocs
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Utiliser ce template
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="col-md-4 mb-3">
            <div className="card border-dashed">
              <div className="card-body text-center">
                <h5>Nouveau devis vide</h5>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setQuoteData(quoteDataMock)}
                >
                  Créer un devis vide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => setShowTemplates(true)}
        >
          ← Choisir un autre template
        </button>
        
        <button 
          className="btn btn-outline-success"
          onClick={handleSaveAsTemplate}
        >
          💾 Sauvegarder comme template
        </button>
      </div>
      
      <QuoteEditor
        data={quoteData!}
        onChange={setQuoteData}
      />
    </>
  );
}
```

## 🎯 Personnalisation PDF

### Styles PDF personnalisés

```tsx
// Création de styles PDF personnalisés
const createCustomPDFStyles = (company: Company, customOptions: any) => {
  const mainColor = customOptions.primaryColor || company.mainColor;
  
  return StyleSheet.create({
    page: {
      fontFamily: customOptions.fontFamily || 'Helvetica',
      fontSize: customOptions.fontSize || 10,
      paddingTop: customOptions.marginTop || 100,
      paddingBottom: customOptions.marginBottom || 50,
      paddingHorizontal: customOptions.marginHorizontal || 30,
      backgroundColor: customOptions.backgroundColor || 'white',
    },
    
    header: {
      backgroundColor: customOptions.headerBackground || mainColor,
      color: customOptions.headerColor || 'white',
      padding: customOptions.headerPadding || 15,
      // ... autres styles
    }
    
    // ... autres styles personnalisés
  });
};

// Composant PDF personnalisé
function CustomQuotePDFDocument({ data, customOptions }) {
  const styles = createCustomPDFStyles(data.company, customOptions);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header personnalisé */}
        {customOptions.showHeader && (
          <CustomPDFHeader data={data} styles={styles} />
        )}
        
        {/* Contenu avec styles personnalisés */}
        <View style={styles.content}>
          {/* ... contenu adapté */}
        </View>
        
        {/* Footer personnalisé */}
        {customOptions.showFooter && (
          <CustomPDFFooter data={data} styles={styles} />
        )}
      </Page>
    </Document>
  );
}

// Hook d'export PDF personnalisé
function useCustomPDFExport() {
  const exportWithCustomOptions = async (data: QuoteData, options: any) => {
    const doc = <CustomQuotePDFDocument data={data} customOptions={options} />;
    const blob = await pdf(doc).toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${options.filename || 'devis'}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  return { exportWithCustomOptions };
}
```

### Configuration d'export avancée

```tsx
function AdvancedExportDialog({ quoteData, onExport, onClose }) {
  const [options, setOptions] = useState({
    primaryColor: quoteData.company.mainColor,
    fontFamily: 'Helvetica',
    fontSize: 10,
    showHeader: true,
    showFooter: true,
    showLogo: true,
    marginTop: 100,
    marginBottom: 50,
    marginHorizontal: 30,
    includeSignature: true,
    watermark: '',
    filename: `devis-${quoteData.quote.number}`
  });
  
  const { exportWithCustomOptions } = useCustomPDFExport();
  
  const handleExport = async () => {
    await exportWithCustomOptions(quoteData, options);
    onClose();
  };
  
  return (
    <div className="modal fade show d-block">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Options d'export PDF</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Mise en page</h6>
                
                <div className="mb-3">
                  <label className="form-label">Police</label>
                  <select 
                    className="form-select"
                    value={options.fontFamily}
                    onChange={(e) => setOptions(prev => ({ ...prev, fontFamily: e.target.value }))}
                  >
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times-Roman">Times</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Taille de police</label>
                  <input
                    type="range"
                    min="8"
                    max="14"
                    value={options.fontSize}
                    onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="form-range"
                  />
                  <small>{options.fontSize}pt</small>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Couleur principale</label>
                  <input
                    type="color"
                    value={options.primaryColor}
                    onChange={(e) => setOptions(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="form-control form-control-color"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <h6>Contenu</h6>
                
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    checked={options.showHeader}
                    onChange={(e) => setOptions(prev => ({ ...prev, showHeader: e.target.checked }))}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Afficher l'en-tête</label>
                </div>
                
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    checked={options.showFooter}
                    onChange={(e) => setOptions(prev => ({ ...prev, showFooter: e.target.checked }))}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Afficher le pied de page</label>
                </div>
                
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    checked={options.showLogo}
                    onChange={(e) => setOptions(prev => ({ ...prev, showLogo: e.target.checked }))}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Afficher le logo</label>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Filigrane (optionnel)</label>
                  <input
                    type="text"
                    value={options.watermark}
                    onChange={(e) => setOptions(prev => ({ ...prev, watermark: e.target.value }))}
                    className="form-control"
                    placeholder="CONFIDENTIEL"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nom du fichier</label>
                  <input
                    type="text"
                    value={options.filename}
                    onChange={(e) => setOptions(prev => ({ ...prev, filename: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="button" className="btn btn-primary" onClick={handleExport}>
              Exporter PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Ces exemples montrent comment personnaliser profondément le composant QuoteEditor selon vos besoins spécifiques.