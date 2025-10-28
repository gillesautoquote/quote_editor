# Cahier des charges - API de génération PDF

## Vue d'ensemble

API REST pour générer des PDFs de devis professionnels à partir de données structurées, en utilisant Puppeteer et des templates HTML/Tailwind CSS.

---

## 1. Endpoint principal

### POST `/api/generate-pdf`

Génère un PDF à partir des données de devis fournies.

---

## 2. Format de requête

### Headers
```
Content-Type: application/json
```

### Body (JSON)

```json
{
  "quoteData": {
    "header": {
      "logo": "https://example.com/logo.png",
      "companyName": "Nom de la société",
      "address": "Adresse complète",
      "phone": "Téléphone",
      "email": "contact@example.com",
      "website": "www.example.com"
    },
    "recipient": {
      "name": "Nom du client",
      "organization": "Nom de l'organisation",
      "address": "Adresse du client",
      "phone": "Téléphone client",
      "email": "client@example.com"
    },
    "intro": {
      "quoteNumber": "DEVIS-2024-001",
      "date": "2024-01-15",
      "validUntil": "2024-02-15",
      "title": "Devis pour transport scolaire",
      "description": "Description détaillée du projet de transport..."
    },
    "sections": [
      {
        "id": "section-1",
        "title": "Transport aller-retour",
        "showDates": true,
        "showPrices": true,
        "items": [
          {
            "id": "item-1",
            "date": "2024-03-15",
            "description": "Transport Paris - Lyon",
            "quantity": 2,
            "unit": "bus",
            "unitPrice": 850.00,
            "vatRate": 10,
            "total": 1700.00
          }
        ],
        "subtotal": 1700.00,
        "vatAmount": 170.00,
        "totalWithVat": 1870.00
      }
    ],
    "optionBlocks": [
      {
        "id": "option-1",
        "title": "Options de voyage",
        "style": "checkbox",
        "columns": 2,
        "items": [
          {
            "id": "opt-1",
            "label": "Assurance annulation",
            "price": 50.00,
            "checked": false
          },
          {
            "id": "opt-2",
            "label": "Siège premium",
            "price": 25.00,
            "checked": false
          }
        ]
      }
    ],
    "tripProgram": {
      "visible": true,
      "days": [
        {
          "id": "day-1",
          "date": "2024-03-15",
          "title": "Jour 1 - Départ",
          "items": [
            {
              "id": "item-1",
              "time": "08:00",
              "description": "Départ de Paris",
              "location": "Place de la République"
            }
          ]
        }
      ]
    },
    "busServices": {
      "visible": true,
      "items": [
        {
          "id": "service-1",
          "icon": "wifi",
          "label": "WiFi gratuit"
        },
        {
          "id": "service-2",
          "icon": "coffee",
          "label": "Boissons chaudes"
        }
      ]
    },
    "carbonImpact": {
      "visible": true,
      "co2Saved": 245,
      "treesEquivalent": 12
    },
    "totals": {
      "subtotal": 1700.00,
      "vatBreakdown": [
        {
          "rate": 10,
          "base": 1700.00,
          "amount": 170.00
        }
      ],
      "totalVat": 170.00,
      "totalWithVat": 1870.00,
      "deposit": 500.00,
      "balance": 1370.00
    },
    "signature": {
      "visible": true,
      "text": "Bon pour accord",
      "termsAccepted": "J'accepte les conditions générales de vente",
      "signatureLabel": "Signature du client",
      "dateLabel": "Date"
    },
    "footer": {
      "legalInfo": "SIRET: 123 456 789 00010 - TVA: FR12345678901",
      "paymentTerms": "Acompte de 30% à la signature, solde avant prestation",
      "additionalInfo": "Conditions générales disponibles sur demande"
    }
  },
  "options": {
    "format": "A4",
    "orientation": "portrait",
    "printBackground": true,
    "preferCSSPageSize": true,
    "displayHeaderFooter": false,
    "margin": {
      "top": "0",
      "right": "0",
      "bottom": "0",
      "left": "0"
    }
  }
}
```

