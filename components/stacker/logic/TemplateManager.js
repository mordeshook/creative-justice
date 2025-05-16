
// components\stacker\logic\TemplateManager.js
export class TemplateManager {
  constructor() {
    this.templates = {};
  }

  saveTemplate(name, data) {
    this.templates[name] = data;
  }

  loadTemplate(name) {
    return this.templates[name] || null;
  }

  listTemplates() {
    return Object.keys(this.templates);
  }
}
