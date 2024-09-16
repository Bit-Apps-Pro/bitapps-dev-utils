export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports from \'pro-module\'',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'pro-module') {
          context.report({
            node,
            message: 'কিরে ভাই, ভুলে গেছেন ? আপনি সরাসরি \'pro-module\' import করতে পারবেন না, `<ProLoader/>` অথবা `withPro` ব্যাবহার করেন',
          })
        }
      },
    }
  },
}