---

## 3. Structure détaillée des données

### 3.1 Header (En-tête de l'entreprise)
- `logo`: URL du logo (optionnel)
- `companyName`: Nom de l'entreprise
- `address`: Adresse complète
- `phone`: Numéro de téléphone
- `email`: Email de contact
- `website`: Site web (optionnel)

### 3.2 Recipient (Destinataire)
- `name`: Nom du contact
- `organization`: Nom de l'organisation (optionnel)
- `address`: Adresse complète
- `phone`: Téléphone
- `email`: Email

### 3.3 Intro (Introduction du devis)
- `quoteNumber`: Numéro unique du devis
- `date`: Date d'émission (format ISO: YYYY-MM-DD)
- `validUntil`: Date de validité (format ISO: YYYY-MM-DD)
- `title`: Titre du devis
- `description`: Description détaillée (supporte Markdown)

### 3.4 Sections (Lignes de facturation)
Tableau d'objets avec :
- `id`: Identifiant unique
- `title`: Titre de la section
- `showDates`: Afficher les dates (boolean)
- `showPrices`: Afficher les prix (boolean)
- `items`: Tableau d'items
  - `id`: Identifiant unique
  - `date`: Date de prestation (format ISO)
  - `description`: Description de la prestation
  - `quantity`: Quantité
  - `unit`: Unité (ex: "bus", "jour", "personne")
  - `unitPrice`: Prix unitaire HT
  - `vatRate`: Taux de TVA (en %, ex: 10, 20)
  - `total`: Total HT (quantity × unitPrice)
- `subtotal`: Sous-total HT de la section
- `vatAmount`: Montant TVA
- `totalWithVat`: Total TTC de la section

### 3.5 Option Blocks (Blocs d'options sélectionnables)
Tableau d'objets avec :
- `id`: Identifiant unique
- `title`: Titre du bloc
- `style`: Style d'affichage ("checkbox", "radio", "button")
- `columns`: Nombre de colonnes (1, 2, 3, 4)
- `items`: Tableau d'options
  - `id`: Identifiant unique
  - `label`: Libellé de l'option
  - `price`: Prix de l'option (optionnel)
  - `checked`: Pré-sélectionné (boolean)

### 3.6 Trip Program (Programme de voyage)
- `visible`: Afficher le programme (boolean)
- `days`: Tableau de jours
  - `id`: Identifiant unique
  - `date`: Date (format ISO)
  - `title`: Titre de la journée
  - `items`: Tableau d'étapes
    - `id`: Identifiant unique
    - `time`: Heure (format HH:MM)
    - `description`: Description de l'étape
    - `location`: Lieu (optionnel)

### 3.7 Bus Services (Services à bord)
- `visible`: Afficher les services (boolean)
- `items`: Tableau de services
  - `id`: Identifiant unique
  - `icon`: Nom de l'icône Lucide React
  - `label`: Libellé du service

### 3.8 Carbon Impact (Impact carbone)
- `visible`: Afficher l'impact carbone (boolean)
- `co2Saved`: CO2 économisé en kg
- `treesEquivalent`: Équivalent en arbres

### 3.9 Totals (Totaux)
- `subtotal`: Total HT
- `vatBreakdown`: Détail de la TVA par taux
  - `rate`: Taux de TVA
  - `base`: Base HT
  - `amount`: Montant TVA
- `totalVat`: Total TVA
- `totalWithVat`: Total TTC
- `deposit`: Acompte demandé (optionnel)
- `balance`: Solde à payer (optionnel)

### 3.10 Signature (Zone de signature)
- `visible`: Afficher la zone de signature (boolean)
- `text`: Texte "Bon pour accord"
- `termsAccepted`: Texte d'acceptation des CGV
- `signatureLabel`: Label de la signature
- `dateLabel`: Label de la date

### 3.11 Footer (Pied de page)
- `legalInfo`: Informations légales (SIRET, TVA)
- `paymentTerms`: Conditions de paiement
- `additionalInfo`: Informations complémentaires

