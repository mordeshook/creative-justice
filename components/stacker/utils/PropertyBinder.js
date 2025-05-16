// utils/PropertyBinder.js
export default function bindProperties(target, properties) {
    Object.keys(properties).forEach((key) => {
      if (properties[key] !== undefined) {
        target[key] = properties[key];
      }
    });
    return target;
  }
  