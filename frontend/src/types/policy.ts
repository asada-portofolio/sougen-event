export interface PolicyRule {
  id: number;
  ruleText: string;
  iconName: string;
  displayOrder: number;
}

export interface SafetyProcedure {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
}
