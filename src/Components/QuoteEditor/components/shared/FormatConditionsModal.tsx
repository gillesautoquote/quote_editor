import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface FormatConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormatted: (blocks: Array<{
    id: string;
    title: string;
    color: string;
    columns: number;
    showTitle: boolean;
    allowWidthControl: boolean;
    type: 'list';
    rows: Array<{
      id: string;
      label: string;
      style: 'normal' | 'bold';
    }>;
  }>) => void;
  companyColor: string;
}

interface ChatGPTResponse {
  blocks: Array<{
    title: string;
    items: string[];
  }>;
}

export const FormatConditionsModal: React.FC<FormatConditionsModalProps> = ({
  isOpen,
  onClose,
  onFormatted,
  companyColor
}) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatWithChatGPT = async () => {
    if (!text.trim()) {
      setError('Veuillez entrer du texte');
      return;
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setError('Clé API OpenAI manquante. Ajoutez VITE_OPENAI_API_KEY dans votre fichier .env');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es un assistant qui formate des conditions générales pour des devis de transport.

Analyse le texte fourni et structure-le en blocs logiques avec des titres clairs.
Chaque bloc doit contenir une liste d'éléments.

Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
{
  "blocks": [
    {
      "title": "Titre du bloc",
      "items": ["Item 1", "Item 2", "Item 3"]
    }
  ]
}

Règles importantes :
- Crée des blocs logiques (ex: "Ces tarifs comprennent", "Ces tarifs ne comprennent pas", "Modalités de paiement", "Conditions d'annulation", etc.)
- Chaque item doit être concis et clair
- Garde le sens et le contenu original
- Ne rajoute pas d'explications, juste le JSON`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Réponse vide de ChatGPT');
      }

      const parsed: ChatGPTResponse = JSON.parse(content);

      const formattedBlocks = parsed.blocks.map((block, blockIndex) => ({
        id: `block_${Date.now()}_${blockIndex}`,
        title: block.title,
        color: companyColor,
        columns: 6,
        showTitle: true,
        allowWidthControl: true,
        type: 'list' as const,
        rows: block.items.map((item, itemIndex) => ({
          id: `row_${Date.now()}_${blockIndex}_${itemIndex}`,
          label: item,
          style: 'normal' as const
        }))
      }));

      onFormatted(formattedBlocks);
      setText('');
      onClose();
    } catch (err) {
      console.error('Error formatting with ChatGPT:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du formatage');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/50">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-xl tw-max-w-2xl tw-w-full tw-mx-4 tw-max-h-[90vh] tw-flex tw-flex-col">
        <div className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <div className="tw-flex tw-items-center tw-gap-2">
            <Sparkles size={20} style={{ color: companyColor }} />
            <h3 className="tw-text-lg tw-font-bold">Formater avec ChatGPT</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tw-p-1 tw-rounded hover:tw-bg-gray-100 tw-transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tw-p-4 tw-flex-1 tw-overflow-y-auto">
          <p className="tw-text-sm tw-text-gray-600 tw-mb-3">
            Collez vos conditions générales non formatées ci-dessous. ChatGPT les structurera automatiquement en blocs organisés.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Collez votre texte ici...&#10;&#10;Exemple:&#10;Les tarifs comprennent la mise à disposition du véhicule, le carburant, les péages.&#10;Les tarifs ne comprennent pas les repas, l'hébergement du chauffeur.&#10;Paiement à 30 jours fin de mois..."
            className="tw-w-full tw-h-64 tw-p-3 tw-border tw-border-gray-300 tw-rounded tw-text-sm tw-resize-none focus:tw-outline-none focus:tw-ring-2"
            style={{ '--tw-ring-color': companyColor } as React.CSSProperties}
            disabled={isLoading}
          />

          {error && (
            <div className="tw-mt-3 tw-p-3 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded tw-text-sm tw-text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="tw-flex tw-justify-end tw-gap-2 tw-p-4 tw-border-t">
          <button
            type="button"
            onClick={onClose}
            className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded hover:tw-bg-gray-50 tw-transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={formatWithChatGPT}
            disabled={isLoading || !text.trim()}
            className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white tw-rounded tw-transition-colors tw-flex tw-items-center tw-gap-2 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            style={{ backgroundColor: companyColor }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="tw-animate-spin" />
                Formatage en cours...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Formater avec ChatGPT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
