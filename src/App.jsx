import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, MapPin, Calendar as CalendarIcon, Clock,
  Image as ImageIcon, Type, Music, Layout,
  Smartphone, Share2, CheckCircle, Save, Eye,
  Palette, Grid, Settings, Video, Sliders, ChevronDown, ChevronUp,
  ImagePlus, Trash2, SkipBack, SkipForward, Shuffle, Repeat, Upload, GripVertical, Code, Globe, FileAudio, MessageCircle, X, ExternalLink, Sparkles, AlertTriangle, Youtube
} from 'lucide-react';

// --- CONFIGURACIÓN Y UTILIDADES ---

const FONT_OPTIONS = [
  { label: 'Elegante (Playfair Display)', value: "'Playfair Display', serif" },
  { label: 'Romántica (Great Vibes)', value: "'Great Vibes', cursive" },
  { label: 'Majestuosa (Cinzel)', value: "'Cinzel', serif" },
  { label: 'Moderna (Montserrat)', value: "'Montserrat', sans-serif" },
  { label: 'Manuscrita (Sacramento)', value: "'Sacramento', cursive" },
  { label: 'Divertida (Dancing Script)', value: "'Dancing Script', cursive" },
  { label: 'Realeza (Pinyon Script)', value: "'Pinyon Script', cursive" },
  { label: 'Clásica Fina (Italianno)', value: "'Italianno', cursive" },
  { label: 'Editorial (Cormorant Garamond)', value: "'Cormorant Garamond', serif" },
  { label: 'Limpia (Lato)', value: "'Lato', sans-serif" },
  { label: 'Lectura (Open Sans)', value: "'Open Sans', sans-serif" },
];

const INITIAL_CONFIG = {
  global: {
    primaryColor: '#D4AF37',   // Oro
    secondaryColor: '#E5989B', // Rosa Viejo / Acento
    titleFont: "'Cormorant Garamond', serif",
    bodyFont: "'Montserrat', sans-serif",
    audioUrl: '',
    audioTitle: 'Canción de Fondo',
    showFloatingPlayer: true,
  },
  sections: [
    {
      id: 'hero_1',
      type: 'hero',
      visible: true,
      bgImage: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80&w=1000',
      overlayImage: '',
      overlayOpacity: 0.3,
      title: 'Sofía & Alejandro',
      subtitle: '¡Nuestra Boda!',
      date: '2025-11-20',
      mediaType: 'image',
      youtubeUrl: '',
    },
    {
      id: 'music_1',
      type: 'music',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0,
      title: 'Canción Especial',
      subtitle: 'Nuestra Historia de Amor',
      instruction: 'Dale Play al Amor'
    },
    {
      id: 'countdown_1',
      type: 'countdown',
      visible: true,
      bgImage: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&q=80&w=1000',
      overlayImage: '',
      overlayOpacity: 0.6,
      title: 'Faltan...',
      targetDate: '2025-11-20T16:00',
    },
    {
      id: 'calendar_1',
      type: 'calendar',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0.0,
      title: 'Reserva la Fecha',
      date: '2025-11-20'
    },
    {
      id: 'text_1',
      type: 'text',
      visible: true,
      bgImage: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=1000',
      overlayImage: '',
      overlayOpacity: 0.7,
      title: 'Ceremonia',
      content: 'Te invitamos a compartir este momento único en nuestras vidas.'
    },
    {
      id: 'gallery_1',
      type: 'gallery',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0,
      title: 'Nuestros Momentos',
      images: [
        'https://images.unsplash.com/photo-1623091411315-2663f338d93c?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=500',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500'
      ]
    },
    {
      id: 'rsvp_form_1',
      type: 'rsvp_form',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0,
      title: 'Confirmar Asistencia',
      subtitle: 'Por favor llena el formulario',
      googleScriptUrl: ''
    },
    {
      id: 'rsvp_wa_1',
      type: 'rsvp_whatsapp',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0,
      title: 'Confirmar por WhatsApp',
      whatsappNumber: '573000000000',
      whatsappMessage: 'Hola, quiero confirmar mi asistencia al evento.'
    },
    {
      id: 'location_1',
      type: 'location',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0,
      title: 'Ubicación',
      placeName: 'El Castillo',
      address: 'Medellín, Colombia',
      mapUrl: 'https://maps.google.com'
    },
    {
      id: 'html_1',
      type: 'html',
      visible: true,
      bgImage: '',
      overlayImage: '',
      overlayOpacity: 0,
      title: 'Extra',
      htmlContent: '<div style="text-align:center; padding: 20px; border: 1px dashed #ccc; background: rgba(255,255,255,0.5);"><h3>¡Gracias por acompañarnos!</h3></div>'
    }
  ]
};

