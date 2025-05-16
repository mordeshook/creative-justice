// utils/PublishPipeline.js
export async function publishProject({ title, description, compiledScene, previewImage }) {
    const payload = {
      title,
      description,
      frameCount: compiledScene.length,
      preview: previewImage,
      timestamp: new Date().toISOString()
    };
  
    // Upload preview, save JSON, and register metadata
    try {
      console.log("Publishing...", payload);
      // Replace with real backend call
      return { success: true, data: payload };
    } catch (e) {
      console.error("Publish failed:", e);
      return { success: false, error: e.message };
    }
  }
  