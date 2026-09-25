import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Sparkles, Plus, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { Prompt, Category } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import * as api from '../../lib/api';
import { VideoPreview } from '../../components/marketplace/VideoPreview';

interface AdminPromptFormProps {
  initialPrompt?: Prompt | null;
  onBack: () => void;
  onSuccess: (saved: Prompt) => void;
}

export const AdminPromptForm: React.FC<AdminPromptFormProps> = ({
  initialPrompt,
  onBack,
  onSuccess,
}) => {
  const { categories, refreshData, showToast } = useMarketplace();

  // Form states
  const [title, setTitle] = useState(initialPrompt?.title || '');
  const [slug, setSlug] = useState(initialPrompt?.slug || '');
  const [shortDesc, setShortDesc] = useState(initialPrompt?.short_description || '');
  const [description, setDescription] = useState(initialPrompt?.description || '');
  const [categoryId, setCategoryId] = useState(
    initialPrompt?.category_id || (categories[0]?.id ?? 'cat-image')
  );
  const [tags, setTags] = useState<string>(initialPrompt?.tags?.join(', ') || '');
  const [aiTool, setAiTool] = useState(initialPrompt?.ai_tool || 'Flux');
  const [model, setModel] = useState(initialPrompt?.model || 'Flux 1.1 Pro');
  const [accessType, setAccessType] = useState<'free' | 'paid' | 'pro'>(
    initialPrompt?.access_type || 'paid'
  );
  const [price, setPrice] = useState<number>(initialPrompt?.price ?? 7);
  const [currency, setCurrency] = useState(initialPrompt?.currency || 'USD');
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialPrompt?.cover_image_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
  );
  const [videoUrl, setVideoUrl] = useState(initialPrompt?.demo_video_url || '');
  const [exampleImages, setExampleImages] = useState<string[]>(
    initialPrompt?.example_images || [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    ]
  );
  // Media upload & drag state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const [uploadingExamples, setUploadingExamples] = useState(false);
  const [exampleProgress, setExampleProgress] = useState(0);
  const [isDraggingExamples, setIsDraggingExamples] = useState(false);

  const isUploadingMedia = uploadingCover || uploadingVideo || uploadingExamples;

  const [fullPrompt, setFullPrompt] = useState(initialPrompt?.full_prompt || '');
  const [negativePrompt, setNegativePrompt] = useState(initialPrompt?.negative_prompt || '');
  const [instructions, setInstructions] = useState(initialPrompt?.instructions || '');

  // Recommended settings
  const [aspectRatio, setAspectRatio] = useState(
    initialPrompt?.recommended_settings?.aspect_ratio || '16:9'
  );
  const [stylize, setStylize] = useState(initialPrompt?.recommended_settings?.stylize || 'raw');
  const [steps, setSteps] = useState(initialPrompt?.recommended_settings?.sampling_steps || 30);
  const [cfg, setCfg] = useState(initialPrompt?.recommended_settings?.cfg_scale || 3.5);
  const [camera, setCamera] = useState(
    initialPrompt?.recommended_settings?.camera || '50mm f/1.4 prime lens'
  );

  // SEO & Flags
  const [seoTitle, setSeoTitle] = useState(initialPrompt?.seo_title || '');
  const [seoDesc, setSeoDesc] = useState(initialPrompt?.seo_description || '');
  const [featured, setFeatured] = useState(initialPrompt?.featured || false);
  const [trending, setTrending] = useState(initialPrompt?.trending || false);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    initialPrompt?.status || 'published'
  );

  const [previewMode, setPreviewMode] = useState(false);

  // Auto-slugify when title changes (for new prompts)
  useEffect(() => {
    if (!initialPrompt && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  }, [title, initialPrompt]);

  // Adjust price when accessType changes
  useEffect(() => {
    if (accessType === 'free') {
      setPrice(0);
    } else if (price === 0) {
      setPrice(6);
    }
  }, [accessType]);

  // Process Cover File
  const processCoverFile = async (file: File) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      showToast('Unsupported cover image format. Allowed: JPG, PNG, WebP, GIF.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Cover image size exceeds maximum limit of 10MB.', 'error');
      return;
    }

    setUploadingCover(true);
    setCoverProgress(0);

    try {
      const url = await api.uploadMedia(file, 'covers', initialPrompt?.id, (pct) => {
        setCoverProgress(pct);
      });

      if (!url) {
        showToast('Failed to upload cover image.', 'error');
        return;
      }

      setCoverImageUrl(url);
      showToast('Cover image uploaded successfully.', 'success');
    } catch (error) {
      console.error('Cover image upload error:', error);
      showToast('Failed to upload cover image.', 'error');
    } finally {
      setUploadingCover(false);
      setCoverProgress(0);
    }
  };

  const handleCoverInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCoverFile(file);
    e.target.value = '';
  };

  // Process Video File
  const processVideoFile = async (file: File) => {
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Unsupported demo video format. Allowed: MP4, WebM.', 'error');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      showToast('Demo video size exceeds maximum limit of 100MB.', 'error');
      return;
    }

    setUploadingVideo(true);
    setVideoProgress(0);

    try {
      const url = await api.uploadMedia(file, 'videos', initialPrompt?.id, (pct) => {
        setVideoProgress(pct);
      });

      if (!url) {
        showToast('Failed to upload demo video.', 'error');
        return;
      }

      setVideoUrl(url);
      showToast('Demo video uploaded successfully.', 'success');
    } catch (error) {
      console.error('Video upload error:', error);
      showToast('Failed to upload demo video.', 'error');
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
    e.target.value = '';
  };

  // Process Example File
  const processExampleFile = async (file: File) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = ['video/mp4', 'video/webm'].includes(file.type);

    if (!isImage && !isVideo) {
      showToast('Unsupported format. Allowed: JPG, PNG, WebP, GIF, MP4, WebM.', 'error');
      return;
    }

    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(
        isVideo
          ? 'Example video size exceeds 100MB limit.'
          : 'Example image size exceeds 10MB limit.',
        'error'
      );
      return;
    }

    setUploadingExamples(true);
    setExampleProgress(0);

    try {
      const url = await api.uploadMedia(file, 'examples', initialPrompt?.id, (pct) => {
        setExampleProgress(pct);
      });

      if (!url) {
        showToast('Failed to upload example media.', 'error');
        return;
      }

      setExampleImages((current) => [...current, url]);
      showToast('Example media uploaded successfully.', 'success');
    } catch (error) {
      console.error('Example media upload error:', error);
      showToast('Failed to upload example media.', 'error');
    } finally {
      setUploadingExamples(false);
      setExampleProgress(0);
    }
  };

  const handleExampleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processExampleFile(file);
    e.target.value = '';
  };

  const handleAddExampleImage = () => {
    const url = prompt('Enter image or video URL:');
    if (url && url.trim()) {
      setExampleImages((current) => [...current, url.trim()]);
    }
  };

  const handleRemoveExampleImage = (index: number) => {
    setExampleImages(exampleImages.filter((_, i) => i !== index));
  };

  const handleSave = (targetStatus?: 'draft' | 'published') => {
    if (isUploadingMedia) {
      showToast('Please wait for media uploads to finish before saving.', 'error');
      return;
    }

    if (!title.trim() || !fullPrompt.trim()) {
      alert('Please fill in the title and master prompt content.');
      return;
    }

    const effectiveStatus = targetStatus || status;

    const record: Prompt = {
      id: initialPrompt?.id || `p-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || `prompt-${Date.now()}`,
      short_description: shortDesc.trim(),
      description: description.trim(),
      category_id: categoryId,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      ai_tool: aiTool,
      model: model.trim(),
      access_type: accessType,
      price: accessType === 'free' ? 0 : Number(price) || 0,
      currency: currency,
      cover_image_url: coverImageUrl.trim(),
      demo_video_url: videoUrl.trim() || undefined,
      example_images: exampleImages,
      full_prompt: fullPrompt.trim(),
      negative_prompt: negativePrompt.trim() || undefined,
      instructions: instructions.trim() || undefined,
      recommended_settings: {
        aspect_ratio: aspectRatio,
        stylize: stylize,
        sampling_steps: Number(steps),
        cfg_scale: Number(cfg),
        camera: camera,
      },
      rating: initialPrompt?.rating || 5.0,
      rating_count: initialPrompt?.rating_count || 1,
      views: initialPrompt?.views || 12,
      sales_count: initialPrompt?.sales_count || 0,
      featured: featured,
      trending: trending,
      status: effectiveStatus,
      seo_title: seoTitle.trim() || title.trim(),
      seo_description: seoDesc.trim() || shortDesc.trim(),
      created_at: initialPrompt?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    api.savePrompt(record);
    refreshData();
    showToast(
      initialPrompt ? `Updated "${record.title}"` : `Created "${record.title}"`,
      'success'
    );
    onSuccess(record);
  };

  // Mock temporary object for preview
  const previewPrompt: Prompt = {
    id: initialPrompt?.id || 'preview-id',
    title: title || 'Untitled Prompt',
    slug: slug || 'preview-slug',
    short_description: shortDesc || 'Short description will appear here.',
    description: description || 'Full description will appear here.',
    category_id: categoryId,
    tags: tags.split(',').map((t) => t.trim()),
    ai_tool: aiTool,
    model: model,
    access_type: accessType,
    price: accessType === 'free' ? 0 : price,
    currency: currency,
    cover_image_url: coverImageUrl,
    demo_video_url: videoUrl,
    example_images: exampleImages,
    full_prompt: fullPrompt,
    negative_prompt: negativePrompt,
    instructions: instructions,
    recommended_settings: {
      aspect_ratio: aspectRatio,
      stylize: stylize,
      sampling_steps: steps,
      cfg_scale: cfg,
      camera: camera,
    },
    rating: 5.0,
    rating_count: 1,
    views: 1,
    sales_count: 0,
    featured: featured,
    trending: trending,
    status: status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E7E3] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#111111]">
              {initialPrompt ? `Edit: ${initialPrompt.title}` : 'Create New Prompt'}
            </h1>
            <p className="text-xs text-[#666666]">
              All fields are verified and directly reflected across the catalog and search index.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-white border border-[#E7E7E3] hover:bg-neutral-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Edit Mode' : 'Live Preview'}</span>
          </button>
          <button
            type="button"
            disabled={isUploadingMedia}
            onClick={() => handleSave('draft')}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-200 hover:bg-neutral-300 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploadingMedia ? 'Uploading...' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={isUploadingMedia}
            onClick={() => handleSave('published')}
            className="px-4 py-1.5 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isUploadingMedia ? 'Uploading media...' : 'Publish Prompt'}</span>
          </button>
        </div>
      </div>

      {previewMode ? (
        /* Preview Component */
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A] bg-neutral-100 p-2 rounded">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>Live Demonstration Video & UI Preview:</span>
          </div>
          <div className="max-w-xl mx-auto">
            <VideoPreview prompt={previewPrompt} isDetail={true} aspectRatio="16:9" />
          </div>
        </div>
      ) : (
        /* The Form Grid */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-8"
        >
          {/* Section 1: Basic Information */}
          <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              1. Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra-Minimal Editorial Ceramic Lookbook"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Short Description (for cards) *</label>
              <input
                type="text"
                required
                placeholder="High-fidelity product studio lighting calibrated for luxury homewares."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Full Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Explain the output characteristics, background, and specific camera aesthetic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {/* Section 2: Taxonomy & Model */}
          <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              2. Taxonomy & AI Engine
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">AI Tool</label>
                <select
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  <option>Flux</option>
                  <option>Midjourney</option>
                  <option>Sora</option>
                  <option>Claude</option>
                  <option>ChatGPT</option>
                  <option>Gemini</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Model Version</label>
                <input
                  type="text"
                  placeholder="e.g. Flux 1.1 Pro, Midjourney v6.1"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Comma-separated Tags</label>
                <input
                  type="text"
                  placeholder="ceramics, lighting, flux"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Commercial Rights */}
          <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              3. Pricing & Access Controls
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Access Type</label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111] cursor-pointer"
                >
                  <option value="paid">Paid (One-off Purchase)</option>
                  <option value="free">Free (Unlocked upon Login)</option>
                  <option value="pro">Pro (Mekyo Pro Exclusive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Price (USD)</label>
                <input
                  type="number"
                  step="0.50"
                  disabled={accessType === 'free'}
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Currency</label>
                <input
                  type="text"
                  disabled
                  value={currency}
                  className="w-full px-3 py-2 text-xs font-mono bg-neutral-100 border border-[#E7E7E3] rounded-xl text-[#8A8A8A]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Media & Video Demonstrations */}
          <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              4. Media & Video Demonstrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image Uploader & URL */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#666666]">
                  Cover Image *
                </label>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingCover(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingCover(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingCover(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processCoverFile(file);
                  }}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    isDraggingCover
                      ? 'border-[#111111] bg-neutral-100/80 scale-[0.99]'
                      : 'border-[#E7E7E3] bg-neutral-50 hover:border-[#111111]'
                  }`}
                >
                  <Upload className="w-5 h-5 mx-auto text-neutral-400 mb-1" />
                  <p className="text-xs font-medium text-[#111111]">
                    Drag & drop cover image or{' '}
                    <label className="text-blue-600 underline cursor-pointer font-semibold">
                      browse
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleCoverInputChange}
                        disabled={uploadingCover}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                    JPG, PNG, WebP, GIF • Max 10MB
                  </p>

                  {uploadingCover && (
                    <div className="mt-3 space-y-1">
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#111111] h-full transition-all duration-200"
                          style={{ width: `${coverProgress}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-mono text-[#666666]">
                        Uploading cover... {coverProgress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* URL Input Fallback */}
                <div className="pt-1">
                  <span className="block text-[11px] font-medium text-[#8A8A8A] mb-1">
                    Or paste Image URL:
                  </span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                  />
                </div>

                {/* Cover Image Preview */}
                {coverImageUrl && (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-[#E7E7E3] group bg-neutral-100">
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className="w-full h-44 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl('')}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Video Uploader & URL */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#666666]">
                  Demo Video (MP4 / WebM)
                </label>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingVideo(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingVideo(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingVideo(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processVideoFile(file);
                  }}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    isDraggingVideo
                      ? 'border-[#111111] bg-neutral-100/80 scale-[0.99]'
                      : 'border-[#E7E7E3] bg-neutral-50 hover:border-[#111111]'
                  }`}
                >
                  <Upload className="w-5 h-5 mx-auto text-neutral-400 mb-1" />
                  <p className="text-xs font-medium text-[#111111]">
                    Drag & drop demo video or{' '}
                    <label className="text-blue-600 underline cursor-pointer font-semibold">
                      browse
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleVideoInputChange}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                    MP4, WebM • Max 100MB
                  </p>

                  {uploadingVideo && (
                    <div className="mt-3 space-y-1">
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#111111] h-full transition-all duration-200"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-mono text-[#666666]">
                        Uploading video... {videoProgress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* URL Input Fallback */}
                <div className="pt-1">
                  <span className="block text-[11px] font-medium text-[#8A8A8A] mb-1">
                    Or paste Video URL:
                  </span>
                  <input
                    type="url"
                    placeholder="https://assets.mixkit.co/videos/... or leave blank"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                  />
                </div>

                {/* Video Preview */}
                {videoUrl && (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-[#E7E7E3] bg-black group">
                    <video
                      src={videoUrl}
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full max-h-44 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Example Output Media */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium text-[#666666]">
                    Example Output Media ({exampleImages.length})
                  </label>
                  <p className="text-[11px] text-[#8A8A8A]">
                    Upload sample outputs or paste external URLs. Supports images (Max 10MB) & videos (Max 100MB).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] text-white text-xs font-medium transition-all ${
                      uploadingExamples
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingExamples ? 'Uploading...' : 'Upload Media'}</span>
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/webm"
                      onChange={handleExampleInputChange}
                      disabled={uploadingExamples}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddExampleImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7E7E3] bg-white text-[#111111] text-xs font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Media URL</span>
                  </button>
                </div>
              </div>

              {/* Example Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingExamples(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingExamples(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingExamples(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processExampleFile(file);
                }}
                className={`border-2 border-dashed rounded-xl p-3 text-center transition-all ${
                  isDraggingExamples
                    ? 'border-[#111111] bg-neutral-100/80'
                    : 'border-[#E7E7E3] bg-neutral-50 hover:border-[#111111]'
                }`}
              >
                <p className="text-xs text-[#666666]">
                  Drag & drop extra sample image or video here to add to gallery
                </p>
                {uploadingExamples && (
                  <div className="mt-2 max-w-xs mx-auto space-y-1">
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#111111] h-full transition-all duration-200"
                        style={{ width: `${exampleProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] font-mono text-[#666666]">
                      Uploading sample... {exampleProgress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Grid of Example Media */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {exampleImages.map((img, i) => {
                  const isVideo = img.toLowerCase().match(/\.(mp4|webm)$/i);
                  return (
                    <div
                      key={i}
                      className="relative aspect-video rounded-xl overflow-hidden border border-[#E7E7E3] bg-black group"
                    >
                      {isVideo ? (
                        <video
                          src={img}
                          className="w-full h-full object-cover"
                          controls
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={img}
                          alt={`Example ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/400x225?text=Invalid+Media+URL';
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveExampleImage(i)}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Master Prompt Content */}
          <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              5. Master Prompt Content
            </h2>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Full Verbatim Master Prompt * (Locked until purchased/unlocked)
              </label>
              <textarea
                required
                rows={5}
                placeholder="High-end ceramic vessel placed on a honed travertine plinth..."
                value={fullPrompt}
                onChange={(e) => setFullPrompt(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Negative Prompt / Exclusions (optional)
              </label>
              <textarea
                rows={2}
                placeholder="deformed, plastic sheen, oversaturated, watermark, grainy..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">
                Usage Instructions & Parameter Substitution (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Replace [material] with stoneware, bone china, or terra cotta..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-3 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Recommended Settings Grid */}
            <div className="pt-2 border-t border-[#E7E7E3]">
              <span className="block text-xs font-medium text-[#666666] mb-2">Recommended Settings</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-[#8A8A8A] mb-0.5">Aspect Ratio</label>
                  <input
                    type="text"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-[#E7E7E3] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A8A8A] mb-0.5">Stylize / Mode</label>
                  <input
                    type="text"
                    value={stylize}
                    onChange={(e) => setStylize(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-[#E7E7E3] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A8A8A] mb-0.5">Sampling Steps</label>
                  <input
                    type="number"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-[#E7E7E3] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A8A8A] mb-0.5">CFG Scale</label>
                  <input
                    type="number"
                    step="0.5"
                    value={cfg}
                    onChange={(e) => setCfg(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-[#E7E7E3] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A8A8A] mb-0.5">Lens/Camera</label>
                  <input
                    type="text"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-50 border border-[#E7E7E3] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: SEO & Flags */}
          <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              6. Editorial Flags & Status
            </h2>
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-[#E7E7E3] text-[#111111]"
                />
                <span className="font-semibold text-neutral-800">Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="rounded border-[#E7E7E3] text-[#111111]"
                />
                <span className="font-semibold text-neutral-800">Mark as Trending</span>
              </label>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-neutral-500">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="px-3 py-1.5 text-xs bg-neutral-50 border border-[#E7E7E3] rounded-lg text-[#111111] font-semibold cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploadingMedia}
              className="px-6 py-2.5 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>
                {isUploadingMedia
                  ? 'Uploading media...'
                  : initialPrompt
                  ? 'Save Changes'
                  : 'Create & Publish'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