// --- UTILIDAD PARA VIDEO YOUTUBE ---
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

// --- COMPONENTE DE CARGA DE ARCHIVOS CON LIMITE DE PESO ---
const FileUploader = ({ label, currentFile, onFileChange, type = "image", className = "" }) => {
  const fileInputRef = useRef(null);
  const acceptType = type === "audio" ? "audio/*" : "image/png, image/jpeg, image/gif, image/webp";
  const MAX_SIZE_MB = 2; // Límite de 2MB para optimización móvil

  let Icon = ImageIcon;
  if (type === "audio") Icon = FileAudio;
  if (type === "overlay") Icon = Sparkles;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación de peso
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > MAX_SIZE_MB) {
        alert(`⚠️ El archivo es muy pesado (${fileSizeMB.toFixed(2)} MB). Por favor usa archivos menores a ${MAX_SIZE_MB} MB para que la tarjeta cargue rápido en celulares.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onFileChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
          <Icon size={14} /> {label}
        </label>
        <span className="text-[10px] text-gray-400">Máx {MAX_SIZE_MB}MB</span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative group cursor-pointer flex items-center justify-center
            ${type === 'audio' ? 'w-full h-12' : 'w-16 h-16'}
          `}
          onClick={() => fileInputRef.current.click()}
        >
          {currentFile ? (
            (type === "image" || type === "overlay") ? (
              <img src={currentFile} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-medium text-xs px-3">
                <CheckCircle size={16} /> Listo
              </div>
            )
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Icon size={20} />
              {type === "overlay" && <span className="text-[8px] mt-1 text-center">GIF/PNG</span>}
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload size={16} className="text-white" />
          </div>
        </div>

        {/* Controles Unificados para Subir/Quitar (Incluye Audio) */}
        <div className="flex-1">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptType} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
            {currentFile ? 'Cambiar' : 'Subir'}
          </button>
          {currentFile && (
            <button onClick={(e) => { e.stopPropagation(); onFileChange(''); }} className="ml-2 text-xs text-red-500 hover:text-red-700">
              Quitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- WRAPPER DE SECCIONES ---
const SectionWrapper = ({ config, children, globalConfig, className = "" }) => {
  const hasBg = !!config.bgImage;
  const isParallax = config.type === 'hero';

  return (
    <section
      className={`relative overflow-hidden transition-all duration-500 w-full ${className}`}
      style={{ fontFamily: globalConfig.bodyFont }}
    >
      {/* 1. Capa de Fondo */}
      {hasBg && (
        <div
          className={`absolute inset-0 z-0 ${isParallax ? 'bg-fixed' : ''}`}
          style={{
            backgroundImage: `url('${config.bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: '#000', opacity: config.overlayOpacity }} />
        </div>
      )}

      {/* 2. Capa Decorativa (GIF/PNG Flotante) */}
      {config.overlayImage && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
          <img
            src={config.overlayImage}
            alt="Decoration"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      )}

      {/* 3. Contenido Real */}
      <div className={`relative z-20 w-full ${hasBg ? 'text-white' : 'text-gray-800'}`}>
        {children}
      </div>
    </section>
  );
};

// --- COMPONENTES DE VISTA PREVIA ---

const InlineMusicSection = ({ section, primaryColor, secondaryColor, audioUrl, titleFont }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const togglePlay = () => { if (audioRef.current) { if (playing) audioRef.current.pause(); else audioRef.current.play(); setPlaying(!playing); } };

  return (
    <div className="px-6 py-16 text-center relative z-10 flex flex-col items-center w-full">
      <div className="mb-6"><Music size={32} style={{ color: section.bgImage ? 'white' : primaryColor, opacity: 0.5 }} /></div>
      <h2 className="text-4xl md:text-5xl mb-2 animate-fade-in" style={{ fontFamily: titleFont, color: section.bgImage ? 'white' : primaryColor }}>{section.title}</h2>
      <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-10">{section.subtitle}</p>

      <div className="w-full max-w-xs bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 shadow-lg flex items-center justify-between px-4">
        <span className="text-[10px] opacity-60 w-8 text-right">0:00</span>
        <div className="flex items-center gap-4 text-gray-600">
          <SkipBack size={20} className="cursor-pointer hover:scale-110 transition-transform" />
          <button onClick={togglePlay} className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transform active:scale-90 transition-transform hover:scale-105" style={{ backgroundColor: primaryColor }}>
            {playing ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-1" />}
          </button>
          <SkipForward size={20} className="cursor-pointer hover:scale-110 transition-transform" />
        </div>
        <span className="text-[10px] opacity-60 w-8 text-left">--:--</span>
      </div>
      <p className="text-[10px] mt-6 opacity-50 uppercase tracking-widest animate-pulse" style={{ color: secondaryColor }}>{section.instruction}</p>
      {audioUrl ? <audio ref={audioRef} src={audioUrl} loop /> : <p className="text-[10px] text-red-400 mt-2">(Sube audio en config)</p>}
    </div>
  );
};

const FullMonthCalendar = ({ dateStr, primaryColor, titleFont }) => {
  const date = new Date(dateStr);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return (
    <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-6 inline-block border border-gray-100 max-w-sm w-full mx-auto">
      <div className="text-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-2xl font-bold uppercase tracking-widest" style={{ color: primaryColor, fontFamily: titleFont }}>{monthNames[date.getMonth()]}</h3>
        <p className="text-sm text-gray-400 font-serif italic">{date.getFullYear()}</p>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => <div key={i} className="text-xs font-bold text-gray-300 uppercase text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {Array.from({ length: firstDay + daysInMonth }).map((_, i) => {
          const d = i >= firstDay ? i - firstDay + 1 : null;
          return <div key={i} className="flex justify-center">{d ? <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all ${d === date.getDate() ? 'text-white shadow-lg scale-110 font-bold' : 'text-gray-600'}`} style={{ backgroundColor: d === date.getDate() ? primaryColor : 'transparent' }}>{d}</div> : <div />}</div>;
        })}
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function InvitationBuilder() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState('editor');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;600&family=Cinzel:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Montserrat:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Sacramento&family=Pinyon+Script&family=Italianno&family=Cormorant+Garamond:wght@400;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const updateGlobal = (key, value) => setConfig(prev => ({ ...prev, global: { ...prev.global, [key]: value } }));
  const updateSection = (id, field, value) => setConfig(prev => ({ ...prev, sections: prev.sections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec) }));
  const handleFileUpload = (sectionId, field, base64Data) => sectionId === null ? updateGlobal(field, base64Data) : updateSection(sectionId, field, base64Data);

  const moveSection = (index, direction) => {
    const newSections = [...config.sections];
    if (direction === 'up' && index > 0) [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    else if (direction === 'down' && index < newSections.length - 1) [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setConfig(prev => ({ ...prev, sections: newSections }));
  };

  const onDragStart = (e, index) => { setDraggedItemIndex(index); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newSections = [...config.sections];
    const draggedItem = newSections[draggedItemIndex];
    newSections.splice(draggedItemIndex, 1);
    newSections.splice(index, 0, draggedItem);
    setConfig(prev => ({ ...prev, sections: newSections }));
    setDraggedItemIndex(index);
  };

  // --- LÓGICA DE PUBLICACIÓN (SIMULADA) ---
  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const hero = config.sections.find(s => s.type === 'hero');
      const names = hero ? hero.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'invitacion';
      const mockUrl = `https://tarjetas-wa-hero.railway.app/${names}`;
      setPublishedUrl(mockUrl);
      setIsPublishing(false);
    }, 2000);
  };

  const renderEditor = () => (
    <div className="h-full bg-slate-50 flex flex-col font-sans">
      <header className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Settings className="text-indigo-600" size={20} /> WA JERO</h1>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {isPublishing ? 'Generando...' : <><Globe size={14} /> Publicar</>}
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* GLOBAL SETTINGS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Palette size={14} /> Estilo Global</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Color Primario</label>
                <input type="color" value={config.global.primaryColor} onChange={(e) => updateGlobal('primaryColor', e.target.value)} className="h-8 w-full rounded cursor-pointer border-0 p-0" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Color Secundario</label>
                <input type="color" value={config.global.secondaryColor} onChange={(e) => updateGlobal('secondaryColor', e.target.value)} className="h-8 w-full rounded cursor-pointer border-0 p-0" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Fuente Títulos</label>
                <select value={config.global.titleFont} onChange={(e) => updateGlobal('titleFont', e.target.value)} className="w-full h-9 text-xs border rounded px-2">{FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Fuente Textos</label>
                <select value={config.global.bodyFont} onChange={(e) => updateGlobal('bodyFont', e.target.value)} className="w-full h-9 text-xs border rounded px-2">{FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <FileUploader label="Música de Fondo (MP3)" currentFile={config.global.audioUrl} type="audio" onFileChange={(data) => handleFileUpload(null, 'audioUrl', data)} />
            </div>
          </div>
        </div>

        {/* SECTIONS LIST */}
        <div className="space-y-2">
          {config.sections.map((section, index) => (
            <div key={section.id} className={`bg-white rounded-lg border shadow-sm transition-all duration-200 ${draggedItemIndex === index ? 'opacity-50 scale-95 border-dashed border-indigo-400' : 'border-slate-200'}`} draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => onDragOver(e, index)} onDragEnd={() => setDraggedItemIndex(null)}>
              <div className="flex items-center p-3 cursor-grab bg-slate-50 rounded-t-lg border-b border-slate-100" onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}>
                <GripVertical size={16} className="mr-3 text-slate-400" />
                <div className="flex-1 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${section.visible ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                  <span className="font-semibold text-slate-700 text-sm capitalize">{section.title || section.type.replace('_', ' ')}</span>
                  {section.type === 'hero' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">Parallax</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-400" onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} disabled={index === 0}><ChevronUp size={14} /></button>
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-400" onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} disabled={index === config.sections.length - 1}><ChevronDown size={14} /></button>
                </div>
              </div>
              {editingSectionId === section.id && (
                <div className="p-4 space-y-4 bg-white animate-in slide-in-from-top-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Visible</span>
                    <input type="checkbox" checked={section.visible} onChange={() => updateSection(section.id, 'visible', !section.visible)} className="w-4 h-4 accent-indigo-600" />
                  </div>

                  {/* FONDOS Y CAPAS */}
                  <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-3">
                    <div>
                      <FileUploader label="Fondo Sección" currentFile={section.bgImage} onFileChange={(data) => handleFileUpload(section.id, 'bgImage', data)} />
                      {section.bgImage && <input type="range" min="0" max="0.9" step="0.1" value={section.overlayOpacity} onChange={(e) => updateSection(section.id, 'overlayOpacity', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2" />}
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <FileUploader label="Decoración Flotante (GIF/PNG)" type="overlay" currentFile={section.overlayImage} onFileChange={(data) => handleFileUpload(section.id, 'overlayImage', data)} />
                      <p className="text-[10px] text-gray-400 mt-1">Sube un PNG transparente o GIF que irá encima del contenido (ej. brillos, confeti).</p>
                    </div>
                  </div>

                  {/* EDITORES ESPECIFICOS */}
                  {section.type === 'countdown' && (
                    <div className="space-y-2">
                      <input type="text" placeholder="Título" className="w-full p-2 border rounded text-sm" value={section.title} onChange={e => updateSection(section.id, 'title', e.target.value)} />
                      <label className="text-xs font-bold text-gray-400">Fecha Objetivo</label>
                      <input type="datetime-local" className="w-full p-2 border rounded text-sm" value={section.targetDate} onChange={e => updateSection(section.id, 'targetDate', e.target.value)} />
                    </div>
                  )}

                  {section.type === 'rsvp_form' && (
                    <div className="space-y-2">
                      <input type="text" placeholder="Título" className="w-full p-2 border rounded text-sm" value={section.title} onChange={e => updateSection(section.id, 'title', e.target.value)} />
                      <input type="text" placeholder="Subtítulo" className="w-full p-2 border rounded text-sm" value={section.subtitle} onChange={e => updateSection(section.id, 'subtitle', e.target.value)} />
                      <label className="text-xs font-bold text-gray-400 flex items-center gap-1"><Code size={12} /> Google Script URL</label>
                      <input type="text" placeholder="https://script.google.com/..." className="w-full p-2 border rounded text-xs bg-slate-50" value={section.googleScriptUrl} onChange={e => updateSection(section.id, 'googleScriptUrl', e.target.value)} />
                    </div>
                  )}

                  {section.type === 'gallery' && (
                    <div className="grid grid-cols-2 gap-2">
                      {section.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} className="w-full h-20 object-cover rounded" />
                          <button onClick={() => {
                            const newImages = section.images.filter((_, i) => i !== idx);
                            updateSection(section.id, 'images', newImages);
                          }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const newImages = [...section.images, 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80&w=200'];
                        updateSection(section.id, 'images', newImages);
                      }} className="h-20 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-indigo-300">
                        <ImagePlus size={20} />
                      </button>
                    </div>
                  )}

                  {/* CAMPO DE VIDEO PARA HERO */}
                  {section.type === 'hero' && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-red-500 flex items-center gap-1"><Youtube size={12} /> Video YouTube (Debajo del texto)</label>
                      <input
                        type="text"
                        placeholder="Pega el enlace de YouTube aquí"
                        className="w-full p-2 border rounded text-sm"
                        value={section.youtubeUrl || ''}
                        onChange={e => updateSection(section.id, 'youtubeUrl', e.target.value)}
                      />
                    </div>
                  )}

                  {['hero', 'text', 'calendar', 'location', 'rsvp_whatsapp', 'music', 'html'].includes(section.type) && (
                    <div className="space-y-3">
                      {section.title !== undefined && <input type="text" value={section.title} onChange={e => updateSection(section.id, 'title', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Título" />}
                      {section.subtitle !== undefined && <input type="text" value={section.subtitle} onChange={e => updateSection(section.id, 'subtitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Subtítulo" />}
                      {section.content !== undefined && <textarea rows={4} value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Texto..." />}
                      {section.date !== undefined && <input type="date" value={section.date} onChange={e => updateSection(section.id, 'date', e.target.value)} className="w-full p-2 border rounded text-sm" />}
                      {section.whatsappNumber !== undefined && <input type="text" value={section.whatsappNumber} onChange={e => updateSection(section.id, 'whatsappNumber', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="WhatsApp" />}
                      {section.htmlContent !== undefined && <textarea rows={4} value={section.htmlContent} onChange={e => updateSection(section.id, 'htmlContent', e.target.value)} className="w-full p-2 border rounded text-sm font-mono text-xs" placeholder="HTML..." />}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="h-full w-full bg-white overflow-y-auto scroll-smooth relative" style={{ fontFamily: config.global.bodyFont }}>
      {config.sections.filter(s => s.visible).map((section) => (
        <SectionWrapper
          key={section.id}
          config={section}
          globalConfig={config.global}
          className={section.type === 'hero' ? 'min-h-screen flex flex-col justify-center' : ''}
        >
          {section.type === 'music' && <InlineMusicSection section={section} primaryColor={config.global.primaryColor} secondaryColor={config.global.secondaryColor} audioUrl={config.global.audioUrl} titleFont={config.global.titleFont} />}
          {section.type === 'html' && <div className="relative z-10 w-full overflow-hidden"><div dangerouslySetInnerHTML={{ __html: section.htmlContent }} /></div>}

          {section.type === 'countdown' && (
            <div className="py-16 px-4 text-center relative z-10">
              <h2 className="text-2xl font-light uppercase tracking-widest mb-8" style={{ color: section.bgImage ? 'white' : config.global.primaryColor, fontFamily: config.global.titleFont }}>{section.title}</h2>
              <div className="flex justify-center gap-3">
                {['Días', 'Hs', 'Min', 'Seg'].map(u => (
                  <div key={u} className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <span className="text-xl font-bold" style={{ color: section.bgImage ? 'white' : 'gray' }}>00</span>
                    <span className="text-[10px] uppercase" style={{ color: section.bgImage ? 'white' : 'gray' }}>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.type === 'rsvp_form' && (
            <div className="py-16 px-6 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-2" style={{ color: section.bgImage ? 'white' : config.global.primaryColor, fontFamily: config.global.titleFont }}>{section.title}</h2>
              <p className="text-sm mb-8 opacity-80">{section.subtitle}</p>
              <form className="max-w-md mx-auto bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg text-left text-gray-800 space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Nombre</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Apellido</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="Tu apellido" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">¿Asistirás?</label>
                  <select className="w-full p-2 border rounded">
                    <option value="si">Sí, confirmo asistencia</option>
                    <option value="no">No podré asistir</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">N° Personas</label>
                  <input type="number" min="1" className="w-full p-2 border rounded" defaultValue="1" />
                </div>
                <button className="w-full py-3 mt-2 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-opacity" style={{ backgroundColor: config.global.secondaryColor }}>ENVIAR CONFIRMACIÓN</button>
              </form>
            </div>
          )}

          {section.type === 'rsvp_whatsapp' && (
            <div className="py-16 px-6 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-8" style={{ color: section.bgImage ? 'white' : config.global.primaryColor, fontFamily: config.global.titleFont }}>{section.title}</h2>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl hover:bg-green-600 transition-colors" style={{ backgroundColor: '#25D366' }}>
                <MessageCircle size={24} /> Confirmar Asistencia
              </button>
            </div>
          )}

          {section.type === 'hero' && (
            <div className="text-center p-6 text-white relative z-10 py-20 flex flex-col items-center">
              <p className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80" style={{ fontFamily: config.global.bodyFont }}>{new Date(section.date).toLocaleDateString()}</p>
              <h1 className="text-6xl md:text-7xl mb-6 leading-tight drop-shadow-xl" style={{ fontFamily: config.global.titleFont }}>{section.title}</h1>
              <p className="text-xl italic font-light opacity-90 mb-8">{section.subtitle}</p>

              {/* VIDEO YOUTUBE EMBED */}
              {getYoutubeEmbedUrl(section.youtubeUrl) && (
                <div className="w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYoutubeEmbedUrl(section.youtubeUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          )}

          {section.type === 'calendar' && (
            <div className="py-16 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-8" style={{ color: section.bgImage ? 'white' : config.global.primaryColor, fontFamily: config.global.titleFont }}>{section.title}</h2>
              <FullMonthCalendar dateStr={section.date} primaryColor={config.global.primaryColor} titleFont={config.global.titleFont} />
            </div>
          )}

          {section.type === 'text' && (
            <div className="py-20 px-8 text-center max-w-lg mx-auto relative z-10">
              <div className="mb-8 w-16 h-1 bg-current mx-auto opacity-50" style={{ color: section.bgImage ? 'white' : config.global.primaryColor }} />
              <h3 className="text-3xl font-bold mb-6" style={{ color: section.bgImage ? 'white' : config.global.primaryColor, fontFamily: config.global.titleFont }}>{section.title}</h3>
              <p className={`text-lg leading-relaxed ${section.bgImage ? 'text-white/90' : 'text-gray-600'}`}>{section.content}</p>
            </div>
          )}

          {section.type === 'gallery' && (
            <div className="py-16 px-4 relative z-10">
              <h3 className="text-center text-2xl font-bold mb-8" style={{ color: section.bgImage ? 'white' : config.global.primaryColor, fontFamily: config.global.titleFont }}>{section.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {section.images.map((img, i) => (
                  <img key={i} src={img} className="w-full h-40 object-cover rounded-lg shadow-md hover:scale-105 transition-transform" />
                ))}
              </div>
            </div>
          )}

          {section.type === 'location' && (
            <div className="py-20 px-6 text-center relative z-10">
              <div className="bg-white/95 backdrop-blur p-8 rounded-xl shadow-lg border border-gray-100 inline-block w-full max-w-xs">
                <MapPin size={40} className="mx-auto mb-4" style={{ color: config.global.primaryColor }} />
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: config.global.titleFont }}>{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.placeName}</p>
                <button className="px-6 py-2 rounded-full text-white text-sm font-bold" style={{ backgroundColor: config.global.secondaryColor }}>Ver Mapa</button>
              </div>
            </div>
          )}

        </SectionWrapper>
      ))}
      <div className="py-12 bg-gray-900 text-center text-white/30 text-xs"><p>Diseñado con WA HERO</p></div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* MODAL DE PUBLICACIÓN EXITOSA */}
      {publishedUrl && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Invitación Publicada!</h2>
            <p className="text-gray-500 mb-6">Tu tarjeta está lista y es 100% responsive. Comparte este enlace con tus invitados.</p>

            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 flex items-center justify-between gap-2 mb-6">
              <span className="text-xs font-mono text-slate-600 truncate">{publishedUrl}</span>
              <button onClick={() => navigator.clipboard.writeText(publishedUrl)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs whitespace-nowrap">
                Copiar
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => window.open(publishedUrl, '_blank')} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                <ExternalLink size={18} /> Abrir
              </button>
              <button onClick={() => setPublishedUrl(null)} className="px-4 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full md:w-1/2 lg:w-2/5 border-r bg-white z-10 ${activeTab === 'editor' ? 'block' : 'hidden md:block'}`}>{renderEditor()}</div>
      <div className={`w-full md:w-1/2 lg:w-3/5 bg-slate-200 flex items-center justify-center p-4 md:p-8 relative ${activeTab === 'preview' ? 'block' : 'hidden md:flex'}`}>
        <div className="md:hidden absolute top-4 left-0 w-full flex justify-center z-50 px-4">
          <div className="bg-white shadow-xl rounded-full p-1 flex border border-gray-100">
            <button onClick={() => setActiveTab('editor')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Editor</button>
            <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>Vista Previa</button>
          </div>
        </div>
        <div className="w-full max-w-[380px] h-[calc(100vh-80px)] md:h-[800px] bg-gray-900 rounded-[3rem] shadow-2xl border-[8px] border-gray-800 relative overflow-hidden ring-4 ring-slate-300">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-xl z-50 flex justify-center items-center"><div className="w-16 h-1 bg-gray-800 rounded-full"></div></div>
          <div className="w-full h-full bg-white overflow-hidden rounded-[2.3rem]">{renderPreview()}</div>
        </div>
      </div>
    </div>
  );
}
