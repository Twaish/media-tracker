import z from 'zod'
import { RuleNode } from '../domain/ast/RuleNode'
import {
  BinaryExpression,
  Expression,
  FieldExpression,
  FunctionExpression,
  LiteralExpression,
  MemberExpression,
  ObjectExpression,
  SelfExpression,
} from '../domain/ast/Expression'
import {
  Action,
  AppendAction,
  HttpAction,
  HttpMethods,
  PluginAction,
  SetAction,
  TemplateAction,
} from '../domain/ast/Action'
import { TemplateNode } from '../domain/ast/TemplateNode'
import { PersistedRule } from '../domain/entities/rule'
import { PersistedTemplate } from '../domain/entities/template'

// Expressions
export const literalExpressionSchema: z.ZodType<LiteralExpression> = z.object({
  type: z.literal('literal'),
  value: z.union([z.string(), z.number(), z.boolean()]),
})

export const fieldExpressionSchema: z.ZodType<FieldExpression> = z.object({
  type: z.literal('field'),
  name: z.string(),
})

export const memberExpressionSchema: z.ZodType<MemberExpression> = z.object({
  type: z.literal('member'),
  property: z.string(),
  object: z.lazy(() => expressionSchema),
})

export const functionExpressionSchema: z.ZodType<FunctionExpression> = z.object(
  {
    type: z.literal('function'),
    name: z.string(),
    args: z.array(z.lazy(() => expressionSchema)),
  },
)

export const objectExpressionSchema: z.ZodType<ObjectExpression> = z.object({
  type: z.literal('object'),
  value: z.record(
    z.string(),
    z.lazy(() => expressionSchema),
  ),
})

export const selfExpressionSchema: z.ZodType<SelfExpression> = z.object({
  type: z.literal('self'),
})

export const binaryExpressionSchema: z.ZodType<BinaryExpression> = z.object({
  type: z.literal('binary'),
  operator: z.enum(['>', '<', '>=', '<=', '==', '!=']),
  left: z.lazy(() => expressionSchema),
  right: z.lazy(() => expressionSchema),
})

export const expressionSchema: z.ZodType<Expression> = z.lazy(() =>
  z.union([
    literalExpressionSchema,
    fieldExpressionSchema,
    functionExpressionSchema,
    objectExpressionSchema,
    selfExpressionSchema,
    binaryExpressionSchema,
    memberExpressionSchema,
  ]),
)

// Actions
export const httpActionSchema: z.ZodType<HttpAction> = z.object({
  type: z.literal('http'),
  url: expressionSchema,
  method: z.enum(HttpMethods),
  body: expressionSchema.optional(),
  headers: expressionSchema.optional(),
  retry: z
    .object({
      attempts: z.number(),
      strategy: z.literal('exponential'),
      delayMs: z.number(),
    })
    .optional(),
})

export const setActionSchema: z.ZodType<SetAction> = z.object({
  type: z.literal('set'),
  field: z.string(),
  value: expressionSchema,
})

export const appendActionSchema: z.ZodType<AppendAction> = z.object({
  type: z.literal('append'),
  field: z.string(),
  value: expressionSchema,
})

export const templateActionSchema: z.ZodType<TemplateAction> = z.object({
  type: z.literal('template'),
  name: z.string(),
  args: z.record(z.string(), expressionSchema),
})

export const pluginActionSchema: z.ZodType<PluginAction> = z.object({
  type: z.literal('plugin'),
  name: z.string(),
  args: z.record(z.string(), expressionSchema),
})

export const actionSchema: z.ZodType<Action> = z.union([
  httpActionSchema,
  setActionSchema,
  appendActionSchema,
  templateActionSchema,
  pluginActionSchema,
])

// Nodes
export const ruleNodeSchema: z.ZodType<RuleNode> = z.object({
  type: z.literal('rule'),
  name: z.string(),
  trigger: z.string(),
  events: z.array(z.string()),
  target: z.string(),
  priority: z.number(),
  enabled: z.boolean(),
  condition: binaryExpressionSchema,
  execution: z.literal('sequential'),
  actions: z.array(actionSchema),
})

export const templateNodeSchema: z.ZodType<TemplateNode> = z.object({
  type: z.literal('template'),
  name: z.string(),
  parameters: z.array(z.string()),
  requires: z
    .object({
      config: z.array(z.string()).optional(),
      secrets: z.array(z.string()).optional(),
    })
    .optional(),
  actions: z.array(actionSchema),
})

export const persistedRuleSchema: z.ZodType<PersistedRule> = z.object({
  id: z.number(),
  name: z.string(),
  target: z.string(),
  trigger: z.string(),
  events: z.array(z.string()),
  priority: z.number(),
  enabled: z.boolean(),
  source: z.string(),
  ast: ruleNodeSchema,
  createdAt: z.date().nullish(),
  lastUpdated: z.date().nullish(),
})

export const persistedTemplateSchema: z.ZodType<PersistedTemplate> = z.object({
  id: z.number(),
  name: z.string(),
  source: z.string(),
  ast: templateNodeSchema,
  createdAt: z.date().nullish(),
  lastUpdated: z.date().nullish(),
})

export const addNodeInputSchema = z.object({
  source: z.string(),
  enabled: z.boolean().optional(),
})

export const updateNodeInputSchema = addNodeInputSchema.partial().extend({
  id: z.number(),
})

export const removeNodesInputSchema = z.array(z.number())
export const removeNodesOutputSchema = z.object({
  deleted: z.number(),
  ids: z.array(z.number()),
})

export const getEnabledRulesOutputSchema = z.array(persistedRuleSchema)

export const getAllRulesOutputSchema = z.array(persistedRuleSchema)

export const addTemplateOutputSchema = persistedTemplateSchema

export const updateTemplateOutputSchema = persistedTemplateSchema

export const getAllTemplatesOutputSchema = z.array(persistedTemplateSchema)
