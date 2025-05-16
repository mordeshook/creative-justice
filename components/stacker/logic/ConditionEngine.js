
// ConditionEngine.js
export class ConditionEngine {
  static evaluate(condition, vars) {
    try {
      return new Function(...Object.keys(vars), "return " + condition)(...Object.values(vars));
    } catch (e) {
      console.error("Condition parse error:", e);
      return false;
    }
  }
}
