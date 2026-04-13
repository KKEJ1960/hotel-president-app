import { useState } from 'react';
import axios from '../api/axios';

export default function ImageUpload({ value, onChange, placeholder }) {
  const [activeTab, setActiveTab] = useState('url');
  const [url, setUrl] = useState(value || '');
  const [preview, setPreview] = useState(value || '');
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (isValidUrl(newUrl)) {
      setPreview(newUrl);
      onChange(newUrl);
    } else {
      setPreview('');
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.imageUrl;
        setUrl(imageUrl);
        setPreview(imageUrl);
        onChange(imageUrl);
      } else {
        alert('Erreur lors de l\'upload: ' + response.data.message);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '0.75rem', 
        fontWeight: 600, 
        color: '#555', 
        marginBottom: '6px',
        letterSpacing: '0.04em', 
        textTransform: 'uppercase' 
      }}>
        Photo de l'image
      </label>

      {/* Onglets */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '1rem', 
        border: '1px solid #e8e4e0', 
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: activeTab === 'url' ? '#e87722' : '#f8f6f3',
            color: activeTab === 'url' ? '#fff' : '#888',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          URL Web
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: activeTab === 'file' ? '#e87722' : '#f8f6f3',
            color: activeTab === 'file' ? '#fff' : '#888',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Appareil
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'url' && (
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder || "https://example.com/image.jpg"}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              border: '1.5px solid #e8e4e0',
              outline: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#e87722'}
            onBlur={(e) => e.target.style.borderColor = '#e8e4e0'}
          />
        </div>
      )}

      {activeTab === 'file' && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              border: '1.5px solid #e8e4e0',
              outline: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          />
          {loading && (
            <div style={{
              marginTop: '8px',
              textAlign: 'center',
              color: '#888',
              fontSize: '0.85rem'
            }}>
              Upload en cours...
            </div>
          )}
        </div>
      )}

      {/* Aperçu de l'image */}
      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#555',
            marginBottom: '6px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Aperçu
          </p>
          <img
            src={preview}
            alt="Aperçu"
            style={{
              width: '100%',
              height: '140px',
              objectFit: 'cover',
              borderRadius: '10px',
              border: '1px solid #e8e4e0'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
