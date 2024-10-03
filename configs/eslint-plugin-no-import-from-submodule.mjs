export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow imports from a specific folder',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          forbiddenFolder: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbiddenImport: 'Importing from "{{ forbiddenFolder }}" is not allowed.',
    },
  },

  create(context) {
    const forbiddenFolder = context.options[0]?.forbiddenFolder || ''

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value

        if (importSource.includes(forbiddenFolder)) {
          context.report({
            node,
            messageId: 'forbiddenImport',
            data: { forbiddenFolder },
          })
        }
      },
      CallExpression(node) {
        // This will catch dynamic imports: import('...')
        if (
          node.callee.type === 'Import'
          && node.arguments.length
          && node.arguments[0].type === 'Literal'
        ) {
          const importSource = node.arguments[0].value
          if (importSource.includes(forbiddenFolder)) {
            context.report({
              node,
              messageId: 'forbiddenImport',
              data: { forbiddenFolder },
            })
          }
        }
      },
    }
  },
}
