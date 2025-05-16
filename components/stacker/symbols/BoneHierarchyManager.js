// components/stacker/symbols/BoneHierarchyManager.js

/**
 * BoneHierarchyManager handles parent-child relationships for IK bone rigs
 * attached to MovieClip symbols. Useful for character animation.
 */

export class BoneHierarchyManager {
    constructor() {
      this.bones = {};
    }
  
    /**
     * Add a new bone.
     * @param {string} id - Unique bone ID
     * @param {object} config - { parentId, name, position: {x, y}, rotation, length }
     */
    addBone(id, config) {
      this.bones[id] = {
        ...config,
        children: [],
      };
      if (config.parentId && this.bones[config.parentId]) {
        this.bones[config.parentId].children.push(id);
      }
    }
  
    /**
     * Update a bone's transformation.
     * @param {string} id 
     * @param {object} updates - Partial updates: { position, rotation, length }
     */
    updateBone(id, updates) {
      if (!this.bones[id]) return;
      this.bones[id] = {
        ...this.bones[id],
        ...updates,
      };
    }
  
    /**
     * Get world transform of a bone by recursively applying parent transforms
     * @param {string} id 
     */
    getWorldTransform(id) {
      const bone = this.bones[id];
      if (!bone) return null;
      const parent = this.bones[bone.parentId];
      if (!parent) return { ...bone.position, rotation: bone.rotation };
      // Simple hierarchical transform; can be replaced with matrix math for precision
      const parentTransform = this.getWorldTransform(bone.parentId);
      return {
        x: parentTransform.x + bone.position.x,
        y: parentTransform.y + bone.position.y,
        rotation: parentTransform.rotation + bone.rotation,
      };
    }
  
    /**
     * Delete a bone and remove it from its parent's children
     */
    deleteBone(id) {
      const bone = this.bones[id];
      if (!bone) return;
      if (bone.parentId && this.bones[bone.parentId]) {
        this.bones[bone.parentId].children = this.bones[bone.parentId].children.filter(
          (childId) => childId !== id
        );
      }
      delete this.bones[id];
    }
  
    /**
     * Export full bone tree for storage or serialization
     */
    serialize() {
      return JSON.parse(JSON.stringify(this.bones));
    }
  
    /**
     * Load bone tree from external source
     * @param {object} boneData 
     */
    load(boneData) {
      this.bones = boneData;
    }
  }
  