### 3.12 Options PDF
- `format`: Format du papier ("A4", "Letter")
- `orientation`: Orientation ("portrait", "landscape")
- `printBackground`: Imprimer les arrière-plans (boolean)
- `preferCSSPageSize`: Utiliser les tailles CSS (boolean)
- `displayHeaderFooter`: Afficher header/footer auto (boolean)
- `margin`: Marges (top, right, bottom, left en string avec unité)

---

## 4. Format de réponse

### Succès (200 OK)

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="devis-[quoteNumber].pdf"
```

**Body:** Fichier PDF binaire

### Erreur (400 Bad Request)

```json
{
  "error": "Invalid request",
  "message": "Missing required field: quoteData.intro.quoteNumber",
  "details": {
    "field": "quoteData.intro.quoteNumber",
    "expected": "string"
  }
}
```

### Erreur (500 Internal Server Error)

```json
{
  "error": "PDF generation failed",
  "message": "Puppeteer failed to render PDF",
  "details": {
    "step": "html-to-pdf",
    "reason": "Timeout after 30s"
  }
}
```

---

## 5. Contraintes techniques

### Performance
- **Timeout maximum**: 30 secondes
- **Taille de requête**: Maximum 5 MB
- **Taille de réponse**: Maximum 10 MB (PDF)

### Sécurité
- Validation stricte des URLs (logo, images)
- Sanitization des données HTML/Markdown
- Rate limiting recommandé (ex: 10 requêtes/minute par IP)

### Rendu
- **Template**: HTML5 + Tailwind CSS 3.4+
- **Fonts**: Google Fonts (Inter, Roboto recommandés)
- **Images**: Support PNG, JPG, SVG
- **Polices d'icônes**: Lucide React ou équivalent

---

## 6. Design attendu

### Style général
- Design professionnel et épuré
- Palette de couleurs neutres (gris, bleu corporate)
- Typographie lisible (16px minimum pour le corps)
- Marges généreuses pour l'impression

### Éléments visuels
- Logo en haut à gauche
- Informations entreprise alignées à droite
- Sections clairement délimitées
- Tableaux avec bordures subtiles
- Totaux mis en évidence (fond coloré léger)
- Zone de signature avec lignes pointillées

### Responsive print
- Gestion des sauts de page (@page break)
- Headers/footers sur chaque page
- Numérotation des pages si multi-pages

---

## 7. Exemple d'utilisation côté client

```typescript
const generateQuotePDF = async (quoteData: QuoteData) => {
  try {
    const response = await fetch('https://your-api.com/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteData,
        options: {
          format: 'A4',
          orientation: 'portrait',
          printBackground: true,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devis-${quoteData.intro.quoteNumber}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};
```

---

## 8. Template HTML/CSS recommandé

Le template doit :
- Utiliser Tailwind CSS pour le styling
- Être responsive pour l'impression
- Gérer les sauts de page proprement
- Inclure des media queries `@media print`
- Supporter les polices custom via Google Fonts

Structure suggérée :
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      margin: 0;
    }
    body {
      font-family: 'Inter', sans-serif;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <!-- Contenu du devis -->
</body>
</html>
```

---

## 9. Tests recommandés

### Cas de test minimum
1. Devis simple (1 section, sans options)
2. Devis complet (toutes les sections actives)
3. Devis multi-pages (20+ lignes)
4. Devis avec images (logo, icônes)
5. Devis avec caractères spéciaux (UTF-8)
6. Devis avec montants décimaux complexes

### Validation
- Vérifier les calculs de TVA
- Vérifier les totaux
- Vérifier les sauts de page
- Vérifier le rendu des polices
- Vérifier la qualité des images

---

## 10. Evolution future possible

- Support de templates multiples (choix de design)
- Watermark personnalisable
- Signature électronique intégrée
- Multi-langue automatique
- Export en HTML en plus du PDF
- Webhooks pour notification asynchrone

---

## Contact et support

Pour toute question sur l'intégration de cette API, référez-vous à la documentation du composant QuoteEditor dans `/src/Components/QuoteEditor/README.md`
